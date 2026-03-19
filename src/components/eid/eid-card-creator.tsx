"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Share2,
  Mail,
  Sparkles,
  Loader2,
  Check,
  ChevronLeft,
  ChevronRight,
  Type,
  Settings2,
  X,
  ShieldCheck,
  RectangleHorizontal,
  RectangleVertical,
  Square,
  Clipboard,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CARD_DESIGNS, CARD_LAYOUT_CONFIG, EID_PAGE_TEXTS, FONT_STYLES, type CardDesign, type CardLayout } from "@/lib/eid-content";
import type { TransLang } from "@/lib/islamic-content";
import { EidCardMini } from "./eid-card-preview";
import { EidCardAnimatedWrapper } from "./eid-card-animated-wrapper";

interface EidCardCreatorProps {
  lang: TransLang;
  message: string;
  onMessageChange: (msg: string) => void;
  onSuccess?: () => void;
}

type TextSize = "small" | "medium" | "large";

const SIZE_MAP: Record<TextSize, string> = {
  small: "text-xs sm:text-sm",
  medium: "text-sm sm:text-base",
  large: "text-base sm:text-lg",
};

const NAME_SIZE_MAP: Record<TextSize, string> = {
  small: "text-sm sm:text-base",
  medium: "text-lg sm:text-xl",
  large: "text-xl sm:text-2xl",
};

const LAYOUT_ICONS = {
  portrait: RectangleVertical,
  landscape: RectangleHorizontal,
  square: Square,
};

// Fixed pixel dimensions for export (high quality)
const EXPORT_DIMENSIONS: Record<CardLayout, { width: number; height: number }> = {
  portrait: { width: 1080, height: 1440 },
  landscape: { width: 1920, height: 1080 },
  square: { width: 1080, height: 1080 },
};

export function EidCardCreator({ lang, message, onMessageChange, onSuccess }: EidCardCreatorProps) {
  const t = EID_PAGE_TEXTS[lang];
  const isRTL = lang === "ar" || lang === "ur";

  const [selectedDesign, setSelectedDesign] = useState<CardDesign>(CARD_DESIGNS[0]);
  const [name, setName] = useState("");
  const [messageSize, setMessageSize] = useState<TextSize>("medium");
  const [nameSize, setNameSize] = useState<TextSize>("medium");
  const [layout, setLayout] = useState<CardLayout>("portrait");
  const [fontStyle, setFontStyle] = useState(FONT_STYLES[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copiedClipboard, setCopiedClipboard] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const designScrollRef = useRef<HTMLDivElement>(null);

  // AI Message Generation
  const generateAIMessage = useCallback(async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/eid-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: lang }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      if (data.message) onMessageChange(data.message);
    } catch {
      const fallbacks: Record<string, string> = {
        en: "Eid Mubarak! May this blessed day bring endless joy, peace, and blessings to you and your family. Taqabbalallahu minna wa minkum!",
        bn: "ঈদ মোবারক! এই মুবারক দিনটি আপনার ও আপনার পরিবারের জন্য অফুরন্ত আনন্দ, শান্তি ও বরকত নিয়ে আসুক।",
        ur: "عید مبارک! یہ مبارک دن آپ اور آپ کے خاندان کے لیے بے حد خوشی، سکون اور برکتیں لائے۔",
        ar: "عيد مبارك! عسى أن يجلب هذا اليوم المبارك السعادة والسلام والبركات لك ولعائلتك.",
        tr: "Bayramınız mübarek olsun! Bu mübarek gün size ve ailenize sonsuz mutluluk, huzur ve bereket getirsin!",
        ms: "Selamat Hari Raya! Semoga hari yang mulia ini membawa kegembiraan dan keberkatan!",
        id: "Selamat Hari Raya! Semoga hari yang mulia ini membawa kebahagiaan dan keberkatan!",
      };
      onMessageChange(fallbacks[lang] || fallbacks.en);
    } finally {
      setIsGenerating(false);
    }
  }, [lang, onMessageChange]);

  // Generate card image blob — capture at actual rendered size with high DPI
  const getCardBlob = useCallback(async () => {
    if (!cardRef.current) return null;
    const { toPng } = await import("html-to-image");
    const el = cardRef.current;

    const dataUrl = await toPng(el, {
      pixelRatio: 3,
      width: el.offsetWidth,
      height: el.offsetHeight,
    });
    return { dataUrl, blob: await (await fetch(dataUrl)).blob() };
  }, []);

  // Download
  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      const result = await getCardBlob();
      if (!result) return;
      const link = document.createElement("a");
      link.download = `eid-mubarak-card-${Date.now()}.png`;
      link.href = result.dataUrl;
      link.click();
      onSuccess?.();
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloading(false);
    }
  }, [getCardBlob, onSuccess]);

  // Share (native OS share sheet)
  const handleShare = useCallback(async () => {
    try {
      const result = await getCardBlob();
      if (!result) return;
      const file = new File([result.blob], "eid-mubarak-card.png", { type: "image/png" });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({ title: t.eidMubarak, text: message || t.eidMubarak, files: [file] });
      } else if (navigator.share) {
        await navigator.share({ title: t.eidMubarak, text: message || t.eidMubarak });
      } else {
        handleDownload();
      }
    } catch { /* cancelled */ }
  }, [message, t.eidMubarak, handleDownload, getCardBlob]);

  // WhatsApp share — send card image via native share (mobile) or text link (desktop)
  const handleWhatsApp = useCallback(async () => {
    try {
      const result = await getCardBlob();
      if (result) {
        const file = new File([result.blob], "eid-mubarak-card.png", { type: "image/png" });
        // Mobile: native share with image → user picks WhatsApp
        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            text: `${t.eidMubarak}\n\n${message || ""}`,
            files: [file],
          });
          return;
        }
      }
    } catch {
      // User cancelled or share failed — fall through to text fallback
    }
    // Desktop fallback: text-only via wa.me
    const text = encodeURIComponent(
      `${t.eidMubarak}\n\n${message || ""}\n\n🌙 Create your own Eid card:\nhttps://ihsan-wealth.onrender.com/eid`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }, [message, t.eidMubarak, getCardBlob]);

  // Copy to clipboard
  const handleCopyClipboard = useCallback(async () => {
    try {
      const result = await getCardBlob();
      if (!result) return;
      if ("ClipboardItem" in window) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": result.blob }),
        ]);
        setCopiedClipboard(true);
        setTimeout(() => setCopiedClipboard(false), 2000);
      }
    } catch { /* unsupported */ }
  }, [getCardBlob]);

  const scrollDesigns = (dir: "left" | "right") => {
    designScrollRef.current?.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      {/* Live Card Preview (top) */}
      <div className="flex justify-center px-2 pb-4">
        <EidCardAnimatedWrapper
          cardRef={cardRef}
          design={selectedDesign}
          message={message}
          name={name}
          recipientName=""
          messageSize={SIZE_MAP[messageSize]}
          nameSize={NAME_SIZE_MAP[nameSize]}
          isRTL={isRTL}
          eidMubarakText={t.eidMubarak}
          layout={layout}
          fontClass={fontStyle.className}
          toLabel=""
          fromLabel={t.fromLabel}
          replayLabel={t.replayAnimation}
        />
      </div>

      {/* Customization section divider */}
      <div className="flex items-center gap-4 my-2">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent" />
        <span className="text-emerald-400/50 text-xs font-medium">{t.cardSettings}</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent" />
      </div>

      {/* Step 1: Layout Picker */}
      <div>
        <h3 className="text-sm font-semibold text-emerald-800 mb-3 flex items-center gap-2">
          <span className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700">1</span>
          {t.chooseLayout}
        </h3>
        <div className="flex gap-2">
          {(["portrait", "landscape", "square"] as CardLayout[]).map((l) => {
            const Icon = LAYOUT_ICONS[l];
            return (
              <button
                key={l}
                type="button"
                onClick={() => setLayout(l)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  layout === l
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t[l]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Design Picker */}
      <div>
        <h3 className="text-sm font-semibold text-emerald-800 mb-3 flex items-center gap-2">
          <span className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700">2</span>
          {t.chooseDesign}
        </h3>
        <div className="relative">
          <button type="button" onClick={() => scrollDesigns("left")} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 flex items-center justify-center rounded-full bg-white/90 shadow-md border border-gray-200 hover:bg-white transition-all">
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </button>
          <div ref={designScrollRef} className="flex gap-3 overflow-x-auto pb-3 px-10 scrollbar-hide">
            {CARD_DESIGNS.map((design) => (
              <button
                key={design.id}
                type="button"
                onClick={() => setSelectedDesign(design)}
                className={`shrink-0 w-[72px] h-24 rounded-xl border-2 transition-all relative overflow-hidden ${
                  selectedDesign.id === design.id
                    ? "border-emerald-500 ring-2 ring-emerald-300 scale-105 shadow-lg"
                    : "border-transparent hover:border-gray-300 hover:scale-[1.03] shadow-sm"
                }`}
              >
                <EidCardMini design={design} />
                {selectedDesign.id === design.id && (
                  <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
                    <Check className="h-2.5 w-2.5 text-white" />
                  </span>
                )}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => scrollDesigns("right")} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 flex items-center justify-center rounded-full bg-white/90 shadow-md border border-gray-200 hover:bg-white transition-all">
            <ChevronRight className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Step 3: Message */}
      <div>
        <h3 className="text-sm font-semibold text-emerald-800 mb-3 flex items-center gap-2">
          <span className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700">3</span>
          {t.yourMessage}
        </h3>
        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder={t.yourMessage + "..."}
            dir={isRTL ? "rtl" : "ltr"}
            rows={4}
            className={`w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 focus:outline-none resize-none transition-all ${isRTL ? "pl-28" : "pr-28"}`}
          />
          <button
            type="button"
            onClick={generateAIMessage}
            disabled={isGenerating}
            className={`absolute top-2.5 ${isRTL ? "left-2" : "right-2"} flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-xs font-medium hover:from-violet-600 hover:to-indigo-600 transition-all disabled:opacity-50 shadow-sm hover:shadow-md`}
          >
            {isGenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            {isGenerating ? t.generating : t.generateAI}
          </button>
        </div>
      </div>

      {/* Step 4: Your Name */}
      <div>
        <h3 className="text-sm font-semibold text-emerald-800 mb-3 flex items-center gap-2">
          <span className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700">4</span>
          {t.yourName}
        </h3>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t.yourName + "..."}
          dir={isRTL ? "rtl" : "ltr"}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all"
        />
      </div>

      {/* Settings (Font, Sizes) */}
      <button
        type="button"
        onClick={() => setShowSettings(!showSettings)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-700 transition-colors"
      >
        <Settings2 className="h-4 w-4" />
        {t.cardSettings}
      </button>

      <AnimatePresence>
        {showSettings && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="space-y-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1">
                  <Type className="h-3 w-3" />
                  {t.chooseFont}
                </label>
                <div className="flex gap-2">
                  {FONT_STYLES.map((fs) => (
                    <button
                      key={fs.id}
                      type="button"
                      onClick={() => setFontStyle(fs)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        fontStyle.id === fs.id
                          ? "bg-emerald-600 text-white"
                          : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <span className={fs.className}>{fs.preview}</span>{" "}
                      {fs.label[lang]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1">
                    <Type className="h-3 w-3" /> {t.messageSize}
                  </label>
                  <div className="flex gap-1">
                    {(["small", "medium", "large"] as TextSize[]).map((s) => (
                      <button key={s} type="button" onClick={() => setMessageSize(s)} className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${messageSize === s ? "bg-emerald-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"}`}>{t[s]}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1">
                    <Type className="h-3 w-3" /> {t.nameSize}
                  </label>
                  <div className="flex gap-1">
                    {(["small", "medium", "large"] as TextSize[]).map((s) => (
                      <button key={s} type="button" onClick={() => setNameSize(s)} className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${nameSize === s ? "bg-emerald-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"}`}>{t[s]}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons (bottom) */}
      <div className="flex flex-wrap gap-2 justify-center pt-4">
        <Button onClick={handleDownload} disabled={downloading} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 rounded-xl px-5 h-10">
          {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {t.download}
        </Button>
        <Button onClick={handleShare} variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 gap-2 rounded-xl px-5 h-10">
          <Share2 className="h-4 w-4" />
          {t.share}
        </Button>
        <Button onClick={handleWhatsApp} variant="outline" className="border-green-400 text-green-700 hover:bg-green-50 gap-2 rounded-xl px-5 h-10">
          <MessageCircle className="h-4 w-4" />
          {t.shareWhatsApp}
        </Button>
        {"ClipboardItem" in (typeof window !== "undefined" ? window : {}) && (
          <Button onClick={handleCopyClipboard} variant="outline" className={`gap-2 rounded-xl px-5 h-10 ${copiedClipboard ? "border-emerald-400 text-emerald-600 bg-emerald-50" : "border-gray-300 text-gray-600 hover:bg-gray-50"}`}>
            {copiedClipboard ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
            {copiedClipboard ? t.copiedToClipboard : t.copyToClipboard}
          </Button>
        )}
        <Button onClick={() => setShowEmailModal(true)} variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50 gap-2 rounded-xl px-5 h-10">
          <Mail className="h-4 w-4" />
          {t.shareEmail}
        </Button>
      </div>

      {/* Email Modal */}
      <AnimatePresence>
        {showEmailModal && (
          <EmailCaptchaModal lang={lang} t={t} message={message} eidMubarak={t.eidMubarak} onClose={() => setShowEmailModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Email Captcha Modal ───

function EmailCaptchaModal({ lang, t, message, eidMubarak, onClose }: {
  lang: TransLang;
  t: (typeof EID_PAGE_TEXTS)["en"];
  message: string;
  eidMubarak: string;
  onClose: () => void;
}) {
  const isRTL = lang === "ar" || lang === "ur";
  const [email, setEmail] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [error, setError] = useState("");
  const [captcha] = useState(() => {
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 20) + 1;
    return { a, b, answer: a + b };
  });

  const handleSend = () => {
    if (parseInt(captchaAnswer) !== captcha.answer) {
      setError(t.wrongAnswer);
      setCaptchaAnswer("");
      return;
    }
    const subject = encodeURIComponent(t.emailSubject);
    const body = encodeURIComponent(`${t.emailBody}\n\n---\n\n${message}\n\n— ${eidMubarak}\n\nSent from IhsanWealth (ihsan-wealth.onrender.com)`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    onClose();
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed inset-0 z-[9999] flex items-center justify-center p-4" dir={isRTL ? "rtl" : "ltr"}>
        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              {t.verifyTitle}
            </h3>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">{t.recipientEmail}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 focus:outline-none" />
          </div>
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <p className="text-sm font-medium text-amber-800 mb-2">{t.verifyPrompt}</p>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-amber-700 font-mono">{captcha.a} + {captcha.b} = ?</span>
              <input type="number" value={captchaAnswer} onChange={(e) => { setCaptchaAnswer(e.target.value); setError(""); }} className="w-20 rounded-lg border border-amber-300 px-3 py-2 text-center text-lg font-bold focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 focus:outline-none" placeholder="?" />
            </div>
            {error && <p className="text-xs text-red-600 mt-1.5 font-medium">{error}</p>}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 rounded-xl">{t.cancel}</Button>
            <Button onClick={handleSend} disabled={!email || !captchaAnswer} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2">
              <Mail className="h-4 w-4" />{t.verify}
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
