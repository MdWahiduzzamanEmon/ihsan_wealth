import { NextRequest, NextResponse } from "next/server";

const GRAMS_PER_OUNCE = 31.1035;

// Cache prices for 10 minutes (live prices update frequently)
let cachedPrices: Record<string, { data: unknown; timestamp: number }> = {};
const CACHE_DURATION = 600000; // 10 minutes

async function fetchExchangeRate(currency: string): Promise<number> {
  if (currency === "USD") return 1;
  try {
    const res = await fetch(
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    return data.usd?.[currency.toLowerCase()] || 1;
  } catch {
    return 1;
  }
}

interface SwissquotePrice {
  spreadProfilePrices: Array<{
    bid: number;
    ask: number;
  }>;
}

async function fetchMetalPricesUSD(): Promise<{
  goldPricePerOunce: number;
  silverPricePerOunce: number;
  live: boolean;
}> {
  // Source: Swissquote live forex feed (free, no API key, real-time)
  try {
    const [goldRes, silverRes] = await Promise.all([
      fetch("https://forex-data-feed.swissquote.com/public-quotes/bboquotes/instrument/XAU/USD", {
        next: { revalidate: 300 },
      }),
      fetch("https://forex-data-feed.swissquote.com/public-quotes/bboquotes/instrument/XAG/USD", {
        next: { revalidate: 300 },
      }),
    ]);

    if (goldRes.ok && silverRes.ok) {
      const goldData: SwissquotePrice[] = await goldRes.json();
      const silverData: SwissquotePrice[] = await silverRes.json();

      // Use the first entry's first spread profile, average of bid/ask
      const goldBid = goldData[0]?.spreadProfilePrices[0]?.bid;
      const goldAsk = goldData[0]?.spreadProfilePrices[0]?.ask;
      const silverBid = silverData[0]?.spreadProfilePrices[0]?.bid;
      const silverAsk = silverData[0]?.spreadProfilePrices[0]?.ask;

      if (goldBid && goldAsk && silverBid && silverAsk) {
        return {
          goldPricePerOunce: (goldBid + goldAsk) / 2,
          silverPricePerOunce: (silverBid + silverAsk) / 2,
          live: true,
        };
      }
    }
  } catch {
    // fallback
  }

  // Fallback: hardcoded recent prices (updated March 2026)
  return {
    goldPricePerOunce: 5180,
    silverPricePerOunce: 87,
    live: false,
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
    };

    cachedPrices[cacheKey] = { data: result, timestamp: Date.now() };

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      {
        goldPricePerOunce: 5180,
        silverPricePerOunce: 87,
        goldPricePerGram: 5180 / GRAMS_PER_OUNCE,
        silverPricePerGram: 87 / GRAMS_PER_OUNCE,
        currency: cacheKey,
        timestamp: new Date().toISOString(),
        live: false,
      },
      { status: 200 }
    );
  }
}
