// The M8 interactive experience: the shape of scenes.js and the pacing of the page.

export type Option = {
  t: string;
  rule: boolean;
  key: string;
  how?: string;
};

// What Orbis is told after a choice, per version of a scene. Following the Orbis prompt guide:
// only what visibly changes (never the whole world again), one action per step, sent a few
// seconds apart so each change lands before the next.
export type Change = { steps?: string[] };

export type Scene = {
  tag: string;
  rule: string;
  vo: string[];
  says: string[];
  mother: Option[];
  image?: { file: string; prompt: string; referencePrompt?: string }; // only the first scene has one
  variants: Record<string, { changes?: Change[] }>; // changes[n] belongs to mother option n
};

// One hell ending: its name, its number on screen, and the sentence about humanity and AI.
export type Ending = { n: string; num: number; title?: string; outcome: string };

export type Story = {
  SCENES: Record<string, Scene>;
  ORDER: string[];
  ENDINGS: Record<string, { h: string; tag: string; num?: number; outcome?: string }>;
  DEATHS: Record<string, Ending>;
  variantFor: (id: string) => string;
  won: () => boolean;
  whichDeath: () => Ending;
};

// scenes.js is a plain browser script whose routing reads a global `st`. Handing `st` in
// as a parameter lets its own routing functions read the state object this page keeps.
export async function loadStory(st: Record<string, unknown>) {
  const response = await fetch("/api/scenes", { cache: "no-store" });
  if (!response.ok) throw new Error(`Could not load scenes.js (${response.status})`);
  const source = await response.text();
  const story = new Function(
    "st",
    `${source}\n;return { SCENES, ORDER, ENDINGS, DEATHS, variantFor, won, whichDeath };`,
  )(st) as Story;
  return { story, source: response.headers.get("X-Scenes-Source") ?? "" };
}

// Images named in scenes.js are served from public/m8/.
export const imageUrl = (file: string) => `/m8/${file.split("/").pop()}`;

export const LOGO = "/m8/logo.png";

// Sound effects. Both files have their leading silence trimmed off (moan 0.76s, baby 0.33s)
// so they start the instant their line appears, and both always play from the beginning.
// The moan runs while the TV voice lines are on screen alone and fades as the child speaks.
// The baby voice starts with the child's line and fades once that line is fully written.
export const MOAN = { src: "/m8/moan-trimmed.mp3", volume: 1 };
export const BABY = { src: "/m8/baby-trimmed.mp3", volume: 1 };
export const SFX_FADE_MS = 400;
// Played when a choice button is pressed. The click starts at 0s, so nothing to trim.
export const CLICK = { src: "/m8/click.mp3", volume: 1 };

// Music under the whole piece, starting with the logo. Switchable; the sound effects are not.
// Mean loudness of the files: music -13.2dB, moan -18.6dB, baby -25.4dB. At 0.1 (-20dB) the
// music sits around -33dB, under both effects the whole time.
export const MUSIC = { src: "/m8/music.mp3", volume: 0.1 };

// The opening, two cards on black: the M8 logo alone, then the title with the Visko credit.
export const INTRO = {
  title: "“How to Train Your AI”",
  subtitle: "(Implicit Version)",
  credit: "Created using",
  creditLogo: "/m8/visko-logo.png", // the wordmark from visko.ai
  ms: 9400, // keep in sync with the m8-intro animations in experience.css
};

// The closing card. The two lines are the ones on the tree page (tree.html).
// Fades to black, the lines come in one after the other, then the logo and the link stay.
export const OUTRO = {
  lines: ["Intelligent society begins with how we love.", "Aligned AI starts with how we train it."],
  link: "For more information go on M8.Life",
};

export const TIMING = {
  chunkMs: 1800, // Orbis emits a chunk about every 1.8s; the mock ticks at the same rate
  leadInMs: 5000, // the video plays on its own this long before scene 1's first line and sound
  wordStaggerMs: 90, // gap between words stamping in
  readMsPerWord: 320, // how long a line stays alone before the next one comes
  minReadMs: 1300,
  tagMs: 1400, // SCENE 2/3/4 card between scenes
  betweenChunks: 6, // at least this many chunks (~10.8s) after an answer before the next scene
  afterLastChunks: 6, // same for the last answer, before the ending card
  stepChunks: 2, // chunks (~3.6s) between steps; the guide says a change takes 2-4s to land
  lastStepChunks: 3, // the last step gets a little longer to land
  endingMs: 7000, // the ending card; keep in sync with the m8-endcard animations in experience.css
};

// Splits a child line into even rows, so the speech bubble can hug its text. (CSS
// wrapping leaves the box as wide as the unwrapped line, with empty space either side.)
const BUBBLE_ROW_CHARS = 26;
export function balancedRows(line: string) {
  const words = line.split(" ");
  const rowCount = Math.ceil(line.length / BUBBLE_ROW_CHARS);
  if (rowCount <= 1) return [words];
  const target = line.length / rowCount;
  const rows: string[][] = [[]];
  let before = 0; // characters before the current word
  for (const word of words) {
    const middle = before + word.length / 2;
    if (rows[rows.length - 1].length && middle > target * rows.length && rows.length < rowCount) {
      rows.push([word]);
    } else {
      rows[rows.length - 1].push(word);
    }
    before += word.length + 1;
  }
  return rows;
}

const words = (line: string) => line.split(" ").length;
export const readMs = (line: string) =>
  Math.max(TIMING.minReadMs, words(line) * TIMING.readMsPerWord);
export const landMs = (line: string) => words(line) * TIMING.wordStaggerMs + 350;
