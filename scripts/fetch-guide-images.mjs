/**
 * Pull article imagery from Pexels into public/guide/ and print the
 * attribution block to paste into lib/guide-content.ts.
 *
 * Follows the same access pattern the TikTok pipeline already uses
 * (`../../Social Media/Tiktok/pipeline/render_reels.js`): GET
 * api.pexels.com/v1/search with the key in a bare `Authorization` header, and
 * a seen-id set so the same photo never lands twice in one run. Differences:
 * landscape rather than portrait, and we persist the photographer credit.
 *
 * Pexels license (pexels.com/license, read 2026-08-21): free for commercial
 * use on websites, modification allowed, attribution NOT required but
 * appreciated. Three prohibitions actually constrain us:
 *   - "Identifiable people may not appear in a bad light or in a way that is
 *     offensive."
 *   - "Don't imply endorsement of your product by people or brands on the
 *     imagery."  → never place a photo of a person inside the CTA block.
 *   - "Don't redistribute or sell the photos ... on other stock platforms."
 *
 * Usage:
 *   node scripts/fetch-guide-images.mjs
 *
 * The key is read from `../Social Media/.env`, which is outside this repo and
 * untracked. Nothing here writes the key anywhere.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, "..");
const ENV_PATH = join(REPO, "..", "Social Media", ".env");
const OUT_DIR = join(REPO, "public", "guide");

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
 * What each slot needs. `query` is what Pexels searches; `slot` becomes the
 * filename and the key in the attribution output.
 *
 * Queries deliberately avoid "pregnant belly" close-ups: the audience is
 * Arabic and Gulf, the article is clinical, and a bare-midriff hero would be
 * both off-tone and a bad fit for the reader's context.
 */
const WANTED = [
  // The test flat-lay reads as "early pregnancy" instantly and carries no
  // text, which matters: the first hero pulled was a Portuguese desk calendar
  // ("AGOSTO", "Dia dos Pais"). Latin-script signage inside an Arabic article
  // looks like what it is, a stock photo nobody looked at.
  { slot: "month-1-hero", query: "pregnancy test flat lay" },
  { slot: "month-1-folate", query: "vitamin supplement pills white background" },
  { slot: "month-1-quiet", query: "tea cup morning light minimal still life" },

  // Month 2 is the nausea month, so the imagery is what actually helps:
  // ginger, lemon, rest. Not a woman clutching her stomach.
  // First pull for the hero was a dark rustic board next to a rainbow-striped
  // placemat, which fights the cream-and-rose palette on every other page.
  { slot: "month-2-hero", query: "fresh ginger root white background minimal" },
  { slot: "month-2-rest", query: "white bed linen soft morning light" },

  // Month 3 closes the first trimester and contains the dating scan.
  // ⚠️ Do NOT query for ultrasound machines. The first pull was a scanner
  // console covered in English UI ("Routine", "MagiCut", "HDlive", a QWERTY
  // keyboard) which is the Portuguese-calendar problem again, and it showed a
  // late-term 3D face rather than anything a 12-week scan produces.
  { slot: "month-3-hero", query: "soft sunlight through sheer curtain window" },
  { slot: "month-3-detail", query: "soft neutral dried flowers minimal still life" },
];

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

const credits = [];
for (const { slot, query } of WANTED) {
  const photo = await search(key, query);
  const src = photo.src.large2x ?? photo.src.large;
  const file = `${slot}.jpg`;
  await download(src, join(OUT_DIR, file));
  credits.push({
    slot,
    query,
    src: `/guide/${file}`,
    photographer: photo.photographer,
    photographerUrl: photo.photographer_url,
    pexelsUrl: photo.url,
    alt: photo.alt || "",
    width: photo.width,
    height: photo.height,
  });
  console.log(`✓ ${file}  ← ${photo.photographer}  (${photo.url})`);
}

writeFileSync(join(OUT_DIR, "credits.json"), JSON.stringify(credits, null, 2));
console.log(`\nWrote ${credits.length} images + credits.json to public/guide/`);
