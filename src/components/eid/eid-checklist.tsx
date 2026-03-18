"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { EID_CHECKLIST_ITEMS, EID_PAGE_TEXTS } from "@/lib/eid-content";
import type { TransLang } from "@/lib/islamic-content";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface EidChecklistProps {
  lang: TransLang;
}

export function EidChecklist({ lang }: EidChecklistProps) {
  const t = EID_PAGE_TEXTS[lang];
  const isRTL = lang === "ar" || lang === "ur";
  const year = new Date().getFullYear();

  const [checked, setChecked] = useLocalStorage<Record<string, boolean>>(
    `eid-checklist-${year}`,
    {},
  );

  const completedCount = Object.values(checked).filter(Boolean).length;
  const total = EID_CHECKLIST_ITEMS.length;
  const progress = Math.round((completedCount / total) * 100);

  const toggle = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">{t.eidChecklist}</h2>
        <p className="text-sm text-gray-500 mt-1">{t.checklistSubtitle}</p>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-medium text-gray-500 mb-1.5">
          <span>{t.progress}</span>
          <span className="text-emerald-600">{completedCount}/{total}</span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        {progress === 100 && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-sm font-semibold text-emerald-600 mt-2"
          >
            &#127881; {t.eidMubarak}! &#127881;
          </motion.p>
        )}
      </div>

      {/* Checklist items */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-2"
      >
        {EID_CHECKLIST_ITEMS.map((item) => {
          const isDone = !!checked[item.id];
          return (
            <motion.button
              key={item.id}
              variants={staggerItem}
              type="button"
              onClick={() => toggle(item.id)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left ${
                isDone
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-white border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/30"
              }`}
            >
              <span className="text-xl shrink-0">{item.icon}</span>

              {isDone ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-gray-300 shrink-0" />
              )}

              <span className={`text-sm font-medium flex-1 ${isDone ? "text-emerald-700 line-through" : "text-gray-700"}`}>
                {item.label[lang]}
              </span>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
