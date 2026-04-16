# Nawah Landing Page — nawah-landing

**Project:** Landing page for Nawah (نواة) pregnancy companion app
**URL:** nawah.vercel.app
**Stack:** Next.js 15 · Tailwind CSS v4 · Framer Motion · Magic UI · Aceternity UI

---

## Brand Colors
```
Dark bg:        #1A1625  (all dark sections + hero)
Warm ivory:     #FAFAF8  (body/scroll sections)
Rose (mother):  #C9728A  · dark: #72243E
Navy (father):  #1E3A5F  · mid: #378ADD
Text dark:      #2C2C2A
Text secondary: #5F5E5A
Text tertiary:  #888780
```
Never hardcode hex values outside `app/globals.css` CSS variables. Use `var(--color-*)` in components.

## Typography
```
Playfair Display  → hero H1, week numbers, section headings (--font-playfair)
Nunito Sans       → body, UI copy (--font-nunito)
Cairo             → Arabic text, activates when dir=rtl (--font-cairo)
Weights: 400 + 500 only — never 600, 700, bold
```

## Motion Rules
- All animations: 280ms easeOut — no exceptions
- Framer Motion only — no CSS transitions for layout animations
- Enter animations: fade + slide 16px up or side-slide from ±40px
- No spring/bounce physics

## Component Sources
```
Magic UI      → npx magicui-cli add <name>  → lands in components/ui/
Aceternity UI → copy-paste from ui.aceternity.com → components/ui/
21st.dev      → copy-paste → components/ui/
```

## Architecture Rules
1. Read the file before editing — never assume current state
2. All copy lives in `lib/content.ts` — never hardcode strings in components
3. Language state: `useLang()` from `lib/lang-context.tsx` — `t("key.path")` for all text
4. RTL: set via `document.documentElement.dir` in lang-context — no manual dir attrs in components
5. One responsibility per file — components do layout only, no business logic
6. No shadows · No gradients in UI cards · Dark sections: `#1A1625` · Light sections: `#FAFAF8`

## File Structure
```
app/
  layout.tsx          ← fonts + LangProvider wrapper
  page.tsx            ← section assembly only
  globals.css         ← CSS variables + base resets + animation keyframes
components/
  Navbar.tsx
  HeroSection.tsx
  WeekJourney.tsx
  PartnerSync.tsx
  FeaturesBento.tsx
  ArabicStrip.tsx
  ScreenshotsMarquee.tsx
  CtaSection.tsx
  Footer.tsx
  ui/                 ← Magic UI + Aceternity components
lib/
  content.ts          ← ALL strings (EN + AR)
  lang-context.tsx    ← language state + RTL toggle
  utils.ts            ← cn() helper only
public/
  logo.png            ← nawah_logo_full.png (white version)
  screenshot-mother.png
  screenshot-father.png
```

## Play Store URL
```ts
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.nawahapp";
```
Update this when the Play Store listing goes live. It appears in `HeroSection.tsx` and `CtaSection.tsx`.

## Deployment
- Push to GitHub main branch → Vercel auto-deploys in ~30s
- Domain: nawah.vercel.app (free, auto-assigned when project named "nawah")
- Never push broken builds — run `npm run build` before pushing

## Copy Tone
Warm, specific, motherly best-friend voice. NOT clinical. NOT promotional.
Examples of the right tone:
- "The size of a lentil. There's already a heartbeat in there."
- "First trimester done. Your baby has fingers and a face now — that part still gets us."
- "You made it to week 40. Write something down before it gets very loud."
