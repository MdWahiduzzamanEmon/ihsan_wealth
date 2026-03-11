"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  calculatePrayerTimes,
  parseTimeToMinutes,
  type PrayerTimes,
} from "@/lib/prayer-times-calc";

export type PrayerName = "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha" | "tahajjud";

/** The six main prayers in chronological daytime order (tahajjud handled separately) */
const MAIN_PRAYER_ORDER: PrayerName[] = [
  "fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha",
];

export interface PrayerTimesState {
  prayerTimes: PrayerTimes | null;
  currentPrayer: PrayerName | null;
  nextPrayer: PrayerName | null;
  countdown: string;
  isLoading: boolean;
  error: string | null;
  latitude: number | null;
  longitude: number | null;
  method: string;
  setMethod: (m: string) => void;
  asrJuristic: "standard" | "hanafi";
  setAsrJuristic: (j: "standard" | "hanafi") => void;
}

export function usePrayerTimes(): PrayerTimesState {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [method, setMethod] = useState("MWL");
  const [asrJuristic, setAsrJuristic] = useState<"standard" | "hanafi">("standard");
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [currentPrayer, setCurrentPrayer] = useState<PrayerName | null>(null);
  const [nextPrayer, setNextPrayer] = useState<PrayerName | null>(null);
  const [countdown, setCountdown] = useState("--:--:--");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastDateRef = useRef<string>("");

  // Get browser geolocation
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
      },
      () => {
        // Default to Makkah if denied
        setLatitude(21.4225);
        setLongitude(39.8262);
        setError("Location access denied. Showing times for Makkah.");
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 },
    );
  }, []);

  // Calculate prayer times - extracted so it can be called on date change
  const recalculate = useCallback(() => {
    if (latitude === null || longitude === null) return;

    const now = new Date();
    const dateStr = now.toDateString();

    // Only recalculate if the date has actually changed (or first run)
    if (lastDateRef.current === dateStr) return;
    lastDateRef.current = dateStr;

    const times = calculatePrayerTimes(
      now,
      latitude,
      longitude,
      method,
      asrJuristic,
      "12h",
    );
    setPrayerTimes(times);
    setIsLoading(false);
  }, [latitude, longitude, method, asrJuristic]);

  // Recalculate when inputs change
  useEffect(() => {
    lastDateRef.current = ""; // force recalculation
    recalculate();
  }, [recalculate]);

  // Determine current/next prayer and countdown
  const updateCurrentPrayer = useCallback(() => {
    if (!prayerTimes) return;

    // Check if the date changed (midnight crossing)
    recalculate();

    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

    // Build sorted list of main prayers with their times in minutes
    const prayerMinutes = MAIN_PRAYER_ORDER.map((name) => ({
      name,
      minutes: parseTimeToMinutes(prayerTimes[name]),
    }));

    const fajrMinutes = prayerMinutes[0].minutes;

    let current: PrayerName | null = null;
    let next: PrayerName | null = null;

    // Before Fajr (early morning hours, 0:00 - Fajr)
    if (nowMinutes < fajrMinutes) {
      current = "isha"; // still in last night's isha period
      next = "fajr";
    } else {
      // Daytime: iterate backwards through main prayers
      for (let i = prayerMinutes.length - 1; i >= 0; i--) {
        if (nowMinutes >= prayerMinutes[i].minutes) {
          current = prayerMinutes[i].name;
          if (i < prayerMinutes.length - 1) {
            next = prayerMinutes[i + 1].name;
          } else {
            // After isha: next is fajr (tomorrow)
            next = "fajr";
          }
          break;
        }
      }
    }

    setCurrentPrayer(current);
    setNextPrayer(next);

    // Countdown to next prayer
    if (next) {
      let nextMin = parseTimeToMinutes(prayerTimes[next]);
      const nowExact = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

      if (nextMin <= nowExact) {
        nextMin += 24 * 60; // next day
      }
      const diffSec = Math.round((nextMin - nowExact) * 60);
      const h = Math.floor(diffSec / 3600);
      const m = Math.floor((diffSec % 3600) / 60);
      const s = diffSec % 60;
      setCountdown(
        `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${Math.max(0, s).toString().padStart(2, "0")}`,
      );
    }
  }, [prayerTimes, recalculate]);

  useEffect(() => {
    updateCurrentPrayer();
    intervalRef.current = setInterval(updateCurrentPrayer, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [updateCurrentPrayer]);

  return {
    prayerTimes,
    currentPrayer,
    nextPrayer,
    countdown,
    isLoading,
    error,
    latitude,
    longitude,
    method,
    setMethod,
    asrJuristic,
    setAsrJuristic,
  };
}
