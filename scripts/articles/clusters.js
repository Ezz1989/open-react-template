/**
 * clusters.js — the 11 website-article clusters, in one place, as data.
 *
 * Written 2026-09-15, per the P4 plan (`C:\Users\EZZ\.claude\plans\recursive-marinating-puddle.md`
 * §"P4 · Gemini article pipeline") and the RESUME HERE block in `../../CLAUDE.md`.
 *
 * 🔴 Lives inside nawah-landing on purpose, separate from `Social Media/Tiktok/pipeline`. The
 * two pipelines share a SHAPE (data file + prompt builder, paste into Gemini, JSON back) but
 * nothing else — different repo, different language register (MSA here, Egyptian dialect there),
 * different output (a rendered page here, a video/carousel there). An earlier draft built this
 * inside the reel pipeline and imported nothing from it anyway; moved out per the user's explicit
 * "everything needs to be separate" (2026-09-15).
 *
 * Each cluster's `shape` says how many articles it produces:
 *   'single' → exactly one article
 *   'split'  → one article per label in `splitLabels` (e.g. Egypt vs Gulf)
 *   'hub'    → an open-ended list of short entries under one page (glossary only, so far)
 */

const CLUSTERS = {
  glossary: {
    tag: 'glossary',
    name: 'قاموس المصطلحات الطبية',
    job: 'reach + internal links — decode the clinical terms every other article uses',
    shape: 'hub',
    medical: true,
    voice: 'neutral',
    ctaFeature: 'general app install — this hub has no one feature, it exists to link OUT to the tools/guide pages that do',
    note: 'Built first (plan order). Every month/father/tool article can link a term here instead '
        + 'of re-explaining it inline — this is infrastructure for the rest of P4, not just '
        + 'content of its own. Terms come from the app\'s own screens and the GSC export '
        + '(`docs/gsc/`) where available; do not invent a term nobody actually searches.',
    topicGate: `The gate, asked first:

> Does a NAME appear on Nawah's own screens, or in another article, that a reader would not
> already know — the same test قاموس الحمل (the reel pillar) uses for reach, applied to text
> instead of video?

**TIER 1 — at least half:** a term that already appears in the app or in a shipped guide/father
article without explanation (e.g. NIPT, GBS, الطوق, تسمم الحمل).

**TIER 2:** a term common on WebTeb/SuperMama's own glossaries that Nawah does not yet use but
plausibly will.

One entry per term: the plain-language definition, the week or trimester it usually comes up (if
any), and which existing article it should link back to.`,
  },

  postpartum: {
    tag: 'postpartum',
    name: 'الأربعين (فترة النفاس)',
    job: 'reach — the guide covers pregnancy, nothing on the site covers after birth',
    shape: 'single',
    medical: true,
    voice: 'neutral',
    ctaFeature: 'general app install (no postpartum-tracking feature exists in Nawah yet — do not '
              + 'claim one). If a real feature is added later, wire this CTA to it then.',
    note: 'Zero overlap with the 9 pregnancy-guide months by definition — this starts at birth. '
        + 'Covers the traditional "forty days" (الأربعين) as the organizing frame because that is '
        + 'the term Egyptian/Gulf readers actually search, not a Western "postpartum recovery" '
        + 'framing.',
    topicGate: `The gate, asked first:

> Would a woman in the first 40 days after birth search this, the way a pregnant woman searches
> the guide months?

**TIER 1 — all true:** covers physical recovery (bleeding, stitches, breast changes) AND
emotional/mood changes (baby blues vs postpartum depression — NAME the difference, do not blur
it) AND names concrete red flags that need a doctor same-day.
**Do NOT** merge this with a general "newborn care" topic — that is a different reader intent
(about the baby, not about her body) and would dilute both.`,
  },

  birth_cost: {
    tag: 'birth_cost',
    name: 'تكلفة الولادة',
    shape: 'split',
    splitLabels: ['مصر', 'الخليج'],
    job: 'reach — the SERP is 100% individual clinic sites, no neutral resource exists (plan)',
    medical: false,
    voice: 'neutral',
    ctaFeature: 'Baby Budget (multi-currency) — the one Nawah feature this pairs with directly',
    note: `🔴 PRICE NUMBERS ARE NOT A SOURCEABLE MEDICAL CLAIM. Do not invent a figure and do not
treat a plausible-sounding number as fact — that is the exact failure ARTICLE_PATTERN.md §5
documents for citations, applied to prices instead of medical claims. Write the article shape
(what drives cost: normal vs C-section, public vs private, room class, prenatal-care package,
insurance vs cash) with ranges left as a clearly marked placeholder for the user to fill from a
real 2026 quote, rather than a guessed number presented as current.`,
    topicGate: `The gate, asked first:

> Is a reader trying to BUDGET for a birth, and finding only clinic marketing pages instead of a
> neutral comparison?

**TIER 1 — both labels needed, one article each:** مصر and الخليج get separate articles, never
merged — currency, public/private system and typical delivery method differ enough that a merged
page serves neither reader well.
Structure per label: what drives the price up or down (delivery type, hospital tier, prenatal
package, insurance), NOT a single headline number presented as THE cost.`,
  },

  food_safety: {
    tag: 'food_safety',
    name: 'آمنة للحامل؟ — أطعمة',
    shape: 'split',
    splitLabels: [], // one article per food item, opened as needed — not a fixed pair
    job: 'reach — highest-intent searchable question format on the whole site',
    medical: true,
    voice: 'neutral',
    ctaFeature: 'general app install, or a specific tracker feature if the food ties to a week/symptom',
    note: `🔒 GATE A RESOLVED (2026-09-15, user's choice among 4 options) — every title and opening
question uses the SAFETY frame, never the religious-permissibility frame:
    USE:    "الأناناس آمن للحامل؟"
    NEVER:  "هل يجوز أكل الأناناس للحامل؟"
"يجوز" asks a fiqh question and pulls fatwa sites into the comparison set. "آمن" matches how
WebTeb/SuperMama actually phrase it and is what Google returns results for. This is locked, do
not re-litigate it or offer the ـيجوز phrasing as an option to test.`,
    topicGate: `The gate, asked first:

> Is this a specific NAMED food a pregnant woman would type into Google with "?" at the end —
> not a general "what to eat" listicle?

**TIER 1 — all true:** one food per article title exactly as Gate A specifies · a direct yes/no/
conditional answer in the first two sentences (SuperMama's structure, not a scroll-to-find-out) ·
sourced to NHS/WHO/MedlinePlus food-safety-in-pregnancy pages, never a home-remedy site.
One article per food. Do not bundle several foods into one page — it is the single-question
searchability that makes this cluster work.`,
  },

  father_expansion: {
    tag: 'father_expansion',
    name: 'دليل الأب — مواضيع جديدة',
    shape: 'hub', // open count — however many genuinely new angles pass the gate
    job: 'shares + differentiator — father mode is the app\'s only real differentiator',
    medical: false,
    voice: 'father',
    ctaFeature: 'app install via fatherPlayUrl, same as the 7 existing father articles',
    note: `Extends the 7 already-live father articles (lib/father-content.ts). Read that file's
existing topics FIRST — this batch must not duplicate an angle already covered there.
🔴 Same rule as the father article/reel pillar: he is always LEARNING, never FAILING. No
useless-husband jokes, no content that reads as being about him instead of to him.`,
    topicGate: `The gate, asked first (identical to the دليل الأب reel pillar's gate, ported to article
length):

> Is this something a father could actually DO, told TO him, second person, not ABOUT him?

**TIER 1 — both true:** a concrete situation he will actually face (not a generic "supporting your
wife" abstraction) · states plainly why it matters to her or the baby, never played for a laugh at
his expense.
Check against the 7 existing father articles before proposing — no repeats of an angle already
live.`,
  },

  fasting: {
    tag: 'fasting',
    name: 'صيام الحامل',
    job: 'reach — zero femtech competitor owns this SERP (2026-09-15 research pass)',
    shape: 'single',
    medical: true,
    voice: 'neutral',
    ctaFeature: 'general app install, or symptom/hydration tracking if such a feature exists',
    note: `Sits at a medical/religious intersection. This article answers the MEDICAL safety
question only (hydration, blood sugar, which trimester carries more risk, warning signs to break
the fast) — it must NEVER issue a religious ruling on whether fasting is obligatory or exempted.
Where the two intersect, say plainly: "the medical picture below; whether you are religiously
required or exempted from fasting is a question for your own religious authority, not this
article." Do not blur the two roles into one voice.`,
    topicGate: `The gate, asked first:

> Would a pregnant woman search this specifically during Ramadan, looking for medical (not
> religious) guidance?

**TIER 1 — all true:** covers hydration and blood-sugar risk by trimester · names concrete
warning signs that mean break the fast now (per NHS/WHO/MedlinePlus, not invented) · explicitly
defers the religious-permissibility question to a religious authority rather than answering it.`,
  },

  csection: {
    tag: 'csection',
    name: 'قيصري أم طبيعي',
    job: 'reach — a real decision-stage query with good NHS/MedlinePlus source coverage',
    shape: 'single',
    medical: true,
    voice: 'neutral',
    ctaFeature: 'general app install; due-date calculator if the article discusses timing',
    note: 'A comparison article, not an advocacy piece for either method — present both fairly, '
        + 'end on "this is decided with your doctor based on your specific case," never a '
        + 'ranking of which is "better."',
    topicGate: `The gate, asked first:

> Is a reader actually facing this choice or trying to understand a doctor's recommendation, not
> just curious in the abstract?

**TIER 1 — all true:** covers recovery time, risks and when each is medically indicated for BOTH
methods, evenly · no framing that implies one method is more "natural" or "better" as a value
judgment · sourced to NHS/MedlinePlus, both fetched and read.`,
  },

  intimacy: {
    tag: 'intimacy',
    name: 'العلاقة الحميمة أثناء الحمل',
    job: 'reach — the "anonymous search" pattern (culturally sensitive, high search intent)',
    shape: 'single',
    medical: true,
    voice: 'father', // per the 2026-09-15 research pass: genuinely fits father mode
    ctaFeature: 'general app install via fatherPlayUrl',
    note: `Register: clinical-warm, never explicit, never coy. This is a safety-information
article (is it safe, when to avoid it, what to expect), not a relationship-advice piece. Written
in father mode because the research pass found this fits the "asking on behalf of, privately"
pattern better than mother-voiced content does — keep that framing, do not rewrite it back to a
generic second-person-feminine article.`,
    topicGate: `The gate, asked first:

> Does this answer a real safety question plainly, without either being clinically cold or
> tipping into content that reads as explicit?

**TIER 1 — all true:** states the medical safety picture by trimester (per NHS/ACOG-type sourcing)
· names the specific situations where it should be avoided (placenta previa, preterm labor risk,
etc., sourced) · never uses euphemism so vague the actual question goes unanswered.`,
  },

  aqiqah: {
    tag: 'aqiqah',
    name: 'العقيقة والتحنيك',
    job: 'reach — cultural/religious newborn practice, not covered by WebTeb/BabyCenter at all',
    shape: 'single',
    medical: false,
    voice: 'neutral',
    ctaFeature: 'general app install',
    note: `A cultural/religious explainer, not a medical article — do NOT run this through the
medical-sourcing block (no ACOG/NHS/WHO citation requirement). Explain what عقيقة and تحنيك are,
when they are traditionally done, and the practicalities (who performs it, what is customary) as
description, not prescription. 🔴 If any health/hygiene claim is made about تحنيك specifically
(e.g. about the substance used), it must be flagged as tradition, not medical benefit — do not
imply a health benefit that is not evidenced.`,
    topicGate: `The gate, asked first:

> Would a new parent search this to understand a practice they've heard of but don't know the
> details of?

**TIER 1 — all true:** describes both practices factually and respectfully, without asserting a
denominational ruling as universal (practices vary) · no unevidenced health claim.`,
  },

  newborn_admin: {
    tag: 'newborn_admin',
    name: 'تسجيل المولود والتأمين',
    shape: 'split',
    splitLabels: ['مصر', 'الخليج'],
    job: 'reach — admin/paperwork query, EG vs GCC split like تكلفة الولادة',
    medical: false,
    voice: 'neutral',
    ctaFeature: 'general app install',
    note: `🔴 GOVERNMENT PROCESS DETAILS (which office, which documents, which deadline) ARE FACTS
THAT CAN CHANGE AND THAT AN AI CANNOT RELIABLY VERIFY BY MEMORY. Any specific bureaucratic detail
(office name, required document list, day-count deadline) must be marked as needing a live check
against an official government source before publishing — do not present a remembered or
plausible-sounding process as current. If no live-fetchable official source is found, the article
ships with the general shape and an explicit "confirm current requirements with [authority]"
rather than invented specifics.`,
    topicGate: `The gate, asked first:

> Is a new parent trying to figure out WHAT to do and BY WHEN, not general information?

**TIER 1 — both labels, one article each (مصر / الخليج split, never merged, per the same currency/
system-difference logic as تكلفة الولادة):** states the concrete steps and deadline · flags any
detail that needs a live official-source check rather than asserting it from memory.`,
  },

  gender_prediction: {
    tag: 'gender_prediction',
    name: 'تحديد جنس الجنين',
    job: 'reach — extremely high search volume, currently owned by myth-repeating sites',
    shape: 'single',
    medical: true,
    voice: 'neutral',
    ctaFeature: 'general app install',
    note: `☠️ MUST BE FRAMED AS MYTH-DEBUNKING, NOT AS A LIST OF METHODS THAT WORK. This is the
opposite of every other cluster's job: readers arrive believing folk methods (heart rate, belly
shape, the Chinese gender chart, cravings) are predictive, and they are not. The article's job is
to correct that, clearly, while still naming the folk methods (that IS the searched term) —
never presenting one as reliable, even hedged as "some say." Only ultrasound (from ~18-20 weeks)
and NIPT (from ~10 weeks) are medically reliable, sourced to NHS/MedlinePlus. This is the same
"no fabricated credibility" discipline the site already applies to bylines (ARTICLE_PATTERN.md
§5) — applied here to methods instead of authors.`,
    topicGate: `The gate, asked first:

> Does the article correct a specific named folk method rather than just listing methods
> neutrally?

**TIER 1 — all true:** names the folk methods people actually search (heart rate, belly shape,
Chinese gender chart, cravings, ring test) AND states plainly, per method, that it is not
medically predictive · clearly separates these from the two methods that ARE reliable (ultrasound,
NIPT), sourced · never uses "some believe" as a way to imply legitimacy without stating it.`,
  },
};

function resolveCluster(input) {
  if (!input) return null;
  const key = String(input).trim();
  if (CLUSTERS[key]) return CLUSTERS[key];
  return Object.values(CLUSTERS).find(c => c.name === key) || null;
}

const CLUSTER_TAGS = Object.keys(CLUSTERS);

module.exports = { CLUSTERS, CLUSTER_TAGS, resolveCluster };

if (require.main === module) {
  console.log('\nThe 11 article clusters — tag · name · shape\n');
  for (const c of Object.values(CLUSTERS)) {
    const shapeNote = c.shape === 'split' ? `split: ${c.splitLabels.join(' / ')}` : c.shape;
    console.log(`  ${c.tag.padEnd(18)} ${c.name.padEnd(28)} ${shapeNote}`);
  }
  console.log('');
}
