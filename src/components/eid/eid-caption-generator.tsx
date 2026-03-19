"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Copy, Check, Loader2, Hash, RefreshCw, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EID_PAGE_TEXTS } from "@/lib/eid-content";
import type { TransLang } from "@/lib/islamic-content";

interface EidCaptionGeneratorProps {
  lang: TransLang;
}

const FALLBACK_CAPTIONS: Record<string, string[]> = {
  en: [
    "Eid Mubarak! Grateful for the blessings, the family, and the food. Lots of food. 🌙✨",
    "Another Eid, another reason to be thankful. May Allah bless us all with joy and peace. 🤲",
    "Dressed up, prayed up, ready to celebrate! Eid vibes only today. 🎉🕌",
  ],
  bn: [
    "ঈদ মোবারক! রহমত, পরিবার আর খাবারের জন্য কৃতজ্ঞ। অনেক অনেক খাবার। 🌙✨",
    "আরেকটি ঈদ, কৃতজ্ঞ হওয়ার আরেকটি কারণ। আল্লাহ আমাদের সবাইকে আনন্দ ও শান্তি দিন। 🤲",
    "সেজেগুজে, নামাজ পড়ে, উদযাপনে প্রস্তুত! আজ শুধুই ঈদের আমেজ। 🎉🕌",
  ],
  ur: [
    "عید مبارک! نعمتوں، خاندان اور کھانے کا شکر ہے۔ بہت سارا کھانا۔ 🌙✨",
    "ایک اور عید، شکرگزاری کی ایک اور وجہ۔ اللہ ہم سب کو خوشی اور سکون دے۔ 🤲",
    "تیار ہو کر، نماز پڑھ کر، جشن منانے کو تیار! آج صرف عید کا موڈ۔ 🎉🕌",
  ],
  ar: [
    "عيد مبارك! ممتن للنعم والعائلة والطعام. الكثير من الطعام. 🌙✨",
    "عيد آخر وسبب آخر للشكر. اللهم بارك لنا بالفرح والسلام. 🤲",
    "تزينا وصلينا وجاهزين للاحتفال! أجواء العيد فقط اليوم. 🎉🕌",
  ],
  tr: [
    "Bayramınız mübarek olsun! Nimetlere, aileye ve yemeklere şükür. 🌙✨",
    "Bir bayram daha, şükretmek için bir neden daha. Allah hepimize mutluluk versin. 🤲",
    "Güzel giyindik, namaz kıldık, kutlamaya hazırız! Bugün sadece bayram havası. 🎉🕌",
  ],
  ms: [
    "Selamat Hari Raya! Bersyukur atas nikmat, keluarga dan makanan. 🌙✨",
    "Satu lagi Raya, satu lagi sebab bersyukur. Semoga Allah rahmati kita semua. 🤲",
    "Berpakaian cantik, solat siap, sedia untuk meraikan! Hari ini vibes Raya je. 🎉🕌",
  ],
  id: [
    "Selamat Hari Raya! Bersyukur atas nikmat, keluarga dan makanan. 🌙✨",
    "Satu Lebaran lagi, satu alasan lagi untuk bersyukur. Semoga Allah rahmati kita semua. 🤲",
    "Berpakaian rapi, shalat sudah, siap merayakan! Hari ini vibes Lebaran saja. 🎉🕌",
  ],
};

const HASHTAGS = ["#EidMubarak", "#Eid2026", "#EidAlFitr", "#EidVibes", "#Blessed", "#EidOutfit", "#EidFood", "#Alhamdulillah", "#MuslimFestival", "#EidGreetings"];

const SHARE_TEXTS: Record<TransLang, { shareToFb: string; shareToInsta: string; shareCaption: string }> = {
  en: { shareToFb: "Share to Facebook", shareToInsta: "Copy for Instagram", shareCaption: "Share" },
  bn: { shareToFb: "ফেসবুকে শেয়ার", shareToInsta: "ইনস্টাগ্রামের জন্য কপি", shareCaption: "শেয়ার" },
  ur: { shareToFb: "فیس بک پر شیئر", shareToInsta: "انسٹاگرام کے لیے کاپی", shareCaption: "شیئر" },
  ar: { shareToFb: "مشاركة على فيسبوك", shareToInsta: "نسخ لإنستغرام", shareCaption: "مشاركة" },
  tr: { shareToFb: "Facebook'ta Paylaş", shareToInsta: "Instagram için Kopyala", shareCaption: "Paylaş" },
  ms: { shareToFb: "Kongsi ke Facebook", shareToInsta: "Salin untuk Instagram", shareCaption: "Kongsi" },
  id: { shareToFb: "Bagikan ke Facebook", shareToInsta: "Salin untuk Instagram", shareCaption: "Bagikan" },
};

export function EidCaptionGenerator({ lang }: EidCaptionGeneratorProps) {
  const t = EID_PAGE_TEXTS[lang];
  const st = SHARE_TEXTS[lang];
  const isRTL = lang === "ar" || lang === "ur";
  const [captions, setCaptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [hashtagsCopied, setHashtagsCopied] = useState(false);

  const generate = useCallback(async () => {
    setIsLoading(true);
    setCaptions([]);
    try {
      const results = await Promise.all(
        [1, 2, 3].map(() =>
          fetch("/api/eid-message", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ language: lang }),
          }).then((r) => r.json()).then((d) => d.message as string).catch(() => null)
        )
      );
      const valid = results.filter(Boolean) as string[];
      setCaptions(valid.length >= 2 ? valid : (FALLBACK_CAPTIONS[lang] || FALLBACK_CAPTIONS.en));
    } catch {
      setCaptions(FALLBACK_CAPTIONS[lang] || FALLBACK_CAPTIONS.en);
    } finally {
      setIsLoading(false);
    }
  }, [lang]);

  const copyCaption = useCallback(async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text + "\n\n" + HASHTAGS.slice(0, 5).join(" "));
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  }, []);

  const shareToFacebook = useCallback((text: string) => {
    const url = encodeURIComponent("https://ihsanwealth.onrender.com/eid");
    const quote = encodeURIComponent(text);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`, "_blank", "width=600,height=400");
  }, []);

  const shareToInstagram = useCallback(async (text: string) => {
    // Instagram doesn't have a web share URL for text — copy with hashtags so user can paste
    const fullText = text + "\n\n" + HASHTAGS.join(" ");
    await navigator.clipboard.writeText(fullText);
    setCopiedIdx(-1); // Special indicator
    setTimeout(() => setCopiedIdx(null), 2000);
  }, []);

  const copyAllHashtags = useCallback(async () => {
    await navigator.clipboard.writeText(HASHTAGS.join(" "));
    setHashtagsCopied(true);
    setTimeout(() => setHashtagsCopied(false), 2000);
  }, []);

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <div className="text-center mb-5">
        <h2 className="text-xl font-bold text-gray-800">{t.captionGenerator}</h2>
        <p className="text-sm text-gray-500 mt-0.5">{t.captionGeneratorSubtitle}</p>
      </div>

      <Button
        onClick={generate}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white gap-2 rounded-xl h-11 mb-5"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : captions.length ? <RefreshCw className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
        {isLoading ? t.generatingCaptions : t.generateCaptions}
      </Button>

      {/* Captions */}
      <AnimatePresence>
        {captions.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 mb-5">
            {captions.map((cap, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:border-violet-200 hover:shadow-sm transition-all"
              >
                <p className="text-sm text-gray-700 leading-relaxed mb-3">{cap}</p>

                {/* Action buttons row */}
                <div className="flex flex-wrap gap-1.5">
                  {/* Copy */}
                  <button
                    type="button"
                    onClick={() => copyCaption(cap, i)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                      copiedIdx === i ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {copiedIdx === i ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copiedIdx === i ? t.copied : t.copyCaption}
                  </button>

                  {/* Facebook */}
                  <button
                    type="button"
                    onClick={() => shareToFacebook(cap)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all"
                  >
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    {st.shareToFb}
                  </button>

                  {/* Instagram (copy with hashtags) */}
                  <button
                    type="button"
                    onClick={() => shareToInstagram(cap)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                      copiedIdx === -1 ? "bg-emerald-100 text-emerald-600" : "bg-gradient-to-r from-pink-50 to-purple-50 text-pink-600 hover:from-pink-100 hover:to-purple-100"
                    }`}
                  >
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                    {copiedIdx === -1 ? t.copied : st.shareToInsta}
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hashtags */}
      {captions.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
              <Hash className="h-3.5 w-3.5 text-violet-500" />
              {t.hashtags}
            </h4>
            <button
              type="button"
              onClick={copyAllHashtags}
              className={`text-xs font-medium px-2 py-1 rounded-md transition-all ${
                hashtagsCopied ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500 hover:bg-violet-50 hover:text-violet-600"
              }`}
            >
              {hashtagsCopied ? t.copied : t.copyHashtags}
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {HASHTAGS.map((tag) => (
              <span key={tag} className="px-2 py-1 bg-violet-50 text-violet-600 rounded-md text-xs font-medium">{tag}</span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
