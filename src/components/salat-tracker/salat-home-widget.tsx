"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ClipboardCheck, Flame, ChevronRight } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useSalatTracker, FARD_PRAYERS, type PrayerName, type PrayerStatus } from "@/hooks/use-salat-tracker";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { SALAT_TRACKER_TEXTS } from "@/lib/salat-tracker-texts";
import { getLangFromCountry, type TransLang } from "@/lib/islamic-content";
import { DEFAULT_FORM_DATA, type ZakatFormData } from "@/types/zakat";
import { fadeIn } from "@/lib/animations";
import { PrayerCheckCard } from "./prayer-check-card";

export function SalatHomeWidget() {
  const { isAuthenticated } = useAuth();
  const [formData] = useLocalStorage<ZakatFormData>("zakat-calculator-data", DEFAULT_FORM_DATA);
  const lang = getLangFromCountry(formData.country) as TransLang;
  const t = SALAT_TRACKER_TEXTS[lang];

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

  return (
    <motion.section
      className="mx-auto max-w-5xl px-4 py-4"
      variants={fadeIn}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
    >
      <div className="relative overflow-hidden rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-white via-emerald-50/30 to-white shadow-sm">
        {/* Gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500" />

        <div className="p-4 sm:p-5">
          {/* Header — links to full page */}
          <Link href="/salat-tracker" className="group flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 shadow-sm">
                <ClipboardCheck className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">{t.pageTitle}</h3>
                <p className="text-[10px] text-gray-400">{t.todayProgress} — {stats.todayFardCompleted}/5</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {stats.currentStreak > 0 && (
                <div className="flex items-center gap-1 rounded-full bg-orange-50 border border-orange-200/60 px-2.5 py-1">
                  <Flame className="h-3.5 w-3.5 text-orange-500" />
                  <span className="text-xs font-bold text-orange-600">{stats.currentStreak}</span>
                </div>
              )}
              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
            </div>
          </Link>

          {/* Prayer cards — same component as salat tracker page */}
          <div className="space-y-2">
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
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-400">{t.completionRate}:</span>
                <span className="text-xs font-bold text-emerald-700">{stats.completionRate}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-400">{t.jamaahRate}:</span>
                <span className="text-xs font-bold text-emerald-700">{stats.jamaahRate}%</span>
              </div>
            </div>
            <Link href="/salat-tracker" className="text-[11px] text-emerald-600 font-medium hover:underline">
              {t.tabReports} →
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
