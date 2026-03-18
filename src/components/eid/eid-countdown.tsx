"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, PartyPopper } from "lucide-react";
import { EID_PAGE_TEXTS, getNextEidInfo } from "@/lib/eid-content";
import type { TransLang } from "@/lib/islamic-content";

interface EidCountdownProps {
  lang: TransLang;
  countryCode: string;
  /** "full" = standalone card (for /eid page), "compact" = dark theme inline (for homepage banner) */
  variant?: "full" | "compact";
}

export function EidCountdown({ lang, countryCode, variant = "full" }: EidCountdownProps) {
  const t = EID_PAGE_TEXTS[lang];
  const isRTL = lang === "ar" || lang === "ur";
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isEidToday, setIsEidToday] = useState(false);
  const [hijriDateStr, setHijriDateStr] = useState("");
  const [eidName, setEidName] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const eid = getNextEidInfo(countryCode);
    setHijriDateStr(eid.hijriStr);
    setEidName(eid.name);

    if (eid.isEidToday) {
      setIsEidToday(true);
      return;
    }

    function update() {
      const now = new Date();
      const diff = eid.date.getTime() - now.getTime();

      if (diff <= 0) {
        setIsEidToday(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [countryCode]);

  if (!mounted) return null;

  const units = [
    { value: timeLeft.days, label: t.days },
    { value: timeLeft.hours, label: t.hours },
    { value: timeLeft.minutes, label: t.minutes },
    { value: timeLeft.seconds, label: t.seconds },
  ];

  // ─── Compact variant (for homepage banner — dark bg) ───
  if (variant === "compact") {
    if (isEidToday) {
      return (
        <div className="text-center py-2">
          <p className="font-arabic text-lg text-amber-300/70" dir="rtl">تَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُمْ</p>
        </div>
      );
    }

    return (
      <div className="flex justify-center gap-2 sm:gap-3" dir={isRTL ? "rtl" : undefined}>
        {units.map((unit, i) => (
          <div key={i} className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/10 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
              <span className="text-xl sm:text-2xl font-bold text-white font-mono">
                {String(unit.value).padStart(2, "0")}
              </span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-emerald-300/60 mt-1 font-medium">{unit.label}</p>
          </div>
        ))}
      </div>
    );
  }

  // ─── Full variant (standalone card — for /eid page) ───

  if (isEidToday) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mx-auto max-w-5xl px-4 mt-4"
        dir={isRTL ? "rtl" : undefined}
      >
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <PartyPopper className="h-8 w-8 text-amber-500" />
            <h3 className="text-2xl font-bold text-amber-800">{t.eidToday}</h3>
            <PartyPopper className="h-8 w-8 text-amber-500 scale-x-[-1]" />
          </div>
          <p className="font-arabic text-lg text-amber-600/70" dir="rtl">تَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُمْ</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="mx-auto max-w-5xl px-4 mt-4"
      dir={isRTL ? "rtl" : undefined}
    >
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5">
        <div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
          <Clock className="h-4 w-4 text-emerald-600" />
          <h3 className="text-sm font-semibold text-emerald-800">
            {t.countdown} {eidName && <span className="text-emerald-600/60 font-normal">— {eidName}</span>}
          </h3>
          {hijriDateStr && (
            <span className="text-[10px] text-emerald-600/60">• {hijriDateStr}</span>
          )}
        </div>

        <div className="flex justify-center gap-3">
          {units.map((unit, i) => (
            <div key={i} className="text-center">
              <div className="bg-white rounded-xl shadow-sm border border-emerald-100 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                <motion.span
                  key={unit.value}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-2xl sm:text-3xl font-bold text-emerald-800 font-mono"
                >
                  {String(unit.value).padStart(2, "0")}
                </motion.span>
              </div>
              <p className="text-[10px] sm:text-xs text-emerald-600 mt-1 font-medium">{unit.label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
