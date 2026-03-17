"use client";

import { motion } from "framer-motion";
import type { TransLang } from "@/lib/islamic-content";
import { slideUp } from "@/lib/animations";

const VERSE_TRANSLATIONS: Record<TransLang, string> = {
  en: "\"Indeed, prayer has been decreed upon the believers at specified times.\" — Surah An-Nisa 4:103",
  bn: "\"নিশ্চয়ই নামাজ মুমিনদের উপর নির্দিষ্ট সময়ে ফরজ করা হয়েছে।\" — সূরা আন-নিসা ৪:১০৩",
  ur: "\"بے شک نماز مومنوں پر وقت مقرر پر فرض کی گئی ہے۔\" — سورۃ النساء ۴:۱۰۳",
  ar: "\"إن الصلاة كانت على المؤمنين كتاباً موقوتاً\" — سورة النساء ٤:١٠٣",
  tr: "\"Namaz, müminlere belirli vakitlerde farz kılınmıştır.\" — Nisâ 4:103",
  ms: "\"Sesungguhnya solat itu adalah ketetapan yang diwajibkan atas orang-orang beriman pada waktu-waktu tertentu.\" — An-Nisa 4:103",
  id: "\"Sesungguhnya shalat itu adalah kewajiban yang ditentukan waktunya atas orang-orang beriman.\" — An-Nisa 4:103",
};

interface QuranVerseBannerProps {
  lang: TransLang;
  isRtl: boolean;
}

export function QuranVerseBanner({ lang, isRtl }: QuranVerseBannerProps) {
  return (
    <section className="mx-auto max-w-4xl px-4 py-8 sm:py-10">
      <motion.div
        className="rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/50 to-white p-6 sm:p-8 text-center"
        variants={slideUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        dir={isRtl ? "rtl" : "ltr"}
      >
        <p className="font-arabic text-2xl text-emerald-700 mb-3" dir="rtl">
          إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا
        </p>
        <p className="text-sm text-gray-600 max-w-xl mx-auto italic">
          {VERSE_TRANSLATIONS[lang]}
        </p>
      </motion.div>
    </section>
  );
}
