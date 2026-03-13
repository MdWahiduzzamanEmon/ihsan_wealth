"use client";

import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import Link from "next/link";
import {
  Sparkles,
  BookOpen,
  Calculator,
  Activity,
  MessageSquare,
  Moon,
} from "lucide-react";
import type { TransLang } from "@/lib/islamic-content";

const texts: Record<
  TransLang,
  {
    title: string;
    subtitle: string;
    btn: string;
    features: [string, string, string, string, string, string];
  }
> = {
  en: {
    title: "Meet IhsanAI — Your Personal Islamic Assistant",
    subtitle:
      "AI-powered with access to your real data — tracks your Salat, Zakat, Sadaqah, Tasbih, Ramadan progress, and live gold prices. Ask anything Islamic with Quran & Hadith references.",
    btn: "Try IhsanAI",
    features: [
      "Salat & Ramadan Insights",
      "Live Gold & Zakat Calc",
      "Dua Recommendations",
      "Islamic Q&A with Sources",
      "Sadaqah & Tasbih Stats",
      "Zakat Distribution Plan",
    ],
  },
  bn: {
    title: "IhsanAI — আপনার ব্যক্তিগত ইসলামিক সহায়ক",
    subtitle:
      "আপনার আসল ডেটা দিয়ে চালিত AI — সালাত, যাকাত, সদকা, তাসবীহ, রমজান অগ্রগতি এবং সরাসরি সোনার দাম ট্র্যাক করে। কুরআন ও হাদিসের রেফারেন্সসহ যেকোনো ইসলামিক প্রশ্ন করুন।",
    btn: "IhsanAI ব্যবহার করুন",
    features: [
      "সালাত ও রমজান বিশ্লেষণ",
      "সরাসরি সোনার দাম ও যাকাত",
      "দোয়া সুপারিশ",
      "কুরআন-হাদিস ভিত্তিক প্রশ্নোত্তর",
      "সদকা ও তাসবীহ পরিসংখ্যান",
      "যাকাত বণ্টন পরিকল্পনা",
    ],
  },
  ur: {
    title: "IhsanAI — آپ کا ذاتی اسلامی معاون",
    subtitle:
      "آپ کے اصل ڈیٹا تک رسائی — نماز، زکوٰۃ، صدقہ، تسبیح، رمضان کی پیشرفت اور سونے کی تازہ قیمتیں۔ قرآن و حدیث کے حوالوں سمیت کوئی بھی اسلامی سوال پوچھیں۔",
    btn: "IhsanAI آزمائیں",
    features: [
      "نماز و رمضان بصیرت",
      "تازہ سونے کی قیمت و زکوٰۃ",
      "دعا کی سفارشات",
      "قرآن و حدیث سے سوال و جواب",
      "صدقہ و تسبیح اعداد و شمار",
      "زکوٰۃ تقسیم منصوبہ",
    ],
  },
  ar: {
    title: "IhsanAI — مساعدك الإسلامي الشخصي",
    subtitle:
      "ذكاء اصطناعي يصل إلى بياناتك الحقيقية — يتابع صلاتك وزكاتك وصدقاتك وتسبيحك وتقدم رمضان وأسعار الذهب الحية. اسأل أي سؤال إسلامي بمراجع القرآن والحديث.",
    btn: "جرب IhsanAI",
    features: [
      "إحصاءات الصلاة ورمضان",
      "أسعار الذهب الحية والزكاة",
      "توصيات الأدعية",
      "أسئلة إسلامية بالمصادر",
      "إحصاءات الصدقة والتسبيح",
      "خطة توزيع الزكاة",
    ],
  },
  tr: {
    title: "IhsanAI — Kişisel İslami Asistanınız",
    subtitle:
      "Gerçek verilerinize erişen AI — namaz, zekat, sadaka, tesbih, Ramazan ilerlemesi ve canlı altın fiyatlarını takip eder. Kur'an ve Hadis referanslarıyla İslami sorular sorun.",
    btn: "IhsanAI'yi Deneyin",
    features: [
      "Namaz ve Ramazan Analizi",
      "Canlı Altın ve Zekat Hesabı",
      "Dua Önerileri",
      "Kaynaklı İslami Soru-Cevap",
      "Sadaka ve Tesbih İstatistikleri",
      "Zekat Dağıtım Planı",
    ],
  },
  ms: {
    title: "IhsanAI — Pembantu Islam Peribadi Anda",
    subtitle:
      "AI dengan akses data sebenar anda — menjejak solat, zakat, sedekah, tasbih, kemajuan Ramadan dan harga emas langsung. Tanya apa sahaja soalan Islam dengan rujukan al-Quran & Hadis.",
    btn: "Cuba IhsanAI",
    features: [
      "Analisis Solat & Ramadan",
      "Harga Emas & Zakat Langsung",
      "Cadangan Doa",
      "Soal Jawab Islam Bersumber",
      "Statistik Sedekah & Tasbih",
      "Pelan Agihan Zakat",
    ],
  },
  id: {
    title: "IhsanAI — Asisten Islam Pribadi Anda",
    subtitle:
      "AI dengan akses data nyata Anda — melacak shalat, zakat, sedekah, tasbih, kemajuan Ramadan dan harga emas langsung. Tanya apa saja soal Islam dengan referensi Al-Quran & Hadis.",
    btn: "Coba IhsanAI",
    features: [
      "Analisis Shalat & Ramadan",
      "Harga Emas & Zakat Langsung",
      "Rekomendasi Doa",
      "Tanya Jawab Islam Bersumber",
      "Statistik Sedekah & Tasbih",
      "Rencana Distribusi Zakat",
    ],
  },
};

const featureIcons = [Activity, Calculator, BookOpen, MessageSquare, Moon, Sparkles];

export function IhsanAIPromo({ lang }: { lang: TransLang }) {
  const t = texts[lang] || texts.en;
  const isRTL = lang === "ar" || lang === "ur";

  return (
    <motion.section
      variants={fadeIn}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.3 }}
      className="mx-auto max-w-5xl px-4 py-6"
    >
      <div
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 to-emerald-950 shadow-xl"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Islamic SVG pattern overlay */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="islamic-geo"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M20 0L40 20L20 40L0 20Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-emerald-200"
              />
              <circle
                cx="20"
                cy="20"
                r="6"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-emerald-300"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic-geo)" />
        </svg>

        <div className="relative z-10 flex flex-col gap-5 p-6 sm:p-8 md:flex-row md:items-center md:gap-8">
          {/* Left / main text content */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <span className="font-arabic text-sm text-emerald-300/70">
                مساعد ذكاء اصطناعي إسلامي
              </span>
            </div>

            <h2 className="text-xl font-bold leading-snug text-white sm:text-2xl">
              {t.title}
            </h2>

            <p className="text-sm leading-relaxed text-emerald-100/70">
              {t.subtitle}
            </p>

            <Link
              href="/assistant"
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-emerald-950 shadow-md transition-all hover:bg-amber-400 hover:shadow-lg"
            >
              <Sparkles className="h-4 w-4" />
              {t.btn}
            </Link>
          </div>

          {/* Right / feature pills */}
          <div className="grid grid-cols-2 gap-2 md:w-72 md:shrink-0 md:grid-cols-2">
            {t.features.map((label, i) => {
              const Icon = featureIcons[i];
              return (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-lg border border-emerald-700/50 bg-emerald-800/40 px-3 py-2 backdrop-blur-sm"
                >
                  <Icon className="h-4 w-4 shrink-0 text-amber-400/80" />
                  <span className="text-xs font-medium leading-tight text-emerald-100/80">
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
