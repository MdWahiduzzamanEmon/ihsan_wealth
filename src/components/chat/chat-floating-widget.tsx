"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { ChatPanel } from "./chat-panel";
import { getLangFromCountry, type TransLang } from "@/lib/islamic-content";
import { buildZakatSummary } from "@/lib/chat/build-zakat-summary";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { DEFAULT_FORM_DATA, type ZakatFormData } from "@/types/zakat";
import { useMetalPrices } from "@/hooks/use-metal-prices";
import { LANG_TO_CURRENCY } from "@/lib/chat/constants";

function IhsanAIIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="spark-a" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#d1fae5" />
        </linearGradient>
        <linearGradient id="spark-b" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fde68a" />
          <stop offset="1" stopColor="#fbbf24" />
        </linearGradient>
      </defs>

      {/* Large center star — slow breathe */}
      <motion.path
        d="M20 4 C20.6 12.4 21.6 13.4 30 14 C21.6 14.6 20.6 15.6 20 24 C19.4 15.6 18.4 14.6 10 14 C18.4 13.4 19.4 12.4 20 4Z"
        fill="url(#spark-a)"
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        animate={{ scale: [1, 1.12, 0.94, 1.07, 1], opacity: [1, 0.8, 1, 0.9, 1] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0 }}
      />

      {/* Medium top-right star — faster flicker */}
      <motion.path
        d="M31.5 24.5 C31.7 27.3 32.2 27.8 35 28 C32.2 28.2 31.7 28.7 31.5 31.5 C31.3 28.7 30.8 28.2 28 28 C30.8 27.8 31.3 27.3 31.5 24.5Z"
        fill="url(#spark-b)"
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        animate={{ scale: [1, 1.25, 0.85, 1.15, 1], opacity: [0.9, 1, 0.6, 1, 0.9] }}
        transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
      />

      {/* Tiny bottom-left star — slowest, dreamy */}
      <motion.path
        d="M10 28 C10.1 29.4 10.6 29.9 12 30 C10.6 30.1 10.1 30.6 10 32 C9.9 30.6 9.4 30.1 8 30 C9.4 29.9 9.9 29.4 10 28Z"
        fill="white"
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        animate={{ scale: [1, 1.4, 0.7, 1.2, 1], opacity: [0.7, 1, 0.4, 0.85, 0.7] }}
        transition={{ duration: 2.7, repeat: Infinity, ease: "easeInOut", delay: 1.6 }}
      />
    </svg>
  );
}

export function ChatFloatingWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [formData] = useLocalStorage<ZakatFormData>("zakat-calculator-data", DEFAULT_FORM_DATA);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const lang = getLangFromCountry(formData.country) as TransLang;
  const zakatSummary = useMemo(() => buildZakatSummary(formData), [formData]);
  const currency = LANG_TO_CURRENCY[lang] || "BDT";
  const { prices: metalPrices } = useMetalPrices(currency);

  // Hide floating widget on the dedicated assistant page
  if (pathname === "/assistant") return null;

  return (
    <>
      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && !open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-44 right-6 z-[99] no-print flex h-10 w-10 items-center justify-center rounded-full bg-white border border-gray-200 shadow-md hover:shadow-lg hover:border-emerald-300 transition-all"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-4 w-4 text-gray-600" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-24 right-6 z-[100] group no-print"
            aria-label="Open IhsanAI Chat"
          >
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-emerald-500/25 animate-ping" />
            {/* Outer glow ring */}
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-1 rounded-full border border-amber-400/25"
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
                w-full sm:w-[420px]
                max-h-[85vh] sm:max-h-[600px]
                rounded-t-2xl sm:rounded-2xl
                shadow-2xl shadow-emerald-900/20
                border border-gray-200
                bg-white overflow-hidden"
            >
              <ChatPanel lang={lang} zakatSummary={zakatSummary} metalPrices={metalPrices} onClose={() => setOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
