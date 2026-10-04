/**
 * ingest.mjs — Gemini article JSON → checked, published article.
 *
 *   node scripts/articles/ingest.mjs          check every content/articles/*.json, publish the ones that pass
 *   node scripts/articles/ingest.mjs --dry    check only, write nothing
 *
 * For each file:
 *   1. SEO gate (docs/ARTICLE_PATTERN.md §12): keyword placement, title/description length,
 *      length, FAQ count, section count. ERRORS block publishing; WARNINGS are printed.
 *   2. Every citation URL is requested — anything that doesn't answer 2xx/3xx is an error.
 *      This only proves the page exists. Claude still opens each one and checks it says what the
 *      article claims (§5) before pushing; the script can't read meaning.
 *   3. Hero photo from Pexels (`imageQuery`) → public/articles/<slug>-hero.jpg, once. The JSON must
 *      then get a hand-written `heroAlt` after someone has LOOKED at the photo (§6) — until it does,
 *      the article is held back.
 *   4. Writes lib/articles-generated.json, which lib/articles-content.ts merges into ARTICLES.
 *
 * Files whose `cluster` isn't a known tag (the Sept drafts, already hand-ported) are skipped.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, "..", "..");
const IN_DIR = join(REPO, "content", "articles");
const OUT = join(REPO, "lib", "articles-generated.json");
const IMG_DIR = join(REPO, "public", "articles");
const DRY = process.argv.includes("--dry");
const { CLUSTERS } = createRequire(import.meta.url)("./clusters.js");
const TODAY = new Date().toISOString().slice(0, 10);

/** Loose Arabic match: tashkeel off, أإآ→ا, ة→ه, ى→ي — so "الحامل" matches "الحامِل". */
const norm = (t = "") => t
  .replace(/[ً-ْٰـ]/g, "")
  .replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي")
  .replace(/\s+/g, " ").trim();
const has = (text, kw) => norm(text).includes(norm(kw));
const words = (t = "") => t.split(/\s+/).filter(Boolean).length;

function parseFile(file) {
  const raw = readFileSync(file, "utf8");
  return JSON.parse(raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1));
}

function seoCheck(a) {
  const E = [], W = [];
  for (const f of ["slug", "primaryKeyword", "title", "metaTitle", "description", "standfirst", "eyebrow", "sections", "faqs", "cta", "citations"])
    if (!a[f]) E.push(`missing ${f}`);
  if (E.length) return { E, W };

  const kw = a.primaryKeyword;
  if (!/^[a-z0-9]+(-[a-z0-9]+){0,5}$/.test(a.slug)) E.push(`slug "${a.slug}" not short english kebab-case`);
  if (!norm(a.title.ar).startsWith(norm(kw)) && !has(a.title.ar.slice(0, kw.length + 15), kw))
    E.push(`title.ar doesn't start with the keyword "${kw}"`);
  if (!has(a.metaTitle.ar, kw)) E.push("metaTitle.ar missing the keyword");
  if (a.metaTitle.ar.length > 60) E.push(`metaTitle.ar ${a.metaTitle.ar.length} chars (max 60)`);
  if (a.metaTitle.en.length > 60) W.push(`metaTitle.en ${a.metaTitle.en.length} chars (max 60)`);
  if (!has(a.description.ar, kw)) E.push("description.ar missing the keyword");
  const dl = a.description.ar.length;
  if (dl < 100 || dl > 170) E.push(`description.ar ${dl} chars (want 120–155)`);
  else if (dl < 120 || dl > 155) W.push(`description.ar ${dl} chars (want 120–155)`);

  const first = a.sections[0]?.body?.[0]?.ar ?? "";
  if (!has(first.split(/[.!؟?]/)[0] + " " + first.slice(0, 200), kw)) E.push("keyword not in the opening sentence");
  const h2kw = a.sections.filter((s) => has(s.heading.ar, kw)).length;
  if (h2kw < 2) W.push(`keyword in ${h2kw} H2s (want ≥ 2)`);
  if (a.sections.length < 5) W.push(`${a.sections.length} sections (want 5–8)`);

  const arText = a.sections.flatMap((s) => [
    ...(s.body ?? []), ...(s.bullets ?? []), ...(s.afterBullets ?? []),
    ...(s.table ? s.table.rows.flat() : []),
  ]).map((x) => x.ar).join(" ") + " " + a.faqs.map((f) => f.q.ar + " " + f.a.ar).join(" ");
  const n = words(arText);
  if (n < 900) E.push(`only ${n} Arabic words (want 1,200–1,800)`);
  else if (n < 1200) W.push(`${n} Arabic words (want 1,200–1,800)`);
  if (a.faqs.length < 6) W.push(`${a.faqs.length} FAQs (want 6–8)`);
  if (/[0-9]/.test(arText.replace(/https?:\S+/g, ""))) W.push("Latin digits in Arabic prose (use ٠-٩)");

  const ids = new Set(a.citations.map((c) => c.id));
  const used = [...a.sections.flatMap((s) => s.cites ?? []), ...(a.redFlags?.cites ?? []), ...a.faqs.flatMap((f) => f.cites ?? [])];
  for (const id of used) if (!ids.has(id)) E.push(`cites unknown source id "${id}"`);
  const blocked = a.citations.filter((c) => /acog\.org|cdc\.gov/.test(c.url));
  if (blocked.length) E.push(`ACOG/CDC can't be verified by fetch: ${blocked.map((c) => c.url).join(", ")}`);
  return { E, W, words: n };
}

async function linkCheck(a) {
  const E = [];
  for (const c of a.citations) {
    try {
      const res = await fetch(c.url, {
        redirect: "follow",
        headers: { "User-Agent": "Mozilla/5.0 (compatible; NawahLinkCheck/1.0)" },
        signal: AbortSignal.timeout(15000),
      });
      if (res.status >= 400) E.push(`dead source ${res.status}: ${c.url}`);
    } catch (e) {
      E.push(`source unreachable (${e.name}): ${c.url}`);
    }
  }
  return E;
}

function pexelsKey() {
  const env = join(REPO, "..", "Social Media", ".env");
  const line = readFileSync(env, "utf8").split(/\r?\n/).find((l) => l.trim().startsWith("PEXELS_API_KEY="));
  return line.split("=").slice(1).join("=").trim().replace(/^["']|["']$/g, "");
}

/** Downloads the hero once; returns the GuideImage minus alt, or null. */
async function hero(a) {
  const file = join(IMG_DIR, `${a.slug}-hero.jpg`);
  const credits = join(IMG_DIR, "credits.json");
  const all = existsSync(credits) ? JSON.parse(readFileSync(credits, "utf8")) : [];
  const known = all.find((c) => c.slot === `${a.slug}-hero`);
  if (known && existsSync(file)) return known;
  if (DRY || !a.imageQuery) return null;

  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", a.imageQuery);
  url.searchParams.set("orientation", "landscape");
  url.searchParams.set("per_page", "15");
  const res = await fetch(url, { headers: { Authorization: pexelsKey() } });
  if (!res.ok) throw new Error(`Pexels ${res.status}`);
  const usedIds = new Set(all.map((c) => c.pexelsUrl));
  const photo = (await res.json()).photos.find((p) => !usedIds.has(p.url));
  if (!photo) return null;
  const img = await fetch(photo.src.large2x ?? photo.src.large);
  writeFileSync(file, Buffer.from(await img.arrayBuffer()));
  const credit = {
    slot: `${a.slug}-hero`,
    src: `/articles/${a.slug}-hero.jpg`,
    photographer: photo.photographer,
    photographerUrl: photo.photographer_url,
    pexelsUrl: photo.url,
    width: photo.width,
    height: photo.height,
  };
  writeFileSync(credits, JSON.stringify([...all, credit], null, 2) + "\n");
  return credit;
}

const files = readdirSync(IN_DIR).filter((f) => f.endsWith(".json"));
const prev = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : [];
const out = [];
let failed = 0;

for (const f of files) {
  let a;
  try { a = parseFile(join(IN_DIR, f)); } catch (e) { console.log(`✗ ${f}: not valid JSON (${e.message})`); failed++; continue; }
  if (!CLUSTERS[a.cluster]) continue; // legacy Sept draft, already hand-ported

  const { E, W, words: n } = seoCheck(a);
  if (!E.length) E.push(...(await linkCheck(a)));
  const img = E.length ? null : await hero(a);
  if (!E.length && !img) E.push("no hero photo found — change imageQuery");
  if (!E.length && !(a.heroAlt?.ar && a.heroAlt?.en))
    E.push(`heroAlt missing — LOOK at public/articles/${a.slug}-hero.jpg, then add "heroAlt": {ar, en} to ${f}`);
  if (!E.length && out.some((o) => o.slug === a.slug)) E.push(`duplicate slug ${a.slug}`);

  console.log(`${E.length ? "✗" : "✓"} ${f} → /articles/${a.cluster}/${a.slug}${n ? `  (${n} words)` : ""}`);
  for (const e of E) console.log(`    ERROR  ${e}`);
  for (const w of W) console.log(`    warn   ${w}`);
  if (E.length) {
    failed++;
    const old = prev.find((p) => p.slug === a.slug); // keep the live version live while a fix is pending
    if (old) out.push(old);
    continue;
  }

  const { slot, ...image } = img;
  out.push({
    cluster: a.cluster,
    slug: a.slug,
    published: true,
    hero: { ...image, alt: a.heroAlt },
    eyebrow: a.eyebrow,
    title: a.title,
    metaTitle: a.metaTitle,
    description: a.description,
    standfirst: a.standfirst,
    sections: a.sections,
    ...(a.redFlags ? { redFlags: a.redFlags } : {}),
    faqs: a.faqs,
    cta: a.cta,
    citations: a.citations,
    keywords: [a.primaryKeyword, ...(a.keywords ?? [])],
    related: a.related ?? [],
    updated: prev.find((p) => p.slug === a.slug)?.updated ?? TODAY,
  });
}

if (!DRY) writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
console.log(`\n${out.length} article(s) in lib/articles-generated.json${DRY ? " (dry run, nothing written)" : ""} · ${failed} need fixing`);
process.exitCode = failed ? 1 : 0;
