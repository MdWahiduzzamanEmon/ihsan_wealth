"use client";

import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import Link from "next/link";
import {
  Sparkles,
  BookOpen,
  Calculator,
  Heart,
  MessageSquare,
} from "lucide-react";
import type { TransLang } from "@/lib/islamic-content";

const texts: Record<
  TransLang,
  {
    title: string;
    subtitle: string;
    btn: string;
    features: [string, string, string, string];
  }
> = {
  en: {
    title: "Meet IhsanAI — Your Islamic Companion",
    subtitle:
      "AI-powered assistant for Zakat guidance, Islamic Q&A, Dua recommendations, and more",
    btn: "Try IhsanAI",
    features: [
      "Islamic Q&A",
      "Zakat Calculator Help",
      "Dua Finder",
      "Distribution Planner",
    ],
  },
  bn: {
    title: "IhsanAI-এর সাথে পরিচিত হোন — আপনার ইসলামিক সঙ্গী",
    subtitle:
      "যাকাত গাইডেন্স, ইসলামিক প্রশ্নোত্তর, দোয়া সুপারিশ এবং আরও অনেক কিছুর জন্য AI সহকারী",
    btn: "IhsanAI ব্যবহার করুন",
    features: [
      "ইসলামিক প্রশ্নোত্তর",
      "যাকাত ক্যালকুলেটর সাহায্য",
      "দোয়া খোঁজক",
      "বণ্টন পরিকল্পনা",
    ],
  },
  ur: {
    title: "IhsanAI سے ملیں — آپ کا اسلامی ساتھی",
    subtitle:
      "زکات رہنمائی، اسلامی سوال و جواب، دعا کی سفارشات اور مزید کے لیے AI معاون",
    btn: "IhsanAI آزمائیں",
    features: [
      "اسلامی سوال و جواب",
      "زکات کیلکولیٹر مدد",
      "دعا تلاش",
      "تقسیم منصوبہ بندی",
    ],
  },
  ar: {
    title: "تعرف على IhsanAI — رفيقك الإسلامي",
    subtitle:
      "مساعد ذكي للزكاة والأسئلة الإسلامية وتوصيات الأدعية والمزيد",
    btn: "جرب IhsanAI",
    features: [
      "أسئلة إسلامية",
      "مساعدة حاسبة الزكاة",
      "باحث الأدعية",
      "مخطط التوزيع",
    ],
  },
  tr: {
    title: "IhsanAI ile Tanışın — İslami Yardımcınız",
    subtitle:
      "Zekat rehberliği, İslami Soru-Cevap, Dua önerileri ve daha fazlası için AI asistanı",
    btn: "IhsanAI'yi Deneyin",
    features: [
      "İslami Soru-Cevap",
      "Zekat Hesaplayıcı Yardımı",
      "Dua Bulucu",
      "Dağıtım Planlayıcı",
    ],
  },
  ms: {
    title: "Kenali IhsanAI — Teman Islami Anda",
    subtitle:
      "Pembantu AI untuk panduan Zakat, Soal Jawab Islam, cadangan Doa, dan lagi",
    btn: "Cuba IhsanAI",
    features: [
      "Soal Jawab Islam",
      "Bantuan Kalkulator Zakat",
      "Pencari Doa",
      "Perancang Agihan",
    ],
  },
  id: {
    title: "Kenali IhsanAI — Pendamping Islami Anda",
    subtitle:
      "Asisten AI untuk panduan Zakat, Tanya Jawab Islam, rekomendasi Doa, dan lainnya",
    btn: "Coba IhsanAI",
    features: [
      "Tanya Jawab Islam",
      "Bantuan Kalkulator Zakat",
      "Pencari Doa",
      "Perencana Distribusi",
    ],
  },
};

const featureIcons = [MessageSquare, Calculator, BookOpen, Heart];

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
          <div className="grid grid-cols-2 gap-2 md:w-64 md:shrink-0">
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
