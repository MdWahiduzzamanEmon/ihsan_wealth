"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, Download, ImagePlus, RefreshCw, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EID_PAGE_TEXTS } from "@/lib/eid-content";
import type { TransLang } from "@/lib/islamic-content";

interface EidPhotoFrameProps {
  lang: TransLang;
}

interface FrameStyle {
  id: string;
  name: Record<TransLang, string>;
  render: (photo: string | null, placeholder: React.ReactNode) => React.ReactNode;
}

const FRAME_STYLES: FrameStyle[] = [
  {
    id: "royal-gold",
    name: { en: "Royal Gold", bn: "রয়েল গোল্ড", ur: "شاہی سنہری", ar: "ذهبي ملكي", tr: "Altın", ms: "Emas Diraja", id: "Emas Kerajaan" },
    render: (photo, placeholder) => (
      <div className="relative rounded-2xl overflow-hidden">
        {/* Gold outer border */}
        <div className="p-1 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-2xl">
          <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 rounded-xl">
            {/* Photo area */}
            <div className="p-3 pb-0">
              <div className="border-2 border-amber-500/40 rounded-lg overflow-hidden">
                {photo ? (
                  <img src={photo} alt="Your photo" className="w-full h-auto block" />
                ) : placeholder}
              </div>
            </div>
            {/* Bottom text */}
            <div className="px-4 py-4 text-center">
              <p className="font-arabic text-amber-400 text-xl mb-0.5" dir="rtl">عِيدٌ مُبَارَكٌ</p>
              <p className="text-amber-300/40 text-[9px] tracking-widest">EID MUBARAK</p>
            </div>
          </div>
        </div>
        {/* Corner ornaments */}
        <svg className="absolute top-3 left-3 w-5 h-5 text-amber-400/30" viewBox="0 0 24 24"><path d="M0 0L12 0Q0 0 0 12Z" fill="currentColor"/></svg>
        <svg className="absolute top-3 right-3 w-5 h-5 text-amber-400/30 scale-x-[-1]" viewBox="0 0 24 24"><path d="M0 0L12 0Q0 0 0 12Z" fill="currentColor"/></svg>
      </div>
    ),
  },
  {
    id: "floral-rose",
    name: { en: "Rose Garden", bn: "গোলাপ বাগান", ur: "گلاب باغ", ar: "حديقة ورد", tr: "Gül Bahçesi", ms: "Taman Mawar", id: "Taman Mawar" },
    render: (photo, placeholder) => (
      <div className="relative bg-gradient-to-br from-rose-950 via-pink-950 to-rose-900 rounded-2xl overflow-hidden">
        {/* Floral pattern overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="pf-rose" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
            <circle cx="25" cy="25" r="10" fill="none" stroke="#fda4af" strokeWidth="0.5"/>
            <circle cx="25" cy="25" r="4" fill="none" stroke="#fda4af" strokeWidth="0.3"/>
            <path d="M25 15Q30 20 25 25Q20 20 25 15Z" fill="#fda4af" fillOpacity="0.2"/>
            <path d="M25 35Q30 30 25 25Q20 30 25 35Z" fill="#fda4af" fillOpacity="0.2"/>
            <path d="M15 25Q20 20 25 25Q20 30 15 25Z" fill="#fda4af" fillOpacity="0.2"/>
            <path d="M35 25Q30 20 25 25Q30 30 35 25Z" fill="#fda4af" fillOpacity="0.2"/>
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#pf-rose)"/>
        </svg>
        <div className="relative p-4">
          <div className="border-3 border-rose-400/50 rounded-xl overflow-hidden shadow-lg shadow-rose-950/50" style={{ borderWidth: 3 }}>
            {photo ? (
              <img src={photo} alt="Your photo" className="w-full h-auto block" />
            ) : placeholder}
          </div>
          <div className="text-center mt-3 pb-1">
            <p className="font-arabic text-rose-300 text-xl" dir="rtl">عِيدٌ مُبَارَكٌ</p>
            <div className="flex items-center justify-center gap-2 mt-1">
              <div className="h-px w-8 bg-rose-400/30"/>
              <span className="text-rose-400/40 text-[8px]">✿</span>
              <div className="h-px w-8 bg-rose-400/30"/>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "mosque-night",
    name: { en: "Night Mosque", bn: "রাতের মসজিদ", ur: "رات کی مسجد", ar: "مسجد ليلي", tr: "Gece Cami", ms: "Masjid Malam", id: "Masjid Malam" },
    render: (photo, placeholder) => (
      <div className="relative bg-gradient-to-b from-indigo-950 via-blue-950 to-indigo-900 rounded-2xl overflow-hidden">
        {/* Stars */}
        <div className="absolute top-2 left-4 w-1.5 h-1.5 rounded-full bg-amber-300/40"/>
        <div className="absolute top-4 right-6 w-1 h-1 rounded-full bg-amber-300/30"/>
        <div className="absolute top-3 left-1/3 w-1 h-1 rounded-full bg-amber-300/25"/>
        <div className="absolute top-5 right-1/4 w-0.5 h-0.5 rounded-full bg-amber-300/40"/>
        {/* Crescent */}
        <svg className="absolute top-1 right-3 w-8 h-8 opacity-20" viewBox="0 0 100 100">
          <path d="M50 10A40 40 0 1 1 50 90A30 30 0 1 0 50 10Z" fill="#fbbf24"/>
        </svg>
        <div className="relative p-4 pb-16">
          <div className="border-2 border-sky-400/30 rounded-xl overflow-hidden">
            {photo ? (
              <img src={photo} alt="Your photo" className="w-full h-auto block" />
            ) : placeholder}
          </div>
        </div>
        {/* Mosque silhouette at bottom */}
        <svg className="absolute bottom-0 left-0 right-0 h-16" viewBox="0 0 400 64" preserveAspectRatio="xMidYMax slice">
          <path d="M0 64 L0 44 L50 44 Q70 20 90 44 L130 44 Q150 8 170 44 L200 44 Q220 8 240 44 L280 44 Q300 20 320 44 L400 44 L400 64Z" fill="#1e1b4b" opacity="0.8"/>
          <rect x="165" y="20" width="3" height="24" fill="#fbbf24" opacity="0.3"/>
          <circle cx="166.5" cy="18" r="3" fill="#fbbf24" opacity="0.3"/>
        </svg>
        <p className="absolute bottom-2 left-0 right-0 text-center font-arabic text-sky-300/70 text-sm" dir="rtl">عِيدٌ مُبَارَكٌ</p>
      </div>
    ),
  },
  {
    id: "crescent-purple",
    name: { en: "Purple Crescent", bn: "বেগুনি চাঁদ", ur: "جامنی ہلال", ar: "هلال بنفسجي", tr: "Mor Hilal", ms: "Hilal Ungu", id: "Hilal Ungu" },
    render: (photo, placeholder) => (
      <div className="relative bg-gradient-to-br from-violet-950 via-purple-950 to-indigo-950 rounded-2xl overflow-hidden">
        {/* Crescent top-right */}
        <svg className="absolute -top-2 -right-2 w-24 h-24 opacity-10" viewBox="0 0 100 100">
          <path d="M50 5A45 45 0 1 1 50 95A35 35 0 1 0 50 5Z" fill="#a78bfa"/>
          <polygon points="82,25 84,31 90,31 85,35 87,41 82,37 77,41 79,35 74,31 80,31" fill="#a78bfa"/>
        </svg>
        {/* Geometric pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="pf-purp" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M20 0L40 20L20 40L0 20Z" fill="none" stroke="#a78bfa" strokeWidth="0.5"/>
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#pf-purp)"/>
        </svg>
        <div className="relative p-4">
          <div className="border-2 border-violet-400/40 rounded-xl overflow-hidden shadow-lg shadow-violet-950/50">
            {photo ? (
              <img src={photo} alt="Your photo" className="w-full h-auto block" />
            ) : placeholder}
          </div>
          <div className="text-center mt-3 pb-1">
            <p className="font-arabic text-violet-300 text-xl" dir="rtl">عِيدٌ مُبَارَكٌ</p>
            <div className="flex items-center justify-center gap-2 mt-1">
              <div className="h-px w-6 bg-violet-400/30"/>
              <span className="text-violet-400/40 text-[8px]">☪</span>
              <div className="h-px w-6 bg-violet-400/30"/>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "lantern-warm",
    name: { en: "Warm Lantern", bn: "উষ্ণ লণ্ঠন", ur: "گرم فانوس", ar: "فانوس دافئ", tr: "Sıcak Fener", ms: "Pelita Hangat", id: "Lentera Hangat" },
    render: (photo, placeholder) => (
      <div className="relative bg-gradient-to-br from-amber-950 via-orange-950 to-amber-900 rounded-2xl overflow-hidden">
        {/* Lanterns at top */}
        <svg className="absolute top-0 left-0 right-0 h-10 opacity-15" viewBox="0 0 400 40" preserveAspectRatio="xMidYMin slice">
          {[80, 160, 240, 320].map((x, i) => (
            <g key={i}>
              <line x1={x} y1="0" x2={x} y2={10+i*2} stroke="#fbbf24" strokeWidth="0.5"/>
              <path d={`M${x-5} ${10+i*2}Q${x} ${5+i*2} ${x+5} ${10+i*2}L${x+4} ${28+i*2}Q${x} ${32+i*2} ${x-4} ${28+i*2}Z`} fill="none" stroke="#fbbf24" strokeWidth="0.5"/>
            </g>
          ))}
        </svg>
        <div className="relative p-4 pt-6">
          <div className="border-2 border-amber-400/40 rounded-xl overflow-hidden shadow-lg shadow-amber-950/50">
            {photo ? (
              <img src={photo} alt="Your photo" className="w-full h-auto block" />
            ) : placeholder}
          </div>
          <div className="text-center mt-3 pb-1">
            <p className="font-arabic text-amber-300 text-xl" dir="rtl">عِيدٌ مُبَارَكٌ</p>
            <div className="flex items-center justify-center gap-2 mt-1">
              <div className="h-px w-6 bg-amber-400/30"/>
              <span className="text-amber-400/40 text-[8px]">✦</span>
              <div className="h-px w-6 bg-amber-400/30"/>
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

export function EidPhotoFrame({ lang }: EidPhotoFrameProps) {
  const t = EID_PAGE_TEXTS[lang];
  const isRTL = lang === "ar" || lang === "ur";
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [selectedFrame, setSelectedFrame] = useState(FRAME_STYLES[0]);
  const [downloading, setDownloading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoUrl(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const removePhoto = useCallback(() => {
    setPhotoUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleDownload = useCallback(async () => {
    if (!frameRef.current) return;
    setDownloading(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(frameRef.current, { pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `eid-photo-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloading(false);
    }
  }, []);

  const placeholder = (
    <div className="w-full aspect-[4/3] bg-gray-800/50 flex flex-col items-center justify-center gap-2">
      <ImagePlus className="h-10 w-10 text-gray-500" />
      <p className="text-gray-400 text-xs">{t.uploadPhoto}</p>
    </div>
  );

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">{t.photoFrame}</h2>
        <p className="text-sm text-gray-500 mt-1">{t.photoFrameSubtitle}</p>
      </div>

      {/* Upload / Change / Remove */}
      <div className="flex gap-2 mb-6">
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          className="flex-1 rounded-xl h-11 gap-2 border-dashed border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
        >
          {photoUrl ? <RefreshCw className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
          {photoUrl ? t.changePhoto : t.uploadPhoto}
        </Button>
        {photoUrl && (
          <Button
            onClick={removePhoto}
            variant="outline"
            className="rounded-xl h-11 gap-2 border-red-200 text-red-500 hover:bg-red-50 px-4"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Frame Selector */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-2">{t.chooseFrame}</p>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {FRAME_STYLES.map((frame) => (
            <button
              key={frame.id}
              type="button"
              onClick={() => setSelectedFrame(frame)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                selectedFrame.id === frame.id
                  ? "bg-emerald-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              {frame.name[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="flex justify-center mb-6">
        <div ref={frameRef} className="w-full max-w-sm">
          {selectedFrame.render(photoUrl, placeholder)}
        </div>
      </div>

      {/* Download — always visible */}
      <div className="flex justify-center">
        <Button
          onClick={handleDownload}
          disabled={downloading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 rounded-xl px-6 h-11"
        >
          {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {t.downloadFrame}
        </Button>
      </div>
    </div>
  );
}
