"use client";

import { useState, useMemo, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { getLangFromCountry } from "@/lib/islamic-content";
import { slideUp, staggerContainer } from "@/lib/animations";
import { HOW_TO_PRAY_TEXTS } from "@/lib/how-to-pray-texts";
import { ALL_PRAYERS } from "@/lib/how-to-pray-data";
import { DEFAULT_FORM_DATA, type ZakatFormData } from "@/types/zakat";

import { HeroSection } from "@/components/how-to-pray/hero-section";
import { SearchBar } from "@/components/how-to-pray/search-bar";
import { WuduSection } from "@/components/how-to-pray/wudu-section";
import { PrayerList } from "@/components/how-to-pray/prayer-list";
import { QuranVerseBanner } from "@/components/how-to-pray/quran-verse-banner";

export default function HowToPrayPage() {
  const [formData] = useLocalStorage<ZakatFormData>("zakat-calculator-data", DEFAULT_FORM_DATA);
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const [searchQuery, setSearchQuery] = useState("");

  const countryCode = formData?.country || "BD";
  const lang = getLangFromCountry(countryCode);
  const isRtl = lang === "ar" || lang === "ur";

  const dailyPrayers = useMemo(() => ALL_PRAYERS.filter((p) => p.category === "daily"), []);
  const specialPrayers = useMemo(() => ALL_PRAYERS.filter((p) => p.category === "special"), []);

  const filteredDaily = useMemo(() => {
    if (!searchQuery.trim()) return dailyPrayers;
    const q = searchQuery.toLowerCase();
    return dailyPrayers.filter((p) =>
      p.name.en.toLowerCase().includes(q) || p.name[lang].toLowerCase().includes(q) || p.id.includes(q)
    );
  }, [searchQuery, dailyPrayers, lang]);

  const filteredSpecial = useMemo(() => {
    if (!searchQuery.trim()) return specialPrayers;
    const q = searchQuery.toLowerCase();
    return specialPrayers.filter((p) =>
      p.name.en.toLowerCase().includes(q) || p.name[lang].toLowerCase().includes(q) || p.id.includes(q)
    );
  }, [searchQuery, specialPrayers, lang]);

  if (!mounted) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50/30 via-white to-amber-50/20">
        <Header countryCode={countryCode} />
        <main className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
        </main>
        <Footer countryCode={countryCode} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50/30 via-white to-amber-50/20">
      <Header countryCode={countryCode} />

      <main className="flex-1">
        <HeroSection lang={lang} isRtl={isRtl} />

        {/* Search */}
        <section className="mx-auto max-w-4xl px-4 pt-6 sm:pt-8">
          <SearchBar value={searchQuery} onChange={setSearchQuery} lang={lang} isRtl={isRtl} />
        </section>

        {/* Prerequisites */}
        <section className="mx-auto max-w-4xl px-4 pt-6">
          <motion.div
            variants={slideUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
            className="rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50/80 to-white p-5 sm:p-6"
            dir={isRtl ? "rtl" : "ltr"}
          >
            <h3 className="text-sm font-bold text-amber-800 mb-2">{HOW_TO_PRAY_TEXTS.prerequisites[lang]}</h3>
            <p className="text-sm text-gray-600">{HOW_TO_PRAY_TEXTS.prerequisitesList[lang]}</p>
          </motion.div>
        </section>

        {/* Wudu */}
        <section className="mx-auto max-w-4xl px-4 pt-6 sm:pt-8">
          <h2 className="text-xl font-bold text-emerald-900 mb-4" dir={isRtl ? "rtl" : "ltr"}>
            {HOW_TO_PRAY_TEXTS.wuduSection[lang]}
          </h2>
          <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true, margin: "-50px" }}>
            <WuduSection lang={lang} isRtl={isRtl} />
          </motion.div>
        </section>

        {/* Daily Prayers */}
        <PrayerList title={HOW_TO_PRAY_TEXTS.dailyPrayers[lang]} prayers={filteredDaily} lang={lang} isRtl={isRtl} />

        {/* Special Prayers */}
        <PrayerList title={HOW_TO_PRAY_TEXTS.specialPrayers[lang]} prayers={filteredSpecial} lang={lang} isRtl={isRtl} />

        {/* No Results */}
        {filteredDaily.length === 0 && filteredSpecial.length === 0 && searchQuery && (
          <section className="mx-auto max-w-4xl px-4 py-16 text-center">
            <p className="text-gray-500 text-sm">No prayers found matching &ldquo;{searchQuery}&rdquo;</p>
          </section>
        )}

        {/* Separator */}
        <div className="mx-auto max-w-4xl px-4 pt-8">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent" />
            <div className="font-arabic text-emerald-300/50 text-lg">&#10022;</div>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent" />
          </div>
        </div>

        <QuranVerseBanner lang={lang} isRtl={isRtl} />
      </main>

      <Footer countryCode={countryCode} />
    </div>
  );
}
