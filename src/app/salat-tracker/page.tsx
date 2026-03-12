"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ClipboardCheck, LogIn } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useSalatTracker } from "@/hooks/use-salat-tracker";
import { useRamadanTracker } from "@/hooks/use-ramadan-tracker";
import { usePrayerTimes } from "@/hooks/use-prayer-times";
import { SALAT_TRACKER_TEXTS } from "@/lib/salat-tracker-texts";
import { getLangFromCountry, type TransLang } from "@/lib/islamic-content";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { DEFAULT_FORM_DATA, type ZakatFormData } from "@/types/zakat";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TodayView } from "@/components/salat-tracker/today-view";
import { ReportView } from "@/components/salat-tracker/report-view";
import { Leaderboard } from "@/components/salat-tracker/leaderboard";
import { QazaLog } from "@/components/salat-tracker/qaza-log";
import { SalatReportExport } from "@/components/salat-tracker/salat-report-export";
import { Button } from "@/components/ui/button";
import type { PrayerName, PrayerStatus } from "@/hooks/use-salat-tracker";

type Tab = "today" | "reports" | "leaderboard" | "qaza";

export default function SalatTrackerPage() {
  const { isAuthenticated } = useAuth();
  const [formData] = useLocalStorage<ZakatFormData>("zakat-calculator-data", DEFAULT_FORM_DATA);
  const lang = getLangFromCountry(formData.country) as TransLang;
  const t = SALAT_TRACKER_TEXTS[lang];
  const isRtl = lang === "ar" || lang === "ur";

  const [activeTab, setActiveTab] = useState<Tab>("today");

  const tracker = useSalatTracker(formData.country);
  const ramadan = useRamadanTracker(formData.country);
  const { prayerTimes } = usePrayerTimes();

  // Build prayer times map for display
  const prayerTimesMap = prayerTimes
    ? {
        fajr: prayerTimes.fajr,
        dhuhr: prayerTimes.dhuhr,
        asr: prayerTimes.asr,
        maghrib: prayerTimes.maghrib,
        isha: prayerTimes.isha,
      }
    : undefined;

  const handleToggleStatus = (prayerName: PrayerName, status: PrayerStatus) => {
    tracker.togglePrayer(prayerName, status);
  };

  const handleToggleJamaah = (prayerName: PrayerName, inJamaah: boolean) => {
    const record = tracker.selectedDateRecords.find((r) => r.prayer_name === prayerName);
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

  const tabs: { id: Tab; label: string }[] = [
    { id: "today", label: t.tabToday },
    { id: "reports", label: t.tabReports },
    { id: "leaderboard", label: t.tabLeaderboard },
    { id: "qaza", label: t.tabQaza },
  ];

  return (
    <div
      className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50/30 via-white to-amber-50/20"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <Header countryCode={formData.country} />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-6">
          {/* Page header */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 shadow-lg shadow-emerald-200 mb-3">
              <ClipboardCheck className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-emerald-900 mb-1">{t.pageTitle}</h1>
            <p className="text-sm text-gray-500 max-w-md mx-auto">{t.subtitle}</p>
          </div>

          {/* Login gate */}
          {!isAuthenticated ? (
            <motion.div
              className="rounded-xl border border-emerald-200 bg-white p-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ClipboardCheck className="h-12 w-12 text-emerald-300 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-gray-800 mb-2">{t.loginRequired}</h2>
              <p className="text-sm text-gray-500 mb-4">{t.loginToTrack}</p>
              <Link href="/auth/login">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            </motion.div>
          ) : (
            <>
              {/* Tab navigation */}
              <div className="flex rounded-xl bg-gray-100 p-1 mb-5">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 rounded-lg py-2.5 text-xs font-medium transition-all ${
                      activeTab === tab.id
                        ? "bg-white text-emerald-700 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              {activeTab === "today" && (
                <TodayView
                  selectedDate={tracker.selectedDate}
                  selectedDateRecords={tracker.selectedDateRecords}
                  allRecords={tracker.records}
                  stats={tracker.stats}
                  dateContext={tracker.dateContext}
                  t={t}
                  isToday={tracker.isToday}
                  sunnahEnabled={tracker.sunnahEnabled}
                  prayerTimes={prayerTimesMap}
                  ramadanData={ramadan.isRamadan ? ramadan.todayData : undefined}
                  ramadanStats={ramadan.isRamadan ? ramadan.stats : undefined}
                  onToggleStatus={handleToggleStatus}
                  onToggleJamaah={handleToggleJamaah}
                  onRemove={handleRemove}
                  onToggleSunnah={() => tracker.setSunnahEnabled(!tracker.sunnahEnabled)}
                  onPreviousDay={tracker.goToPreviousDay}
                  onNextDay={tracker.goToNextDay}
                  onGoToToday={tracker.goToToday}
                  onRamadanToggle={ramadan.isRamadan ? ramadan.toggleField : undefined}
                  onRamadanQuranPages={ramadan.isRamadan ? ramadan.updateQuranPages : undefined}
                />
              )}

              {activeTab === "reports" && (
                <div className="space-y-4">
                  <ReportView
                    records={tracker.records}
                    stats={tracker.stats}
                    t={t}
                    getRecordsForRange={tracker.getRecordsForRange}
                  />
                  <SalatReportExport stats={tracker.stats} t={t} />
                </div>
              )}

              {activeTab === "leaderboard" && <Leaderboard t={t} />}

              {activeTab === "qaza" && (
                <div className="max-w-2xl mx-auto">
                  <QazaLog
                    qazaLog={tracker.qazaLog}
                    totalQazaRemaining={tracker.totalQazaRemaining}
                    t={t}
                    onLogQaza={tracker.logQaza}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer countryCode={formData.country} />
    </div>
  );
}
