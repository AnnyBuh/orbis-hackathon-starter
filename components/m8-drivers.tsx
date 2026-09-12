"use client";

import {
  ReactorView,
  useReactor,
  useReactorMessage,
} from "@reactor-team/js-sdk";
import { type ReactNode, useEffect, useRef, useState } from "react";

import { TIMING } from "@/lib/m8-experience";
import { unwrapOrbisMessage } from "@/lib/orbis";

// The experience talks to a Driver. The mock driver shows the still image and fakes Orbis's
// timing (chunks, the late pause); the live driver sends the same calls to Orbis. Everything
// above this file is identical in both, so what works in the mock is what runs live.
export type Driver = {
  mode: "mock" | "live";
  status: string;
  view: ReactNode; // what fills the stage
  controls: ReactNode; // mode-specific buttons for the control bar
  prepare: (imageUrl: string, prompt: string) => Promise<void>; // costs nothing
  start: () => Promise<void>;
  waitChunks: (n: number) => Promise<void>;
  pause: () => Promise<void>; // resolves once actually paused
  resume: () => Promise<void>;
  setPrompt: (prompt: string) => Promise<void>; // empty = leave the picture as it is
  stop: () => Promise<void>;
};

export type Log = (line: string) => void;

function useChunks() {
  const listeners = useRef(new Set<() => void>());
  return {
    tick: () => [...listeners.current].forEach((fn) => fn()),
    clear: () => listeners.current.clear(),
    // Resolves after n chunks, or after a generous timeout if chunk events go missing.
    waitChunks: (n: number) =>
      new Promise<void>((resolve) => {
        let left = n;
        const done = () => {
          clearTimeout(timer);
          listeners.current.delete(onChunk);
          resolve();
        };
        const onChunk = () => {
          left -= 1;
          if (left <= 0) done();
        };
        const timer = setTimeout(done, n * TIMING.chunkMs + 5_000);
        listeners.current.add(onChunk);
      }),
  };
}

type Resolver = { current: (() => void) | null };

function waitFor(ref: Resolver, label: string, ms: number, soft = false) {
  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      ref.current = null;
      if (soft) resolve();
      else reject(new Error(`Timed out waiting for ${label}`));
    }, ms);
    ref.current = () => {
      clearTimeout(timer);
      ref.current = null;
      resolve();
    };
  });
}

const describePrompt = (prompt: string) =>
  prompt.trim() ? `prompt → ${prompt}` : "no prompt for this choice yet, picture carries on";

// ---------------------------------------------------------------- mock

export function useMockDriver(log: Log): Driver {
  const [image, setImage] = useState("");
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const chunks = useChunks();
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const pausing = useRef(false);
  const pauseWaiters = useRef<(() => void)[]>([]);

  const stopTimer = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  };
  useEffect(() => stopTimer, []);

  const startTimer = () => {
    stopTimer();
    timer.current = setInterval(() => {
      setVisible(true); // like Orbis, nothing shows until the first chunk is through
      chunks.tick();
      if (pausing.current) {
        // Like Orbis, a pause lands at the next chunk boundary, not instantly.
        pausing.current = false;
        stopTimer();
        setPaused(true);
        log("paused");
        pauseWaiters.current.splice(0).forEach((resolve) => resolve());
      }
    }, TIMING.chunkMs);
  };

  return {
    mode: "mock",
    status: "mock",
    view: visible ? (
      <div className="m8-mock">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" className={paused ? "is-paused" : ""} />
      </div>
    ) : null,
    controls: null,
    prepare: async (imageUrl, prompt) => {
      stopTimer();
      chunks.clear();
      pausing.current = false;
      setVisible(false);
      setPaused(false);
      setImage(imageUrl);
      log(`image ${imageUrl}`);
      log(describePrompt(prompt));
      if (!prompt.trim()) log("warning: live Orbis will refuse to start without a prompt");
    },
    start: async () => {
      log("start");
      startTimer();
    },
    waitChunks: chunks.waitChunks,
    pause: () =>
      new Promise<void>((resolve) => {
        pauseWaiters.current.push(resolve);
        pausing.current = true;
      }),
    resume: async () => {
      setPaused(false);
      log("resume");
      startTimer();
    },
    setPrompt: async (prompt) => log(describePrompt(prompt)),
    stop: async () => {
      stopTimer();
      setVisible(false);
      log("stopped");
    },
  };
}

// ---------------------------------------------------------------- live

export function useLiveDriver(log: Log, onDisconnected: () => void): Driver {
  const { status, connect, disconnect, sendCommand, uploadFile } = useReactor(
    (state) => ({
      status: state.status,
      connect: state.connect,
      disconnect: state.disconnect,
      sendCommand: state.sendCommand,
      uploadFile: state.uploadFile,
    }),
  );
  const [started, setStarted] = useState(false);
  const chunks = useChunks();

  const ready = useRef<(() => void) | null>(null);
  const imageReady = useRef<(() => void) | null>(null);
  const conditionsReady = useRef<(() => void) | null>(null);
  const paused = useRef<(() => void) | null>(null);

  const previousStatus = useRef(status);
  useEffect(() => {
    if (status === "ready") ready.current?.();
    if (status === "disconnected" && previousStatus.current !== "disconnected") {
      onDisconnected();
      setStarted(false);
    }
    previousStatus.current = status;
  }, [status, onDisconnected]);

  useReactorMessage((raw: unknown) => {
    const message = unwrapOrbisMessage(raw);
    switch (message.type) {
      case "state":
        if (message.has_image === true) imageReady.current?.();
        break;
      case "conditions_ready":
        conditionsReady.current?.();
        break;
      case "generation_started":
        setStarted(true);
        break;
      case "generation_paused":
        paused.current?.();
        log("paused");
        break;
      case "chunk_complete":
        chunks.tick();
        break;
      case "command_error":
        log(`error ${message.command || "command"}: ${message.reason || "rejected"}`);
        break;
    }
  });

  const cmd = async (name: string, data: Record<string, unknown> = {}) => {
    const raw = await sendCommand(name, data);
    const reply = raw ? unwrapOrbisMessage(raw) : null;
    if (reply?.type === "command_error") {
      throw new Error(`${name}: ${reply.reason || "rejected"}`);
    }
    return reply;
  };

  return {
    mode: "live",
    status,
    view: started ? (
      <ReactorView
        track="main_video"
        audioTrack="main_audio"
        muted // Orbis's own generated audio stays off; the film's sound is the music and effects
        videoObjectFit="cover"
      />
    ) : null,
    controls: (
      <>
        <button onClick={() => disconnect()} disabled={status === "disconnected"}>
          Disconnect (stops credits)
        </button>
      </>
    ),
    prepare: async (imageUrl, prompt) => {
      chunks.clear();
      if (!prompt.trim()) {
        throw new Error("The starting image prompt in scenes.js is empty; Orbis needs one to start.");
      }
      if (status !== "ready") {
        const connected = waitFor(ready, "the connection", 30_000);
        await connect();
        await connected;
      } else if (started) {
        await cmd("reset"); // also clears the image and prompt
        setStarted(false);
      }

      const blob = await (await fetch(imageUrl)).blob();
      const file = new File([blob], imageUrl.split("/").pop() || "start.jpg", { type: blob.type });
      const uploaded = await uploadFile(file, { name: file.name });
      const hasImage = waitFor(imageReady, "the start image", 15_000);
      await cmd("set_image", { image: uploaded });
      await hasImage;
      log(`image ${imageUrl}`);

      // Skip Orbis's audio model entirely (silence on main_audio from the next start).
      // Not fatal if refused: the player is muted anyway.
      try {
        await cmd("set_audio_enabled", { audio_enabled: false });
      } catch (caught) {
        log(`audio off refused: ${caught instanceof Error ? caught.message : String(caught)}`);
      }

      const hasPrompt = waitFor(conditionsReady, "the prompt", 15_000);
      await cmd("set_prompt", { prompt });
      await hasPrompt;
      log(describePrompt(prompt));
    },
    start: async () => {
      await cmd("start");
      log("start");
    },
    waitChunks: chunks.waitChunks,
    pause: async () => {
      const landed = waitFor(paused, "pause", 8_000, true);
      await cmd("pause");
      await landed;
    },
    resume: async () => {
      await cmd("resume");
      log("resume");
    },
    setPrompt: async (prompt) => {
      if (prompt.trim()) await cmd("set_prompt", { prompt });
      log(describePrompt(prompt));
    },
    stop: async () => {
      await disconnect();
    },
  };
}
