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
6. Google Play only (no App Store button).
7. Nawal chat uses real Groq AI via `app/api/nawal/chat/route.ts`. Never call Groq directly from the client — the key stays server-side.

## Play Store URL

`https://play.google.com/store/apps/details?id=com.nawahapp` — appears in `HeroSection.tsx` and `CtaSection.tsx`. Update when the listing goes live.

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
