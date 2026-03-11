"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Clock } from "lucide-react";
import { AnimatedPattern } from "@/components/ui/animated-pattern";
import { fadeIn, slideUp } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { usePrayerTimes } from "@/hooks/use-prayer-times";
import { PrayerTimesDisplay } from "@/components/prayer-times/prayer-times-display";

export default function PrayerTimesPage() {
  const state = usePrayerTimes();

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50/30 via-white to-amber-50/20">
      {/* Header */}
      <header className="relative overflow-hidden border-b bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900">
        {/* Islamic geometric pattern overlay */}
        <AnimatedPattern color="emerald" opacity={0.1} density="normal" />

        <div className="relative mx-auto max-w-5xl px-4 py-5">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/favicon.svg"
                alt="IhsanWealth"
                width={44}
                height={44}
                className="rounded-xl shadow-lg shadow-emerald-900/50 group-hover:scale-105 transition-transform"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-white group-hover:text-white/90 transition-colors">
                    <span className="text-amber-400">Ihsan</span>Wealth
                  </h1>
                  <span className="font-arabic text-base text-amber-300/60 hidden sm:inline">
                    إحسان الثروة
                  </span>
                </div>
                <p className="text-xs text-emerald-300/70">
                  Prayer Times &mdash; مواقيت الصلاة
                </p>
              </div>
            </Link>

            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-emerald-100 hover:text-white hover:bg-white/10 gap-1.5"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Calculator</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-8">
          {/* Page Title */}
          <motion.div
            variants={slideUp}
            initial="initial"
            animate="animate"
            className="mb-8 text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700 mb-4">
              <Clock className="h-4 w-4" />
              Prayer Times
            </div>
            <h2 className="text-2xl font-bold text-emerald-900 sm:text-3xl">
              Daily Prayer Schedule
            </h2>
            <p className="font-arabic text-lg text-amber-600/60 mt-1">
              مواقيت الصلاة اليومية
            </p>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              Prayer times calculated based on your location using standard astronomical methods.
            </p>
          </motion.div>

          {/* Prayer Times Display */}
          <PrayerTimesDisplay state={state} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-gradient-to-b from-emerald-950 to-emerald-950 px-4 py-8 text-white/80">
        <div className="mx-auto max-w-5xl text-center">
          <p className="font-arabic text-lg text-amber-300/60 mb-2">
            حافظوا على الصلوات والصلاة الوسطى
          </p>
          <p className="text-xs text-emerald-300/50 italic max-w-md mx-auto">
            &ldquo;Guard strictly your prayers, especially the middle prayer.&rdquo;
          </p>
          <p className="text-xs text-emerald-400/40 mt-1">- Surah Al-Baqarah 2:238</p>

          <div className="flex items-center gap-3 my-5">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-700/50 to-transparent" />
            <span className="font-arabic text-amber-400/40 text-sm">&#9770;</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-700/50 to-transparent" />
          </div>

          <p className="text-xs text-emerald-400/30">
            Prayer times are approximate and may vary slightly from local mosque schedules.
            Please verify with your local Islamic authority.
          </p>
        </div>
      </footer>
    </div>
  );
}
