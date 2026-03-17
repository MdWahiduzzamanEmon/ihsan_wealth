"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, HandHelping, BookMarked, Calendar, Users } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { CurrentPrayerWidget } from "@/components/home/current-prayer-widget";
import { useVisitorCount } from "@/hooks/use-visitor-count";
import type { TransLang } from "@/lib/islamic-content";

const HERO_TEXTS: Record<
  TransLang,
  {
    tagline: string;
    about: string;
    quranVerse: string;
    quranRef: string;
    mission: string;
    free: string;
    ihsan: string;
    features: { label: string; href: string }[];
  }
> = {
  en: {
    tagline: "Your Complete Islamic Companion",
    about:
      "IhsanWealth brings together everything a Muslim needs in daily life — Zakat Calculator, Prayer Tracker, Quran, Duas, Qibla, Islamic Calendar, Tasbih, and more. All free, no ads, built with sincerity.",
    quranVerse:
      "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا",
    quranRef: "Surah An-Nisa 4:103",
    mission:
      '"Indeed, prayer has been decreed upon the believers a decree of specified times."',
    free: "100% Free & Open Source",
    ihsan: "Built with Ihsan",
    features: [
      { label: "Al-Quran", href: "/quran" },
      { label: "Dua", href: "/duas" },
      { label: "Hadith", href: "/hadith" },
      { label: "Calendar", href: "/calendar" },
    ],
  },
  bn: {
    tagline: "আপনার সম্পূর্ণ ইসলামী সহচর",
    about:
      "IhsanWealth একজন মুসলিমের দৈনন্দিন জীবনে প্রয়োজনীয় সবকিছু এক জায়গায় এনেছে — যাকাত ক্যালকুলেটর, নামায ট্র্যাকার, কুরআন, দু'আ, কিবলা, ইসলামী ক্যালেন্ডার, তাসবিহ এবং আরও অনেক কিছু। সম্পূর্ণ বিনামূল্যে, কোনো বিজ্ঞাপন নেই, ইখলাসের সাথে তৈরি।",
    quranVerse:
      "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا",
    quranRef: "সূরা আন-নিসা ৪:১০৩",
    mission: '"নিশ্চয়ই নামায মুমিনদের উপর নির্দিষ্ট সময়ে ফরয করা হয়েছে।"',
    free: "১০০% বিনামূল্যে ও ওপেন সোর্স",
    ihsan: "ইখলাসের সাথে নির্মিত",
    features: [
      { label: "আল-কুরআন", href: "/quran" },
      { label: "দু'আ", href: "/duas" },
      { label: "হাদিস", href: "/hadith" },
      { label: "ক্যালেন্ডার", href: "/calendar" },
    ],
  },
  ur: {
    tagline: "آپ کا مکمل اسلامی ساتھی",
    about:
      "IhsanWealth ایک مسلمان کی روزمرہ زندگی میں ضروری ہر چیز ایک جگہ لے کر آیا ہے — زکوٰۃ کیلکولیٹر، نماز ٹریکر، قرآن، دعائیں، قبلہ، اسلامی کیلنڈر، تسبیح اور بہت کچھ۔ بالکل مفت، کوئی اشتہار نہیں، اخلاص سے بنایا گیا۔",
    quranVerse:
      "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا",
    quranRef: "سورۃ النساء ۴:۱۰۳",
    mission: '"بے شک نماز مومنوں پر مقررہ اوقات میں فرض کی گئی ہے۔"',
    free: "۱۰۰٪ مفت اور اوپن سورس",
    ihsan: "اخلاص سے بنایا گیا",
    features: [
      { label: "القرآن", href: "/quran" },
      { label: "دعائیں", href: "/duas" },
      { label: "حدیث", href: "/hadith" },
      { label: "کیلنڈر", href: "/calendar" },
    ],
  },
  ar: {
    tagline: "رفيقك الإسلامي الشامل",
    about:
      "إحسان الثروة يجمع كل ما يحتاجه المسلم في حياته اليومية — حاسبة الزكاة، متتبع الصلاة، القرآن، الأدعية، القبلة، التقويم الإسلامي، التسبيح والمزيد. مجاني بالكامل، بدون إعلانات، مبني بإخلاص.",
    quranVerse:
      "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا",
    quranRef: "سورة النساء ٤:١٠٣",
    mission: '"إن الصلاة كانت على المؤمنين كتاباً موقوتاً"',
    free: "١٠٠٪ مجاني ومفتوح المصدر",
    ihsan: "مبني بإخلاص",
    features: [
      { label: "القرآن", href: "/quran" },
      { label: "الأدعية", href: "/duas" },
      { label: "الحديث", href: "/hadith" },
      { label: "التقويم", href: "/calendar" },
    ],
  },
  tr: {
    tagline: "Eksiksiz Islami Yoldasiniz",
    about:
      "IhsanWealth, bir Muslumanin gunluk hayatinda ihtiyac duydugu her seyi bir araya getiriyor — Zekat Hesaplayici, Namaz Takipcisi, Kuran, Dualar, Kible, Islami Takvim, Tesbih ve daha fazlasi. Tamamen ucretsiz, reklamsiz, ihlas ile yapilmis.",
    quranVerse:
      "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا",
    quranRef: "Nisa Suresi 4:103",
    mission: '"Suphesiz namaz, muminlere belirli vakitlerde farz kilinmistir."',
    free: "100% Ucretsiz ve Acik Kaynak",
    ihsan: "Ihlas ile yapildi",
    features: [
      { label: "Kuran-i Kerim", href: "/quran" },
      { label: "Dua", href: "/duas" },
      { label: "Hadis", href: "/hadith" },
      { label: "Takvim", href: "/calendar" },
    ],
  },
  ms: {
    tagline: "Teman Islam Lengkap Anda",
    about:
      "IhsanWealth menghimpunkan segala keperluan seorang Muslim dalam kehidupan harian — Kalkulator Zakat, Penjejak Solat, Al-Quran, Doa, Kiblat, Kalendar Islam, Tasbih dan banyak lagi. Percuma sepenuhnya, tiada iklan, dibina dengan ikhlas.",
    quranVerse:
      "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا",
    quranRef: "Surah An-Nisa 4:103",
    mission:
      '"Sesungguhnya solat itu telah ditetapkan ke atas orang-orang mukmin pada waktu-waktu yang tertentu."',
    free: "100% Percuma & Sumber Terbuka",
    ihsan: "Dibina dengan ikhlas",
    features: [
      { label: "Al-Quran", href: "/quran" },
      { label: "Doa", href: "/duas" },
      { label: "Hadis", href: "/hadith" },
      { label: "Kalendar", href: "/calendar" },
    ],
  },
  id: {
    tagline: "Pendamping Islam Lengkap Anda",
    about:
      "IhsanWealth menyatukan semua yang dibutuhkan seorang Muslim dalam kehidupan sehari-hari — Kalkulator Zakat, Pelacak Shalat, Al-Quran, Doa, Kiblat, Kalender Islam, Tasbih dan lainnya. Sepenuhnya gratis, tanpa iklan, dibuat dengan keikhlasan.",
    quranVerse:
      "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا",
    quranRef: "Surah An-Nisa 4:103",
    mission:
      '"Sesungguhnya shalat itu telah diwajibkan atas orang-orang mukmin pada waktu-waktu yang telah ditentukan."',
    free: "100% Gratis & Open Source",
    ihsan: "Dibuat dengan keikhlasan",
    features: [
      { label: "Al-Quran", href: "/quran" },
      { label: "Doa", href: "/duas" },
      { label: "Hadis", href: "/hadith" },
      { label: "Kalender", href: "/calendar" },
    ],
  },
};

const FEATURE_ICONS = [BookOpen, HandHelping, BookMarked, Calendar];

const VISITOR_LABELS: Record<TransLang, string> = {
  en: "Muslims visited",
  bn: "মুসলিম পরিদর্শন করেছেন",
  ur: "مسلمان آئے",
  ar: "مسلم زاروا",
  tr: "Müslüman ziyaret etti",
  ms: "Muslim melawat",
  id: "Muslim mengunjungi",
};

interface HeroSectionProps {
  lang: TransLang;
}

export function HeroSection({ lang }: HeroSectionProps) {
  const t = HERO_TEXTS[lang];
  const isRTL = lang === "ar" || lang === "ur";
  const visitorCount = useVisitorCount();

  return (
    <section
      className="relative overflow-hidden"
      dir={isRTL ? "rtl" : undefined}
    >
      {/* Dark background with layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950" />

        {/* Islamic geometric pattern — more visible */}
        <div className="absolute inset-0 opacity-[0.13]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="hero-geo"
                x="0"
                y="0"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M30 0L60 30L30 60L0 30Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.7"
                />
                <circle
                  cx="30"
                  cy="30"
                  r="12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.4"
                />
                <circle
                  cx="30"
                  cy="30"
                  r="4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.4"
                />
                <path
                  d="M30 0L30 60M0 30L60 30"
                  stroke="currentColor"
                  strokeWidth="0.2"
                />
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="url(#hero-geo)"
              className="text-emerald-300"
            />
          </svg>
        </div>

        {/* Top-center radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-radial-[at_50%_0%] from-emerald-500/30 via-emerald-700/10 to-transparent blur-3xl" />

        {/* Left ambient glow */}
        <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-emerald-600/15 blur-3xl" />
        {/* Right ambient glow */}
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl" />

        {/* Calligraphy watermark — more visible */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.07] pointer-events-none select-none overflow-hidden">
          <p
            className="font-arabic text-[120px] sm:text-[180px] text-white whitespace-nowrap leading-none"
            dir="rtl"
          >
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </p>
        </div>

        {/* Top shimmer line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-10 sm:py-14">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Brand identity */}
          <motion.div
            variants={staggerItem}
            className="text-center mb-8 sm:mb-10 md:block hidden"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="relative">
                <Image
                  src="/favicon.svg"
                  alt="IhsanWealth"
                  width={52}
                  height={52}
                  className="rounded-2xl shadow-lg shadow-black/30 ring-2 ring-white/10"
                />
                <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-400 border-2 border-emerald-950 animate-pulse" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                <span className="text-amber-400">Ihsan</span>
                <span className="text-white">Wealth</span>
              </h1>
            </div>

            <p
              className="font-arabic text-amber-400/60 text-base sm:text-lg mb-1.5"
              dir="rtl"
            >
              رفيقك الإسلامي الشامل
            </p>
            <p className="text-sm sm:text-base font-semibold text-emerald-100/80">
              {t.tagline}
            </p>

            {visitorCount !== null && (
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/[0.07] border border-white/10 px-4 py-1.5">
                <Users className="h-3.5 w-3.5 text-emerald-400/80" />
                <span className="text-xs font-medium text-emerald-200/80">
                  <span className="text-amber-300 font-bold">{visitorCount.toLocaleString()}</span>
                  {" "}{VISITOR_LABELS[lang]}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            )}
          </motion.div>

          {/* Two-column: About (3) + Quran (2) */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-5">
            {/* Next Prayer + Quick Links */}
            <motion.div
              variants={staggerItem}
              className="lg:col-span-3 relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 sm:p-6"
            >
              <CurrentPrayerWidget lang={lang} />

              {/* Quick feature links */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {t.features.map((feat, i) => {
                  const Icon = FEATURE_ICONS[i];
                  return (
                    <Link
                      key={feat.href}
                      href={feat.href}
                      className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 hover:bg-white/10 hover:border-emerald-400/30 transition-all group"
                    >
                      <Icon className="h-4 w-4 text-emerald-400/70 group-hover:text-emerald-300 transition-colors shrink-0" />
                      <span className="text-[11px] font-medium text-emerald-100/70 group-hover:text-white transition-colors truncate">
                        {feat.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>

            {/* Quran verse card */}
            <motion.div
              variants={staggerItem}
              className="lg:col-span-2 relative rounded-2xl border border-amber-400/15 bg-gradient-to-br from-amber-500/10 via-white/5 to-emerald-500/5 backdrop-blur-sm p-5 sm:p-6 overflow-hidden flex flex-col justify-center"
            >
              {/* Decorative corner arcs */}
              <div className="absolute top-0 right-0 w-24 h-24 opacity-[0.08] pointer-events-none">
                <svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M96 0A96 96 0 0 0 0 96"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.8"
                    className="text-amber-300"
                  />
                  <path
                    d="M96 20A76 76 0 0 0 20 96"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-amber-300"
                  />
                  <path
                    d="M96 40A56 56 0 0 0 40 96"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.3"
                    className="text-amber-300"
                  />
                </svg>
              </div>
              <div className="absolute bottom-0 left-0 w-24 h-24 opacity-[0.08] pointer-events-none rotate-180">
                <svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M96 0A96 96 0 0 0 0 96"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.8"
                    className="text-amber-300"
                  />
                  <path
                    d="M96 20A76 76 0 0 0 20 96"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-amber-300"
                  />
                </svg>
              </div>

              <div
                className="font-arabic text-amber-400/40 text-4xl leading-none mb-2 text-center"
                dir="rtl"
              >
                ❝
              </div>

              <p
                className="font-arabic text-lg sm:text-xl text-amber-200 leading-loose text-center mb-3"
                dir="rtl"
              >
                {t.quranVerse}
              </p>

              <div className="flex items-center gap-3 mb-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
                <div className="font-arabic text-amber-400/50 text-xs">✦</div>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
              </div>

              <p className="text-xs sm:text-sm text-emerald-100/90 italic text-center leading-relaxed">
                {t.mission}
              </p>
              <p className="text-[10px] text-amber-300/70 text-center mt-2 font-medium">
                — {t.quranRef}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Bottom fade into white page */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white/8 to-transparent" />
    </section>
  );
}
