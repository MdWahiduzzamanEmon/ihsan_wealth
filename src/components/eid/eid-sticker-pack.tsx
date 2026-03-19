"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Download, Check } from "lucide-react";
import { EID_PAGE_TEXTS } from "@/lib/eid-content";
import type { TransLang } from "@/lib/islamic-content";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface EidStickerPackProps {
  lang: TransLang;
  trackAction?: (action: "sticker_download") => void;
}

interface Sticker {
  id: string;
  name: Record<TransLang, string>;
  svg: React.ReactNode;
  bg: string;
}

const STICKERS: Sticker[] = [
  {
    id: "crescent",
    name: { en: "Crescent Moon", bn: "চাঁদ", ur: "ہلال", ar: "هلال", tr: "Hilal", ms: "Bulan Sabit", id: "Bulan Sabit" },
    bg: "bg-indigo-900",
    svg: (
      <svg viewBox="0 0 120 120" className="w-full h-full">
        <circle cx="60" cy="60" r="50" fill="#1e1b4b" />
        <path d="M60 15 A45 45 0 1 1 60 105 A35 35 0 1 0 60 15Z" fill="#fbbf24" />
        <polygon points="95,30 97,36 103,36 98,40 100,46 95,42 90,46 92,40 87,36 93,36" fill="#fbbf24" />
        <polygon points="85,55 86.5,59 91,59 87.5,62 88.5,66 85,63 81.5,66 82.5,62 79,59 83.5,59" fill="#fbbf24" opacity="0.7" />
      </svg>
    ),
  },
  {
    id: "mosque",
    name: { en: "Mosque", bn: "মসজিদ", ur: "مسجد", ar: "مسجد", tr: "Cami", ms: "Masjid", id: "Masjid" },
    bg: "bg-emerald-900",
    svg: (
      <svg viewBox="0 0 120 120" className="w-full h-full">
        <rect x="0" y="0" width="120" height="120" rx="12" fill="#064e3b" />
        <path d="M20 90 L20 60 Q40 30 60 55 Q80 30 100 60 L100 90Z" fill="#10b981" opacity="0.3" />
        <path d="M35 90 L35 65 Q50 40 65 65 L65 90Z" fill="#10b981" opacity="0.5" />
        <rect x="55" y="40" width="3" height="25" fill="#fbbf24" />
        <circle cx="56.5" cy="38" r="4" fill="#fbbf24" />
        <rect x="15" y="88" width="90" height="4" rx="2" fill="#10b981" opacity="0.6" />
        <text x="60" y="108" textAnchor="middle" fill="#a7f3d0" fontSize="10" fontWeight="bold" fontFamily="sans-serif">EID</text>
      </svg>
    ),
  },
  {
    id: "lantern",
    name: { en: "Lantern", bn: "লণ্ঠন", ur: "فانوس", ar: "فانوس", tr: "Fener", ms: "Pelita", id: "Lentera" },
    bg: "bg-amber-900",
    svg: (
      <svg viewBox="0 0 120 120" className="w-full h-full">
        <rect x="0" y="0" width="120" height="120" rx="12" fill="#78350f" />
        <line x1="60" y1="10" x2="60" y2="25" stroke="#fbbf24" strokeWidth="2" />
        <rect x="50" y="22" width="20" height="6" rx="3" fill="#fbbf24" />
        <path d="M42 28 Q60 20 78 28 L74 85 Q60 90 46 85Z" fill="#f59e0b" opacity="0.8" />
        <path d="M48 35 Q60 30 72 35 L70 80 Q60 84 50 80Z" fill="#fef3c7" opacity="0.4" />
        <circle cx="60" cy="55" r="6" fill="#fef3c7" opacity="0.6" />
        <rect x="48" y="85" width="24" height="4" rx="2" fill="#fbbf24" />
        <circle cx="60" cy="95" r="3" fill="#fbbf24" />
        <text x="60" y="113" textAnchor="middle" fill="#fcd34d" fontSize="9" fontWeight="bold" fontFamily="sans-serif">MUBARAK</text>
      </svg>
    ),
  },
  {
    id: "star",
    name: { en: "Star", bn: "তারা", ur: "ستارہ", ar: "نجمة", tr: "Yıldız", ms: "Bintang", id: "Bintang" },
    bg: "bg-violet-900",
    svg: (
      <svg viewBox="0 0 120 120" className="w-full h-full">
        <rect x="0" y="0" width="120" height="120" rx="12" fill="#4c1d95" />
        <polygon points="60,10 72,45 110,45 80,65 90,100 60,80 30,100 40,65 10,45 48,45" fill="#a78bfa" />
        <polygon points="60,25 68,45 90,45 72,58 78,78 60,66 42,78 48,58 30,45 52,45" fill="#c4b5fd" />
        <circle cx="60" cy="50" r="8" fill="#ede9fe" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: "gift",
    name: { en: "Eidi Gift", bn: "ঈদী", ur: "عیدی", ar: "عيدية", tr: "Hediye", ms: "Hadiah", id: "Hadiah" },
    bg: "bg-rose-900",
    svg: (
      <svg viewBox="0 0 120 120" className="w-full h-full">
        <rect x="0" y="0" width="120" height="120" rx="12" fill="#881337" />
        <rect x="25" y="50" width="70" height="50" rx="6" fill="#f43f5e" />
        <rect x="25" y="38" width="70" height="18" rx="4" fill="#fb7185" />
        <rect x="55" y="38" width="10" height="62" fill="#fbbf24" />
        <rect x="25" y="44" width="70" height="8" fill="#fbbf24" opacity="0.3" />
        <path d="M60 38 Q45 20 35 30 Q25 38 40 38" fill="#fbbf24" />
        <path d="M60 38 Q75 20 85 30 Q95 38 80 38" fill="#fbbf24" />
        <text x="60" y="112" textAnchor="middle" fill="#fecdd3" fontSize="9" fontWeight="bold" fontFamily="sans-serif">EIDI</text>
      </svg>
    ),
  },
  {
    id: "dates",
    name: { en: "Dates", bn: "খেজুর", ur: "کھجوریں", ar: "تمر", tr: "Hurma", ms: "Kurma", id: "Kurma" },
    bg: "bg-orange-900",
    svg: (
      <svg viewBox="0 0 120 120" className="w-full h-full">
        <rect x="0" y="0" width="120" height="120" rx="12" fill="#7c2d12" />
        <ellipse cx="40" cy="65" rx="14" ry="20" fill="#92400e" />
        <ellipse cx="60" cy="60" rx="14" ry="22" fill="#a16207" />
        <ellipse cx="80" cy="65" rx="14" ry="20" fill="#92400e" />
        <ellipse cx="40" cy="62" rx="10" ry="16" fill="#b45309" opacity="0.6" />
        <ellipse cx="60" cy="57" rx="10" ry="18" fill="#ca8a04" opacity="0.6" />
        <ellipse cx="80" cy="62" rx="10" ry="16" fill="#b45309" opacity="0.6" />
        <path d="M50 40 Q55 25 60 35 Q65 25 70 40" fill="#15803d" />
        <text x="60" y="105" textAnchor="middle" fill="#fed7aa" fontSize="10" fontWeight="bold" fontFamily="sans-serif">سنة</text>
      </svg>
    ),
  },
  {
    id: "prayer",
    name: { en: "Dua Hands", bn: "দু'আ", ur: "دعا", ar: "دعاء", tr: "Dua", ms: "Doa", id: "Doa" },
    bg: "bg-teal-900",
    svg: (
      <svg viewBox="0 0 120 120" className="w-full h-full">
        <rect x="0" y="0" width="120" height="120" rx="12" fill="#134e4a" />
        <path d="M40 85 Q35 55 42 40 Q48 30 52 40 L55 55" fill="none" stroke="#5eead4" strokeWidth="3" strokeLinecap="round" />
        <path d="M80 85 Q85 55 78 40 Q72 30 68 40 L65 55" fill="none" stroke="#5eead4" strokeWidth="3" strokeLinecap="round" />
        <path d="M52 40 L55 35 L58 40" fill="none" stroke="#5eead4" strokeWidth="2" />
        <path d="M62 40 L65 35 L68 40" fill="none" stroke="#5eead4" strokeWidth="2" />
        <circle cx="60" cy="25" r="8" fill="#fbbf24" opacity="0.3" />
        <circle cx="60" cy="25" r="4" fill="#fbbf24" opacity="0.5" />
        <text x="60" y="108" textAnchor="middle" fill="#99f6e4" fontSize="10" fontFamily="sans-serif">آمين</text>
      </svg>
    ),
  },
  {
    id: "eidtext",
    name: { en: "Eid Mubarak", bn: "ঈদ মোবারক", ur: "عید مبارک", ar: "عيد مبارك", tr: "Bayram", ms: "Hari Raya", id: "Hari Raya" },
    bg: "bg-emerald-800",
    svg: (
      <svg viewBox="0 0 120 120" className="w-full h-full">
        <rect x="0" y="0" width="120" height="120" rx="12" fill="#065f46" />
        <circle cx="60" cy="45" r="30" fill="#10b981" opacity="0.2" />
        <text x="60" y="42" textAnchor="middle" fill="#fbbf24" fontSize="18" fontWeight="bold" fontFamily="serif">عِيدٌ</text>
        <text x="60" y="62" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold" fontFamily="serif">مُبَارَكٌ</text>
        <line x1="25" y1="75" x2="95" y2="75" stroke="#fbbf24" strokeWidth="0.5" opacity="0.4" />
        <text x="60" y="90" textAnchor="middle" fill="#a7f3d0" fontSize="8" fontFamily="sans-serif">Eid Mubarak</text>
        <polygon points="60,98 62,103 67,103 63,106 64.5,111 60,108 55.5,111 57,106 53,103 58,103" fill="#fbbf24" opacity="0.5" />
      </svg>
    ),
  },
];

export function EidStickerPack({ lang, trackAction }: EidStickerPackProps) {
  const t = EID_PAGE_TEXTS[lang];
  const isRTL = lang === "ar" || lang === "ur";
  const [downloadedId, setDownloadedId] = useState<string | null>(null);
  const stickerRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleDownload = useCallback(async (sticker: Sticker) => {
    const el = stickerRefs.current[sticker.id];
    if (!el) return;
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(el, { pixelRatio: 3, backgroundColor: undefined });
      const link = document.createElement("a");
      link.download = `eid-sticker-${sticker.id}.png`;
      link.href = dataUrl;
      link.click();
      setDownloadedId(sticker.id);
      setTimeout(() => setDownloadedId(null), 2000);
      trackAction?.("sticker_download");
    } catch (err) {
      console.error("Sticker download failed:", err);
    }
  }, []);

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">{t.stickerPack}</h2>
        <p className="text-sm text-gray-500 mt-1">{t.stickerPackSubtitle}</p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {STICKERS.map((sticker) => (
          <motion.div key={sticker.id} variants={staggerItem} className="group">
            <div
              ref={(el) => { stickerRefs.current[sticker.id] = el; }}
              className={`${sticker.bg} rounded-2xl p-2 aspect-square`}
            >
              {sticker.svg}
            </div>
            <div className="flex items-center justify-between mt-2 px-1">
              <span className="text-xs text-gray-600 font-medium truncate">{sticker.name[lang]}</span>
              <button
                type="button"
                onClick={() => handleDownload(sticker)}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-all ${
                  downloadedId === sticker.id
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-gray-100 text-gray-500 hover:bg-emerald-50 hover:text-emerald-600"
                }`}
              >
                {downloadedId === sticker.id ? <Check className="h-3 w-3" /> : <Download className="h-3 w-3" />}
                {downloadedId === sticker.id ? "✓" : t.downloadSticker}
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
