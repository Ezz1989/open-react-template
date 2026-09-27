# Archive — landing CLAUDE.md blocks trimmed 2026-09-28

DONE or superseded. Open items moved to `../Social Media/CLAUDE.md` (NAWAHSOCIAL).

## 🚀 RESUME HERE — trigger `NAWAHWEB` (2026-09-15 traffic session)

Full plan/status/gates: `C:\Users\EZZ\.claude\plans\recursive-marinating-puddle.md` — read it
first, it has the detailed per-phase build notes this block only summarizes.

**Shipped and live on nawahapp.net this session** (36 → 629 sitemap URLs, 641 built pages):
PostHog web analytics (same EU project as the Flutter app) · 6 pregnancy calculators at
`/[lang]/tools` (`lib/tools-content.ts`) · baby-names hub at `/[lang]/names` reading live from
Supabase (`lib/names-data.ts`, 250 names) · birth-month cohort timelines at `/[lang]/due`
(`lib/due-content.ts`, 24-month rolling window) · homepage nav fix — Tools/Names/Due were built
but unreachable from the front door until `components/Navbar.tsx` + `lib/content.ts` got the 3
missing entries · a "what's common" vs "call now" panel (`components/PanicNormalPanel.tsx`) on
every guide month and father article that has `redFlags`, built entirely from data already in
`lib/guide-content.ts`/`lib/father-content.ts` (zero new content authored) · GSC's first real
export processed (`docs/gsc/`, 11 queries, too thin to be conclusive yet — re-export in 4–6 weeks).

Also done, outside this repo: the social-pipeline CTA signature (`Social Media/Tiktok/pipeline/
make_gemini_prompt.js`'s `blockCta()`) now names `nawahapp.net` instead of the generic
"اللينك في البايو" — `pregnancy_companion` commit `a97b1c1`.

**Two resolved gates, in case a stale question about them resurfaces:**
- Food-safety article phrasing: `آمن للحامل؟` ("is it SAFE"), never `هل يجوز` (fiqh/permissibility
  framing) — user's choice among 4 options, 2026-09-15.
- Social CTA signature: bare domain `nawahapp.net`, not a phrase — user's choice, same day.

**Not started yet — the actual next work:**
1. **P4, the Gemini article pipeline.** Was mid-build (reading `docs/ARTICLE_PATTERN.md`'s §2a
   tone rule) when this session ended — nothing written to disk yet, clean starting point. Needs:
   `Social Media/Tiktok/pipeline/clusters.js` (mirrors `pillars.js`'s shape) + two new
   `make_gemini_prompt.js` modes (`article-topics`, `article`). ⚠️ **Do NOT reuse `blockDialect()`**
   for these — that's Egyptian TikTok/reel dialect. Website articles are MSA with SuperMama's
   warm second-person-feminine register (`ARTICLE_PATTERN.md` §2a) — a different voice block
   entirely, not yet written.
   **11 confirmed clusters to seed it with** (5 from the original plan, 6 from a 2026-09-15
   market-research pass, cross-checked against actual content — zero hits confirmed for each):
   glossary/ويكي · postpartum/الأربعين · تكلفة الولادة (EG+GCC split) · food-safety (`آمن للحامل؟`,
   Gate A resolved) · father-series expansion · **صيام الحامل** (Ramadan fasting — zero femtech
   competitor owns this SERP) · **قيصري أم طبيعي** (C-section vs natural) · **العلاقة الحميمة
   أثناء الحمل** (intimacy — genuinely fits father mode, the culturally-sensitive "anonymous
   search" pattern) · **العقيقة والتحنيك** (Aqiqah/Tahneeq) · **تسجيل المولود والتأمين** (newborn
   admin, EG vs GCC split like the birth-cost cluster) · **تحديد جنس الجنين** (gender-prediction
   methods — ⚠️ must gate as myth-debunking, per this site's own no-fabricated-credentials
   discipline; folk methods are not medically reliable and must never be presented as if they are).
2. **P4.5, cheap UX add already scoped but not built:** the market-research pass also suggested
   a red-flags section restyle, which became the Panic/Normal panel above instead (shipped). Two
   suggestions explicitly **declined by the user, do not build them**: an "Ask a doctor" portal
   (staffing/liability commitment, not a content task) and a WhatsApp broadcast funnel (marketing
   infra, not site scope). A third — "reviewed by local OB-GYNs" — is explicitly ruled out by this
   file's own `BYLINE` precedent in `lib/guide-content.ts`: no clinician on the project, fabricating
   one is a real Play-policy risk.
3. **GSC re-export** in 4–6 weeks once the 629 new pages get crawled — the 2026-09-15 export
   (`docs/gsc/`) is a baseline, not a verdict; 11 queries is too thin to drive P4's topics alone.

## Active port (2026-04-18)

Porting the design prototype at `c:\Users\EZZ\Downloads\nawah\` 1:1. Approved plan at `C:\Users\EZZ\.claude\plans\prototype-override-all-yes-flickering-emerson.md`. Follow the plan task-by-task. Work happens on branch `prototype-port`.

