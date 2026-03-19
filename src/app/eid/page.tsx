"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  PartyPopper,
  MessageSquareHeart,
  Palette,
  ArrowLeft,
  Moon,
  Star,
  ListChecks,
  Sticker,
  ImagePlus,
  Sparkles,
} from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { getLangFromCountry, type TransLang } from "@/lib/islamic-content";
import { DEFAULT_FORM_DATA, type ZakatFormData } from "@/types/zakat";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BismillahBanner } from "@/components/islamic/bismillah-banner";
import { EidMessagesList } from "@/components/eid/eid-messages-list";
import { EidCardCreator } from "@/components/eid/eid-card-creator";
import { EidCountdown } from "@/components/eid/eid-countdown";
import { EidTakbeerPlayer } from "@/components/eid/eid-takbeer-player";
import { EidChecklist } from "@/components/eid/eid-checklist";
import { EidReminder } from "@/components/eid/eid-reminder";
import { EidStickerPack } from "@/components/eid/eid-sticker-pack";
import { EidPhotoFrame } from "@/components/eid/eid-photo-frame";
import { EidSavingsCalculator } from "@/components/eid/eid-savings-calculator";
import { EidCaptionGenerator } from "@/components/eid/eid-caption-generator";
import { EidConfetti } from "@/components/eid/eid-confetti";
import { EidBackgroundMusic } from "@/components/eid/eid-background-music";
import { EID_PAGE_TEXTS } from "@/lib/eid-content";
import { fadeIn, slideUp } from "@/lib/animations";

type Tab = "card" | "messages" | "checklist" | "stickers" | "frames" | "captions" | "fun";

export default function EidPage() {
  const [formData] = useLocalStorage<ZakatFormData>(
    "zakat-calculator-data",
    DEFAULT_FORM_DATA,
  );
  const countryCode = formData.country;
  const lang = getLangFromCountry(countryCode) as TransLang;
  const t = EID_PAGE_TEXTS[lang];
  const isRTL = lang === "ar" || lang === "ur";

  const [activeTab, setActiveTab] = useState<Tab>("card");
  const [cardMessage, setCardMessage] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleSelectMessage = useCallback((message: string) => {
    setCardMessage(message);
    setTimeout(() => {
      setActiveTab("card");
      contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 400);
  }, []);

  const triggerConfetti = useCallback(() => {
    setShowConfetti(true);
  }, []);

  const tabs: { id: Tab; icon: React.ElementType; label: string }[] = [
    { id: "card", icon: Palette, label: t.createCard },
    { id: "messages", icon: MessageSquareHeart, label: t.browseMessages },
    { id: "stickers", icon: Sticker, label: t.stickerPack },
    { id: "frames", icon: ImagePlus, label: t.photoFrame },
    { id: "captions", icon: Sparkles, label: t.captionGenerator },
    { id: "checklist", icon: ListChecks, label: t.eidChecklist },
    { id: "fun", icon: PartyPopper, label: t.eidiCalculator },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50/30 via-white to-amber-50/20">
      <BismillahBanner countryCode={countryCode} />
      <Header countryCode={countryCode} />

      {/* Confetti overlay */}
      <EidConfetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />

      <main className="flex-1">
        {/* Hero Banner */}
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-amber-300/20"
                style={{ left: `${10 + i * 12}%`, top: `${15 + (i % 3) * 25}%` }}
                animate={{ y: [0, -15, 0], opacity: [0.15, 0.35, 0.15], rotate: [0, 180, 360] }}
                transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
              >
                <Star className="h-4 w-4" fill="currentColor" />
              </motion.div>
            ))}
            <motion.div
              className="absolute top-6 right-8 text-amber-400/15"
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
            >
              <Moon className="h-20 w-20" fill="currentColor" />
            </motion.div>
            <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="eid-hero-pat" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M25 0L50 25L25 50L0 25Z" fill="none" stroke="white" strokeWidth="0.5" />
                  <circle cx="25" cy="25" r="8" fill="none" stroke="white" strokeWidth="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#eid-hero-pat)" />
            </svg>
          </div>

          <div className="relative mx-auto max-w-5xl px-4 py-12 text-center" dir={isRTL ? "rtl" : "ltr"}>
            <motion.p variants={slideUp} initial="initial" animate="animate" className="font-arabic text-2xl text-amber-300/60 mb-3" dir="rtl">
              اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ لَا إِلَٰهَ إِلَّا اللَّهُ
            </motion.p>

            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }} className="inline-flex items-center gap-3 mb-4">
              <PartyPopper className="h-8 w-8 text-amber-400" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">{t.pageTitle}</h1>
              <PartyPopper className="h-8 w-8 text-amber-400 scale-x-[-1]" />
            </motion.div>

            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-emerald-200/80 text-sm md:text-base max-w-lg mx-auto">
              {t.pageSubtitle}
            </motion.p>

            {/* Takbeer + Background Music */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex flex-col items-center gap-3 mt-4">
              <p className="font-arabic text-sm text-amber-200/40" dir="rtl">وَاللَّهُ أَكْبَرُ وَلِلَّهِ الْحَمْدُ</p>
              <div className="flex items-center gap-2">
                <EidTakbeerPlayer lang={lang} />
                <EidBackgroundMusic lang={lang} />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Countdown */}
        <EidCountdown lang={lang} countryCode={countryCode} />
        <EidReminder lang={lang} />

        {/* Back link */}
        <div className="mx-auto max-w-5xl px-4 mt-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-700 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            {t.back}
          </Link>
        </div>

        {/* Tab Switcher — 6 tabs, horizontally scrollable */}
        <div ref={contentRef} className="mx-auto max-w-5xl px-4 mt-6 scroll-mt-4">
          <div className="overflow-x-auto scrollbar-hide max-w-full">
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mx-auto min-w-max">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === tab.id ? "bg-white text-emerald-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-3xl px-4 py-8">
          <AnimatePresence mode="wait">
            {activeTab === "card" && (
              <motion.div key="card" variants={fadeIn} initial="initial" animate="animate" exit="exit">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">{t.cardCreatorTitle}</h2>
                  <p className="text-sm text-gray-500 mt-1">{t.cardCreatorSubtitle}</p>
                </div>
                <EidCardCreator lang={lang} message={cardMessage} onMessageChange={setCardMessage} onSuccess={triggerConfetti} />
              </motion.div>
            )}
            {activeTab === "messages" && (
              <motion.div key="messages" variants={fadeIn} initial="initial" animate="animate" exit="exit">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">{t.messagesTitle}</h2>
                  <p className="text-sm text-gray-500 mt-1">{t.messagesSubtitle}</p>
                </div>
                <EidMessagesList lang={lang} onSelectMessage={handleSelectMessage} />
              </motion.div>
            )}
            {activeTab === "stickers" && (
              <motion.div key="stickers" variants={fadeIn} initial="initial" animate="animate" exit="exit">
                <EidStickerPack lang={lang} />
              </motion.div>
            )}
            {activeTab === "frames" && (
              <motion.div key="frames" variants={fadeIn} initial="initial" animate="animate" exit="exit">
                <EidPhotoFrame lang={lang} />
              </motion.div>
            )}
            {activeTab === "checklist" && (
              <motion.div key="checklist" variants={fadeIn} initial="initial" animate="animate" exit="exit">
                <EidChecklist lang={lang} />
              </motion.div>
            )}
            {activeTab === "captions" && (
              <motion.div key="captions" variants={fadeIn} initial="initial" animate="animate" exit="exit">
                <EidCaptionGenerator lang={lang} />
              </motion.div>
            )}
            {activeTab === "fun" && (
              <motion.div key="fun" variants={fadeIn} initial="initial" animate="animate" exit="exit">
                <EidSavingsCalculator lang={lang} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer countryCode={countryCode} />
    </div>
  );
}
