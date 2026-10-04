/**
 * suggest.js — real Google searches for a seed phrase, from Google's own autocomplete.
 *
 *   node scripts/articles/suggest.js "صيام الحامل"
 *
 * Why: Gemini cannot see search volume and will happily title an article with a phrase nobody
 * types. Autocomplete only shows queries people actually search, so it is the cheapest honest
 * demand signal available (no paid keyword tool on this project). Queried for Egypt and Saudi
 * Arabia, the two markets the site serves, plus a few question/modifier prefixes so the list
 * catches the long-tail phrasings that become H2s and FAQs.
 *
 * Used by make_gemini_prompt.js (article mode injects the list) and by the topic check.
 */
const MARKETS = ['eg', 'sa'];
const MODIFIERS = ['', ' هل', ' في', ' متى', ' ما', ' أسباب', ' علاج'];

async function one(q, gl) {
  const url = 'https://suggestqueries.google.com/complete/search?client=firefox&hl=ar'
    + `&gl=${gl}&q=${encodeURIComponent(q)}`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    const data = JSON.parse(await res.text());
    return Array.isArray(data[1]) ? data[1] : [];
  } catch {
    return []; // offline or rate-limited — the prompt still builds, just without the list
  }
}

/** Returns [{ q, markets: ['eg','sa'] }], most-shared first (shown in both markets = stronger). */
async function suggest(seed) {
  const seen = new Map();
  for (const gl of MARKETS) {
    for (const mod of MODIFIERS) {
      for (const q of await one(seed + mod, gl)) {
        const k = q.trim();
        if (!seen.has(k)) seen.set(k, new Set());
        seen.get(k).add(gl);
      }
    }
  }
  return [...seen.entries()]
    .map(([q, m]) => ({ q, markets: [...m] }))
    .sort((a, b) => b.markets.length - a.markets.length);
}

module.exports = { suggest };

if (require.main === module) {
  const seed = process.argv.slice(2).join(' ').trim();
  if (!seed) { console.log('node scripts/articles/suggest.js "<seed phrase>"'); process.exit(0); }
  suggest(seed).then(list => {
    if (!list.length) { console.log('(no suggestions — phrase has little or no search demand, or offline)'); return; }
    for (const s of list) console.log(`${s.markets.join('+').padEnd(5)}  ${s.q}`);
    console.log(`\n${list.length} real searches`);
  });
}
