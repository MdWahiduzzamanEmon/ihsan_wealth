"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { usePrayerTimes } from "@/hooks/use-prayer-times";
import { useReverseGeocode } from "@/hooks/use-reverse-geocode";
import { PRAYER_PAGE_TEXTS } from "@/lib/islamic-content";
import { isFriday } from "@/lib/hijri-utils";
import type { TransLang } from "@/lib/islamic-content";

const PRAYER_ARABIC: Record<string, string> = {
  fajr: "الفجر",
  sunrise: "الشروق",
  dhuhr: "الظهر",
  jummah: "الجمعة",
  asr: "العصر",
  maghrib: "المغرب",
  isha: "العشاء",
};

interface CurrentPrayerWidgetProps {
  lang: TransLang;
}

export function CurrentPrayerWidget({ lang }: CurrentPrayerWidgetProps) {
  const state = usePrayerTimes();
  const { prayerTimes, currentPrayer, latitude, longitude, isLoading } = state;
  const locationName = useReverseGeocode(latitude, longitude);
  const t = PRAYER_PAGE_TEXTS[lang];

  if (isLoading || !currentPrayer || !prayerTimes) return null;

  // On Friday, display "jummah" instead of "dhuhr"
  const displayPrayer = currentPrayer === "dhuhr" && isFriday() ? "jummah" : currentPrayer;

  return (
    <section className="mx-auto max-w-5xl px-0 py-2">
      <Link href="/prayer-times" className="block group" prefetch>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 p-4 sm:p-5 text-white shadow-lg shadow-emerald-900/15 transition-shadow group-hover:shadow-xl">
          {/* Islamic pattern */}
          <div className="absolute inset-0 opacity-[0.06]">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="np-pat" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
                  <path d="M24 0L48 24L24 48L0 24Z" fill="none" stroke="white" strokeWidth="0.5" />
                  <circle cx="24" cy="24" r="10" fill="none" stroke="white" strokeWidth="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#np-pat)" />
            </svg>
          </div>

          <div className="relative flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-widest text-emerald-300/80">
                {t.currentPrayer}
              </p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <p className="text-xl sm:text-2xl font-bold capitalize">{displayPrayer}</p>
                <span className="font-arabic text-sm text-amber-300/70">{PRAYER_ARABIC[displayPrayer] || ""}</span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-emerald-200">{prayerTimes[currentPrayer]}</span>
                {locationName && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-300/60">
                    <MapPin className="h-2.5 w-2.5" />
                    {locationName}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right shrink-0">
              <p className="text-[10px] font-medium uppercase tracking-widest text-amber-300/60">
                {t.nextPrayer} →
              </p>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
