# IhsanWealth — Islamic Companion App

A full-stack Islamic companion web app built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS 4**. Designed for Muslims worldwide to manage Zakat, track worship, and access Islamic knowledge — all in one place.

> **Live:** [ihsanwealth.onrender.com](https://ihsanwealth.onrender.com)

<a href="https://www.producthunt.com/products/ihsanwealth/reviews/new?utm_source=badge-product_review&utm_medium=badge&utm_source=badge-ihsanwealth" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/product_review.svg?product_id=1182437&theme=dark" alt="IhsanWealth - IslamicTech&#0044;&#0032;Muslim&#0044;&#0032;Zakat | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

---

## Features

### Zakat Calculator
- 10-step guided wizard covering all major asset categories (cash, gold, silver, stocks, crypto, business, property, agricultural)
- Multi-madhab support: Hanafi, Shafi'i, Maliki, Hanbali
- Nisab based on gold (87.48g) or silver (612.36g)
- Includes Zakat al-Fitr and Ushr (agricultural zakat)
- Live gold & silver prices fetched from gold-api.com
- Save and track calculations via Supabase (authenticated users)

### IhsanAI — AI Assistant
- Powered by LangChain + OpenRouter (stepfun/step-3.5-flash)
- Four modes: Islamic Q&A, Asset Categorization Guide, Dua Finder, Zakat Distribution Planner
- Greets with Assalamu Alaikum — strictly Islamic etiquette
- Accesses live metal prices and user data (zakat history, sadaqah, salat records)
- Streaming SSE responses with tool-calling support

### Salat (Prayer) Tracker
- Track all 5 daily fard prayers + sunnah, nafl, and special prayers
- Mark as prayed, missed, late, or qaza (makeup)
- Streak tracking, jamaah toggle, on-time stats
- Jummah auto-detection on Fridays; Eid prayers on 1 Shawwal & 10 Dhul Hijjah
- Weekly heatmap, monthly calendar, yearly reports

### Ramadan Tracker
- Auto-activates during Hijri month 9
- Track fasting, taraweeh, Quran pages, sadaqah, i'tikaf, and Laylatul Qadr worship

### Sadaqah Tracker
- Log voluntary charity by category and amount
- View totals and history by category

### Tasbih Counter
- Digital dhikr counter for SubhanAllah, Alhamdulillah, Allahu Akbar, and more
- Sessions saved to database for logged-in users

### Additional Features
- **Prayer Times** — calculated times for current location
- **Qibla Direction** — compass-based Qibla finder
- **Hijri Calendar** — accurate Hijri date conversion
- **Hadith of the Day** — 15 curated authentic hadiths (Bukhari, Muslim, and others)
- **Dua Collection** — categorized duas with Arabic, transliteration, and translation
- **Quran Audio** — listen to Quran recitations
- **PWA** — installable, offline-capable with service worker caching

### Internationalization
7 languages: English, Bengali, Urdu, Arabic, Turkish, Malay, Indonesian

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4, shadcn/ui |
| Language | TypeScript (strict) |
| Auth & DB | Supabase (email/password, PostgreSQL) |
| AI | LangChain + OpenRouter |
| Metal Prices | gold-api.com + Swissquote fallback |
| PWA | Custom service worker |

---

## Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project
- An [OpenRouter](https://openrouter.ai) API key

### Installation

```bash
git clone https://github.com/your-username/zakat-calculator.git
cd zakat-calculator
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

### Database Setup

Apply the Supabase migrations:

```bash
npx supabase db push
```

Or run migration files manually from `supabase/migrations/`.

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Scripts

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Bump service worker version + Next.js production build
npm run lint     # Run ESLint
npm start        # Start production server
```

> The build script runs `scripts/bump-sw.js` before `next build` to stamp `public/sw.js` with a unique cache-busting timestamp.

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── api/chat/           # AI assistant streaming endpoint
│   ├── api/metals/         # Live gold/silver price API
│   └── assistant/          # AI assistant page
├── components/
│   ├── calculator/         # 10-step Zakat calculator wizard
│   ├── chat/               # IhsanAI chat UI components
│   └── ui/                 # shadcn/ui + custom UI components
├── hooks/                  # Custom React hooks (metal prices, chat, prayer times, etc.)
├── lib/
│   ├── chat/               # AI system prompt, tools, constants
│   ├── zakat-calculator.ts # Core Zakat calculation engine
│   ├── constants.ts        # Nisab values, country list
│   └── form-translations.ts# i18n translations
├── types/                  # TypeScript type definitions
└── supabase/migrations/    # Database schema migrations
```

---

## API Routes

| Route | Description |
|---|---|
| `POST /api/chat` | Streaming AI assistant (SSE) |
| `GET /api/metals?currency=BDT` | Live gold & silver prices |

---

## Deployment

The app is deployed on [Render](https://render.com). Any standard Node.js host supporting Next.js works.

```bash
npm run build
npm start
```

Set all environment variables from `.env.local` in your hosting dashboard.

---

## License

MIT
