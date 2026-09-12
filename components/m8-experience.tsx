"use client";

import { ReactorProvider } from "@reactor-team/js-sdk";
import { useCallback, useEffect, useRef, useState } from "react";

import { type Driver, type Log, useLiveDriver, useMockDriver } from "@/components/m8-drivers";
import { Track } from "@/lib/m8-audio";
import {
  BABY,
  CLICK,
  INTRO,
  LOGO,
  MOAN,
  MUSIC,
  OUTRO,
  SFX_FADE_MS,
  type Option,
  type Story,
  TIMING,
  imageUrl,
  landMs,
  loadStory,
  readMs,
} from "@/lib/m8-experience";
import { ORBIS_MODEL_NAME, ORBIS_TRACKS, requestReactorJwt } from "@/lib/orbis";

export function M8Experience({ mock }: { mock: boolean }) {
  return mock ? <MockRoot /> : <LiveRoot />;
}

function useLog() {
  const [lines, setLines] = useState<string[]>([]);
  const log = useCallback<Log>(
    (line) =>
      setLines((current) =>
        [`${new Date().toLocaleTimeString()}  ${line}`, ...current].slice(0, 8),
      ),
    [],
  );
  return { lines, log };
}

function MockRoot() {
  const { lines, log } = useLog();
  const driver = useMockDriver(log);
  return <Player driver={driver} log={log} lines={lines} />;
}

function LiveRoot() {
  const jwtPromise = useRef<Promise<string> | null>(null);
  const getJwt = useCallback(() => {
    jwtPromise.current ??= requestReactorJwt();
    return jwtPromise.current;
  }, []);
  const clearJwt = useCallback(() => {
    jwtPromise.current = null;
  }, []);

  return (
    <ReactorProvider
      apiUrl="https://api.reactor.inc"
      modelName={ORBIS_MODEL_NAME}
      modelTracks={[...ORBIS_TRACKS]}
      connectOptions={{ autoConnect: false }}
      jwtToken={getJwt}
    >
      <LiveInner clearJwt={clearJwt} />
    </ReactorProvider>
  );
}

function LiveInner({ clearJwt }: { clearJwt: () => void }) {
  const { lines, log } = useLog();
  const driver = useLiveDriver(log, clearJwt);
  return <Player driver={driver} log={log} lines={lines} />;
}

// A speaker, left of the TV voice lines: this sound is coming from the TV. Same pink as the
// TV text, no outline, and it pops in size while a line is being written.
function SpeakerMark({ talking }: { talking: boolean }) {
  return (
    <svg className={`m8-speaker${talking ? " is-talking" : ""}`} viewBox="0 0 100 80" aria-hidden="true">
      <g className="m8-speaker-body" fill="currentColor" stroke="currentColor">
        <path d="M10 28 H30 L55 8 V72 L30 52 H10 Z" strokeWidth="4" strokeLinejoin="round" />
        <path d="M67 27 Q77 40 67 53 M79 16 Q95 40 79 64" fill="none" strokeWidth="7" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// A lipstick kiss at the start of each TV voice line: saucy content.
function KissMark() {
  return (
    <svg className="m8-kiss" viewBox="0 0 120 84" aria-hidden="true">
      <path
        d="M10 42 C25 22 42 10 52 16 C56 18 58 22 60 25 C62 22 64 18 68 16 C78 10 95 22 110 42 C90 39 75 35 60 39 C45 35 30 39 10 42 Z"
        fill="#e0115f"
      />
      <path
        d="M10 42 C30 45 45 48 60 46 C75 48 90 45 110 42 C98 64 80 74 60 74 C40 74 22 64 10 42 Z"
        fill="#e0115f"
      />
      <g stroke="#ff7fb0" strokeWidth="1.6" strokeLinecap="round" opacity="0.8" fill="none">
        <path d="M34 24 C38 30 40 34 42 38" />
        <path d="M80 22 C78 28 77 33 76 37" />
        <path d="M40 52 C44 60 48 66 52 69" />
        <path d="M60 50 L60 70" />
        <path d="M82 52 C78 60 74 65 69 69" />
      </g>
    </svg>
  );
}

type Phase = "idle" | "intro" | "warming" | "tag" | "lines" | "choice" | "answer" | "done";

const ABORT = Symbol("abort");

function Player({ driver, log, lines }: { driver: Driver; log: Log; lines: string[] }) {
  // The flow reads the newest driver on every step, not the one from the click.
  const driverRef = useRef(driver);
  driverRef.current = driver;

  const stRef = useRef<Record<string, unknown>>({});
  const [story, setStory] = useState<Story | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStory(stRef.current)
      .then(({ story: loaded, source }) => {
        setStory(loaded);
        log(`scenes.js from ${source}`);
      })
      .catch((caught) => setError(String(caught)));
  }, [log]);

  const [phase, setPhase] = useState<Phase>("idle");
  const [tag, setTag] = useState("");
  const [vo, setVo] = useState<string[]>([]);
  const [tvWriting, setTvWriting] = useState(false); // a TV line's words are still landing
  const [says, setSays] = useState<string[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [stamp, setStamp] = useState("");
  const [where, setWhere] = useState("");
  const [ending, setEnding] = useState("");
  const [runKey, setRunKey] = useState(0);

  const runId = useRef(0);
  const choose = useRef<((index: number) => void) | null>(null);

  // Sound. All files load when the page opens, so the music is there the moment the logo
  // appears and each effect starts the instant its line does.
  const sound = useRef<{ moan: Track; baby: Track; click: Track; music: Track } | null>(null);
  const tracks = () =>
    (sound.current ??= {
      moan: new Track(MOAN.src, MOAN.volume, true),
      baby: new Track(BABY.src, BABY.volume),
      click: new Track(CLICK.src, CLICK.volume),
      music: new Track(MUSIC.src, MUSIC.volume, true),
    });
  useEffect(() => {
    const t = tracks();
    t.moan.load();
    t.baby.load();
    t.click.load();
    t.music.load();
    return () => {
      t.moan.stop();
      t.baby.stop();
      t.click.stop();
      t.music.stop();
    };
  }, []);

  const blocked = (caught: unknown) => log(`sound blocked: ${String(caught)}`);
  const startSfx = (name: "moan" | "baby") => tracks()[name].playFromStart().catch(blocked);
  const stopSfx = (name: "moan" | "baby") => tracks()[name].fadeOut(SFX_FADE_MS);

  // Music is switchable and only plays while a run is on screen.
  const [musicOn, setMusicOn] = useState(true);
  const musicOnRef = useRef(true);
  const running = useRef(false);
  const toggleMusic = () => {
    const next = !musicOnRef.current;
    musicOnRef.current = next;
    setMusicOn(next);
    if (!next) tracks().music.stop();
    else if (running.current) tracks().music.resume().catch(blocked);
  };

  const run = async () => {
    if (!story) return;
    const id = ++runId.current;
    const step = async <T,>(promise: Promise<T>) => {
      const value = await promise;
      if (runId.current !== id) throw ABORT; // a newer run has taken over
      return value;
    };
    const sleep = (ms: number) => step(new Promise<void>((r) => setTimeout(r, ms)));
    const d = () => driverRef.current;

    // Music from the very beginning, with the logo.
    const t = tracks();
    t.moan.stop();
    t.baby.stop();
    t.music.stop();
    running.current = true;
    if (musicOnRef.current) t.music.playFromStart().catch(blocked);

    const st = stRef.current;
    Object.keys(st).forEach((key) => delete st[key]);
    setRunKey((k) => k + 1);
    setVo([]);
    setTvWriting(false);
    setSays([]);
    setOptions([]);
    setStamp("");
    setEnding("");
    setError("");

    try {
      const first = story.SCENES[story.ORDER[0]];

      // Logo and intro line on black. Setup happens underneath; generation waits for it.
      setPhase("intro");
      const intro = new Promise<void>((r) => setTimeout(r, INTRO.ms));
      await step(d().prepare(imageUrl(first.image?.file ?? ""), first.image?.prompt ?? ""));
      await step(intro);

      setTag(first.tag);
      setPhase("warming");
      await step(d().start());
      await step(d().waitChunks(1)); // the first chunk has no frames

      for (let i = 0; i < story.ORDER.length; i++) {
        const sceneId = story.ORDER[i];
        const scene = story.SCENES[sceneId];
        setWhere(`${scene.tag} · ${story.variantFor(sceneId)}`);

        if (i > 0) {
          setTag(scene.tag);
          setPhase("tag");
          await sleep(TIMING.tagMs);
        }

        // Lines in script order. The video pauses the moment the last one lands;
        // reading it happens over the frozen frame.
        setPhase("lines");
        if (scene.vo.length) startSfx("moan");
        for (const line of scene.vo) {
          setVo((current) => [...current, line]);
          setTvWriting(true);
          await sleep(landMs(line));
          setTvWriting(false);
          await sleep(readMs(line));
        }
        stopSfx("moan");
        if (scene.says.length) startSfx("baby");
        for (let j = 0; j < scene.says.length; j++) {
          const line = scene.says[j];
          setSays((current) => [...current, line]);
          const last = j === scene.says.length - 1;
          await sleep(landMs(line) + (last ? 0 : readMs(line)));
        }
        stopSfx("baby"); // the child's line is fully written
        await step(d().pause());

        setOptions(scene.mother);
        setPhase("choice");
        const picked = await step(new Promise<number>((r) => (choose.current = r)));
        const option = scene.mother[picked];
        st[option.key] = option.rule;
        if (option.how) st[`${option.key}how`] = option.how;
        log(`${scene.tag} · ${option.t}`);

        setOptions([]);
        setVo([]);
        setSays([]);
        setStamp(option.t);
        setPhase("answer");
        await step(d().setPrompt(option.prompt ?? ""));
        await step(d().resume());
        const last = i === story.ORDER.length - 1;
        await step(d().waitChunks(last ? TIMING.afterLastChunks : TIMING.betweenChunks));
        setStamp("");
      }

      await step(d().pause());
      setEnding(
        story.won()
          ? `Ending A · ${story.ENDINGS.A.h}`
          : `Ending C · ${story.ENDINGS.C.h} · ${story.whichDeath().n}`,
      );
      setPhase("done");
    } catch (caught) {
      if (caught === ABORT) return; // the newer run has already stopped the sound
      running.current = false;
      t.moan.stop();
      t.baby.stop();
      t.music.stop();
      setError(caught instanceof Error ? caught.message : String(caught));
      setPhase("idle");
    }
  };

  const pick = (index: number) => {
    if (phase !== "choice") return;
    tracks().click.playFromStart().catch(blocked);
    choose.current?.(index);
    choose.current = null;
  };

  return (
    <div className="m8-wrap">
      <div className="m8-stage">
        <div className="m8-video">{driver.view}</div>

        <div className="m8-overlay" key={runKey}>
          {phase === "intro" && (
            <div className="m8-intro">
              <div className="m8-intro-logo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={LOGO} alt="M8" />
              </div>
              <div className="m8-intro-title">
                <h1>{INTRO.title}</h1>
                <h2>{INTRO.subtitle}</h2>
                <p>{INTRO.credit}</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={INTRO.creditLogo} alt="Visko" />
              </div>
            </div>
          )}

          {(phase === "warming" || phase === "tag") && tag && (
            <div className="m8-card" key={tag}>
              <span className="m8-word">{tag}</span>
            </div>
          )}

          {vo.length > 0 && (
            <div className="m8-tv">
              <SpeakerMark talking={tvWriting} />
              <div className="m8-tv-lines">
              {vo.map((line, n) => (
                <div className="m8-tv-box" key={n}>
                  <KissMark />
                  {line.split(" ").map((w, i) => (
                    <span
                      className="m8-tv-word"
                      key={i}
                      style={{ animationDelay: `${120 + i * TIMING.wordStaggerMs}ms` }}
                    >
                      {w}
                    </span>
                  ))}
                </div>
              ))}
              </div>
            </div>
          )}

          {says.length > 0 && (
            <div className="m8-child">
              {says.map((line, n) => (
                <div key={n}>
                  {line.split(" ").map((w, i) => (
                    <span
                      className="m8-word"
                      key={i}
                      style={{ animationDelay: `${i * TIMING.wordStaggerMs}ms` }}
                    >
                      {w}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          )}

          {phase === "choice" && (
            <div className={`m8-choices n${options.length}`}>
              {options.map((option, i) => (
                <button
                  className="m8-choice"
                  key={option.t}
                  style={{ animationDelay: `${i * 120}ms, ${600 + i * 280}ms` }}
                  onClick={() => pick(i)}
                >
                  {option.t}
                </button>
              ))}
            </div>
          )}

          {phase === "done" && (
            <div className="m8-outro">
              <div className="m8-outro-lines">
                {OUTRO.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <div className="m8-outro-end">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={LOGO} alt="M8" />
                <p>{OUTRO.link}</p>
              </div>
            </div>
          )}

          {stamp && (
            <div className="m8-stamp" key={stamp}>
              {stamp}
            </div>
          )}
        </div>
      </div>

      <div className="m8-hud">
        <button onClick={run} disabled={!story}>
          {phase === "idle" ? "Start" : "Replay"}
        </button>
        <button onClick={toggleMusic}>{musicOn ? "Music off" : "Music on"}</button>
        {driver.controls}
        <span className="m8-status">
          {driver.mode.toUpperCase()} · {driver.status} · {phase}
          {where && ` · ${where}`}
        </span>
        {ending && <span className="m8-ending">{ending}</span>}
        {error && <span className="m8-error">{error}</span>}
      </div>

      <ol className="m8-log">
        {lines.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ol>
    </div>
  );
}
