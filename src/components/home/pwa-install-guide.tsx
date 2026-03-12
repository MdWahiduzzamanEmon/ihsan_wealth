"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Download, Share, PlusSquare, Check, Monitor, Apple, ChevronDown } from "lucide-react";
import { fadeIn } from "@/lib/animations";
import type { TransLang } from "@/lib/islamic-content";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// Capture the beforeinstallprompt event globally so we don't miss it
// if it fires before the React component mounts.
let globalDeferredPrompt: BeforeInstallPromptEvent | null = null;

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    globalDeferredPrompt = e as BeforeInstallPromptEvent;
  });
}

const PWA_TEXTS: Record<TransLang, {
  title: string;
  subtitle: string;
  installBtn: string;
  followSteps: string;
  step1: string;
  step2ios: string;
  step2android: string;
  step3: string;
  installed: string;
  iosLabel: string;
  androidLabel: string;
}> = {
  en: {
    title: "Install IhsanWealth",
    subtitle: "Use it like a native app — offline access, home screen shortcut, fast loading.",
    installBtn: "Install App",
    followSteps: "Follow these steps to install",
    step1: "Open IhsanWealth in your browser",
    step2ios: "Tap the Share button, then \"Add to Home Screen\"",
    step2android: "Tap the menu (⋮), then \"Install app\" or \"Add to Home Screen\"",
    step3: "The app icon will appear on your home screen",
    installed: "App is already installed!",
    iosLabel: "iOS / Safari",
    androidLabel: "Android / Chrome",
  },
  bn: {
    title: "IhsanWealth ইনস্টল করুন",
    subtitle: "নেটিভ অ্যাপের মতো ব্যবহার করুন — অফলাইন অ্যাক্সেস, হোম স্ক্রিন শর্টকাট, দ্রুত লোডিং।",
    installBtn: "অ্যাপ ইনস্টল",
    followSteps: "ইনস্টল করতে এই ধাপগুলি অনুসরণ করুন",
    step1: "আপনার ব্রাউজারে IhsanWealth খুলুন",
    step2ios: "শেয়ার বাটনে ট্যাপ করুন, তারপর \"হোম স্ক্রিনে যোগ করুন\"",
    step2android: "মেনু (⋮) ট্যাপ করুন, তারপর \"অ্যাপ ইনস্টল করুন\" বা \"হোম স্ক্রিনে যোগ করুন\"",
    step3: "অ্যাপ আইকনটি আপনার হোম স্ক্রিনে দেখা যাবে",
    installed: "অ্যাপ ইতিমধ্যে ইনস্টল করা আছে!",
    iosLabel: "iOS / Safari",
    androidLabel: "Android / Chrome",
  },
  ur: {
    title: "IhsanWealth انسٹال کریں",
    subtitle: "مقامی ایپ کی طرح استعمال کریں — آف لائن رسائی، ہوم اسکرین شارٹ کٹ، تیز لوڈنگ۔",
    installBtn: "ایپ انسٹال",
    followSteps: "انسٹال کرنے کے لیے ان مراحل پر عمل کریں",
    step1: "اپنے براؤزر میں IhsanWealth کھولیں",
    step2ios: "شیئر بٹن دبائیں، پھر \"ہوم اسکرین میں شامل کریں\"",
    step2android: "مینو (⋮) دبائیں، پھر \"ایپ انسٹال کریں\" یا \"ہوم اسکرین میں شامل کریں\"",
    step3: "ایپ آئیکن آپ کی ہوم اسکرین پر نظر آئے گا",
    installed: "!ایپ پہلے سے انسٹال ہے",
    iosLabel: "iOS / Safari",
    androidLabel: "Android / Chrome",
  },
  ar: {
    title: "تثبيت إحسان الثروة",
    subtitle: "استخدمه كتطبيق أصلي — وصول بدون إنترنت، اختصار على الشاشة الرئيسية، تحميل سريع.",
    installBtn: "تثبيت التطبيق",
    followSteps: "اتبع هذه الخطوات للتثبيت",
    step1: "افتح إحسان الثروة في متصفحك",
    step2ios: "اضغط على زر المشاركة، ثم \"إضافة إلى الشاشة الرئيسية\"",
    step2android: "اضغط على القائمة (⋮)، ثم \"تثبيت التطبيق\" أو \"إضافة إلى الشاشة الرئيسية\"",
    step3: "سيظهر رمز التطبيق على شاشتك الرئيسية",
    installed: "!التطبيق مثبت بالفعل",
    iosLabel: "iOS / Safari",
    androidLabel: "Android / Chrome",
  },
  tr: {
    title: "IhsanWealth'i Yükleyin",
    subtitle: "Yerel uygulama gibi kullanın — çevrimdışı erişim, ana ekran kısayolu, hızlı yükleme.",
    installBtn: "Uygulamayı Yükle",
    followSteps: "Yüklemek için bu adımları izleyin",
    step1: "Tarayıcınızda IhsanWealth'i açın",
    step2ios: "Paylaş düğmesine dokunun, ardından \"Ana Ekrana Ekle\"",
    step2android: "Menüye (⋮) dokunun, ardından \"Uygulamayı yükle\" veya \"Ana Ekrana Ekle\"",
    step3: "Uygulama simgesi ana ekranınızda görünecek",
    installed: "Uygulama zaten yüklü!",
    iosLabel: "iOS / Safari",
    androidLabel: "Android / Chrome",
  },
  ms: {
    title: "Pasang IhsanWealth",
    subtitle: "Gunakan seperti aplikasi asli — akses luar talian, pintasan skrin utama, pemuatan pantas.",
    installBtn: "Pasang Aplikasi",
    followSteps: "Ikuti langkah-langkah ini untuk memasang",
    step1: "Buka IhsanWealth dalam pelayar anda",
    step2ios: "Ketik butang Kongsi, kemudian \"Tambah ke Skrin Utama\"",
    step2android: "Ketik menu (⋮), kemudian \"Pasang aplikasi\" atau \"Tambah ke Skrin Utama\"",
    step3: "Ikon aplikasi akan muncul di skrin utama anda",
    installed: "Aplikasi sudah dipasang!",
    iosLabel: "iOS / Safari",
    androidLabel: "Android / Chrome",
  },
  id: {
    title: "Pasang IhsanWealth",
    subtitle: "Gunakan seperti aplikasi asli — akses offline, pintasan layar utama, loading cepat.",
    installBtn: "Pasang Aplikasi",
    followSteps: "Ikuti langkah-langkah ini untuk menginstal",
    step1: "Buka IhsanWealth di browser Anda",
    step2ios: "Ketuk tombol Bagikan, lalu \"Tambahkan ke Layar Utama\"",
    step2android: "Ketuk menu (⋮), lalu \"Instal aplikasi\" atau \"Tambahkan ke Layar Utama\"",
    step3: "Ikon aplikasi akan muncul di layar utama Anda",
    installed: "Aplikasi sudah terpasang!",
    iosLabel: "iOS / Safari",
    androidLabel: "Android / Chrome",
  },
};

interface PWAInstallGuideProps {
  lang: TransLang;
}

export function PWAInstallGuide({ lang }: PWAInstallGuideProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const t = PWA_TEXTS[lang];
  const isRTL = lang === "ar" || lang === "ur";

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Check if we already captured the prompt before mount
    if (globalDeferredPrompt) {
      setDeferredPrompt(globalDeferredPrompt);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      globalDeferredPrompt = e as BeforeInstallPromptEvent;
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
      globalDeferredPrompt = null;
    }
  };

  if (isInstalled) return null;

  const isIOS = typeof navigator !== "undefined" && /iPhone|iPad|iPod/.test(navigator.userAgent);

  return (
    <motion.section
      className="mx-auto max-w-5xl px-4 py-4"
      variants={fadeIn}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      dir={isRTL ? "rtl" : undefined}
    >
      <div className="relative overflow-hidden rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30 p-5 sm:p-6 shadow-sm">
        {/* Decorative pattern */}
        <div className="absolute top-0 right-0 w-40 h-40 opacity-[0.04] pointer-events-none">
          <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
            <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-emerald-800" />
            <circle cx="80" cy="80" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-emerald-800" />
            <path d="M80 10L150 80L80 150L10 80Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-emerald-800" />
          </svg>
        </div>

        <div className="relative flex flex-col sm:flex-row items-start gap-5">
          {/* App icon */}
          <div className="shrink-0">
            <div className="relative">
              <Image
                src="/favicon.svg"
                alt="IhsanWealth"
                width={56}
                height={56}
                className="rounded-2xl shadow-lg shadow-emerald-500/20"
              />
              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-amber-400 flex items-center justify-center shadow-sm">
                <Download className="h-3 w-3 text-amber-900" />
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-base">{t.title}</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{t.subtitle}</p>

            {/* Install button — prominent when native prompt is available */}
            {deferredPrompt ? (
              <button
                onClick={handleInstall}
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 hover:from-emerald-500 hover:to-emerald-600 hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
              >
                <Download className="h-4 w-4" />
                {t.installBtn}
              </button>
            ) : (
              <button
                onClick={() => setShowSteps((v) => !v)}
                className="mt-3 inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Download className="h-4 w-4" />
                {t.installBtn}
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showSteps ? "rotate-180" : ""}`} />
              </button>
            )}

            {/* Manual steps — shown only when there's no native prompt AND user expands */}
            {!deferredPrompt && showSteps && (
              <div className="mt-4">
                <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-2 font-medium">{t.followSteps}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="flex items-start gap-2 rounded-lg bg-emerald-50/60 border border-emerald-100/80 p-2.5">
                    <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">1</span>
                    <p className="text-[11px] text-gray-600 leading-relaxed">{t.step1}</p>
                  </div>
                  <div className="flex items-start gap-2 rounded-lg bg-emerald-50/60 border border-emerald-100/80 p-2.5">
                    <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">2</span>
                    <div className="flex items-start gap-1.5">
                      {isIOS ? (
                        <Share className="h-3 w-3 text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <PlusSquare className="h-3 w-3 text-emerald-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="text-[11px] text-gray-600 leading-relaxed">{isIOS ? t.step2ios : t.step2android}</p>
                        <span className="inline-flex items-center gap-1 mt-1 text-[9px] text-gray-400">
                          {isIOS ? <Apple className="h-2.5 w-2.5" /> : <Monitor className="h-2.5 w-2.5" />}
                          {isIOS ? t.iosLabel : t.androidLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 rounded-lg bg-emerald-50/60 border border-emerald-100/80 p-2.5">
                    <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                      <Check className="h-3 w-3" />
                    </span>
                    <p className="text-[11px] text-gray-600 leading-relaxed">{t.step3}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
