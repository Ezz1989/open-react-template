# Nawah Landing Page — CLAUDE.md

**Project:** Landing page for Nawah (نواة) pregnancy companion app
**Live URL:** babynawah.vercel.app
**Stack:** Next.js 15.1.11 · React 19.2.3 · TS 5.9.3 (strict) · Tailwind v4 · Framer Motion 12.38.0

## Active port (2026-04-18)

Porting the design prototype at `c:\Users\EZZ\Downloads\nawah\` 1:1. Approved plan at `C:\Users\EZZ\.claude\plans\prototype-override-all-yes-flickering-emerson.md`. Follow the plan task-by-task. Work happens on branch `prototype-port`.

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

## Architecture rules

1. Read a file before editing it. Never assume current state.
2. ALL user-facing copy lives in `lib/content.ts`. Never hardcode strings in components. Use `t("path.to.key")` via `useLang()` from `lib/lang-context.tsx`.
3. RTL: toggled via `document.documentElement.dir` in `LangProvider` — no manual `dir` attrs in components.
4. Mother/father toggle: `useMode()` from `lib/mode-context.tsx` writes `data-mode` on `<html>`. Components react through the CSS cascade, not JS state.
5. One responsibility per file. Components do layout only, no business logic.
6. **CHANGED 2026-08-11 (was "Google Play only, no App Store button").** `CtaSection.tsx` now shows BOTH badges. The App Store one is a non-interactive `<span class="btn btn-store btn-store-soon">` reading "Coming soon to App Store" / "قريباً على آب ستور" — **never an `<a>`**, because there is no iOS build and a badge linking nowhere misleads users. Full switch-on instructions are in the `APP_STORE_URL` memo in `lib/constants.ts`. Both badges were also made smaller (padding 14/24 → 11/18, strong 16px → 14px).
7. Nawal chat uses real Groq AI via `app/api/nawal/chat/route.ts`. Never call Groq directly from the client — the key stays server-side.

## Play Store URL

`https://play.google.com/store/apps/details?id=com.nawahapp` — appears in `HeroSection.tsx` and `CtaSection.tsx`, both importing `PLAY_STORE_URL` from `lib/constants.ts`.

🔴 **Verified 2026-08-11: this URL returns HTTP 404.** The package id is right; the listing is not public because the app is only on the **internal testing** track, so the button currently sends visitors to a Play error page. It resolves by itself at production publish (tracker P15) with no code change. Memo lives on the constant.

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

- `.env.local` (gitignored): `GROQ_API_KEY_LANDING=<key>` — separate from the Flutter app's `GROQ_API_KEY` so web abuse can't rate-limit real mobile users.
- Vercel project settings: same var, scoped to Production + Preview.

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

## Component inventory (post-port)

Section components live in `components/`:

- `Navbar.tsx` — pill-toggle mother/father + EN/ع language toggle
- `HeroSection.tsx` — two-column hero, week slider (4-40), stats strip, Play Store CTA
- `GrowthVisualizer.tsx` — week-image crossfade panel (used inside Hero)
- `FeatureGrid.tsx` — 3-col grid, 6 cards with inline SVG icons
- `DualJourney.tsx` — mother/father split panels, click toggles mode
- `FetusSVG.tsx` — stylized fetus SVG that scales with week (used in DualJourney)
- `NawalSection.tsx` — real-time chat UI fetching `/api/nawal/chat`, keyword fallback
- `BabyNamesSection.tsx` — swipe-card UI with 6 seeded names
- `PlannersSection.tsx` — tabs with HospitalBagPanel/BudgetPanel/JournalPanel (internal)
- `CtaSection.tsx` — centered footer CTA block
- `Footer.tsx` — hairline row with logo, links, copyright

Assembly: `app/page.tsx` renders Navbar → Hero → FeatureGrid → DualJourney → Nawal → BabyNames → Planners → Cta → Footer.
