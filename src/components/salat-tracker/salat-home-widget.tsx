"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ClipboardCheck, Flame, ChevronRight, TrendingUp } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useSalatTracker, FARD_PRAYERS, type PrayerName, type PrayerStatus } from "@/hooks/use-salat-tracker";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { SALAT_TRACKER_TEXTS } from "@/lib/salat-tracker-texts";
import { getLangFromCountry, type TransLang } from "@/lib/islamic-content";
import { DEFAULT_FORM_DATA, type ZakatFormData } from "@/types/zakat";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { PrayerCheckCard } from "./prayer-check-card";

export function SalatHomeWidget() {
  const { isAuthenticated } = useAuth();
  const [formData] = useLocalStorage<ZakatFormData>("zakat-calculator-data", DEFAULT_FORM_DATA);
  const lang = getLangFromCountry(formData.country) as TransLang;
  const t = SALAT_TRACKER_TEXTS[lang];
  const isRtl = lang === "ar" || lang === "ur";

  const tracker = useSalatTracker(formData.country);

  if (!isAuthenticated) return null;

  const { stats, selectedDateRecords } = tracker;

  const handleToggleStatus = (prayerName: PrayerName, status: PrayerStatus) => {
    tracker.togglePrayer(prayerName, status);
  };

  const handleToggleJamaah = (prayerName: PrayerName, inJamaah: boolean) => {
    const record = selectedDateRecords.find((r) => r.prayer_name === prayerName);
    if (record) {
      tracker.togglePrayer(prayerName, record.status, {
        in_jamaah: inJamaah,
        on_time: record.on_time,
      });
    }
  };

  const handleRemove = (prayerName: PrayerName) => {
    tracker.removePrayer(prayerName);
  };

  const completionPercent = Math.round((stats.todayFardCompleted / 5) * 100);

  return (
    <motion.section
      className="mx-auto max-w-5xl px-4 py-3"
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      dir={isRtl ? "rtl" : undefined}
    >
      <div className="rounded-2xl border border-emerald-100 bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <Link href="/salat-tracker" className="group flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-900 to-emerald-950">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
              <ClipboardCheck className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-[13px] leading-tight">{t.pageTitle}</h3>
              <p className="text-[9px] text-emerald-400/60">{t.todayProgress}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Progress pill */}
            <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1">
              <div className="h-1.5 w-12 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
              <span className="text-[10px] font-semibold text-emerald-300">{stats.todayFardCompleted}/5</span>
            </div>

            {stats.currentStreak > 0 && (
              <div className="flex items-center gap-1 rounded-full bg-orange-500/20 px-2 py-1">
                <Flame className="h-3 w-3 text-orange-400" />
                <span className="text-[10px] font-bold text-orange-300">{stats.currentStreak}</span>
              </div>
            )}

            <ChevronRight className="h-3.5 w-3.5 text-emerald-400/40 group-hover:text-white transition-colors" />
          </div>
        </Link>

        {/* Prayer cards */}
        <div className="p-3 space-y-1.5">
          {FARD_PRAYERS.map((prayer) => (
            <PrayerCheckCard
              key={prayer}
              prayerName={prayer}
              record={selectedDateRecords.find((r) => r.prayer_name === prayer)}
              t={t}
              onToggleStatus={handleToggleStatus}
              onToggleJamaah={handleToggleJamaah}
              onRemove={handleRemove}
              compact
            />
          ))}
        </div>

        {/* Bottom stats */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="text-[10px] text-gray-400">{t.completionRate}</span>
              <span className="text-[10px] font-bold text-emerald-700">{stats.completionRate}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-gray-400">{t.jamaahRate}</span>
              <span className="text-[10px] font-bold text-emerald-700">{stats.jamaahRate}%</span>
            </div>
          </div>
          <Link href="/salat-tracker" className="text-[10px] text-emerald-600 font-medium hover:underline">
            {t.tabReports} →
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
