"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatPanel } from "./chat-panel";
import { getLangFromCountry, type TransLang } from "@/lib/islamic-content";
import { buildZakatSummary } from "@/lib/chat/build-zakat-summary";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { DEFAULT_FORM_DATA, type ZakatFormData } from "@/types/zakat";

function IhsanAIIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Outer glow ring */}
      <circle cx="24" cy="24" r="22" stroke="url(#glow)" strokeWidth="1.5" opacity="0.6" />
      {/* Inner circle */}
      <circle cx="24" cy="24" r="17" fill="url(#bg)" />
      {/* Star/Islamic pattern */}
      <path
        d="M24 10L27.5 19.5L37 20L29.5 26.5L32 36L24 30.5L16 36L18.5 26.5L11 20L20.5 19.5Z"
        fill="url(#star)"
        stroke="white"
        strokeWidth="0.5"
        opacity="0.9"
      />
      {/* Center dot */}
      <circle cx="24" cy="23" r="3" fill="white" opacity="0.95" />
      <defs>
        <linearGradient id="glow" x1="2" y1="2" x2="46" y2="46">
          <stop stopColor="#fbbf24" />
          <stop offset="1" stopColor="#10b981" />
        </linearGradient>
        <linearGradient id="bg" x1="7" y1="7" x2="41" y2="41">
          <stop stopColor="#059669" />
          <stop offset="1" stopColor="#064e3b" />
        </linearGradient>
        <linearGradient id="star" x1="11" y1="10" x2="37" y2="36">
          <stop stopColor="#fcd34d" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ChatFloatingWidget() {
  const [open, setOpen] = useState(false);
  const [formData] = useLocalStorage<ZakatFormData>("zakat-calculator-data", DEFAULT_FORM_DATA);
  const lang = getLangFromCountry(formData.country) as TransLang;

  // Build a read-only summary of current zakat data for context
  const zakatSummary = buildZakatSummary(formData);

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-[100] group no-print"
            aria-label="Open IhsanAI Chat"
          >
            {/* Animated pulse ring */}
            <span className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping" />
            {/* Rotating outer ring */}
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-1 rounded-full border border-amber-400/30"
            />
            {/* Main button */}
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-800 shadow-lg shadow-emerald-900/40 group-hover:shadow-xl group-hover:shadow-emerald-800/50 transition-shadow">
              <motion.span
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <IhsanAIIcon className="h-8 w-8 drop-shadow-lg" />
              </motion.span>
            </span>
            {/* Label */}
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-emerald-900 px-2 py-0.5 text-[10px] font-medium text-emerald-200 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
              IhsanAI
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop on mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[100] bg-black/30 sm:hidden no-print"
            />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed z-[101] no-print
                bottom-0 right-0 left-0 sm:bottom-6 sm:right-6 sm:left-auto
                w-full sm:w-[400px]
                rounded-t-2xl sm:rounded-2xl
                shadow-2xl shadow-emerald-900/20
                border border-gray-200
                bg-white overflow-hidden"
            >
              <ChatPanel lang={lang} zakatSummary={zakatSummary} onClose={() => setOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
