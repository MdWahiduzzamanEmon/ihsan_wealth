"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, BellRing, Check } from "lucide-react";
import { EID_PAGE_TEXTS } from "@/lib/eid-content";
import type { TransLang } from "@/lib/islamic-content";

interface EidReminderProps {
  lang: TransLang;
}

const REMINDER_KEY = "eid-reminder-2026";

export function EidReminder({ lang }: EidReminderProps) {
  const t = EID_PAGE_TEXTS[lang];
  const isRTL = lang === "ar" || lang === "ur";
  const [isSet, setIsSet] = useState(false);
  const [justSet, setJustSet] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(REMINDER_KEY);
    if (stored) {
      setIsSet(true);
      // Check if reminder should fire (stored date has passed)
      const reminderDate = new Date(stored);
      if (new Date() >= reminderDate && Notification.permission === "granted") {
        new Notification("Eid Mubarak! 🎉", {
          body: "Taqabbalallahu minna wa minkum! Visit IhsanWealth for Eid greetings.",
          icon: "/favicon.svg",
        });
        localStorage.removeItem(REMINDER_KEY);
        setIsSet(false);
      }
    }
  }, []);

  const handleSetReminder = useCallback(async () => {
    try {
      if ("Notification" in window) {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;
      }

      // Store a target date (next Eid morning approximate)
      // This is a simplified approach — reminder fires on next page visit after this date
      const targetDate = new Date();
      targetDate.setHours(targetDate.getHours() + 24); // At least 24h from now
      localStorage.setItem(REMINDER_KEY, targetDate.toISOString());

      setIsSet(true);
      setJustSet(true);
      setTimeout(() => setJustSet(false), 3000);
    } catch {
      // Notifications not supported
    }
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 mt-3" dir={isRTL ? "rtl" : undefined}>
      <AnimatePresence mode="wait">
        {justSet ? (
          <motion.div
            key="set"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm"
          >
            <Check className="h-4 w-4" />
            <span className="font-medium">{t.reminderSet}</span>
            <span className="text-emerald-500/70 text-xs">— {t.reminderDesc}</span>
          </motion.div>
        ) : !isSet ? (
          <motion.button
            key="btn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            type="button"
            onClick={handleSetReminder}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium hover:bg-amber-100 transition-all group"
          >
            <Bell className="h-4 w-4 group-hover:hidden" />
            <BellRing className="h-4 w-4 hidden group-hover:block" />
            {t.setReminder}
          </motion.button>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
