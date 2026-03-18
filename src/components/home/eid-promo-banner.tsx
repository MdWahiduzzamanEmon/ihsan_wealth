"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PartyPopper, Palette, ArrowRight, Moon, Star } from "lucide-react";
import type { TransLang } from "@/lib/islamic-content";
import { getNextEidInfo } from "@/lib/eid-content";
import { EidCountdown } from "@/components/eid/eid-countdown";
import { fadeIn } from "@/lib/animations";

interface EidPromoBannerProps {
  lang: TransLang;
  countryCode: string;
}

const TEXTS: Record<TransLang, { title: string; subtitle: string; cta: string }> = {
  en: { title: "Eid Mubarak!", subtitle: "Create beautiful greeting cards & share Eid wishes", cta: "Create Eid Card" },
  bn: { title: "ঈদ মোবারক!", subtitle: "সুন্দর গ্রিটিং কার্ড তৈরি করুন ও শুভেচ্ছা জানান", cta: "ঈদ কার্ড তৈরি" },
  ur: { title: "عید مبارک!", subtitle: "خوبصورت گریٹنگ کارڈ بنائیں اور مبارکباد دیں", cta: "عید کارڈ بنائیں" },
  ar: { title: "عيد مبارك!", subtitle: "أنشئ بطاقات تهنئة جميلة وشارك تمنيات العيد", cta: "إنشاء بطاقة" },
  tr: { title: "Bayramınız Mübarek!", subtitle: "Güzel tebrik kartları oluşturun ve paylaşın", cta: "Kart Oluştur" },
  ms: { title: "Selamat Hari Raya!", subtitle: "Cipta kad ucapan cantik dan kongsi ucapan", cta: "Cipta Kad" },
  id: { title: "Selamat Hari Raya!", subtitle: "Buat kartu ucapan cantik dan bagikan ucapan", cta: "Buat Kartu" },
};

export function EidPromoBanner({ lang, countryCode }: EidPromoBannerProps) {
  const t = TEXTS[lang];
  const isRTL = lang === "ar" || lang === "ur";
  const [eidName, setEidName] = useState("");
  const [hijriStr, setHijriStr] = useState("");

  useEffect(() => {
    const info = getNextEidInfo(countryCode);
    setEidName(info.name);
    setHijriStr(info.hijriStr);
  }, [countryCode]);

  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      className="mx-auto max-w-5xl px-4 mt-4"
      dir={isRTL ? "rtl" : undefined}
    >
      <Link href="/eid" className="block group">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 p-5 md:p-6 border border-emerald-600/30 shadow-lg hover:shadow-xl transition-all">
          {/* Decorative */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-amber-300/15"
                style={{ left: `${15 + i * 18}%`, top: `${10 + (i % 2) * 60}%` }}
                animate={{ y: [0, -8, 0], opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 2 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
              >
                <Star className="h-3 w-3" fill="currentColor" />
              </motion.div>
            ))}
            <Moon className="absolute top-3 right-4 h-12 w-12 text-amber-400/10" fill="currentColor" />
            <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="eid-promo-pat" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M20 0L40 20L20 40L0 20Z" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#eid-promo-pat)" />
            </svg>
          </div>

          <div className="relative">
            {/* Top row: title + hijri + CTA */}
            <div className="flex items-center gap-3 mb-4">
              <div className="shrink-0 h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <PartyPopper className="h-5 w-5 text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 flex-wrap">
                  {t.title}
                  {eidName && <span className="text-amber-300/50 text-xs font-normal">— {eidName}</span>}
                </h3>
                <p className="text-emerald-200/60 text-xs mt-0.5 line-clamp-1">
                  {t.subtitle}
                  {hijriStr && <span className="text-emerald-300/40 ml-1.5">• {hijriStr}</span>}
                </p>
              </div>
              <div className="shrink-0 hidden sm:flex items-center gap-2 bg-amber-500 text-emerald-950 px-4 py-2 rounded-xl text-sm font-semibold group-hover:bg-amber-400 transition-colors">
                <Palette className="h-4 w-4" />
                {t.cta}
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            {/* Countdown — reuses the shared component with compact variant */}
            <EidCountdown lang={lang} countryCode={countryCode} variant="compact" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
