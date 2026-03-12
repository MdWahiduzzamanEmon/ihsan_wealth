"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { fadeIn } from "@/lib/animations";
import type { TransLang } from "@/lib/islamic-content";

const TEXTS: Record<TransLang, { title: string; desc: string; btn: string; via: string }> = {
  en: {
    title: "Sadaqah Jariyah",
    desc: "This app is completely free and open source. If it benefits you, consider supporting its development as Sadaqah Jariyah — a charity that continues to earn reward.",
    btn: "Support this project",
    via: "Donate via",
  },
  bn: {
    title: "সদকায়ে জারিয়া",
    desc: "এই অ্যাপটি সম্পূর্ণ বিনামূল্যে এবং ওপেন সোর্স। যদি এটি আপনার উপকারে আসে, সদকায়ে জারিয়া হিসেবে এর উন্নয়নে সহযোগিতা করুন — এমন দান যার সওয়াব অব্যাহত থাকে।",
    btn: "সহযোগিতা করুন",
    via: "দান করুন",
  },
  ur: {
    title: "صدقہ جاریہ",
    desc: "یہ ایپ مکمل طور پر مفت اور اوپن سورس ہے۔ اگر اس سے آپ کو فائدہ ہو تو اس کی ترقی میں صدقہ جاریہ کے طور پر تعاون کریں۔",
    btn: "تعاون کریں",
    via: "عطیہ دیں",
  },
  ar: {
    title: "صدقة جارية",
    desc: "هذا التطبيق مجاني بالكامل ومفتوح المصدر. إذا استفدت منه، فكّر في دعم تطويره كصدقة جارية — صدقة يستمر أجرها.",
    btn: "ادعم المشروع",
    via: "تبرع عبر",
  },
  tr: {
    title: "Sadaka-i Cariye",
    desc: "Bu uygulama tamamen ucretsiz ve acik kaynaklidir. Faydasini gorduyseniz, gelistirilmesine sadaka-i cariye olarak destek olabilirsiniz.",
    btn: "Destek Olun",
    via: "Bağış yapın",
  },
  ms: {
    title: "Sedekah Jariah",
    desc: "Aplikasi ini percuma sepenuhnya dan sumber terbuka. Jika ia memberi manfaat, pertimbangkan untuk menyokong pembangunannya sebagai sedekah jariah.",
    btn: "Sokong Projek Ini",
    via: "Derma melalui",
  },
  id: {
    title: "Sedekah Jariah",
    desc: "Aplikasi ini sepenuhnya gratis dan open source. Jika bermanfaat bagi Anda, pertimbangkan untuk mendukung pengembangannya sebagai sedekah jariah.",
    btn: "Dukung Proyek Ini",
    via: "Donasi melalui",
  },
};

export function DonationAppeal({ lang }: { lang: TransLang }) {
  const t = TEXTS[lang];
  const isRTL = lang === "ar" || lang === "ur";

  return (
    <motion.section
      variants={fadeIn}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className="mx-auto max-w-5xl px-4 py-2"
      dir={isRTL ? "rtl" : undefined}
    >
      <div className="rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50/40 via-white to-amber-50/30 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 shadow-sm">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-sm">
              <span className="font-arabic text-rose-600/70 text-xs mr-2">صدقة جارية</span>
              {t.title}
            </h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{t.desc}</p>

            {/* Payment methods */}
            <div className="mt-3 flex items-center gap-3 flex-wrap">
              <span className="text-[10px] text-gray-400 font-medium">{t.via}:</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-full bg-[#E2136E]/8 border border-[#E2136E]/15 px-2.5 py-1">
                  <Image src="/bkash-logo.png" alt="bKash" width={56} height={20} className="h-5 w-auto object-contain" />
                </div>
                <div className="flex items-center rounded-full bg-[#F6921E]/8 border border-[#F6921E]/15 px-2.5 py-1">
                  <Image src="/nagad-logo.png" alt="Nagad" width={56} height={20} className="h-5 w-auto object-contain" />
                </div>
              </div>
            </div>
          </div>
          <a
            href="#support-sadaqah"
            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:shadow-md hover:from-rose-600 hover:to-pink-700 transition-all active:scale-[0.98]"
          >
            <Heart className="h-3.5 w-3.5" />
            {t.btn}
          </a>
        </div>
      </div>
    </motion.section>
  );
}
