# GSC export — 2026-09-15

Source: 4 ZIPs downloaded from Search Console (Egypt-only, Saudi-only, Syria-only, unfiltered),
`Last 3 months` date filter — GSC has only been live since 2026-08-21, so this is really ~4 weeks
of data, not 3 months. That's expected, not an error in the export.

## Raw numbers

- **11 distinct queries total**, all with 1 impression and 0 clicks. Egypt/Saudi/Syria-filtered
  Queries.csv came back empty each — the underlying per-country query breakdown, one export per
  filter, of 0 rows each — the country-level counts (below) come from Countries.csv instead.
- **Impressions by country** (unfiltered export): United States 19, Syria 3, United Kingdom 3,
  Netherlands 2, Canada 2, Germany 2, Algeria 2, **Egypt 2**, Iraq 1, Denmark 1, Tanzania 1,
  Italy 1, South Korea 1, **Saudi Arabia 1**, Ukraine 1, Vietnam 1, Australia 1.
- **Top pages by impression**: `/en/father/labour-signs` (8), `/en/about` (6), `/` (4),
  `/en/father/hospital-bag` (4), `/ar/guide/1` (3), `/ar/guide` (3) — all pre-existing pages, none
  of this session's new tools/names/due pages (they went live hours ago, not crawled yet).

## What this means

1. **Not a targeting bug.** hreflang + x-default are already correctly set to Arabic
   (`lib/constants.ts`). This is just very-early indexing: 4 weeks old, positions 8–100 (mostly
   70–100, i.e. page 7+), zero clicks — completely normal at this stage of a new site, regardless
   of language.
2. **The real target markets (Egypt/Saudi/Syria) barely register yet** — 6 impressions combined,
   vs. 34 from non-target English-speaking countries hitting the `/en/*` pages. Re-export in
   4–6 weeks once the 629 new pages (this session) get crawled; this snapshot is a baseline, not
   a verdict.
3. **Every query already matches an existing page** — none of the 11 reveal a genuine content
   gap. The 5 near-duplicate "when to go to hospital in labour" phrasings all map to
   `/father/labour-signs` (which already covers this) and to the new `/tools/contraction-timer`.
   The 2 "how many months is week X" queries map directly to the new `/tools/weeks-months`
   converter. This is a sign the site's existing topic coverage is reasonable — the problem is
   ranking position, not missing content, at least among what these 11 rows can show.

## `queries-2026-09-15.csv`

Combines all 4 exports' Queries.csv, deduped, plus a `query_ar_localized` column — 6 of the 11
rows were in English, translated to natural Arabic phrasing reusing this site's own existing
terminology (`المخاض` not `الطلق`, `حقيبة المستشفى` not `شنطة المستشفى` — pulled from
`lib/father-content.ts`'s own titles, not invented). Already-Arabic rows pass through unchanged.

⚠️ **11 rows is too thin to drive P4's topic generation on its own.** Use it as a sanity check
against whatever P4's Gemini-generated topics turn out to be, not as the primary input yet —
re-export once traffic to the new pages accumulates.
