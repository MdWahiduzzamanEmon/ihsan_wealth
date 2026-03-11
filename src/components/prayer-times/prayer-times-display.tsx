"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Settings2,
  Calendar,
  Clock,
  Loader2,
} from "lucide-react";
import { staggerContainer, fadeIn, slideUp } from "@/lib/animations";
import { CALCULATION_METHODS } from "@/lib/prayer-times-calc";
import { approximateHijriDate } from "@/lib/prayer-times-calc";
import { PrayerCard } from "@/components/prayer-times/prayer-card";
import { AnimatedPattern } from "@/components/ui/animated-pattern";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PrayerTimesState, PrayerName } from "@/hooks/use-prayer-times";
import { useReverseGeocode } from "@/hooks/use-reverse-geocode";

const MAIN_PRAYERS: PrayerName[] = [
  "fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha",
];

interface PrayerTimesDisplayProps {
  state: PrayerTimesState;
}

export function PrayerTimesDisplay({ state }: PrayerTimesDisplayProps) {
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

  const locationName = useReverseGeocode(latitude, longitude);

  const now = new Date();
  const gregorian = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const hijri = approximateHijriDate(now);

  if (isLoading) {
    return (
      <motion.div
        variants={fadeIn}
        initial="initial"
        animate="animate"
        className="flex flex-col items-center justify-center gap-4 py-20"
      >
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <p className="text-sm text-gray-500">Detecting your location...</p>
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
          {/* Animated Islamic pattern overlay */}
          <AnimatedPattern opacity={0.06} color="emerald" density="dense" />

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-emerald-200">
                Next Prayer
              </p>
              <p className="mt-1 text-2xl font-bold capitalize">
                {nextPrayer}
              </p>
              <p className="text-sm text-emerald-200">{prayerTimes[nextPrayer]}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 text-amber-300">
                <Clock className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wider">Time Remaining</span>
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
          <span>Method:</span>
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
          <span>Asr:</span>
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
            Standard
          </button>
          <button
            onClick={() => setAsrJuristic("hanafi")}
            className={`px-3 py-1.5 transition-colors ${
              asrJuristic === "hanafi"
                ? "bg-emerald-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Hanafi
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
              />
            ))}
          </motion.div>

          {/* Tahajjud - separate, de-emphasized */}
          <div className="mt-2 rounded-xl border border-dashed border-violet-200 bg-violet-50/30 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-violet-600">Tahajjud (Last third of night)</span>
                <span className="font-arabic text-xs text-violet-400">التهجد</span>
              </div>
              <span className="font-mono text-sm font-semibold text-violet-700">{prayerTimes.tahajjud}</span>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
