"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { useTasbihHistory } from "@/hooks/use-tasbih-history";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { TasbihCounter } from "@/components/tasbih/tasbih-counter";
import { DHIKR_PRESETS, TASBIH_TEXTS } from "@/lib/tasbih-data";
import { fadeIn, staggerContainer, staggerItem } from "@/lib/animations";
import { getLangFromCountry, type TransLang } from "@/lib/islamic-content";
import { DEFAULT_FORM_DATA, type ZakatFormData } from "@/types/zakat";
import { ArrowLeft, Hash, Trash2, LogIn, Loader2 } from "lucide-react";

export default function TasbihPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { sessions, todaySessions, todayTotal, addSession, deleteSession, isLoading } = useTasbihHistory();
  const [formData] = useLocalStorage<ZakatFormData>("zakat-calculator-data", DEFAULT_FORM_DATA);
  const lang = getLangFromCountry(formData.country) as TransLang;
  const t = TASBIH_TEXTS[lang];
  const isRtl = lang === "ar" || lang === "ur";

  const getPresetLabel = (type: string) => {
    const preset = DHIKR_PRESETS.find((p) => p.id === type);
    return preset ? preset.transliteration : type;
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50/30 via-white to-amber-50/20" dir={isRtl ? "rtl" : "ltr"}>
      <Header countryCode={formData.country} />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-8">
          {/* Page Title */}
          <motion.div className="mb-8" variants={fadeIn} initial="initial" animate="animate">
            <div className="flex items-center gap-3 mb-2">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-1">
                  <ArrowLeft className="h-4 w-4" /> {t.back}
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-emerald-800 flex items-center gap-3">
              <Hash className="h-8 w-8 text-emerald-600" />
              {t.title}
              <span className="font-arabic text-xl text-emerald-600/50">تسبيح</span>
            </h1>
            <p className="text-muted-foreground mt-1">{t.subtitle}</p>
          </motion.div>

          {/* Hadith Banner */}
          <motion.div
            className="mb-8 rounded-xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 p-6 text-center relative overflow-hidden"
            variants={fadeIn} initial="initial" animate="animate"
          >
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-2 left-4 font-arabic text-6xl text-white">﷽</div>
            </div>
            <p className="font-arabic text-xl text-amber-200/90 leading-relaxed relative z-10" dir="rtl">
              أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ
            </p>
            <p className="text-emerald-200 text-sm mt-2 relative z-10 italic">
              &ldquo;Verily, in the remembrance of Allah do hearts find rest.&rdquo; — Ar-Ra&apos;d 13:28
            </p>
          </motion.div>

          {/* Auth Gate */}
          {authLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              <p className="text-sm text-gray-500">{t.loading}</p>
            </div>
          ) : !isAuthenticated ? (
            <motion.div
              variants={fadeIn}
              initial="initial"
              animate="animate"
              className="text-center py-16"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
                <LogIn className="h-8 w-8 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{t.signInTitle}</h2>
              <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                {t.signInDesc}
              </p>
              <div className="flex items-center justify-center gap-3">
                <Link href="/auth/login">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                    <LogIn className="h-4 w-4" />
                    {t.signIn}
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                    {t.createAccount}
                  </Button>
                </Link>
              </div>
            </motion.div>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              <p className="text-sm text-gray-500">{t.loadingRecords}</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Counter */}
              <motion.div variants={fadeIn} initial="initial" animate="animate">
                <TasbihCounter lang={lang} onSessionComplete={addSession} />
              </motion.div>

              {/* Today's Stats */}
              {(todaySessions.length > 0 || todayTotal > 0) && (
                <motion.div variants={fadeIn} initial="initial" animate="animate">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">{t.todayStats}</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-center">
                      <p className="text-3xl font-bold text-emerald-700">{todaySessions.length}</p>
                      <p className="text-sm text-emerald-600">{t.sessions}</p>
                    </div>
                    <div className="rounded-xl bg-amber-50 border border-amber-100 p-4 text-center">
                      <p className="text-3xl font-bold text-amber-700">{todayTotal}</p>
                      <p className="text-sm text-amber-600">{t.totalDhikr}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* History */}
              <motion.div variants={fadeIn} initial="initial" animate="animate">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">{t.history}</h2>
                {sessions.length === 0 ? (
                  <p className="text-center py-8 text-gray-400 text-sm">{t.noHistory}</p>
                ) : (
                  <motion.div className="space-y-2" variants={staggerContainer} initial="initial" animate="animate">
                    {sessions.slice(0, 20).map((session) => (
                      <motion.div
                        key={session.id}
                        variants={staggerItem}
                        className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-4 py-3 shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 font-bold text-sm">
                            {session.completed_count}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{getPresetLabel(session.dhikr_type)}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(session.completed_at).toLocaleDateString()} · {t.target}: {session.target_count}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteSession(session.id)}
                          className="rounded-full p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            </div>
          )}
        </div>
      </main>
      <Footer countryCode={formData.country} />
    </div>
  );
}
