# Nawah Landing Page — CLAUDE.md

**Project:** Landing page for Nawah (نواة) pregnancy companion app
**Live URL:** www.nawahapp.net (babynawah.vercel.app must keep resolving — hardcoded password-reset redirect in the Android app)
**Stack:** Next.js 15.1.11 · React 19.2.3 · TS 5.9.3 (strict) · Tailwind v4 · Framer Motion 12.38.0

## ▶ Open work — tracked under `NAWAHSOCIAL` (no trigger word here since 2026-09-28)

The website task list lives in `../Social Media/CLAUDE.md` (NAWAHSOCIAL block). The finished
2026-09-15 traffic session + the finished 2026-04-18 prototype port are in
[`docs/ARCHIVE_2026-09.md`](docs/ARCHIVE_2026-09.md).

## Design tokens (prototype-aligned)

Source of truth: `app/globals.css`. Never hardcode hex values in components — always `var(--color-*)`.

- Mother (default) accent: `--accent` = `--rose-400` (#C97B8E); strong = `--rose-600`
- Father mode: `[data-mode="father"]` flips accent to navy (`--navy-700` #1F2C4F)
- Dark theme: `[data-theme="dark"]` swaps bg + fg tokens
- Backgrounds: `--bg` (page) · `--bg-elev` (cards) · `--bg-inv` (dark panels)

## Typography

- `--font-display` → Instrument Serif (display headlines, week numbers, italic variants for emphasis)
- `--font-body` → Plus Jakarta Sans (all body copy + UI)
- `--font-arabic` → Noto Naskh Arabic (activates when `dir="rtl"`)

## Motion rules (UPDATED 2026-04-18 — prototype port overrides)

- Default motion: 280ms ease
- Long entrances: `fadeUp` keyframe at 800ms `cubic-bezier(0.22, 1, 0.36, 1)` is allowed (prototype uses this)
- Shadows and radial gradients are now allowed (prototype uses them throughout — see `--shadow-md`, `--shadow-lg` and radial-gradient backgrounds in GrowthVisualizer / FetusSVG)
- Framer Motion for interactive animations; plain CSS keyframes for entrance animations

## 🧠 Verification rules — inherited, non-negotiable

Root [`../CLAUDE.md`](../CLAUDE.md) Hard Rules **0 / 0a / 0b** apply here in full:

> **0. Verify or don't say it.** Every factual claim must trace to a source fetched
> or a file read *this session*. **Errors cluster in volunteered asides, not in
> answers to direct questions.** If you can't cite it, cut it or mark it unverified.
> **0a. Third-party console steps need a fetched doc in the SAME turn** (Vercel,
> Porkbun DNS) — or label it unverified.
> **0b. Answer the question asked, then stop.**

### 🔴 The trap unique to this folder

**This is a SEPARATE git repo nested inside the app repo.** The parent stores only
a SHA pointer and **cannot commit these files**.

- **Never record a landing-page change as done based on the parent repo's status.**
  That mistake once left a wrong Play link — pointing at a stranger's app —
  live on the public site.
- `git add` from the parent silently does nothing useful. Commit **from inside
  this directory**, then bump the parent's pointer as its own commit.
- ⚠️ **Vercel deploys on push.** A push here is an outward-facing action on a live
  public site — confirm with the user first. A local commit is not a deploy, and
  saying "fixed" before the push is a false claim.

## Architecture rules

1. Read a file before editing it. Never assume current state.
2. ALL user-facing copy lives in `lib/content.ts`. Never hardcode strings in components. Use `t("path.to.key")` via `useLang()` from `lib/lang-context.tsx`.
3. RTL: toggled via `document.documentElement.dir` in `LangProvider` — no manual `dir` attrs in components.
4. Father accent: an element with `data-mode="father"` flips the accent to navy (father guide pages set it themselves). The site-wide mother/father toggle (`lib/mode-context.tsx`) was removed with the A2 home page, 2026-11-06.
5. One responsibility per file. Components do layout only, no business logic.
6. Store buttons: both stores are live. Home buttons use `homePlayUrl(where)` / `appStoreUrl("web_<where>")`; the «حمِّلوا تطبيق الحمل» pills use `/go/home_<where>` (store picked by device, PostHog `home_download_click`); the QR uses `/qr` (`qr_scan`).
7. Removed 2026-11-06: the Nawal demo chat (`app/api/nawal/chat`, Groq). The Vercel env var `GROQ_API_KEY_LANDING` is now unused.

## Play Store URL

`https://play.google.com/store/apps/details?id=com.nawahapp` — `PLAY_STORE_URL` in `lib/constants.ts` (untagged, JSON-LD/llms.txt only); buttons use the tagged helpers there.

✅ **Resolved.** Was 404 on 2026-08-11 while the app sat on the internal-testing track.
The app has been **Published** on Play since 2026-08-15 (closed testing), so the listing
is public and this link works — no code change was needed, as predicted. Not re-fetched
this session; if in doubt, click it.

## Session 2026-08-11 — encoding, P7 pages, mobile/RTL

**🔴 MOJIBAKE — FOUND AND FIXED, one of them functional.** `HeroSection.tsx` and `NawalSection.tsx` contained 10 double-encoded runs (Arabic written as UTF-8, re-read as CP1252, re-saved as UTF-8). `HeroSection:48` displayed `Ù†ÙˆØ§Ø©` instead of `نواة` on the live hero.
**The serious one:** `NawalSection.tsx:11-13` are the Arabic keyword regexes for the demo chat. With mojibake in the pattern **no Arabic input could ever match**, so every Arabic visitor silently received the fallback reply — the Arabic demo of an Arabic-first product had never worked. Arrows `â†’`/`â†‘` on lines 251/299 were corrupted too.
**Method that worked:** detect runs of characters CP1252 can encode to a single byte ≥ 0x80, then `run.encode('cp1252').decode('utf-8')`. **Guard the repair with an idempotence check** — a naive "no CP1252 chars remain" assertion is WRONG, because a correctly repaired `·` is itself a CP1252 character. Repo-wide rescan afterwards: 0 remaining. `lib/content.ts` was clean.

**✅ P7 DONE — two new static routes**, both bilingual through `content.ts` (no hardcoded strings) and sharing `components/LegalLayout.tsx`:
- **`/privacy`** — disclosures written from the app's ACTUAL integrations (Supabase eu-west-2, Firebase, PostHog, AdMob, RevenueCat, Groq), so the P13 Data Safety form can be filled to match. Health data called out explicitly as never sold and never used for ad targeting.
- **`/delete-account`** — Play requires a **publicly reachable** deletion URL; an in-app path alone is not sufficient, since a reviewer or an uninstalled user must reach it without an account. Documents in-app route, email route, what is deleted, what is retained (30-day backup cycle), and the partner-unlink consequence.
- `footer.links` now point at `/privacy` and `/delete-account` instead of `ezz1989.github.io/nawah-privacy/`.
- **`LegalLayout` deliberately does not reuse `Navbar`** — Navbar links to on-page anchors (`#features`, `#nawal`) that don't exist on these routes, and its mother/father toggle is meaningless there.

**✅ MOBILE + RTL.** Two of the first suspicions were WRONG and are recorded so they aren't re-raised: **viewport is NOT missing** (Next.js sets `width=device-width, initial-scale=1` automatically — its docs say manual config "is usually unnecessary"), and **the site IS responsive** — breakpoints live in per-component `<style jsx>` blocks, not `globals.css`, so grepping `globals.css` for `@media` returns 0 and looks alarming.
Real fixes applied:
- **9 physical CSS properties → logical** (`marginLeft`→`marginInlineStart`, `left/right`→`insetInlineStart/End`) in `NawalSection`, `GrowthVisualizer`, `DualJourney`, plus `.btn-store { text-align: left }` → `text-align: start`. These did not mirror under `dir="rtl"`.
- **`PlannersSection` `minmax(300px, 1fr)` → `minmax(min(100%, 300px), 1fr)`** — a bare 300px minimum overflows a 360px Android (296px available after container padding), which made the page scroll sideways.
- `.container` padding 32px → 20px under 600px, and `html, body { max-width: 100%; overflow-x: hidden }`.
- ⚠️ **Still open:** `layout.tsx` hardcodes `<html lang="en">` and `LangProvider` sets `dir` in a `useEffect`, so Arabic renders LTR for one frame before flipping. Cosmetic, not fixed.

**Metadata** now uses `metadataBase` + `SITE_URL = https://www.nawahapp.net`. ⚠️ `babynawah.vercel.app` must keep resolving — the shipped Android build hardcodes it as the password-reset redirect (`../lib/features/auth/forgot_password_screen.dart:42`).

**Verification:** EN/AR key parity checked programmatically — **317 leaf paths each, 0 missing either way** (a missing key does not error, `t()` silently returns the raw dot-path). `npm run build` ✅ compiled, types and lint clean, 9/9 static pages.

## Env vars

- `NEXT_PUBLIC_POSTHOG_KEY` (PostHog EU). `GROQ_API_KEY_LANDING` is unused since 2026-11-06 (Nawal demo removed) and can be deleted in Vercel.

## Deployment

- Push to `master` → Vercel auto-deploys in ~30s
- Package manager: npm with `--legacy-peer-deps` (`vercel.json` pins `npm install --legacy-peer-deps`)
- Never push broken builds — run `npm run build` locally first
- Git remote is named `open-react-template.git` because the repo was bootstrapped from that starter — it IS the active Nawah repo, don't be confused

## Copy tone

Warm, specific, best-friend voice. NOT clinical. NOT promotional. Never "testament to", "pivotal", "vibrant", "nestled", "clinical-grade". No forced rule-of-three. See plan's "Copy rewrites" section for the full EN + AR dictionary.

Examples of the right tone:

- "The size of a lentil. There's already a heartbeat in there."
- "First trimester done. Miscarriage risk drops sharply from here. You can exhale a little."
- "Show up. Not as a visitor."

## Sibling Flutter app

- Path: `../lib/` from this repo root
- Reuse pattern from `../lib/services/gemini_service.dart` for the Nawal system prompt (mother/father branching, week context, emergency guidance)
- Keep the two surfaces voice-consistent — the `000-jeremy-content-consistency-validator` plugin runs in Task 18 to enforce this.

## Component inventory (home page A2, 2026-11-06)

Spec: `docs/REVAMP_A2_SPEC.md`. `app/(home)/page.tsx` (own root layout, server-renders `lang="ar" dir="rtl"`) trims the
articles on the server and renders `components/home/HomePage.tsx`:

- `Hero.tsx` (+ `../Navbar.tsx`) - full-screen bump video, giant two-half line, CTA pill
- `Features.tsx` - «تطبيقٌ واحد على هاتفين» bento with real 1.0.8 screens (`public/home/screens/{ar,en}_*.png`) + «وفي التطبيق أيضاً»
- `Articles.tsx` - 5 rows + filter chips
- `Download.tsx` - newborn-feet video, pill, `StoreButtons.tsx`, QR (`public/home/qr.svg` -> /qr); also `HomeFooter`
- `LoopVideo.tsx` - muted looping video over a priority poster; `icons.tsx`; styles in `home.module.css`
- `../BabyFootsteps.tsx` - footprints on the background (client-only)

`components/SiteShell.tsx` = the <html> shell shared by `(home)` (Arabic first) and `(site)` (legal pages, English first).
Strings: `content.ts` `home.*`. Old sections (HeroSection ... CtaSection, GrowthVisualizer, FetusSVG) deleted 2026-11-06.
