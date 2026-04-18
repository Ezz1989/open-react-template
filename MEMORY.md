# Nawah landing page — working notes

**Live URL:** babynawah.vercel.app
**Stack:** Next.js 15.1.11 · React 19.2.3 · TypeScript 5.9.3 (strict) · Tailwind CSS v4 · Framer Motion 12.38.0 · npm (+ `--legacy-peer-deps`)
**Sibling project:** `../` is the Flutter pregnancy app (`pregnancy_companion`). The landing shares the same Groq `llama-3.1-8b-instant` model but uses a separate `GROQ_API_KEY_LANDING` to isolate rate limits.

## Active work

Porting the prototype at `c:\Users\EZZ\Downloads\nawah\` 1:1 into this repo, with a dramatic EN + AR copy rewrite. Approved plan: `C:\Users\EZZ\.claude\plans\prototype-override-all-yes-flickering-emerson.md`. Work happens on branch `prototype-port`.

## Design overrides from the prototype port (2026-04-18)

- Shadows are OK. Radial gradients are OK. `fadeUp` entry animation allowed at 800ms. These override prior "no shadows / no gradients / 280ms only" rules in CLAUDE.md.
- Fonts change to: Instrument Serif (display) + Plus Jakarta Sans (body) + Noto Naskh Arabic (RTL). Playfair / Nunito / Cairo are out.
- Google Play only — no App Store button.
- Mother/father mode toggle now drives accent color via `data-mode` on `<html>` (`useMode()` from `lib/mode-context.tsx`).

## Nawal AI chat

Live through `app/api/nawal/chat/route.ts`. Reuses the Flutter app's Groq system prompt structure (see `../lib/services/gemini_service.dart`). Rate limited to 5 messages per IP per hour (in-memory Map; upgrade to Upstash KV if bot traffic appears).

## File of truth for strings

`lib/content.ts` — ALL user-facing copy lives here in EN + AR. Never hardcode strings in components. Use `t("path.to.key")` via `useLang()` from `lib/lang-context.tsx`.

## Git remote (don't be confused)

The remote is named `open-react-template.git` because this repo was bootstrapped from that starter and the remote was never renamed. It IS the Nawah landing repo — Vercel deploys `babynawah.vercel.app` from it. The sibling folder `../open-react-template-archive/` is a stale clone of the same remote at an older commit; safe to delete if clutter bothers you.

## Env vars

- `.env.local` (gitignored): `GROQ_API_KEY_LANDING=<key>` — separate from the Flutter app's `GROQ_API_KEY` so web abuse can't rate-limit real mobile users.
- Vercel project settings: same var name, scoped to Production + Preview.
