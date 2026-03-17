"use client";

import type { TransLang } from "@/lib/islamic-content";
import type { PrayerStep } from "@/lib/how-to-pray-data";

interface PrayerStepCardProps {
  step: PrayerStep;
  lang: TransLang;
  isRtl: boolean;
}

export function PrayerStepCard({ step, lang, isRtl }: PrayerStepCardProps) {
  return (
    <div className="flex gap-3 sm:gap-4" dir={isRtl ? "rtl" : "ltr"}>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
        {step.stepNumber}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800">{step.action[lang]}</p>
        {step.arabic && (
          <div className="mt-2 rounded-lg bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 p-3 sm:p-4 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id={`sp-${step.stepNumber}`} x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M15 0L30 15L15 30L0 15Z" fill="none" stroke="white" strokeWidth="0.3" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#sp-${step.stepNumber})`} />
              </svg>
            </div>
            <p className="relative font-arabic text-lg sm:text-xl leading-relaxed text-amber-300/90 text-center" dir="rtl">
              {step.arabic}
            </p>
            {step.transliteration && (
              <p className="relative text-xs sm:text-sm text-emerald-200/70 text-center mt-2 italic">
                {step.transliteration}
              </p>
            )}
            {step.meaning[lang] && (
              <p className="relative text-xs text-emerald-100/60 text-center mt-1.5">
                {step.meaning[lang]}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
