"use client";

import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import Link from "next/link";
import { Calculator, Coins, Scale, Globe, ShieldCheck, Layers, ArrowRight } from "lucide-react";
import { isRTLLang, type TransLang } from "@/lib/islamic-content";

const texts: Record<
  TransLang,
  {
    eyebrow: string;
    title: string;
    subtitle: string;
    btn: string;
    features: [string, string, string, string, string, string];
  }
> = {
  en: {
    eyebrow: "Zakat Calculator",
    title: "Know exactly how much Zakat you owe",
    subtitle:
      "Free step-by-step calculator covering cash, gold, silver, crypto, investments & business assets. All 4 madhabs supported.",
    btn: "Start Calculating",
    features: ["Cash & Savings", "Gold & Silver", "Crypto & Stocks", "Business Assets", "All 4 Madhabs", "Zakat al-Fitr"],
  },
  bn: {
    eyebrow: "যাকাত ক্যালকুলেটর",
    title: "জানুন আপনার উপর কত যাকাত ফরয",
    subtitle:
      "বিনামূল্যে ধাপে ধাপে ক্যালকুলেটর — নগদ, সোনা, রুপা, ক্রিপ্টো, বিনিয়োগ ও ব্যবসায়িক সম্পদ। সকল ৪ মাযহাব সাপোর্টেড।",
    btn: "হিসাব শুরু করুন",
    features: ["নগদ ও সঞ্চয়", "সোনা ও রুপা", "ক্রিপ্টো ও শেয়ার", "ব্যবসায়িক সম্পদ", "সকল ৪ মাযহাব", "ফিতরা"],
  },
  ur: {
    eyebrow: "زکوٰۃ کیلکولیٹر",
    title: "جانیں آپ پر کتنی زکوٰۃ فرض ہے",
    subtitle:
      "مفت مرحلہ وار کیلکولیٹر — نقد، سونا، چاندی، کرپٹو، سرمایہ کاری اور کاروباری اثاثے۔ تمام 4 مذاہب سپورٹ کرتا ہے۔",
    btn: "حساب شروع کریں",
    features: ["نقد اور بچت", "سونا اور چاندی", "کرپٹو اور حصص", "کاروباری اثاثے", "تمام 4 مذاہب", "فطرانہ"],
  },
  ar: {
    eyebrow: "حاسبة الزكاة",
    title: "اعرف بالضبط كم زكاتك الواجبة",
    subtitle:
      "حاسبة مجانية خطوة بخطوة تشمل النقد والذهب والفضة والعملات الرقمية والاستثمارات وأصول الأعمال. تدعم المذاهب الأربعة.",
    btn: "ابدأ الحساب",
    features: ["النقد والمدخرات", "الذهب والفضة", "الكريبتو والأسهم", "أصول الأعمال", "المذاهب الأربعة", "زكاة الفطر"],
  },
  tr: {
    eyebrow: "Zekat Hesaplayıcı",
    title: "Ne kadar zekat borcunuz olduğunu bilin",
    subtitle:
      "Ücretsiz adım adım hesaplayıcı — nakit, altın, gümüş, kripto, yatırımlar ve ticari varlıklar. 4 mezhep desteklenir.",
    btn: "Hesaplamaya Başla",
    features: ["Nakit & Tasarruf", "Altın & Gümüş", "Kripto & Hisse", "Ticari Varlıklar", "4 Mezhep", "Fitre"],
  },
  ms: {
    eyebrow: "Kalkulator Zakat",
    title: "Ketahui dengan tepat berapa zakat anda",
    subtitle:
      "Kalkulator percuma langkah demi langkah — tunai, emas, perak, kripto, pelaburan dan aset perniagaan. Semua 4 mazhab disokong.",
    btn: "Mula Kira",
    features: ["Tunai & Simpanan", "Emas & Perak", "Kripto & Saham", "Aset Perniagaan", "4 Mazhab", "Zakat Fitrah"],
  },
  id: {
    eyebrow: "Kalkulator Zakat",
    title: "Ketahui persis berapa zakat yang wajib Anda bayar",
    subtitle:
      "Kalkulator gratis langkah demi langkah — tunai, emas, perak, kripto, investasi dan aset bisnis. Semua 4 mazhab didukung.",
    btn: "Mulai Hitung",
    features: ["Tunai & Tabungan", "Emas & Perak", "Kripto & Saham", "Aset Bisnis", "4 Mazhab", "Zakat Fitrah"],
  },
};

const featureIcons = [Coins, Scale, Globe, Layers, ShieldCheck, Calculator];

export function ZakatPromo({ lang }: { lang: TransLang }) {
  const t = texts[lang] || texts.en;
  const isRTL = isRTLLang(lang);

  return (
    <motion.section
      variants={fadeIn}
      initial="initial"
      animate="animate"
      className="mx-auto max-w-5xl px-4 py-6"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-yellow-50 shadow-md">

        {/* Left gold accent bar */}
        <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-b from-amber-400 via-yellow-500 to-amber-300" />

        {/* Faint Arabic watermark */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-end overflow-hidden opacity-[0.04] pr-4" aria-hidden>
          <p className="font-arabic text-[110px] font-bold leading-none text-amber-800 select-none">
            زكاة
          </p>
        </div>

        <div className="relative z-10 flex flex-col gap-6 p-6 pl-8 sm:p-8 sm:pl-10 md:flex-row md:items-center md:gap-10">

          {/* Left: text + CTA */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 border border-amber-300/60 px-3 py-0.5 text-xs font-semibold text-amber-700">
                <Calculator className="h-3.5 w-3.5" />
                {t.eyebrow}
              </span>
            </div>

            <h2 className="text-xl font-bold leading-snug text-gray-900 sm:text-2xl">
              {t.title}
            </h2>

            <p className="text-sm leading-relaxed text-gray-500 max-w-md">
              {t.subtitle}
            </p>

            <Link
              href="/calculator"
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow transition-all hover:bg-amber-600 hover:shadow-md"
            >
              {t.btn}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Right: 2x3 feature grid */}
          <div className="grid grid-cols-3 gap-2 md:w-64 md:shrink-0">
            {t.features.map((label, i) => {
              const Icon = featureIcons[i];
              return (
                <div
                  key={i}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-amber-200/70 bg-white/70 px-2 py-3 text-center shadow-sm"
                >
                  <Icon className="h-4 w-4 text-amber-500" />
                  <span className="text-[10px] font-medium leading-tight text-gray-600">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
