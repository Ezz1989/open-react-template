/**
 * Pull imagery for the P4 topic-cluster articles into public/articles/ and
 * print the attribution block to paste into lib/articles-content.ts.
 *
 * Separate output dir + separate credits file from the guide/father scripts,
 * for the same reason fetch-father-images.mjs is its own file rather than
 * more rows in fetch-guide-images.mjs: re-running must never re-roll a photo
 * an already-published article's content file still names by photographer.
 *
 * Usage:
 *   node scripts/fetch-article-images.mjs
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
const OUT_DIR = join(REPO, "public", "articles");
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
 * Same two rejections as the guide/father scripts: no Latin signage inside an
 * Arabic article, no identifiable faces (a face reads as a testimonial, and
 * the Pexels license forbids implying endorsement).
 *
 * fasting-hero: the article carefully stays medical, not religious (it defers
 * the fiqh question entirely). The image follows that — dates and water is
 * the universal iftar staple, neutral enough not to read as depicting any one
 * religious practice or denomination, and ties directly to the hydration
 * theme the article opens on.
 *
 * ⚠️ First pull for "dates and glass of water table minimal" returned two
 * glasses of Turkish tea (çay) next to a bowl of dates, not water — the alt
 * text said "tea in glasses", easy to miss if the image isn't actually
 * looked at (the exact mistake ARTICLE_PATTERN.md §6 already documents once,
 * for the month-1 hero). Tea undercuts a hydration article, so the query was
 * narrowed to force water specifically.
 */
const WANTED = [
  { slot: "fasting-hero", query: "glass water pitcher dates bowl minimal" },

  // postpartum-recovery. Object/mood, not a mother-and-baby shot — same
  // no-identifiable-faces rule as the father series. Rest/recovery theme.
  { slot: "postpartum-hero", query: "soft folded blanket cozy bed minimal neutral" },

  // c-section-vs-vaginal-birth. A comparison article about a hospital
  // decision, not either method specifically — a calm, empty hospital
  // interior avoids picturing (or biasing toward) one delivery method.
  { slot: "csection-hero", query: "empty hospital room bed calm minimal" },

  // baby-gender-prediction-myths. The article's whole point is that shape/
  // colour-based folk methods are myths — gender-neutral yellow/green baby
  // clothes (not blue/pink) visually reinforces that rather than undercuts it.
  { slot: "gender-prediction-hero", query: "neutral yellow baby clothes folded minimal" },
];

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
    src: `/articles/${file}`,
    photographer: photo.photographer,
    photographerUrl: photo.photographer_url,
    pexelsUrl: photo.url,
    alt: photo.alt || "",
    width: photo.width,
    height: photo.height,
  });
  console.log(`✓ ${file}  ← ${photo.photographer}  (${photo.url})`);
}

const out = WANTED.map(({ slot }) => bySlot.get(slot)).filter(Boolean);
writeFileSync(CREDITS, JSON.stringify(out, null, 2));
console.log(`\nWrote ${out.length} credits to public/articles/credits.json`);
