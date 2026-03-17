"use client";

import type { TransLang } from "@/lib/islamic-content";
import type { WuduStep } from "@/lib/how-to-pray-data";

interface WuduStepCardProps {
  step: WuduStep;
  lang: TransLang;
  isRtl: boolean;
}

export function WuduStepCard({ step, lang, isRtl }: WuduStepCardProps) {
  return (
    <div className="flex gap-3 sm:gap-4" dir={isRtl ? "rtl" : "ltr"}>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
        {step.stepNumber}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800">{step.action[lang]}</p>
        {step.arabic && (
          <div className="mt-2 rounded-lg bg-emerald-50 p-3">
            <p className="font-arabic text-base text-emerald-800 text-center" dir="rtl">{step.arabic}</p>
            {step.transliteration && (
              <p className="text-xs text-emerald-600 text-center mt-1 italic">{step.transliteration}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
