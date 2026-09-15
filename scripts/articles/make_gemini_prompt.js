/**
 * make_gemini_prompt.js — assemble a paste-ready Gemini prompt for one website-article cluster.
 *
 *   node scripts/articles/make_gemini_prompt.js topics <cluster> [--count=8]
 *   node scripts/articles/make_gemini_prompt.js article <cluster> "<topic>" [--split=<label>]
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

const ROOT = path.join(__dirname, '..', '..'); // nawah-landing/
const OUT_DIR = path.join(ROOT, 'content/prompts');

// ------------------------------------------------------------------ injected blocks

function blockMsaVoice() {
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
- No dialect words at all — the app carries the dialect, this page does not.`;
}

function blockArticleStructure() {
  return `## Structure — fixed order, per \`docs/ARTICLE_PATTERN.md\` §3

1. Eyebrow (names the cluster/topic)
2. \`title\` (h1) — written for a person, repeats the search term per the heading rule above
3. \`standfirst\` — one promise, no "in this article we will..."
4. \`sections[]\` — 3 to 5. Each ends with its own \`sources\` if it made a factual claim
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

- **Cap: 2 citations for the whole article.** Pick the 2 sources that cover the core claims
  (typically: the reasons/how-it-works source, and the risks/red-flags source) and write
  everything else from established medical consensus without chasing a URL per sentence. Still
  never invent a specific number, threshold, or study finding to fit this cap — soften an
  unsourceable figure to the general shape of the fact instead of adding a 3rd citation.
- **Preferred, fetch cleanly: MedlinePlus, NHS, WHO ELENA.** Use these by default.
- **🔴 ACOG returns HTTP 402 and CDC returns 403 to every automated fetch.** If a claim can only
  be sourced there, either find the same fact at MedlinePlus/NHS/WHO instead, or state plainly
  that the claim was dropped for lack of a verifiable source. Do not cite ACOG/CDC as if fetched.
- A peer-reviewed literature review (PubMed/PMC/NCBI) is acceptable ONLY where no MedlinePlus/
  NHS/WHO page covers the specific claim — state in the citation that it is a research paper, not
  a health-body page.
- General consumer health/parenting sites (WebTeb, SuperMama, Tommy's, BabyCenter, hospital
  marketing blogs, etc.) are NEVER an acceptable citation, however accurate they look.
- Every medical claim needs a real URL you actually consulted, listed in the \`sources\` field,
  with what it actually says matching the claim. The URL will be opened and checked — a dead
  link, a redirect to unrelated content, or a page that doesn't say what is claimed fails the
  whole article. A plausible-looking URL that was never opened is a fabrication, not a citation.
- 🔴 If you cannot source a claim, DROP THE CLAIM. Do not soften it, do not hedge it, do not
  attribute it vaguely to "studies" or "doctors". "I don't know" is a correct answer here.
- The source decides the FACT. The user decides the WORD — never ship a literal translation of
  an English medical term because a source used it.`;
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

# OUTPUT FORMAT — a JSON array, nothing else

\`\`\`json
[
  {
    "title": "the exact article <h1>, as a noun phrase repeating the search term — MSA",
    "cluster": "${c.name}",
    ${c.shape === 'split' ? '"split_label": "which of the cluster\'s labels this topic is for",\n    ' : ''}"tier": 1,
    "search_term": "the term a reader would actually type — what this title must contain verbatim",
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
Standard Arabic. This is NOT social-video content — no dialect, no spoken-line formatting.

# THE TASK

Write one complete article for the cluster **${c.name}** on this topic:

> **${topic}**
${opts.splitLabel ? `\nSplit label: **${opts.splitLabel}**` : ''}

This cluster's job: **${c.job}**
${c.note ? `Cluster rules: ${c.note}` : ''}

${c.topicGate}

${blockMsaVoice()}

${blockArticleStructure()}

${blockByline()}

${c.medical ? blockSources() + '\n' : ''}${blockArticleCta(c)}

# OUTPUT FORMAT — one JSON code block, nothing else

\`\`\`json
{
  "cluster": "${c.name}",
  "topic": "${topic}",
  "title": "...",
  "standfirst": "...",
  "eyebrow": "...",
  "sections": [
    { "heading": "a noun phrase repeating the search term", "body": "...", "sources": ["https://... omit field if no factual claim in this section"] }
  ],
  "redFlags": ${c.medical ? '["omit the whole field if this topic genuinely has none — do not fabricate one"]' : 'null'},
  "cta": { "feature": "${c.ctaFeature}", "text": "the one ask, naming the feature" },
  "faqs": [ { "q": "...", "a": "..." } ],
  "citations": [ { "url": "https://...", "source": "MedlinePlus | NHS | WHO", "retrieved": "YYYY-MM-DD" } ]
}
\`\`\`

Before the JSON, write at most TWO lines: anything you could not source and therefore dropped,
and (if the cluster note asks for a judgment call, e.g. gender_prediction's myth framing) how you
applied it. After the JSON, write nothing.

...   ← if the user added any extra constraint for this run, it is here`;
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

  clusters: ${CLUSTER_TAGS.join(' · ')}
`);
  process.exit(mode ? 1 : 0);
}

const c = resolveCluster(tag);
if (!c) { console.error(`❌ unknown cluster "${tag}". Known: ${CLUSTER_TAGS.join(', ')}`); process.exit(1); }

let text, outName;
if (mode === 'topics') {
  text = promptTopics(c, parseInt(flag('count', '8'), 10));
  outName = `topics_${c.tag}.txt`;
} else if (mode === 'article') {
  if (!topicArg || topicArg.startsWith('--')) { console.error('❌ need a topic: ... <cluster> "<topic>"'); process.exit(1); }
  text = promptArticle(c, topicArg, { splitLabel: flag('split') });
  outName = `article_${c.tag}_${slug(topicArg)}.txt`;
} else {
  console.error(`❌ unknown mode "${mode}"`); process.exit(1);
}

fs.mkdirSync(OUT_DIR, { recursive: true });
const out = path.join(OUT_DIR, outName);
fs.writeFileSync(out, text + '\n', 'utf8');

console.log(`\n✓ ${path.relative(ROOT, out)}`);
console.log(`  ${text.split('\n').length} lines · ${(text.length / 1000).toFixed(1)}k chars`);
console.log(`\n  Paste the whole file into Gemini. Then:`);
console.log(mode === 'topics'
  ? `    pick a topic from the JSON, then run:\n      node scripts/articles/make_gemini_prompt.js article <cluster> "<chosen topic>"\n`
  : `    save its JSON to content/articles/<cluster>_<slug>.json, then hand it to Claude to render\n`);
