"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Droplets } from "lucide-react";
import type { TransLang } from "@/lib/islamic-content";
import { WUDU_DATA } from "@/lib/how-to-pray-data";
import { staggerItem } from "@/lib/animations";
import { WuduStepCard } from "./wudu-step-card";

interface WuduSectionProps {
  lang: TransLang;
  isRtl: boolean;
}

export function WuduSection({ lang, isRtl }: WuduSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      variants={staggerItem}
      className="rounded-2xl border border-blue-200/60 bg-white shadow-sm overflow-hidden"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <div className="flex items-center gap-4 p-5 sm:p-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-md shadow-blue-200">
            <Droplets className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-blue-900">{WUDU_DATA.name[lang]}</h3>
            <p className="text-sm text-blue-700/70 font-arabic">{WUDU_DATA.arabicName}</p>
            <p className="text-xs text-gray-500 mt-1">{WUDU_DATA.description[lang]}</p>
          </div>
          <div className="shrink-0">
            {isExpanded ? <ChevronUp className="h-5 w-5 text-blue-400" /> : <ChevronDown className="h-5 w-5 text-blue-400" />}
          </div>
        </div>
      </button>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="border-t border-blue-100 px-5 py-5 sm:px-6"
        >
          <div className="space-y-4">
            {WUDU_DATA.steps.map((step) => (
              <WuduStepCard key={step.stepNumber} step={step} lang={lang} isRtl={isRtl} />
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
