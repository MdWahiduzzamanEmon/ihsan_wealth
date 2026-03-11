import { NextRequest, NextResponse } from "next/server";

const GRAMS_PER_OUNCE = 31.1035;

// Cache prices for 10 minutes
let cachedPrices: Record<string, { data: unknown; timestamp: number }> = {};
const CACHE_DURATION = 600000; // 10 minutes

async function fetchExchangeRate(currency: string): Promise<number> {
  if (currency === "USD") return 1;
  const lower = currency.toLowerCase();

  const urls = [
    `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json`,
    `https://latest.currency-api.pages.dev/v1/currencies/usd.json`,
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) continue;
      const data = await res.json();
      const rate = data.usd?.[lower];
      if (rate && rate > 0) return rate;
    } catch {
      continue;
    }
  }

  // Hardcoded fallback rates
  const fallbackRates: Record<string, number> = {
    bdt: 121, eur: 0.92, gbp: 0.79, inr: 84, pkr: 285,
    sar: 3.75, aed: 3.67, try: 32, myr: 4.7, idr: 15800,
    aud: 1.53, cad: 1.36, ngn: 1550, kwd: 0.31, qar: 3.64,
    bhd: 0.38, omr: 0.39, jod: 0.71, egp: 49,
  };
  return fallbackRates[lower] || 1;
}

interface MetalResult {
  goldPricePerOunce: number;
  silverPricePerOunce: number;
  live: boolean;
  source: string;
}

// Source 1: gold-api.com (free, no key, works from cloud servers)
async function fetchFromGoldApi(): Promise<MetalResult | null> {
  try {
    const [goldRes, silverRes] = await Promise.all([
      fetch("https://api.gold-api.com/price/XAU", {
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(8000),
      }),
      fetch("https://api.gold-api.com/price/XAG", {
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(8000),
      }),
    ]);

    if (!goldRes.ok || !silverRes.ok) return null;

    const goldData = await goldRes.json();
    const silverData = await silverRes.json();

    if (goldData?.price && silverData?.price) {
      return {
        goldPricePerOunce: goldData.price,
        silverPricePerOunce: silverData.price,
        live: true,
        source: "gold-api.com",
      };
    }
  } catch {
    // failed
  }
  return null;
}

// Source 2: Swissquote (real-time, may block datacenter IPs)
async function fetchFromSwissquote(): Promise<MetalResult | null> {
  try {
    const [goldRes, silverRes] = await Promise.all([
      fetch("https://forex-data-feed.swissquote.com/public-quotes/bboquotes/instrument/XAU/USD", {
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(6000),
      }),
      fetch("https://forex-data-feed.swissquote.com/public-quotes/bboquotes/instrument/XAG/USD", {
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(6000),
      }),
    ]);

    if (!goldRes.ok || !silverRes.ok) return null;

    const goldData = await goldRes.json();
    const silverData = await silverRes.json();

    const goldBid = goldData[0]?.spreadProfilePrices?.[0]?.bid;
    const goldAsk = goldData[0]?.spreadProfilePrices?.[0]?.ask;
    const silverBid = silverData[0]?.spreadProfilePrices?.[0]?.bid;
    const silverAsk = silverData[0]?.spreadProfilePrices?.[0]?.ask;

    if (goldBid && goldAsk && silverBid && silverAsk) {
      return {
        goldPricePerOunce: (goldBid + goldAsk) / 2,
        silverPricePerOunce: (silverBid + silverAsk) / 2,
        live: true,
        source: "Swissquote",
      };
    }
  } catch {
    // blocked or timeout
  }
  return null;
}

async function fetchMetalPricesUSD(): Promise<MetalResult> {
  // Try gold-api.com first (works reliably from cloud), then Swissquote
  const sources = [fetchFromGoldApi, fetchFromSwissquote];

  for (const fetchFn of sources) {
    const result = await fetchFn();
    if (result) return result;
  }

  // All sources failed - use hardcoded fallback
  return {
    goldPricePerOunce: 2650,
    silverPricePerOunce: 31,
    live: false,
    source: "fallback",
  };
}

export async function GET(request: NextRequest) {
  const currency = request.nextUrl.searchParams.get("currency") || "USD";
  const cacheKey = currency.toUpperCase();

  // Check cache
  if (cachedPrices[cacheKey] && Date.now() - cachedPrices[cacheKey].timestamp < CACHE_DURATION) {
    return NextResponse.json(cachedPrices[cacheKey].data);
  }

  try {
    const [metalPricesUSD, exchangeRate] = await Promise.all([
      fetchMetalPricesUSD(),
      fetchExchangeRate(currency),
    ]);

    const goldPerOunce = metalPricesUSD.goldPricePerOunce * exchangeRate;
    const silverPerOunce = metalPricesUSD.silverPricePerOunce * exchangeRate;

    const result = {
      goldPricePerOunce: goldPerOunce,
      silverPricePerOunce: silverPerOunce,
      goldPricePerGram: goldPerOunce / GRAMS_PER_OUNCE,
      silverPricePerGram: silverPerOunce / GRAMS_PER_OUNCE,
      currency: cacheKey,
      timestamp: new Date().toISOString(),
      live: metalPricesUSD.live,
      source: metalPricesUSD.source,
    };

    cachedPrices[cacheKey] = { data: result, timestamp: Date.now() };

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      {
        goldPricePerOunce: 2650,
        silverPricePerOunce: 31,
        goldPricePerGram: 2650 / GRAMS_PER_OUNCE,
        silverPricePerGram: 31 / GRAMS_PER_OUNCE,
        currency: cacheKey,
        timestamp: new Date().toISOString(),
        live: false,
        source: "fallback",
      },
      { status: 200 }
    );
  }
}
