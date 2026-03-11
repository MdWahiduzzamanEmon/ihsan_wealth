"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { ChatPanel } from "./chat-panel";
import { getLangFromCountry, type TransLang } from "@/lib/islamic-content";
import { buildZakatSummary } from "@/lib/chat/build-zakat-summary";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { DEFAULT_FORM_DATA, type ZakatFormData } from "@/types/zakat";

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
            className="fixed bottom-6 right-6 z-[100] h-14 w-14 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shadow-xl shadow-emerald-900/30 hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center no-print"
          >
            <MessageCircle className="h-6 w-6" />
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
              {/* Close button */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-3 right-3 z-10 h-7 w-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4 text-white" />
              </button>

              <ChatPanel lang={lang} zakatSummary={zakatSummary} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
