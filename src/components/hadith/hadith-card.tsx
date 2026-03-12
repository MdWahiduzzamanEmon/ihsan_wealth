"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Copy, Check, Heart, Share2 } from "lucide-react";
import { staggerItem } from "@/lib/animations";
import type { Hadith } from "@/lib/hadith-data";
import type { TransLang } from "@/lib/islamic-content";
import { HADITH_TEXTS } from "@/lib/hadith-data";

interface HadithCardProps {
  hadith: Hadith;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  lang: TransLang;
  isHighlighted?: boolean;
}

export function HadithCard({ hadith, isFavorite, onToggleFavorite, lang, isHighlighted }: HadithCardProps) {
  const [copied, setCopied] = useState(false);
  const t = HADITH_TEXTS[lang];
  const translation = hadith.translations[lang] || hadith.translations.en;

  const getFullText = () =>
    `${hadith.arabic}\n\n"${translation}"\n\n— ${hadith.narrator}\n📖 ${hadith.source}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getFullText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleShare = async () => {
    if ("share" in navigator) {
      try {
        await navigator.share({ title: t.todaysHadith, text: getFullText() });
        return;
      } catch {}
    }
    handleCopy();
  };

  return (
    <motion.div variants={staggerItem}>
      <Card className={cn(
        "group relative overflow-hidden border bg-white hover:shadow-lg transition-shadow duration-300",
        isHighlighted
          ? "border-amber-300 shadow-amber-100/50 ring-1 ring-amber-200"
          : "border-emerald-100 hover:shadow-emerald-100/50"
      )}>
        {/* Top accent bar */}
        <div className={cn(
          "h-1 bg-gradient-to-r",
          isHighlighted
            ? "from-amber-400 via-emerald-500 to-amber-400"
            : "from-emerald-500 via-amber-400 to-emerald-500"
        )} />

        <CardContent className="p-5 sm:p-6">
          {/* Arabic text */}
          <p
            className="font-arabic text-2xl sm:text-3xl leading-[2.4] text-center bg-gradient-to-br from-emerald-900 via-emerald-800 to-amber-900 bg-clip-text text-transparent"
            dir="rtl"
          >
            {hadith.arabic}
          </p>

          {/* Decorative divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />
            <span className="text-amber-400/60 text-xs font-arabic">&#10022;</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />
          </div>

          {/* Translation */}
          <p className="text-sm text-gray-700 leading-relaxed text-center">
            &ldquo;{translation}&rdquo;
          </p>

          {/* Narrator & Source */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-block rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
              {hadith.narrator}
            </span>
            <span className="inline-block rounded-full bg-amber-50 border border-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
              {hadith.source}
            </span>
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex items-center justify-center gap-1">
            <button
              onClick={handleShare}
              className="rounded-full p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
              aria-label={t.share}
              title={t.share}
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={handleCopy}
              className="rounded-full p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
              aria-label={t.copy}
              title={t.copy}
            >
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            </button>
            <button
              onClick={() => onToggleFavorite(hadith.id)}
              className={cn(
                "rounded-full p-2 transition-colors",
                isFavorite
                  ? "text-rose-500 hover:bg-rose-50"
                  : "text-gray-400 hover:text-rose-500 hover:bg-rose-50"
              )}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={cn("h-4 w-4", isFavorite && "fill-rose-500")} />
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
