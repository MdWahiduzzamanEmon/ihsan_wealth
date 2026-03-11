"use client";

import { useState, useEffect } from "react";
import { COUNTRIES, TIMEZONE_TO_COUNTRY } from "@/lib/constants";

export interface GeoResult {
  detectedCountry: string | null;
  detectedCurrency: string | null;
  loading: boolean;
}

export function useGeolocation(): GeoResult {
  const [result, setResult] = useState<GeoResult>({
    detectedCountry: null,
    detectedCurrency: null,
    loading: true,
  });

  useEffect(() => {
    async function detect() {
      let countryCode: string | null = null;

      // Method 1: Try server-side IP geolocation
      try {
        const res = await fetch("/api/geolocation");
        if (res.ok) {
          const data = await res.json();
          if (data.countryCode) {
            // Check if we support this country
            const supported = COUNTRIES.find((c) => c.code === data.countryCode);
            if (supported) {
              countryCode = data.countryCode;
            }
          }
        }
      } catch {
        // fallback to timezone
      }

      // Method 2: Fallback to timezone detection
      if (!countryCode) {
        try {
          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          const fromTz = TIMEZONE_TO_COUNTRY[timezone];
          if (fromTz) {
            const supported = COUNTRIES.find((c) => c.code === fromTz);
            if (supported) {
              countryCode = fromTz;
            }
          }
        } catch {
          // ignore
        }
      }

      const country = countryCode
        ? COUNTRIES.find((c) => c.code === countryCode)
        : null;

      setResult({
        detectedCountry: countryCode,
        detectedCurrency: country?.currency || null,
        loading: false,
      });
    }

    detect();
  }, []);

  return result;
}
