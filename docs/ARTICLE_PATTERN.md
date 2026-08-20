# The guide article pattern

How to write months 2 to 9. Month 1 (`lib/guide-content.ts`, `month1`) is the
worked example; this file is why it is shaped the way it is.

Everything below was checked against a primary source on 2026-08-21. Where a
rule comes from a vendor doc, the doc is named. Where it comes from a judgement
call, it says so.

---

## 0 · The one thing that makes any of this work

Arabic has to be in the HTML that leaves the server.

The marketing homepage swaps languages through `LangProvider`, a client
component holding `useState<Lang>("en")`. Both languages live at one URL and
the Arabic only exists after hydration, so a crawler reads an English page and
there is no Arabic URL to rank at all.

Google Search Central, *Localized versions*:

> Google doesn't use `hreflang` or the HTML `lang` attribute to detect the
> language of a page; instead, we use algorithms to determine the language.

So `<html lang="ar">` was never the fix. Separate URLs with server-rendered
text were. That is what `app/(guide)/[lang]/` exists for, and it is why guide
pages must never import a client component that owns language state.

Verify after any change:

```bash
npm run build
grep -o '<html[^>]*>' .next/server/app/ar/guide/1.html   # → lang="ar" dir="rtl"
grep -o '<h1[^>]*>[^<]*</h1>' .next/server/app/ar/guide/1.html   # → Arabic
```

If the Arabic is not in that file, nothing else on this page matters.

---

## 1 · Nine articles, not forty

`../../lib/features/shared/weekly_content_screen.dart` branches on nine bands:
`<=8 / <=12 / <=16 / <=20 / <=24 / <=28 / <=32 / <=36 / term`. Weeks 21 and 24
already return the same string. Forty pages drawn from nine sources would be
four near-duplicates per band, which is what Google's helpful-content guidance
demotes.

Months are also the unit Arabic speakers use. Weeks are what the clinic uses,
so every article states its week span in the eyebrow and again in the hub.

**If week-level pages are ever wanted**, they become spokes linking up to their
month, added only after the search-terms report shows week queries pulling.
`../../docs/AD_PLAN_150USD.md` §3 explains why that report is the only honest
source of Arabic keyword data available here.

---

## 2 · Language: MSA only

The app ships `app_ar`, `app_ar_EG`, `app_ar_SA`, `app_ar_AE`. Dialect belongs
there, next to the user. An article in Egyptian reads as foreign to a Saudi and
the reverse is equally true, so the guide stays in Modern Standard Arabic and
lets the app carry the dialect.

Practical consequences:

- Prefer impersonal and third-person constructions. Fathers read these pages
  too, and Nawah's whole differentiator is that they do.
- Use feminine direct address only where the sentence is unmistakably spoken to
  the pregnant woman, as in the red-flags block.
- Arabic-Indic digits in Arabic prose. `n.toLocaleString("ar-EG")` in code, and
  `١٢` rather than `12` in hand-written strings. A raw `${n}` renders Latin
  digits inside Arabic and looks imported.

---

## 3 · Structure of one article

Order is fixed, and the order carries an argument.

| # | Block | Why it sits here |
|---|---|---|
| 1 | Eyebrow: month + week span | Reconciles the reader's unit with the clinic's, immediately |
| 2 | `title` (h1) | Written for a person, not for a query |
| 3 | `standfirst` | One promise. No throat-clearing, no "in this article we will" |
| 4 | Byline + date | See §5 |
| 5 | Hero photo | See §6 |
| 6 | `sections[]` | 3 to 4. Each ends with its sources if it made a factual claim |
| 7 | `redFlags` | **Before the CTA.** Nothing commercial goes between a reader and this |
| 8 | `cta` | See §4 |
| 9 | `faqs` | Real questions. No schema, see §7 |
| 10 | `citations` | Full list with retrieval dates |
| 11 | Disclaimer | Not collapsible, not fine print |

`redFlags` is a required field on the `GuideMonth` type rather than an ordinary
section. It is the highest-stakes content on the page and requiring it in the
type is what stops a future month shipping without it.

---

## 4 · The CTA

Must name something the app genuinely does for a reader **at that month**. The
month 1 CTA works because Nawah computes the gestational week from the LMP,
which is the exact arithmetic the article just explained. That is a true claim
about a real feature answering the reader's actual state.

The mistake to avoid is named in `../../docs/AD_PLAN_150USD.md` §7:

> People install because the content was useful, not because you asked them to.

A generic "download our app" block is that mistake.

**Every Play link goes through `guidePlayUrl(locale, month)`.** Never
hand-write one. The app carries no Meta SDK, no Snapchat SDK and no MMP, so
Play Console's *User acquisition → Acquisition reports → Tracked channels
(UTM)* is the entire attribution story. Play Console Help (`answer/9859173`)
recommends setting `utm_source`, `utm_medium`, `utm_campaign`, `utm_id` and
`utm_source_platform`; anything omitted reports as `(not set)`.

The helper emits `utm_content=ar_month_1`, so Play Console can separate not
just "articles" from other traffic but which article and which language.

---

## 5 · Byline, sources, and the thing we will not do

Pregnancy is YMYL. Google's creating-helpful-content guidance gives "even more
weight" to E-E-A-T for topics that "could significantly impact the health ...
of people", and says:

> We strongly encourage adding accurate authorship information, such as bylines
> to content where readers might expect it.

A pregnancy article is exactly where a reader expects one.

**There is no clinician on this project.** The byline therefore credits the
team and states plainly that no clinician wrote or reviewed the page, and
`BYLINE.role` says so in both languages. Inventing "Reviewed by Dr. X" would be
a fabricated credential on health content. It is not a shortcut worth taking at
any traffic volume.

If a real clinician ever reviews these pages, add a `reviewer` field and a
`reviewedDate`, and add `reviewedBy` to the Article schema. Not before.

### Citation rule

Every URL in `citations` was opened and read before it was written down.
`retrieved` records the day that happened.

This is not ceremony. Two CDC URLs and one NHS URL that looked entirely
plausible returned 403 and 404 when actually fetched during the month 1 write.
A plausible-looking `acog.org` path that nobody opened is a fabrication, and on
a health page it is the worst kind available.

Sources that worked, and are good defaults for the remaining months:

| Org | Note |
|---|---|
| WHO ELENA | Fetches cleanly. Best for supplement and nutrition recommendations |
| MedlinePlus | Fetches cleanly. Good for definitions |
| ACOG | Fetches cleanly. Best for care schedules and US clinical consensus |
| CDC | **403s to automated fetch.** Findable via search, but do not cite without opening it another way |
| NHS | Section URLs move. Verify the exact page, not the section root |

Note for a future month: ACOG's April 2025 clinical consensus replaced the
fixed 12-to-14 visit schedule with a tailored 6-to-10 visit plan for
average-risk pregnancies. The app still ships "the ACOG prenatal schedule,
pre-loaded", which may now be stale. That is an app issue, logged here so it is
not lost.

---

## 6 · Images

Sourced from Pexels by `../scripts/fetch-guide-images.mjs`, which follows the
same access pattern the TikTok pipeline uses
(`../../Social Media/Tiktok/pipeline/render_reels.js`): `api.pexels.com/v1/search`,
key in a bare `Authorization` header, seen-id set so one run never repeats a
photo. Key lives in `../../Social Media/.env` as `PEXELS_API_KEY`.

Pexels license (read 2026-08-21): free for commercial use on websites,
modification allowed, **attribution not required but appreciated**. We credit
anyway. On a page whose credibility rests on showing its sources, hiding the
photo credit would be an odd exception.

Three prohibitions actually constrain the work:

- "Identifiable people may not appear in a bad light or in a way that is
  offensive."
- "Don't imply endorsement of your product by people or brands on the imagery."
  → **no photo of a person inside the CTA block**, where a face reads as a
  testimonial.
- "Don't redistribute or sell the photos ... on other stock platforms."

### Two rules learned on month 1

**Look at every image before shipping it.** The first hero returned for
`calendar planning desk minimal` was a Portuguese desk calendar reading AGOSTO
and *Dia dos Pais*. Latin-script signage inside an Arabic article looks like
exactly what it is.

**Do not trust the `alt` field from the API.** The month 1 hero came back
described as "white and pink tulips on pink surface". It is a pregnancy test, a
pacifier and tulips. The `alt` written into `guide-content.ts` is written by
hand in both languages, describing the picture for someone who cannot see it,
not stuffed with keywords.

Avoid bare-midriff bump close-ups. The audience is Gulf and Egyptian and the
register of these articles is clinical.

---

## 7 · Structured data

`Article` and `BreadcrumbList`. That is the whole list.

**No `FAQPage`.** Google deprecated the FAQ rich result on 8 May 2026 and
removed the documentation on 15 June 2026:

> The FAQ rich result feature is no longer shown in Google Search results.

The questions stay in the article because readers and answer engines use them.
The markup would be dead weight.

`citation` on the Article node carries the source list into the graph, which
costs nothing and states in machine-readable form the thing §5 is about.

---

## 8 · hreflang

Google names three requirements and ignores the annotations if any is missed:

- **Self-referential.** "Each language version must list itself as well as all
  other language versions."
- **Bidirectional.** "If two pages don't both point to each other, the tags
  will be ignored."
- **`x-default`.** "Used when no other language/region matches the user's
  browser setting."

All three are produced by the `languages` map in `generateMetadata`, and again
by `app/sitemap.ts`. Google treats link tags, HTTP headers and sitemap
annotations as "equivalent", so doing it twice is belt and braces rather than
duplication: the sitemap is the copy that gets fetched on a schedule.

`x-default` points at **Arabic**, set by `X_DEFAULT_LOCALE`. Arabic is the
primary audience, so Arabic is the fallback.

---

## 9 · Prose rules

Applied from the `humanizer` skill and Strunk. The point is that a reader can
tell, and on health content the tell costs trust.

Do not use:

- Em dashes as a rhythm device. Commas and full stops.
- "Not only ... but also", or "It's not just X, it's Y".
- Forced groups of three.
- `stands as`, `serves as`, `boasts`, `plays a vital role`, `underscores`.
- Trailing `-ing` clauses bolted on for depth: "..., highlighting the
  importance of early care."
- Vague authorities: "experts say", "studies show". Name the body or cut it.
- Title Case In Headings. Sentence case.
- Emoji in article prose. (This repo's own docs use them; articles do not.)
- Curly quotes.

Do:

- Vary sentence length. Some short.
- Say the concrete thing. "400 micrograms daily until week 12" beats "adequate
  supplementation".
- State uncertainty where it exists, and say who to ask instead.
- End sections on the emphatic word.

The month 1 line that earns its place: *"The pregnancy did not start four weeks
ago. The counting did."* It is short, it is the actual point, and no LLM
vocabulary appears in it.

---

## 10 · Checklist before publishing a month

- [ ] `published: true` and the month appears in `GUIDE_MONTHS`
- [ ] `npm run build` clean, and the route list still shows `/`,
      `/auth/reset-password`, `/privacy`, `/delete-account` unchanged
- [ ] Arabic `<h1>` present in `.next/server/app/ar/guide/<n>.html`
- [ ] Every `citations[].url` opened this session; `retrieved` dates match
- [ ] Every image viewed, not just downloaded
- [ ] `alt` hand-written in both languages
- [ ] CTA names a feature that is real and relevant to this month
- [ ] Play link built by `guidePlayUrl`, never hand-written
- [ ] `redFlags` present, and rendered before the CTA
- [ ] No `FAQPage` schema
- [ ] Read the Arabic aloud. If it sounds translated, it was

---

## 11 · Deploying

`nawah-landing` is **its own git repo** nested inside the Android repo. The
parent stores only a SHA pointer and cannot commit these files. Commit inside
this directory, then push. Vercel project `babynawah` auto-deploys `master` in
about 30 seconds.

Never push a failing build.
