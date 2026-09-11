"use client";

import {
  ReactorProvider,
  ReactorView,
  useReactor,
  useReactorMessage,
} from "@reactor-team/js-sdk";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

const MODEL_NAME = "reactor/visko-orbis-stable";
const DOCUMENTED_RESOLUTIONS = ["1080p", "2k", "4k"];

const MODEL_TRACKS = [
  { name: "main_video", kind: "video", direction: "recvonly" },
  { name: "main_audio", kind: "audio", direction: "recvonly" },
] as const;

type ModelMessage = {
  type?: string;
  command?: string;
  reason?: string;
  active_prompt?: string;
  available_resolutions?: string[];
  resolution?: string;
  started?: boolean;
  paused?: boolean;
};

function unwrapMessage(raw: unknown): ModelMessage {
  const envelope = raw as { type?: string; data?: Record<string, unknown> };
  if (envelope?.data && typeof envelope.data === "object") {
    return { ...envelope.data, type: envelope.type } as ModelMessage;
  }
  return raw as ModelMessage;
}

async function requestJwt() {
  const response = await fetch("/api/token", {
    method: "POST",
  });
  const result = (await response.json()) as { jwt?: string; error?: string };
  if (!response.ok || !result.jwt) {
    throw new Error(result.error || "Could not create a Reactor token");
  }
  return result.jwt;
}

export function OrbisDemo() {
  return (
    <section className="demo-shell">
      <OrbisRuntime />
    </section>
  );
}

function OrbisRuntime() {
  const jwtPromise = useRef<Promise<string> | null>(null);
  const getJwt = useCallback(() => {
    jwtPromise.current ??= requestJwt();
    return jwtPromise.current;
  }, []);
  const clearJwt = useCallback(() => {
    jwtPromise.current = null;
  }, []);

  return (
    <ReactorProvider
      apiUrl="https://api.reactor.inc"
      modelName={MODEL_NAME}
      modelTracks={[...MODEL_TRACKS]}
      connectOptions={{ autoConnect: false }}
      jwtToken={getJwt}
    >
      <Session onDisconnected={clearJwt} />
    </ReactorProvider>
  );
}

function Session({ onDisconnected }: { onDisconnected: () => void }) {
  const { status, connect, disconnect, sendCommand, uploadFile } = useReactor(
    (state) => ({
      status: state.status,
      connect: state.connect,
      disconnect: state.disconnect,
      sendCommand: state.sendCommand,
      uploadFile: state.uploadFile,
    }),
  );
  const [prompt, setPrompt] = useState(
    "A tiny rover crosses a red desert beneath two moons, cinematic, continuous tracking shot, no cuts.",
  );
  const [image, setImage] = useState<File | null>(null);
  const [resolution, setResolution] = useState("");
  const [availableResolutions, setAvailableResolutions] = useState<string[]>(
    DOCUMENTED_RESOLUTIONS,
  );
  const [muted, setMuted] = useState(true);
  const [busy, setBusy] = useState(false);
  const [runStarted, setRunStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [error, setError] = useState("");
  const [events, setEvents] = useState<string[]>([]);
  const previousStatus = useRef(status);
  const disconnecting = useRef(false);

  useEffect(() => {
    if (status === "disconnected" && previousStatus.current !== "disconnected") {
      onDisconnected();
      setRunStarted(false);
      setPaused(false);
    }
    previousStatus.current = status;
  }, [onDisconnected, status]);

  const run = async (action: () => Promise<unknown>) => {
    setBusy(true);
    setError("");
    try {
      await action();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    } finally {
      setBusy(false);
    }
  };

  useReactorMessage((raw: unknown) => {
    const message = unwrapMessage(raw);
    if (message.type === "state" && message.available_resolutions) {
      const reportedResolutions = message.available_resolutions.map(String);
      if (reportedResolutions.length) {
        setAvailableResolutions(reportedResolutions);
        setResolution((current) => {
          // An empty value omits the optional set_resolution command.
          if (!current) return "";
          if (reportedResolutions.includes(current)) return current;
          return "";
        });
      }
    }
    if (!disconnecting.current) {
      if (message.type === "state") {
        if (typeof message.started === "boolean") setRunStarted(message.started);
        if (typeof message.paused === "boolean") setPaused(message.paused);
      } else if (message.type === "generation_started") {
        setRunStarted(true);
        setPaused(false);
      } else if (message.type === "generation_paused") {
        setPaused(true);
      } else if (message.type === "generation_resumed") {
        setPaused(false);
      } else if (
        message.type === "generation_complete" ||
        message.type === "generation_reset"
      ) {
        setRunStarted(false);
        setPaused(false);
      }
    }
    if (message.type === "command_error") {
      setError(`${message.command || "command"}: ${message.reason || "rejected"}`);
      if (message.command === "start") setRunStarted(false);
    }
    if (message.type) {
      setEvents((current) => [message.type!, ...current].slice(0, 8));
    }
  });

  const start = async (event: FormEvent) => {
    event.preventDefault();
    await run(async () => {
      if (!prompt.trim()) throw new Error("Enter a prompt before starting.");
      if (image) {
        const uploaded = await uploadFile(image, { name: image.name });
        await sendCommand("set_image", { image: uploaded });
      }
      if (resolution) {
        await sendCommand("set_resolution", { resolution });
      }
      await sendCommand("set_prompt", { prompt: prompt.trim() });
      await sendCommand("start", {});
      setRunStarted(true);
      setPaused(false);
    });
  };

  const steer = () =>
    run(async () => {
      if (!prompt.trim()) throw new Error("Enter a prompt before steering.");
      await sendCommand("set_prompt", { prompt: prompt.trim() });
    });

  const disconnectSession = async () => {
    disconnecting.current = true;
    setRunStarted(false);
    setPaused(false);

    // Give React one paint to remove ReactorView before its WebRTC tracks are
    // closed. Otherwise the SDK can call play() while the video is detaching.
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    try {
      await run(() => disconnect());
    } finally {
      disconnecting.current = false;
    }
  };

  const connected = status === "ready";

  return (
    <div className="session-grid">
      <div className="player">
        {runStarted ? (
          <ReactorView
            track="main_video"
            audioTrack="main_audio"
            muted={muted}
            videoObjectFit="contain"
          />
        ) : (
          <div className="player-placeholder">
            {connected ? "Configure and start a run" : "Connect to Orbis Stable"}
          </div>
        )}
        <span className={`status status-${status}`}>{status}</span>
      </div>

      <form className="controls" onSubmit={start}>
        <div className="button-row">
          {!connected ? (
            <button type="button" disabled={busy} onClick={() => run(() => connect())}>
              Connect
            </button>
          ) : (
            <button type="button" disabled={busy} onClick={disconnectSession}>
              Disconnect
            </button>
          )}
          <button type="button" onClick={() => setMuted((value) => !value)}>
            {muted ? "Enable sound" : "Mute"}
          </button>
        </div>

        <fieldset disabled={!connected || runStarted || busy}>
          <legend>Next run setup</legend>
          <p className="hint">
            Resolution choices are loaded from Reactor for the next run.
          </p>
          <div className="two-column">
            <label>
              Optional start image (16:9 recommended)
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setImage(event.target.files?.[0] || null)}
              />
            </label>
            <label>
              Resolution for next run
              <select
                value={resolution}
                onChange={(event) => {
                  setResolution(event.target.value);
                }}
              >
                <option value="">Model setting (2k default)</option>
                {availableResolutions.map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </label>
          </div>
        </fieldset>

        <label>
          Prompt
          <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} />
        </label>

        <div className="button-row">
          <button type="submit" disabled={!connected || runStarted || busy}>
            Start run
          </button>
          <button type="button" disabled={!connected || !runStarted || busy} onClick={steer}>
            Steer current run
          </button>
        </div>

        <div className="button-row secondary">
          <button type="button" disabled={!connected || !runStarted || paused || busy} onClick={() => run(() => sendCommand("pause", {}))}>Pause</button>
          <button type="button" disabled={!connected || !runStarted || !paused || busy} onClick={() => run(() => sendCommand("resume", {}))}>Resume</button>
          <button type="button" disabled={!connected || !runStarted || busy} onClick={() => run(() => sendCommand("reset", {}))}>Reset</button>
        </div>

        {error && <p className="error">{error}</p>}
        <aside>
          <strong>Recent model events</strong>
          <code>{events.length ? events.join(" · ") : "No events yet"}</code>
        </aside>
      </form>
    </div>
  );
}
