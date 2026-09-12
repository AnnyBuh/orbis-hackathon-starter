import { readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

// scenes.js is the single source of truth and lives in Anna's hackathon folder, where the
// tree reads it too. Reading it on every request means an edit shows up on reload.
// data/scenes.js is the committed copy (refresh it with `npm run sync-scenes`).
const CANDIDATES = [
  process.env.M8_SCENES_PATH,
  path.join(
    os.homedir(),
    "Documents/VibeCoding/SocialMediaAgent/projects/M8/interactive-video/hackathon/scenes.js",
  ),
  path.join(process.cwd(), "data/scenes.js"),
].filter((candidate): candidate is string => Boolean(candidate));

export const dynamic = "force-dynamic";

export async function GET() {
  for (const candidate of CANDIDATES) {
    try {
      const source = await readFile(candidate, "utf8");
      return new Response(source, {
        headers: {
          "Content-Type": "text/javascript; charset=utf-8",
          "Cache-Control": "no-store",
          "X-Scenes-Source": candidate,
        },
      });
    } catch {
      // try the next location
    }
  }
  return new Response("scenes.js not found", { status: 404 });
}
