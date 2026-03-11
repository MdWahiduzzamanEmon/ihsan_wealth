"use client";

import { useState, useEffect } from "react";

/**
 * Reverse geocodes lat/lon into a human-readable location name.
 * Uses OpenStreetMap Nominatim (free, no API key needed).
 * Returns null while loading or if geocoding fails — caller can
 * fall back to raw coordinates.
 */
export function useReverseGeocode(
  latitude: number | null,
  longitude: number | null
): string | null {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    if (latitude === null || longitude === null) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=10&accept-language=en`,
          { headers: { "User-Agent": "IhsanWealth/1.0" } }
        );
        if (!res.ok || cancelled) return;
        const data = await res.json();
        const addr = data.address;
        if (!addr || cancelled) return;

        const city =
          addr.city ||
          addr.town ||
          addr.village ||
          addr.county ||
          addr.state_district ||
          "";
        const state = addr.state || "";
        const country = addr.country || "";

        if (city && country) setName(`${city}, ${country}`);
        else if (state && country) setName(`${state}, ${country}`);
        else if (country) setName(country);
      } catch {
        // Silently fail — caller will show coordinates as fallback
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [latitude, longitude]);

  return name;
}
