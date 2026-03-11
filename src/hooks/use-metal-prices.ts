"use client";
import { useState, useEffect, useCallback } from "react";

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

export function useMetalPrices(currency: string) {
  const [prices, setPrices] = useState<MetalPrices | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/metals?currency=${currency}`);
      if (!res.ok) throw new Error("Failed to fetch prices");
      const data = await res.json();
      setPrices({
        ...data,
        goldPricePerTola: data.goldPricePerGram * GRAMS_PER_TOLA,
        silverPricePerTola: data.silverPricePerGram * GRAMS_PER_TOLA,
      });
    } catch {
      setError("Live prices unavailable. Please refresh.");
      // Only set fallback if we have no prices at all
      if (!prices) {
        setPrices(null);
      }
    } finally {
      setLoading(false);
    }
  }, [currency]); // eslint-disable-line react-hooks/exhaustive-deps

  // Initial fetch + refetch on currency change
  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(fetchPrices, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  return { prices, loading, error, refetch: fetchPrices };
}
