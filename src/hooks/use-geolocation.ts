"use client";

import { useState, useEffect } from "react";
import { COUNTRIES } from "@/lib/constants";

const TIMEZONE_TO_COUNTRY: Record<string, string> = {
  "Asia/Dhaka": "BD",
  "Asia/Karachi": "PK",
  "Asia/Kolkata": "IN",
  "Asia/Calcutta": "IN",
  "Asia/Riyadh": "SA",
  "Asia/Dubai": "AE",
  "Asia/Kuwait": "KW",
  "Asia/Qatar": "QA",
  "Asia/Bahrain": "BH",
  "Asia/Muscat": "OM",
  "Asia/Amman": "JO",
  "Asia/Kuala_Lumpur": "MY",
  "Asia/Jakarta": "ID",
  "Europe/Istanbul": "TR",
  "Africa/Cairo": "EG",
  "Africa/Lagos": "NG",
  "Europe/London": "GB",
  "America/New_York": "US",
  "America/Chicago": "US",
  "America/Denver": "US",
  "America/Los_Angeles": "US",
  "America/Toronto": "CA",
  "America/Vancouver": "CA",
  "Australia/Sydney": "AU",
  "Australia/Melbourne": "AU",
  "Europe/Berlin": "EU",
  "Europe/Paris": "EU",
  "Europe/Amsterdam": "EU",
  "Europe/Rome": "EU",
  "Europe/Madrid": "EU",
};

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
