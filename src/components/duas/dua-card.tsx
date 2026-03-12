"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Dua } from "@/lib/duas-data";
import { Copy, Check, Heart, ChevronDown, ChevronUp, Volume2, VolumeX, Loader2, LogIn } from "lucide-react";
import { staggerItem } from "@/lib/animations";
import { useArabicSpeech } from "@/hooks/use-arabic-speech";

interface DuaCardProps {
  dua: Dua;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => Promise<"login-required" | void>;
  lang?: string;
}

const COLLAPSE_THRESHOLD = 200;

export function DuaCard({ dua, isFavorite, onToggleFavorite, lang }: DuaCardProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { speak, speaking, loading: loadingVoice } = useArabicSpeech();

  const translationText = (lang && dua.translations?.[lang]) || dua.translation;
  const isLong = dua.arabic.length > COLLAPSE_THRESHOLD;
  const showFull = !isLong || expanded;

  const handleCopy = async () => {
    const text = `${dua.arabic}\n\n${dua.transliteration}\n\n${translationText}\n\n— ${dua.source}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleToggleFavorite = async () => {
    const result = await onToggleFavorite(dua.id);
    if (result === "login-required") {
      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 4000);
    }
  };

  return (
    <motion.div variants={staggerItem}>
      <Card className="group relative overflow-hidden border border-emerald-100 bg-white hover:shadow-lg hover:shadow-emerald-100/50 transition-shadow duration-300">
        {/* Top accent bar */}
        <div className="h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500" />

        <CardContent className="p-5 sm:p-6">
          {/* Arabic text */}
          <div className="relative">
            <p
              className={cn(
                "font-arabic text-2xl sm:text-3xl leading-[2.4] text-center text-gray-800",
                "bg-gradient-to-br from-emerald-900 via-emerald-800 to-amber-900 bg-clip-text text-transparent",
                !showFull && "line-clamp-3"
              )}
              dir="rtl"
            >
              {dua.arabic}
            </p>

            {isLong && !expanded && (
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
            )}
          </div>

          {/* Expand / Collapse for long duas */}
          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 mx-auto mt-1 text-xs text-emerald-600 hover:text-emerald-800 transition-colors"
            >
              {expanded ? (
                <>
                  Show less <ChevronUp className="h-3 w-3" />
                </>
              ) : (
                <>
                  Show full dua <ChevronDown className="h-3 w-3" />
                </>
              )}
            </button>
          )}

          {/* Decorative divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />
            <span className="text-amber-400/60 text-xs font-arabic">&#10022;</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />
          </div>

          {/* Transliteration */}
          <p className="text-sm italic text-gray-500 leading-relaxed text-center mb-3">
            {dua.transliteration}
          </p>

          {/* Translation */}
          <p className="text-sm text-gray-700 leading-relaxed text-center">
            &ldquo;{translationText}&rdquo;
          </p>

          {/* Footer: source + actions */}
          <div className="mt-4 flex items-center justify-between">
            {/* Source badge */}
            <span className="inline-block rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
              {dua.source}
            </span>

            {/* Action buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => speak(dua.arabic)}
                className={cn(
                  "rounded-full p-2 transition-colors",
                  speaking
                    ? "text-emerald-600 bg-emerald-50"
                    : "text-gray-400 hover:text-emerald-600 hover:bg-emerald-50"
                )}
                aria-label={speaking ? "Stop reading" : "Listen to dua"}
                title={speaking ? "Stop reading" : "Listen to dua"}
              >
                {loadingVoice ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : speaking ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={handleCopy}
                className="rounded-full p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                aria-label="Copy dua"
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
              <div className="relative">
                <button
                  onClick={handleToggleFavorite}
                  className={cn(
                    "rounded-full p-2 transition-colors",
                    isFavorite
                      ? "text-rose-500 hover:bg-rose-50"
                      : "text-gray-400 hover:text-rose-500 hover:bg-rose-50"
                  )}
                  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart
                    className={cn("h-4 w-4", isFavorite && "fill-rose-500")}
                  />
                </button>

                {/* Login required tooltip */}
                <AnimatePresence>
                  {showLoginPrompt && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.95 }}
                      className="absolute bottom-full right-0 mb-2 z-50"
                    >
                      <div className="rounded-xl bg-gray-900 text-white shadow-xl px-4 py-3 text-xs whitespace-nowrap">
                        <p className="font-medium mb-1.5">Login required to save favorites</p>
                        <Link
                          href="/auth/login"
                          className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-emerald-500 transition-colors"
                        >
                          <LogIn className="h-3 w-3" />
                          Sign in
                        </Link>
                        <div className="absolute -bottom-1 right-4 h-2 w-2 rotate-45 bg-gray-900" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
