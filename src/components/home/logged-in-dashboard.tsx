"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calculator, Flame, Star, CalendarDays, TrendingUp, BookOpen, ChevronRight } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useSalatTracker } from "@/hooks/use-salat-tracker";
import { DEFAULT_FORM_DATA, type ZakatFormData } from "@/types/zakat";
import { gregorianToHijri, getHijriMonthName, getHijriAdjustment } from "@/lib/hijri-utils";
import { fadeIn, staggerContainer, staggerItem } from "@/lib/animations";
import type { TransLang } from "@/lib/islamic-content";

const DASH_TEXTS: Record<TransLang, {
  greeting: string;
  continueCalc: string;
  hijriToday: string;
  prayerStreak: string;
  completionRate: string;
  daysTracked: string;
  days: string;
  exploreDuas: string;
}> = {
  en: {
    greeting: "Assalamu Alaikum",
    continueCalc: "Continue Calculator",
    hijriToday: "Today",
    prayerStreak: "Prayer Streak",
    completionRate: "Completion",
    daysTracked: "Total Fard",
    days: "days",
    exploreDuas: "Explore Duas",
  },
  bn: {
    greeting: "আসসালামু আলাইকুম",
    continueCalc: "ক্যালকুলেটর",
    hijriToday: "আজ",
    prayerStreak: "নামায ধারা",
    completionRate: "সম্পূর্ণতা",
    daysTracked: "মোট ফরয",
    days: "দিন",
    exploreDuas: "দু'আ দেখুন",
  },
  ur: {
    greeting: "السلام علیکم",
    continueCalc: "کیلکولیٹر",
    hijriToday: "آج",
    prayerStreak: "نماز تسلسل",
    completionRate: "تکمیل",
    daysTracked: "کل فرض",
    days: "دن",
    exploreDuas: "دعائیں دیکھیں",
  },
  ar: {
    greeting: "السلام عليكم",
    continueCalc: "حاسبة الزكاة",
    hijriToday: "اليوم",
    prayerStreak: "تسلسل الصلاة",
    completionRate: "الإتمام",
    daysTracked: "إجمالي الفرض",
    days: "أيام",
    exploreDuas: "استكشف الأدعية",
  },
  tr: {
    greeting: "Selamun Aleyküm",
    continueCalc: "Hesaplayıcı",
    hijriToday: "Bugün",
    prayerStreak: "Namaz Serisi",
    completionRate: "Tamamlanma",
    daysTracked: "Toplam Farz",
    days: "gün",
    exploreDuas: "Duaları Keşfet",
  },
  ms: {
    greeting: "Assalamualaikum",
    continueCalc: "Kalkulator",
    hijriToday: "Hari Ini",
    prayerStreak: "Rangkaian Solat",
    completionRate: "Penyempurnaan",
    daysTracked: "Jumlah Fardhu",
    days: "hari",
    exploreDuas: "Teroka Doa",
  },
  id: {
    greeting: "Assalamu'alaikum",
    continueCalc: "Kalkulator",
    hijriToday: "Hari Ini",
    prayerStreak: "Rangkaian Shalat",
    completionRate: "Penyelesaian",
    daysTracked: "Total Fardhu",
    days: "hari",
    exploreDuas: "Jelajahi Doa",
  },
};

interface LoggedInDashboardProps {
  lang: TransLang;
  countryCode: string;
}

export function LoggedInDashboard({ lang, countryCode }: LoggedInDashboardProps) {
  const { isAuthenticated, user } = useAuth();
  const [formData] = useLocalStorage<ZakatFormData>("zakat-calculator-data", DEFAULT_FORM_DATA);
  const isRTL = lang === "ar" || lang === "ur";
  const tracker = useSalatTracker(countryCode);

  if (!isAuthenticated) return null;

  const t = DASH_TEXTS[lang];
  const hijri = gregorianToHijri(new Date(), getHijriAdjustment(countryCode));
  const hijriMonth = getHijriMonthName(hijri.month);
  const displayName = user?.user_metadata?.name || user?.email?.split("@")[0] || "";
  const hasFormData = formData.country !== DEFAULT_FORM_DATA.country || formData.cashOnHand > 0;

  const { stats } = tracker;

  return (
    <motion.section
      className="mx-auto max-w-5xl px-4 py-2"
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      dir={isRTL ? "rtl" : undefined}
    >
      <div className="rounded-2xl border border-emerald-100 bg-white overflow-hidden shadow-sm">
        {/* Greeting Header */}
        <div className="relative bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 px-4 sm:px-5 py-3.5">
          {/* Geometric pattern */}
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dash-pat" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M20 0L40 20L20 40L0 20Z" fill="none" stroke="white" strokeWidth="0.5" />
                  <circle cx="20" cy="20" r="6" fill="none" stroke="white" strokeWidth="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dash-pat)" />
            </svg>
          </div>

          <div className="relative flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white">
                {t.greeting}{displayName ? `, ${displayName}` : ""}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <CalendarDays className="h-3 w-3 text-emerald-400/70" />
                <p className="text-[10px] text-emerald-300/60">
                  {t.hijriToday}: {hijri.day} {hijriMonth.english} {hijri.year} AH
                </p>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-2">
              {hasFormData && (
                <Link
                  href="/calculator"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/15 px-2.5 py-1.5 text-[10px] font-medium text-white transition-colors"
                >
                  <Calculator className="h-3 w-3" />
                  <span className="hidden sm:inline">{t.continueCalc}</span>
                  <ChevronRight className="h-2.5 w-2.5 sm:hidden" />
                </Link>
              )}
              <Link
                href="/duas"
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400/15 hover:bg-amber-400/25 px-2.5 py-1.5 text-[10px] font-medium text-amber-300 transition-colors"
              >
                <BookOpen className="h-3 w-3" />
                <span className="hidden sm:inline">{t.exploreDuas}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <motion.div variants={staggerItem} className="grid grid-cols-3 divide-x divide-gray-100">
          <div className="flex flex-col items-center py-3 px-2">
            <div className="flex items-center gap-1 mb-0.5">
              <Flame className="h-3.5 w-3.5 text-orange-500" />
              <span className="text-lg font-bold text-gray-900">{stats.currentStreak}</span>
            </div>
            <span className="text-[9px] text-gray-400 text-center">{t.prayerStreak}</span>
          </div>
          <div className="flex flex-col items-center py-3 px-2">
            <div className="flex items-center gap-1 mb-0.5">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-lg font-bold text-gray-900">{stats.completionRate}%</span>
            </div>
            <span className="text-[9px] text-gray-400 text-center">{t.completionRate}</span>
          </div>
          <div className="flex flex-col items-center py-3 px-2">
            <div className="flex items-center gap-1 mb-0.5">
              <Star className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-lg font-bold text-gray-900">{stats.totalFardPrayed}</span>
            </div>
            <span className="text-[9px] text-gray-400 text-center">{t.daysTracked}</span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
