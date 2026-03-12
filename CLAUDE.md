# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Bump service worker version + Next.js build
npm run lint         # ESLint (no --fix by default)
npm start            # Start production server
```

The build script runs `scripts/bump-sw.js` before `next build` to stamp the service worker (`public/sw.js`) with a unique cache-busting timestamp.

## Architecture

**IhsanWealth** — a full-stack Islamic companion app built with Next.js 16 (App Router), React 19, TypeScript (strict), and Tailwind CSS 4.

### Backend Services

- **Supabase** — auth (email/password), user profiles, zakat/payment records, page views. Server client in `src/lib/supabase/server.ts`, browser client in `src/lib/supabase/client.ts`. Schema defined in `supabase/migrations/`.
- **AI Assistant** — LangChain + OpenRouter (OpenAI-compatible). Route handler at `src/app/api/chat/route.ts`. Tools defined in `src/lib/chat/tools.ts` give the AI access to metal prices and user data.
- **Metal Prices** — Primary: gold-api.com. Fallback: CDN currency APIs + hardcoded rates. 10-minute in-memory cache. Route at `src/app/api/metals/route.ts`.

### Key Directories

- `src/app/` — Next.js App Router pages and API route handlers
- `src/components/calculator/` — 10-step zakat calculator wizard and its step components
- `src/components/ui/` — shadcn/ui components + custom UI in `ui/custom/`
- `src/hooks/` — Custom hooks for localStorage, metal prices, geolocation, prayer times, Quran audio, chat, etc.
- `src/lib/` — Core business logic (zakat calculation engine, prayer time calc, hijri utils, qibla utils, i18n translations)
- `src/types/` — TypeScript type definitions (zakat.ts, chat.ts)

### Core Business Logic

- **Zakat calculator** (`src/lib/zakat-calculator.ts`) — supports cash, gold (4 karats), silver, investments, crypto, business assets, property income, loans. Multi-madhab (Hanafi/Shafi'i/Maliki/Hanbali). Nisab based on gold (87.48g) or silver (612.36g). Includes Zakat al-Fitr and Ushr (agricultural).
- **Constants** (`src/lib/constants.ts`) — Nisab values, country list, step labels.

### Internationalization

7 languages: English, Bengali, Urdu, Arabic, Turkish, Malay, Indonesian. Translations live in `src/lib/form-translations.ts` and `src/lib/islamic-content.ts`. Country-to-language mapping in `src/lib/islamic-content.ts` (COUNTRY_TO_LANG).

### State Management

No external state library. Uses React Context (AuthProvider), custom hooks, and `useLocalStorage` for client-side persistence. Server Components by default; client components marked with `"use client"`.

### Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase client
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase server-side
- `OPENROUTER_API_KEY` — AI assistant

### PWA

Service worker at `public/sw.js` with cache versioning. Manifest at `public/manifest.json`. The `scripts/bump-sw.js` script updates the cache version on each build.

### Path Alias

`@/*` maps to `./src/*` (configured in tsconfig.json).
