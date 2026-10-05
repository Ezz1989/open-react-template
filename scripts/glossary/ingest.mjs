/**
 * ingest.mjs — Gemini glossary JSON → lib/glossary-generated.json.
 *
 *   node scripts/glossary/ingest.mjs          check content/glossary/*.json, publish what passes
 *   node scripts/glossary/ingest.mjs --dry    check only
 *
 * Every file holds { "entries": [...] } (Part 1 / Part 2 files are merged).
 * Per entry: required fields present in both languages, slug is kebab-case,
 * `link` is "" or a real internal path, and every citation URL answers 2xx/3xx
 * (same rule as the article ingest — the page must exist; Claude still checks
 * it says the claim). Entries that fail are printed and left out; the rest ship.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const IN_DIR = join(REPO, "content", "glossary");
const OUT = join(REPO, "lib", "glossary-generated.json");
const DRY = process.argv.includes("--dry");

const LINK_OK = /^\/(guide\/[1-9]|father\/[a-z0-9-]+|articles\/[a-z_]+\/[a-z0-9-]+|tools\/[a-z0-9-]+)$/;
const bi = (v) => v && typeof v.ar === "string" && typeof v.en === "string";
const full = (v) => bi(v) && v.ar.trim() && v.en.trim();

function parse(file) {
  const raw = readFileSync(file, "utf8");
  return JSON.parse(raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1)).entries ?? [];
}

async function urlOk(url) {
  try {
    const res = await fetch(url, { redirect: "follow", headers: { "User-Agent": "Mozilla/5.0 NawahSourceCheck" } });
    return res.status < 400 ? null : `dead source ${res.status}`;
  } catch (e) {
    return `source unreachable (${e.name})`;
  }
}

async function check(e) {
  const E = [];
  if (!/^[a-z0-9]+(-[a-z0-9]+){0,5}$/.test(e.slug ?? "")) E.push(`slug "${e.slug}" not kebab-case`);
  for (const f of ["term", "definition"]) if (!full(e[f])) E.push(`missing ${f}`);
  for (const f of ["aka", "when"]) if (!bi(e[f])) E.push(`${f} must be {ar, en} (empty strings allowed)`);
  if (!Array.isArray(e.body) || !e.body.length || !e.body.every(full)) E.push("body must be a non-empty list of {ar, en}");
  if (e.link && !LINK_OK.test(e.link)) E.push(`link "${e.link}" is not a site path`);
  if (!Array.isArray(e.citations) || !e.citations.length) E.push("no citation (medical — one real source required)");
  for (const c of e.citations ?? []) {
    const bad = await urlOk(c.url);
    if (bad) E.push(`${bad}: ${c.url}`);
  }
  return E;
}

const files = existsSync(IN_DIR) ? readdirSync(IN_DIR).filter((f) => f.endsWith(".json")) : [];
const entries = files.flatMap((f) => parse(join(IN_DIR, f)));
const seen = new Set();
const ok = [];
for (const e of entries) {
  const E = await check(e);
  if (seen.has(e.slug)) E.push("duplicate slug");
  seen.add(e.slug);
  console.log(`${E.length ? "✗" : "✓"} ${e.slug} — ${e.term?.ar ?? "?"}`);
  for (const m of E) console.log(`    ERROR  ${m}`);
  if (!E.length) ok.push(e);
}
if (!DRY) writeFileSync(OUT, JSON.stringify(ok, null, 2) + "\n");
console.log(`\n${ok.length}/${entries.length} entries ${DRY ? "pass (dry run, nothing written)" : "written to lib/glossary-generated.json"}`);
