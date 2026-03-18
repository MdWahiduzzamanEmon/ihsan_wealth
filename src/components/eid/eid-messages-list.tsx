"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Copy, Check, ArrowUpRight } from "lucide-react";
import {
  EID_MESSAGES,
  EID_MESSAGE_CATEGORIES,
  EID_PAGE_TEXTS,
  type EidMessage,
} from "@/lib/eid-content";
import type { TransLang } from "@/lib/islamic-content";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface EidMessagesListProps {
  lang: TransLang;
  /** Called when user clicks "Use this message" — sets the message on the card creator */
  onSelectMessage?: (message: string) => void;
}

export function EidMessagesList({ lang, onSelectMessage }: EidMessagesListProps) {
  const t = EID_PAGE_TEXTS[lang];
  const isRTL = lang === "ar" || lang === "ur";
  const [activeCategory, setActiveCategory] = useState<EidMessage["category"] | "all">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const categories: (EidMessage["category"] | "all")[] = [
    "all",
    "formal",
    "family",
    "friend",
    "religious",
    "heartfelt",
    "fun",
  ];

  const filteredMessages =
    activeCategory === "all"
      ? EID_MESSAGES
      : EID_MESSAGES.filter((m) => m.category === activeCategory);

  const handleCopy = useCallback(
    async (msg: EidMessage, e: React.MouseEvent) => {
      e.stopPropagation();
      const text = msg.message[lang] || msg.message.en;
      await navigator.clipboard.writeText(text);
      setCopiedId(msg.id);
      setTimeout(() => setCopiedId(null), 2000);
    },
    [lang],
  );

  const handleSelect = useCallback(
    (msg: EidMessage) => {
      const text = msg.message[lang] || msg.message.en;
      setSelectedId(msg.id);
      onSelectMessage?.(text);
      // Brief visual feedback before navigating
      setTimeout(() => setSelectedId(null), 600);
    },
    [lang, onSelectMessage],
  );

  const categoryColors: Record<string, string> = {
    all: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    formal: "bg-blue-50 text-blue-700 hover:bg-blue-100",
    family: "bg-rose-50 text-rose-700 hover:bg-rose-100",
    friend: "bg-orange-50 text-orange-700 hover:bg-orange-100",
    religious: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
    heartfelt: "bg-purple-50 text-purple-700 hover:bg-purple-100",
    fun: "bg-amber-50 text-amber-700 hover:bg-amber-100",
  };

  const activeCategoryColors: Record<string, string> = {
    all: "bg-gray-700 text-white",
    formal: "bg-blue-600 text-white",
    family: "bg-rose-600 text-white",
    friend: "bg-orange-600 text-white",
    religious: "bg-emerald-600 text-white",
    heartfelt: "bg-purple-600 text-white",
    fun: "bg-amber-600 text-white",
  };

  const cardBorders: Record<string, string> = {
    formal: "border-blue-200",
    family: "border-rose-200",
    friend: "border-orange-200",
    religious: "border-emerald-200",
    heartfelt: "border-purple-200",
    fun: "border-amber-200",
  };

  const USE_LABEL: Record<TransLang, string> = {
    en: "Use this message",
    bn: "এই বার্তা ব্যবহার করুন",
    ur: "یہ پیغام استعمال کریں",
    ar: "استخدم هذه الرسالة",
    tr: "Bu mesajı kullan",
    ms: "Gunakan mesej ini",
    id: "Gunakan pesan ini",
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeCategory === cat
                ? activeCategoryColors[cat]
                : categoryColors[cat]
            }`}
          >
            {cat === "all"
              ? t.allCategories
              : EID_MESSAGE_CATEGORIES[cat][lang]}
          </button>
        ))}
      </div>

      {/* Messages Grid */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid gap-4 sm:grid-cols-2"
      >
        {filteredMessages.map((msg) => {
          const isSelected = selectedId === msg.id;

          return (
            <motion.div
              key={msg.id}
              variants={staggerItem}
              onClick={() => handleSelect(msg)}
              className={`group relative rounded-xl border ${cardBorders[msg.category]} bg-white p-4 cursor-pointer transition-all ${
                isSelected
                  ? "ring-2 ring-emerald-400 border-emerald-400 shadow-md scale-[0.98]"
                  : "hover:shadow-md hover:border-emerald-200"
              }`}
            >
              {/* Category badge */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold ${categoryColors[msg.category]}`}
                >
                  {EID_MESSAGE_CATEGORIES[msg.category][lang]}
                </span>

                {/* Use this message indicator */}
                <span className={`flex items-center gap-1 text-[10px] font-medium transition-all ${
                  isSelected
                    ? "text-emerald-600"
                    : "text-gray-400 opacity-0 group-hover:opacity-100"
                }`}>
                  {isSelected ? (
                    <>
                      <Check className="h-3 w-3" />
                      {t.copied}
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="h-3 w-3" />
                      {USE_LABEL[lang]}
                    </>
                  )}
                </span>
              </div>

              {/* Arabic text if available */}
              {msg.arabic && (
                <p
                  className="font-arabic text-sm text-gray-400 mb-1.5 leading-relaxed"
                  dir="rtl"
                >
                  {msg.arabic}
                </p>
              )}

              {/* Message */}
              <p className="text-sm text-gray-700 leading-relaxed">
                {msg.message[lang] || msg.message.en}
              </p>

              {/* Copy button */}
              <button
                type="button"
                onClick={(e) => handleCopy(msg, e)}
                className={`absolute bottom-3 ${isRTL ? "left-3" : "right-3"} p-1.5 rounded-lg transition-all ${
                  copiedId === msg.id
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-gray-100 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-gray-200 hover:text-gray-600"
                }`}
                title={copiedId === msg.id ? t.copied : t.copyMessage}
              >
                {copiedId === msg.id ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
