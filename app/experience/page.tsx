import type { Metadata } from "next";
import { Bangers } from "next/font/google";

import { M8Experience } from "@/components/m8-experience";

import "./experience.css";

const comic = Bangers({ weight: "400", subsets: ["latin"], variable: "--font-comic" });

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "M8" };

// Same page on both servers: `npm run dev` (:3000) is live Orbis,
// `npm run mock` (:3001) sets M8_MOCK=1 and plays the still image instead.
export default function ExperiencePage() {
  const mock = process.env.M8_MOCK === "1";
  return (
    <div className={`m8-root ${comic.variable}`}>
      <M8Experience mock={mock} />
    </div>
  );
}
