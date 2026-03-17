"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  Settings2,
  Calendar,
  Clock,
  Loader2,
  GraduationCap,
} from "lucide-react";
import { staggerContainer, fadeIn, slideUp } from "@/lib/animations";
import { CALCULATION_METHODS } from "@/lib/prayer-times-calc";
import { formatHijriDateArabic, isFriday } from "@/lib/hijri-utils";
import { PrayerCard } from "@/components/prayer-times/prayer-card";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { DEFAULT_FORM_DATA, type ZakatFormData } from "@/types/zakat";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PrayerTimesState, PrayerName } from "@/hooks/use-prayer-times";
import { useReverseGeocode } from "@/hooks/use-reverse-geocode";
import type { PRAYER_PAGE_TEXTS } from "@/lib/islamic-content";
import type { TransLang } from "@/lib/islamic-content";

const MAIN_PRAYERS: PrayerName[] = [
  "fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha",
];

interface PrayerTimesDisplayProps {
  state: PrayerTimesState;
  t: (typeof PRAYER_PAGE_TEXTS)[keyof typeof PRAYER_PAGE_TEXTS];
  lang: TransLang;
}

export function PrayerTimesDisplay({ state, t, lang }: PrayerTimesDisplayProps) {
  const {
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
  } = state;

  const [formData] = useLocalStorage<ZakatFormData>("zakat-calculator-data", DEFAULT_FORM_DATA);
  const locationName = useReverseGeocode(latitude, longitude);
  const friday = isFriday();

  // On Friday, display "jummah" instead of "dhuhr" for next prayer
  const displayNextPrayer = nextPrayer === "dhuhr" && friday ? "jummah" : nextPrayer;

  const now = new Date();
  const dateLocale = lang === "bn" ? "bn-BD" : lang === "ur" ? "ur-PK" : lang === "ar" ? "ar-SA" : lang === "tr" ? "tr-TR" : lang === "ms" ? "ms-MY" : lang === "id" ? "id-ID" : "en-US";
  const gregorian = now.toLocaleDateString(dateLocale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const hijri = formatHijriDateArabic(now, formData.country);

  if (isLoading) {
    return (
      <motion.div
        variants={fadeIn}
        initial="initial"
        animate="animate"
        className="flex flex-col items-center justify-center gap-4 py-20"
      >
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <p className="text-sm text-gray-500">{t.detectingLocation}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Date & Location Header */}
      <motion.div variants={slideUp} initial="initial" animate="animate" className="space-y-3">
        {/* Date display */}
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="flex items-center gap-2 text-emerald-700">
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-medium">{gregorian}</span>
          </div>
          <span className="font-arabic text-sm text-amber-700/70">{hijri}</span>
        </div>

        {/* Location */}
        {latitude !== null && longitude !== null && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
            <MapPin className="h-3.5 w-3.5 text-emerald-500" />
            <span>{locationName || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`}</span>
          </div>
        )}

        {error && (
          <p className="text-center text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-1.5">
            {error}
          </p>
        )}
      </motion.div>

      {/* Next Prayer Countdown Banner */}
      {nextPrayer && prayerTimes && (
        <motion.div
          variants={slideUp}
          initial="initial"
          animate="animate"
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 p-5 text-white shadow-xl shadow-emerald-900/20"
        >
          {/* Islamic pattern overlay */}
          <div className="absolute inset-0 opacity-5">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="prayer-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M20 0L40 20L20 40L0 20Z" fill="none" stroke="white" strokeWidth="0.5" />
                  <circle cx="20" cy="20" r="8" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#prayer-pattern)" />
            </svg>
          </div>

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-emerald-200">
                {t.nextPrayer}
              </p>
              <p className="mt-1 text-2xl font-bold capitalize">
                {displayNextPrayer}
              </p>
              <p className="text-sm text-emerald-200">{prayerTimes[nextPrayer]}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 text-amber-300">
                <Clock className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wider">{t.timeRemaining}</span>
              </div>
              <p className="mt-1 font-mono text-3xl font-bold tracking-tight text-amber-300">
                {countdown}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Settings Row */}
      <motion.div
        variants={slideUp}
        initial="initial"
        animate="animate"
        className="flex flex-wrap items-center gap-3"
      >
        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
          <Settings2 className="h-3.5 w-3.5" />
          <span>{t.method}</span>
        </div>
        <Select value={method} onValueChange={(v) => v && setMethod(v)}>
          <SelectTrigger className="h-8 text-xs min-w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(CALCULATION_METHODS).map(([key, m]) => (
              <SelectItem key={key} value={key}>
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 ml-auto sm:ml-0">
          <span>{t.asr}</span>
        </div>
        <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs">
          <button
            onClick={() => setAsrJuristic("standard")}
            className={`px-3 py-1.5 transition-colors ${
              asrJuristic === "standard"
                ? "bg-emerald-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {t.standard}
          </button>
          <button
            onClick={() => setAsrJuristic("hanafi")}
            className={`px-3 py-1.5 transition-colors ${
              asrJuristic === "hanafi"
                ? "bg-emerald-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {t.hanafi}
          </button>
        </div>
      </motion.div>

      {/* Prayer Cards Grid */}
      {prayerTimes && (
        <>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid gap-3 sm:grid-cols-2"
          >
            {MAIN_PRAYERS.map((prayer) => (
              <PrayerCard
                key={prayer}
                prayer={prayer}
                time={prayerTimes[prayer]}
                isCurrent={currentPrayer === prayer}
                isNext={nextPrayer === prayer}
                countdown={nextPrayer === prayer ? countdown : undefined}
                currentPrayerLabel={t.currentPrayer}
              />
            ))}
          </motion.div>

          {/* Tahajjud - separate, de-emphasized */}
          <div className="mt-2 rounded-xl border border-dashed border-violet-200 bg-violet-50/30 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-violet-600">{t.tahajjudLabel}</span>
                <span className="font-arabic text-xs text-violet-400">التهجد</span>
              </div>
              <span className="font-mono text-sm font-semibold text-violet-700">{prayerTimes.tahajjud}</span>
            </div>
          </div>

          {/* How to Pray link */}
          <Link href="/how-to-pray" className="block mt-4">
            <div className="rounded-xl border border-orange-200/60 bg-gradient-to-r from-orange-50 to-amber-50 p-4 transition-all hover:shadow-md hover:border-orange-300">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 shadow-sm">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-orange-900">
                    {lang === "bn" ? "নামাজ শিখুন" : lang === "ur" ? "نماز سیکھیں" : lang === "ar" ? "تعلم كيفية الصلاة" : lang === "tr" ? "Namaz Nasıl Kılınır" : lang === "ms" ? "Cara Solat" : lang === "id" ? "Cara Shalat" : "Learn How to Pray"}
                  </p>
                  <p className="text-xs text-orange-700/70">
                    {lang === "bn" ? "ওজু, ৫ ওয়াক্ত নামাজ, জুমা, ঈদ, জানাযা সহ সম্পূর্ণ গাইড" : lang === "ur" ? "وضو، ۵ وقت نماز، جمعہ، عید، جنازہ کی مکمل رہنمائی" : lang === "ar" ? "دليل شامل للوضوء والصلوات الخمس والجمعة والعيد والجنازة" : lang === "tr" ? "Abdest, 5 vakit namaz, Cuma, Bayram, Cenaze rehberi" : lang === "ms" ? "Panduan lengkap Wudu, 5 solat harian, Jumaat, Eid, Jenazah" : lang === "id" ? "Panduan lengkap Wudu, 5 shalat harian, Jumat, Ied, Jenazah" : "Complete guide to Wudu, 5 daily prayers, Jummah, Eid, Janazah & more"}
                  </p>
                </div>
                <span className="text-orange-400 text-lg">&rarr;</span>
              </div>
            </div>
          </Link>
        </>
      )}
    </motion.div>
  );
}
