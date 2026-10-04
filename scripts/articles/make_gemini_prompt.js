/**
 * make_gemini_prompt.js — assemble a paste-ready Gemini prompt for one website-article cluster.
 *
 *   node scripts/articles/make_gemini_prompt.js topics <cluster> [--count=8]
 *   node scripts/articles/make_gemini_prompt.js article <cluster> "<topic>" [--split=<label>]
  node scripts/articles/make_gemini_prompt.js batch <cluster>          (after topics → content/topics/<cluster>.json)
 *
 * Output: content/prompts/<mode>_<slug>.txt — paste that file into Gemini.
 *
 * Lives entirely inside nawah-landing, standalone — no dependency on `Social Media/Tiktok/
 * pipeline` (different repo, different register: MSA here, Egyptian dialect there). See
 * `clusters.js` for why the two pipelines are shaped alike but never share code.
 *
 * Same loop as the reel pipeline: this script builds the prompt locally with the site's own
 * rules injected verbatim (`docs/ARTICLE_PATTERN.md`), the user pastes it into Gemini, the JSON
 * comes back, Claude validates and renders it. Claude never writes the article body.
 */
const fs = require('fs');
const path = require('path');
const { CLUSTERS, CLUSTER_TAGS, resolveCluster } = require('./clusters');
const { suggest } = require('./suggest');

const ROOT = path.join(__dirname, '..', '..'); // nawah-landing/
const OUT_DIR = path.join(ROOT, 'content/prompts');

// ------------------------------------------------------------------ injected blocks

function blockMsaVoice(c) {
  return `## اللغة والنبرة — Modern Standard Arabic, SuperMama's register

Researched against the two sites that own these queries (\`docs/ARTICLE_PATTERN.md\` §2a).
WebTeb is MSA but clinical and impersonal — third person, 15–20+ word sentences. SuperMama is
ALSO entirely MSA and still reads warm, because in Arabic warmth comes from WHO you address, not
from dialect vocabulary. Match SuperMama, not WebTeb.

| Do | Not |
|---|---|
| \`يُحسب عمر حملكِ\` | \`يُحسب عمر الحمل\` |
| \`قد يقول لكِ الطبيب\` | \`تُخبَر المرأة\` |
| \`ما قد تلاحظينه\` | \`ما تلاحظه المرأة\` |
| Open by addressing her directly | Open with an abstraction |
| Symptoms/steps as a bulleted list | Buried in a paragraph |
| Sentences of 8–15 words | Sentences of 25+ words |

- Second-person feminine (ـكِ) throughout the body — this is an MSA suffix, not dialect.
- **Headings are noun phrases that repeat the actual search term**, never a question, never a
  literary sentence. \`أعراض الحمل في الشهر الأول\`, not \`لماذا يبدأ العدّ قبل حدوث الحمل\`. A
  reader scanning for a term must find it verbatim in a heading.
- Arabic-Indic digits in prose (١٢ not 12).
- No dialect words at all — the app carries the dialect, this page does not.${c && c.voice === 'father'
  ? `\n- 🔴 **This is a FATHER article: second-person MASCULINE (ـكَ) throughout, spoken TO him.** He is
  always learning, never failing — no jokes at his expense.`
  : ''}`;
}

function blockArticleStructure() {
  return `## Structure — fixed order, per \`docs/ARTICLE_PATTERN.md\` §3

1. Eyebrow (names the cluster/topic)
2. \`title\` (h1) — written for a person, repeats the search term per the heading rule above
3. \`standfirst\` — one promise, no "in this article we will..."
4. \`sections[]\` — 5 to 8 H2 sections (see SEO block for length). A section cites only if it
   makes a factual claim. Use \`bullets\` for lists/steps and \`table\` for any comparison
5. \`redFlags\` — **before the CTA**, if this topic has any (required whenever medical: true and a
   symptom/timing dimension exists; omit the field entirely, don't fake one, if it genuinely
   doesn't apply)
6. \`cta\` — see the CTA section below
7. \`faqs\` — real questions a reader would actually ask, plain text (no FAQPage schema — Google
   deprecated the FAQ rich result 2026-05-08)
8. \`citations\` — full URL list

Prose rules (\`docs/ARTICLE_PATTERN.md\` §9, also the \`humanizer\` skill): no em dash as a rhythm
device, no "not only X but also Y", no forced groups of three, no \`stands as/serves as/boasts/
plays a vital role\`, no trailing "-ing" clauses bolted on, no vague "experts say" — name the body
or cut the claim, sentence case in headings, no curly quotes, no emoji in body prose.`;
}

function blockByline() {
  return `## Byline honesty — non-negotiable

**There is no clinician on this project.** Never write "Reviewed by Dr. X" or imply clinical
review — that is a fabricated credential on YMYL health content, the single worst thing this
site could ship. If the article needs a byline line, it credits the Nawah team and states plainly
that no clinician wrote or reviewed the page. This rule has no exception for traffic value.`;
}

function blockSources() {
  return `## Medical claims — sourced or cut

Per \`docs/ARTICLE_PATTERN.md\` §5 — this is the site's article rule, NOT the reel pipeline's
source list, and the two must not be conflated:

- **Don't hunt for sources (user decision 2026-10-05).** ONE main source for the whole article is
  enough (decision 2026-10-04). Pick one page that covers the core medical claims and write the
  rest from established medical consensus. (Price/admin articles are the exception: see the Deep
  Research block.)
- **Only MEDICAL information needs verifying, and ANY real source you opened will do** — a health
  body (MedlinePlus, NHS, WHO), a hospital page, a medical site, a paper. Non-medical content
  (customs, practical tips, the father's role, app features) needs no citation.
- Never invent a specific number, threshold, or study finding — if a figure isn't on a page you
  opened, soften it to the general shape of the fact.
- **🔴 ACOG returns HTTP 402 and CDC returns 403 to automated fetches**, so the publish script
  rejects them. Cite another page that says the same thing.
- Every URL you list must be real, opened by you, and actually say the claim it backs — the
  script opens each one. A plausible-looking URL that was never opened is a fabrication.
- 🔴 If you cannot verify a medical claim anywhere, DROP IT. Don't attribute it vaguely to
  "studies" or "doctors".
- The source decides the FACT. The user decides the WORD — never ship a literal translation of
  an English medical term because a source used it.`;
}

function blockSeo(topic, searches, live) {
  const list = searches.length
    ? searches.slice(0, 40).map(x => `- ${x.q}  (${x.markets.join('+')})`).join('\n')
    : '- (autocomplete returned nothing — pick the phrasing WebTeb/SuperMama use in their titles)';
  return `## SEO — this article must rank on Google AND get quoted by AI answers

**Real Google searches for this topic** (Google autocomplete, Egypt \`eg\` and Saudi \`sa\`, pulled
${new Date().toISOString().slice(0, 10)} — what people actually type; \`eg+sa\` = searched in both):

${list}

Rules — each is checked by a script before publishing; a failed check sends the article back:

1. **Primary keyword** = the strongest search above that matches "${topic}". Put it in
   \`primaryKeyword\`. It must appear: at the START of \`title.ar\`, in \`metaTitle.ar\`, in
   \`description.ar\`, in the first sentence of the first section, and in at least 2 H2 headings.
2. **Secondary keywords**: 6–12 other searches from the list, in \`keywords\`. Each becomes an H2
   heading or a FAQ question, worded as people type it. No stuffing — each used once or twice.
3. **\`metaTitle.ar\` ≤ 60 characters**, keyword first, ends with " | نواة". \`metaTitle.en\` ≤ 60.
4. **\`description.ar\` 120–155 characters**, contains the primary keyword, promises the answer.
5. **Answer first (AI-quotable):** the first paragraph of section 1 answers the search directly in
   2–3 sentences that make sense quoted alone. No preamble.
6. **Length: 1,200–1,800 Arabic words** across sections. Short paragraphs (2–4 sentences).
7. **Every H2 section stands alone** — readable if an AI lifts only that section.
8. **Structure AI engines extract:** bulleted steps for any "how", a \`table\` for any comparison
   or price list, a one-sentence plain definition for any medical term.
9. **FAQs: 6–8**, questions copied from the search list above where possible, answers 2–4 sentences.
10. **\`slug\`**: short English kebab-case of the keyword (e.g. \`iron-during-pregnancy\`), ≤ 5 words.
11. **\`imageQuery\`**: an English Pexels search for a calm editorial hero photo — objects or hands,
    no identifiable faces, no bare belly, no Latin text/signage in shot.
12. **Internal links:** pick 2–4 pages from the live list below that a reader of THIS article would
    open next; put their paths in \`related\`.
13. **Name the source inside the sentence** for every key medical fact: \`وفقاً لهيئة الخدمات
    الصحية البريطانية (NHS)، …\` — not only in the citation list. AI answer engines quote sentences
    that carry their own attribution (GEO audit of this site, 2026-10-05: 0 inline attributions).
14. **Concrete numbers, only from the source:** where the main source gives a figure (weeks, days,
    ml, %), state it with its unit and attribution. Never round, estimate or invent one; no figure in
    the source = no figure in the article.
15. **Each H2 opens with one plain fact sentence** that answers that heading on its own — the
    sentence an AI would lift. Context and reassurance come after it, never before.

**Live pages on nawahapp.net** (for \`related\` — and do not duplicate their topic):
${live.map(x => `- ${x}`).join('\n')}`;
}

function blockDeepResearch(c) {
  if (!c.deepResearch) return '';
  return `## 🔎 Use Gemini DEEP RESEARCH for this one

Turn on Deep Research before sending. Every concrete figure, office, document or deadline must
come from a page you actually opened, dated 2025 or 2026, and its URL goes in \`citations\` and in
that section's \`cites\`. Here MORE than one citation is allowed — one per distinct source used.
Put prices/steps in a \`table\` where possible, with the source and month/year per row. Anything
you cannot source is left out, never estimated. Write "تحقّق من [الجهة] قبل التنفيذ" where rules
change often.
`;
}

function blockArticleCta(c) {
  return `## The CTA — one real feature, never a generic ask

Per \`docs/ARTICLE_PATTERN.md\` §4: "People install because the content was useful, not because
you asked them to." A generic "download our app" block is the named failure mode.

This cluster's CTA anchor: **${c.ctaFeature}**

- Name the actual Nawah feature and why it answers what THIS article just explained — not a
  generic pitch.
- Do not write a Play Store URL yourself. State which feature the CTA should point to; the human
  wires the real link through \`articlesPlayUrl()\` in \`lib/constants.ts\` — never a hand-written
  link in the article body.
- One ask only, placed after \`redFlags\`, never before it.`;
}

function blockClusterUsedTopics(c) {
  return `## Already covered — do not propose a duplicate

Check the cluster's own note above for what already exists (e.g. \`father_expansion\` must not
repeat an angle already live in \`lib/father-content.ts\`; \`glossary\` must not repeat a term
already explained inline in a shipped article). There is no automated topic bank for articles yet
— this check is manual, so be conservative and flag anything you're unsure is new.`;
}

// ------------------------------------------------------------------ modes

function promptTopics(c, count) {
  const shapeLine = c.shape === 'split'
    ? `This cluster is SPLIT: propose ${c.splitLabels.length} topics, one per label — ${c.splitLabels.join(' and ')} — never a merged topic covering both.`
    : c.shape === 'hub'
      ? `This cluster is a HUB (open-ended list of short entries under one page). Propose ${count} entries, not ${count} separate articles.`
      : `This cluster produces exactly ONE article. Propose ${count} candidate angles/titles for that one article; the human picks one.`;

  return `You are an Arabic pregnancy-content strategist for **نواة (Nawah)**, an Arabic
pregnancy-tracking app used in Egypt and the Gulf, writing for the **website**, not social video.
You are proposing TOPICS/TITLES ONLY — no article bodies yet.

# THE TASK

Cluster: **${c.name}** (\`${c.tag}\`)
Job: **${c.job}**
${shapeLine}
${c.note ? `\nCluster rules: ${c.note}` : ''}

${c.topicGate}

${c.medical ? blockSources() + '\n' : ''}${blockClusterUsedTopics(c)}

**Live pages on nawahapp.net right now:**
${livePages().map(x => `- ${x}`).join('\n')}

# OUTPUT FORMAT — a JSON array, nothing else

\`\`\`json
[
  {
    "title": "the exact article <h1>, as a noun phrase repeating the search term — MSA",
    "cluster": "${c.name}",
    ${c.shape === 'split' ? '"split_label": "which of the cluster\'s labels this topic is for",\n    ' : ''}"tier": 1,
    "search_term": "the SHORT phrase a reader actually types into Google (2–4 words) — it is checked against real Google autocomplete and topics nobody searches are dropped",
    "why": "one line: what makes this cluster's own gate true for this topic"
  }
]
\`\`\`

Rules:
- Titles are noun phrases that repeat the search term, never questions (unless the cluster's own
  gate explicitly requires a question form — food_safety does, via Gate A's \`آمن للحامل؟\`).
- No duplicates of anything already covered (see the "already covered" note above).
- ...   ← if the user added any extra constraint for this run, it is here`;
}

function promptArticle(c, topic, opts) {
  return `You are an Arabic pregnancy-content writer for **نواة (Nawah)**, an Arabic
pregnancy-tracking app used in Egypt and the Gulf, writing one **website article** in Modern
Standard Arabic, plus its English version. This is NOT social-video content — no dialect.

# THE TASK

Write one complete article for the cluster **${c.name}** on this topic:

> **${topic}**
${opts.splitLabel ? `\nSplit label: **${opts.splitLabel}**` : ''}

This cluster's job: **${c.job}**
${c.note ? `Cluster rules: ${c.note}` : ''}

${c.topicGate}

${blockDeepResearch(c)}
${blockSeo(topic, opts.searches, opts.live)}

${blockMsaVoice(c)}

${blockArticleStructure()}

${blockByline()}

${c.medical ? blockSources() + '\n' : ''}${blockArticleCta(c)}

# OUTPUT FORMAT — one JSON code block, nothing else

Every text field is \`{ "ar": "...", "en": "..." }\`. English is a faithful, natural translation of
the Arabic (not a different article). Section/FAQ/redFlags \`cites\` hold citation ids.

\`\`\`json
{
  "cluster": "${c.tag}",
  "slug": "english-kebab-slug",
  "primaryKeyword": "the Arabic primary keyword, verbatim from the search list",
  "keywords": ["secondary search 1", "secondary search 2"],
  "imageQuery": "english pexels query",
  "related": ["/ar/guide/3", "/ar/articles/fasting/fasting-during-pregnancy"],
  "eyebrow": { "ar": "...", "en": "..." },
  "title": { "ar": "...", "en": "..." },
  "metaTitle": { "ar": "... | نواة", "en": "... | Nawah" },
  "description": { "ar": "120–155 chars", "en": "..." },
  "standfirst": { "ar": "...", "en": "..." },
  "sections": [
    {
      "heading": { "ar": "noun phrase with a search term", "en": "..." },
      "body": [ { "ar": "paragraph", "en": "..." } ],
      "bullets": [ { "ar": "...", "en": "..." } ],
      "table": { "head": [ { "ar": "...", "en": "..." } ], "rows": [ [ { "ar": "...", "en": "..." } ] ] },
      "cites": ["src1"]
    }
  ],
  "redFlags": ${c.medical ? '{ "intro": { "ar": "...", "en": "..." }, "items": [ { "ar": "...", "en": "..." } ], "cites": ["src1"] }' : 'null'},
  "cta": { "headline": { "ar": "...", "en": "..." }, "body": { "ar": "names the ONE feature", "en": "..." }, "button": { "ar": "${c.voice === 'father' ? 'حمّل نواة' : 'حمّلي نواة'}", "en": "Get Nawah" } },
  "faqs": [ { "q": { "ar": "...", "en": "..." }, "a": { "ar": "...", "en": "..." } } ],
  "citations": [ { "id": "src1", "org": "NHS", "title": { "ar": "...", "en": "..." }, "url": "https://...", "retrieved": "YYYY-MM-DD" } ]
}
\`\`\`

Omit \`bullets\`/\`table\`/\`cites\` on a section that has none.${c.medical ? ' Omit \`redFlags\` only if the topic genuinely has none.' : ''}
Before the JSON, write at most TWO lines: anything you could not source and dropped. After the
JSON, write nothing.`;
}

/** Every live page path, so Gemini links to real pages and never duplicates one. Read from the
 *  content files — a hand-kept list would go stale the first time an article ships. */
function livePages() {
  const read = f => { try { return fs.readFileSync(path.join(ROOT, f), 'utf8'); } catch { return ''; } };
  const out = ['/ar/guide (months 1–9: /ar/guide/1 … /ar/guide/9)', '/ar/tools', '/ar/names', '/ar/father'];
  for (const m of read('lib/father-content.ts').matchAll(/^\s{2}slug: "([^"]+)"/gm)) out.push(`/ar/father/${m[1]}`);
  for (const m of read('lib/articles-content.ts').matchAll(/cluster: "([^"]+)",\s*\n\s*slug: "([^"]+)"/g)) out.push(`/ar/articles/${m[1]}/${m[2]}`);
  try {
    for (const a of JSON.parse(read('lib/articles-generated.json') || '[]')) out.push(`/ar/articles/${a.cluster}/${a.slug}`);
  } catch { /* first run — file not there yet */ }
  return out;
}

// ------------------------------------------------------------------ dispatch

function slug(s) {
  return String(s).replace(/[^\w؀-ۿ]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
}

const [, , mode, tag, topicArg] = process.argv;
const flags = process.argv.slice(2).filter(a => a.startsWith('--'));
const flag = (name, dflt) => {
  const f = flags.find(x => x.startsWith(`--${name}=`));
  return f ? f.split('=')[1] : dflt;
};

if (!mode || !tag) {
  console.log(`
  node scripts/articles/make_gemini_prompt.js topics <cluster> [--count=8]
  node scripts/articles/make_gemini_prompt.js article <cluster> "<topic>" [--split=<label>]
  node scripts/articles/make_gemini_prompt.js batch <cluster>          (after topics → content/topics/<cluster>.json)

  clusters: ${CLUSTER_TAGS.join(' · ')}
`);
  process.exit(mode ? 1 : 0);
}

const c = resolveCluster(tag);
if (!c) { console.error(`❌ unknown cluster "${tag}". Known: ${CLUSTER_TAGS.join(', ')}`); process.exit(1); }

function write(outName, text) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const out = path.join(OUT_DIR, outName);
  fs.writeFileSync(out, text + '\n', 'utf8');
  console.log(`✓ ${path.relative(ROOT, out)}  (${(text.length / 1000).toFixed(1)}k chars)`);
}

(async () => {
  if (mode === 'topics') {
    write(`topics_${c.tag}.txt`, promptTopics(c, parseInt(flag('count', '8'), 10)));
    console.log(`\n  Paste into Gemini → save its JSON array as content/topics/${c.tag}.json → then:\n` +
      `    node scripts/articles/make_gemini_prompt.js batch ${c.tag}\n`);
  } else if (mode === 'article') {
    if (!topicArg || topicArg.startsWith('--')) { console.error('❌ need a topic: ... <cluster> "<topic>"'); process.exit(1); }
    const searches = await suggest(flag('seed') || topicArg);
    write(`article_${c.tag}_${slug(topicArg)}.txt`,
      promptArticle(c, topicArg, { splitLabel: flag('split'), searches, live: livePages() }));
    console.log(`  ${searches.length} real Google searches injected.\n`);
  } else if (mode === 'batch') {
    // Gemini's topic list → one article prompt per topic that real people actually search.
    const raw = fs.readFileSync(path.join(ROOT, 'content/topics', `${c.tag}.json`), 'utf8');
    const topics = JSON.parse(raw.slice(raw.indexOf('['), raw.lastIndexOf(']') + 1));
    let kept = 0;
    for (const t of topics) {
      const seed = t.search_term || t.title;
      const searches = await suggest(seed);
      if (!searches.length) { console.log(`✗ dropped (no Google searches): ${seed}`); continue; }
      write(`article_${c.tag}_${slug(t.title)}.txt`,
        promptArticle(c, t.title, { splitLabel: t.split_label, searches, live: livePages() }));
      kept++;
    }
    console.log(`\n  ${kept}/${topics.length} topics have real search demand → prompts written.\n`);
  } else {
    console.error(`❌ unknown mode "${mode}"`); process.exit(1);
  }
})();
