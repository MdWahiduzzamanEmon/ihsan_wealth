"use client";
import { useState, useEffect, useCallback, useRef } from "react";

export interface MetalPrices {
  goldPricePerGram: number;
  silverPricePerGram: number;
  goldPricePerOunce: number;
  silverPricePerOunce: number;
  goldPricePerTola: number;
  silverPricePerTola: number;
  timestamp: string;
  live: boolean;
  currency: string;
}

const GRAMS_PER_TOLA = 11.6638;
const GRAMS_PER_OUNCE = 31.1035;

// Hardcoded fallback prices (approximate, updated March 2026)
function getFallbackPrices(currency: string): MetalPrices {
  // USD base prices
  const goldOz = 2650;
  const silverOz = 31;
  return {
    goldPricePerOunce: goldOz,
    silverPricePerOunce: silverOz,
    goldPricePerGram: goldOz / GRAMS_PER_OUNCE,
    silverPricePerGram: silverOz / GRAMS_PER_OUNCE,
    goldPricePerTola: (goldOz / GRAMS_PER_OUNCE) * GRAMS_PER_TOLA,
    silverPricePerTola: (silverOz / GRAMS_PER_OUNCE) * GRAMS_PER_TOLA,
    timestamp: new Date().toISOString(),
    live: false,
    currency,
  };
}

export function useMetalPrices(currency: string) {
  const [prices, setPrices] = useState<MetalPrices | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const retryCount = useRef(0);
  const maxRetries = 2;

  const fetchPrices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/metals?currency=${currency}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setPrices({
        ...data,
        goldPricePerTola: data.goldPricePerGram * GRAMS_PER_TOLA,
        silverPricePerTola: data.silverPricePerGram * GRAMS_PER_TOLA,
      });
      retryCount.current = 0;
    } catch {
      // Use fallback prices so the calculator still works
      setError("Live prices unavailable. Using estimated prices.");
      setPrices((prev) => prev || getFallbackPrices(currency));
      retryCount.current += 1;
    } finally {
      setLoading(false);
    }
  }, [currency]);

  // Initial fetch + refetch on currency change
  useEffect(() => {
    retryCount.current = 0;
    fetchPrices();
  }, [fetchPrices]);

  // Auto-refresh every 5 minutes, but stop if too many failures
  useEffect(() => {
    const interval = setInterval(() => {
      if (retryCount.current < maxRetries) {
        fetchPrices();
      }
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  return { prices, loading, error, refetch: fetchPrices };
}
