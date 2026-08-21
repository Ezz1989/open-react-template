/**
 * Pull imagery for the FATHER articles into public/father/ and print the
 * attribution block to paste into lib/father-content.ts.
 *
 * ⚠️ WHY THIS IS A SEPARATE SCRIPT AND NOT A FEW MORE ROWS IN
 *    fetch-guide-images.mjs
 * ------------------------------------------------------------------------
 * That script ends with `writeFileSync(.../credits.json, ...)` over the whole
 * `credits` array it just built, and `search()` returns whatever Pexels ranks
 * first *on the day it runs*. Adding father slots to its WANTED list and
 * re-running would therefore re-download all sixteen month images as
 * DIFFERENT photos and rewrite credits.json to match — while
 * lib/guide-content.ts still carries the old photographer names hardcoded.
 * The site would then credit the wrong photographer on nine live articles,
 * which is exactly the kind of quiet wrongness the Pexels license section of
 * the sibling script is trying to avoid.
 *
 * Separate output directory, separate credits file, separate WANTED list. The
 * two series cannot damage each other.
 *
 * Pexels license (pexels.com/license, read 2026-08-21): free for commercial
 * use, attribution not required but carried anyway. The prohibition that
 * shapes layout here is the same one: "Don't imply endorsement of your product
 * by people or brands on the imagery" — so no photo of a person goes in a CTA.
 *
 * Usage:
 *   node scripts/fetch-father-images.mjs
 *
 * The key is read from `../Social Media/.env`, outside this repo and
 * untracked. Nothing here writes the key anywhere.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, "..");
const ENV_PATH = join(REPO, "..", "Social Media", ".env");
const OUT_DIR = join(REPO, "public", "father");
const CREDITS = join(OUT_DIR, "credits.json");

function readKey() {
  if (!existsSync(ENV_PATH)) {
    throw new Error(`No .env at ${ENV_PATH}. Expected PEXELS_API_KEY there.`);
  }
  const line = readFileSync(ENV_PATH, "utf8")
    .split(/\r?\n/)
    .find((l) => l.trim().startsWith("PEXELS_API_KEY="));
  if (!line) throw new Error("PEXELS_API_KEY not found in Social Media/.env");
  return line.split("=").slice(1).join("=").trim().replace(/^["']|["']$/g, "");
}

/**
 * What each slot needs.
 *
 * The father series is read in father mode, whose accent is navy
 * (`[data-mode="father"]` in globals.css), not the rose the month articles sit
 * in. Queries lean cooler and more object-led for that reason.
 *
 * Same two rejections as the month series, for the same reasons: no Latin
 * signage inside an Arabic article, and no identifiable faces (a face reads as
 * a testimonial, and the license forbids implying endorsement).
 */
const WANTED = [
  // labour-signs. The article is a decision guide that ends in a car journey,
  // so the hero is the journey and the second image is the timing.
  //
  // ⚠️ Two rejected first pulls, both for branding rather than composition:
  //   "car keys on neutral surface minimal" → a pink leather wallet embossed
  //   "NAHA" beside a cartoon keychain, on an air-conditioner unit.
  //   "analog clock minimal neutral wall"   → a station clock with "MOBATIME"
  //   printed on the dial.
  // Latin lettering inside an Arabic article is the Portuguese-calendar
  // problem again, and a legible brand mark additionally brushes the license
  // line about implying endorsement by brands. Queries now name the subject in
  // a way that returns textureless objects: a road surface and falling sand
  // carry no type.
  { slot: "labour-signs-hero", query: "empty night road headlights long exposure" },
  { slot: "labour-signs-clock", query: "hourglass sand timer minimal neutral" },

  // scan-20-weeks. ⚠️ Do NOT query for ultrasound machines or scan printouts —
  // the month-3 notes in the sibling script record why: scanner consoles come
  // covered in English UI, and stock "scan photos" are usually late-term 3D
  // renders that no 20-week anomaly scan produces. An abstract stands in.
  { slot: "scan-20-weeks-hero", query: "abstract blue water ripples surface" },

  // baby-budget. Not coins or banknotes: currency imagery names a country the
  // article deliberately does not, and most stock money shots carry Latin
  // denominations.
  // ⚠️ "empty wooden cot nursery neutral minimal" returned a decorated TODDLER
  // room — bunting, a doll cot, stacked play mats, pink throughout. Wrong age,
  // wrong palette, and it pictures precisely the over-furnished room this
  // article argues against.
  { slot: "baby-budget-hero", query: "wicker moses basket neutral minimal" },

  // fathers-mental-health. No faces. A person photographed as "depressed" is
  // both a cliche and the licence's "identifiable people may not appear in a
  // bad light" problem in its most literal form.
  { slot: "fathers-mental-health-hero", query: "empty armchair by window low light" },

  // ⚠️ "packed canvas duffel bag neutral floor" returned a bag with a legible
  // "Herschel Supply Co. / TRADE MARK" patch — a real brand, in Latin type,
  // filling the frame. Both rejection rules at once.
  { slot: "hospital-bag-hero", query: "empty open suitcase on bed minimal" },
  { slot: "her-mood-hero", query: "two cups of tea on table minimal neutral" },
  { slot: "baby-movements-hero", query: "folded grey linen fabric texture minimal" },
];

/**
 * Slots already downloaded keep their existing credit unless --force is
 * passed. This is the guard the sibling script lacks: re-running to add one
 * new article must not re-roll the photos of the articles already published.
 */
const force = process.argv.includes("--force");

const seen = new Set();

async function search(key, query) {
  for (let page = 1; page <= 4; page++) {
    const url = new URL("https://api.pexels.com/v1/search");
    url.searchParams.set("query", query);
    url.searchParams.set("per_page", "15");
    url.searchParams.set("page", String(page));
    url.searchParams.set("orientation", "landscape");

    const res = await fetch(url, { headers: { Authorization: key } });
    if (!res.ok) {
      throw new Error(`Pexels ${res.status} ${res.statusText} for "${query}"`);
    }
    const data = await res.json();
    for (const p of data.photos ?? []) {
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      return p;
    }
  }
  throw new Error(`No unused Pexels result for "${query}"`);
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${res.status} for ${url}`);
  writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
}

const key = readKey();
mkdirSync(OUT_DIR, { recursive: true });

const existing = existsSync(CREDITS)
  ? JSON.parse(readFileSync(CREDITS, "utf8"))
  : [];
const bySlot = new Map(existing.map((c) => [c.slot, c]));

for (const { slot, query } of WANTED) {
  if (!force && bySlot.has(slot) && existsSync(join(OUT_DIR, `${slot}.jpg`))) {
    console.log(`· ${slot}.jpg  already present, kept`);
    continue;
  }
  const photo = await search(key, query);
  const src = photo.src.large2x ?? photo.src.large;
  const file = `${slot}.jpg`;
  await download(src, join(OUT_DIR, file));
  bySlot.set(slot, {
    slot,
    query,
    src: `/father/${file}`,
    photographer: photo.photographer,
    photographerUrl: photo.photographer_url,
    pexelsUrl: photo.url,
    alt: photo.alt || "",
    width: photo.width,
    height: photo.height,
  });
  console.log(`✓ ${file}  ← ${photo.photographer}  (${photo.url})`);
}

// Written in WANTED order, so the file reads in article order rather than in
// whatever order the map happened to fill.
const out = WANTED.map(({ slot }) => bySlot.get(slot)).filter(Boolean);
writeFileSync(CREDITS, JSON.stringify(out, null, 2));
console.log(`\nWrote ${out.length} credits to public/father/credits.json`);
