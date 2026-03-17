"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import type { TransLang } from "@/lib/islamic-content";
import { HOW_TO_PRAY_TEXTS } from "@/lib/how-to-pray-texts";
import { fadeIn } from "@/lib/animations";

interface HeroSectionProps {
  lang: TransLang;
  isRtl: boolean;
}

export function HeroSection({ lang, isRtl }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 py-12 sm:py-16">
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="htp-hero" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M40 0L80 40L40 80L0 40Z" fill="none" stroke="white" strokeWidth="0.5" />
              <circle cx="40" cy="40" r="16" fill="none" stroke="white" strokeWidth="0.5" />
              <path d="M40 24L56 40L40 56L24 40Z" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#htp-hero)" />
        </svg>
      </div>

      <motion.div
        className="relative mx-auto max-w-4xl px-4 text-center"
        variants={fadeIn}
        initial="initial"
        animate="animate"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5">
          <GraduationCap className="h-4 w-4 text-amber-300" />
          <span className="text-sm text-emerald-100">{HOW_TO_PRAY_TEXTS.pageTitle[lang]}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          {HOW_TO_PRAY_TEXTS.pageTitle[lang]}
        </h1>
        <p className="text-emerald-200/80 text-base sm:text-lg max-w-2xl mx-auto">
          {HOW_TO_PRAY_TEXTS.pageSubtitle[lang]}
        </p>
        <div className="mt-6 font-arabic text-amber-300/50 text-lg">
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </div>
      </motion.div>
    </section>
  );
}
