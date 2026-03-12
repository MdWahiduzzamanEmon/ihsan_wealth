"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  BookOpenText,
  Calculator,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Clock,
  Compass,
  Heart,
  HelpCircle,
  History,
  Lightbulb,
  LogIn,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { getLangFromCountry, type TransLang } from "@/lib/islamic-content";
import { staggerContainer, staggerItem, fadeIn, slideUp } from "@/lib/animations";
import {
  GUIDE_PAGE_TEXTS,
  GUIDE_SECTIONS,
  type GuideSection,
} from "@/lib/guide-content";
import { DEFAULT_FORM_DATA, type ZakatFormData } from "@/types/zakat";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Calculator,
  ClipboardCheck,
  Clock,
  Compass,
  BookOpen,
  BookOpenText,
  CalendarDays,
  Heart,
  History,
};

const REQUIRES_LOGIN = new Set(["sadaqah", "history", "tasbih", "salat"]);

function GuideSectionCard({
  section,
  lang,
  index,
}: {
  section: GuideSection;
  lang: TransLang;
  index: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = ICON_MAP[section.icon] || BookOpen;
  const isRtl = lang === "ar" || lang === "ur";
  const needsLogin = REQUIRES_LOGIN.has(section.id);

  return (
    <motion.div
      variants={staggerItem}
      className="group relative overflow-hidden rounded-2xl border border-emerald-200/60 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Geometric accent top-right */}
      <div className="absolute -top-6 -right-6 h-24 w-24 opacity-[0.04]">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 0L100 50L50 100L0 50Z" stroke="currentColor" strokeWidth="2" className="text-emerald-800" />
          <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="2" className="text-emerald-800" />
          <path d="M50 30L70 50L50 70L30 50Z" stroke="currentColor" strokeWidth="2" className="text-emerald-800" />
        </svg>
      </div>

      {/* Header - always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <div className="flex items-center gap-4 p-5 sm:p-6">
          {/* Number + Icon */}
          <div className="flex shrink-0 flex-col items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
              {index + 1}
            </span>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-md shadow-emerald-200">
              <Icon className="h-5 w-5 text-white" />
            </div>
          </div>

          {/* Title area */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-emerald-900">
                {section.title[lang]}
              </h3>
              {needsLogin && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-medium text-amber-700">
                  <LogIn className="h-3 w-3" />
                  {GUIDE_PAGE_TEXTS.labels.requiresLogin[lang]}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-emerald-700/70">
              {section.subtitle[lang]}
            </p>
          </div>

          {/* Expand toggle */}
          <div className="shrink-0">
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-emerald-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-emerald-400" />
            )}
          </div>
        </div>
      </button>

      {/* Expandable content */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="border-t border-emerald-100"
          dir={isRtl ? "rtl" : "ltr"}
        >
          {/* Islamic Reference */}
          <div className="mx-5 mt-5 sm:mx-6 rounded-xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 p-5 text-center relative overflow-hidden">
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id={`pat-${section.id}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M20 0L40 20L20 40L0 20Z" fill="none" stroke="white" strokeWidth="0.5" />
                    <circle cx="20" cy="20" r="8" fill="none" stroke="white" strokeWidth="0.3" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#pat-${section.id})`} />
              </svg>
            </div>
            <p className="relative font-arabic text-xl sm:text-2xl leading-relaxed text-amber-300/90 mb-3" dir="rtl">
              {section.islamicRef.arabic}
            </p>
            <p className="relative text-sm text-emerald-100/80 italic max-w-lg mx-auto">
              &ldquo;{section.islamicRef.translation[lang]}&rdquo;
            </p>
            <p className="relative mt-2 text-xs text-emerald-300/50">
              {section.islamicRef.source}
            </p>
          </div>

          {/* Description - Why it matters */}
          <div className="px-5 pt-5 sm:px-6">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-emerald-800 mb-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              {GUIDE_PAGE_TEXTS.labels.whyImportant[lang]}
            </h4>
            <p className="text-sm leading-relaxed text-gray-600">
              {section.description[lang]}
            </p>
          </div>

          {/* Steps - How to use */}
          <div className="px-5 pt-5 sm:px-6">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-emerald-800 mb-3">
              <BookOpen className="h-4 w-4 text-emerald-600" />
              {GUIDE_PAGE_TEXTS.labels.howToUse[lang]}
            </h4>
            <ol className="space-y-2.5">
              {section.steps[lang].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-gray-600 pt-0.5">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Tips */}
          <div className="px-5 pt-5 pb-6 sm:px-6">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-emerald-800 mb-3">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              {GUIDE_PAGE_TEXTS.labels.tips[lang]}
            </h4>
            <ul className="space-y-2">
              {section.tips[lang].map((tip, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                  <span className="text-sm text-gray-600">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function GuidePage() {
  const [formData] = useLocalStorage<ZakatFormData>(
    "zakat-calculator-data",
    DEFAULT_FORM_DATA
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const countryCode = formData?.country || "US";
  const lang = getLangFromCountry(countryCode);
  const isRtl = lang === "ar" || lang === "ur";

  if (!mounted) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50/30 via-white to-amber-50/20">
        <Header countryCode={countryCode} />
        <main className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
        </main>
        <Footer countryCode={countryCode} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50/30 via-white to-amber-50/20">
      <Header countryCode={countryCode} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 py-12 sm:py-16">
          {/* Islamic geometric pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="guide-hero" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                  <path d="M40 0L80 40L40 80L0 40Z" fill="none" stroke="white" strokeWidth="0.5" />
                  <circle cx="40" cy="40" r="16" fill="none" stroke="white" strokeWidth="0.5" />
                  <path d="M40 24L56 40L40 56L24 40Z" fill="none" stroke="white" strokeWidth="0.5" />
                  <circle cx="40" cy="40" r="6" fill="none" stroke="white" strokeWidth="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#guide-hero)" />
            </svg>
          </div>

          <motion.div
            className="relative mx-auto max-w-4xl px-4 text-center"
            variants={fadeIn}
            initial="initial"
            animate="animate"
            dir={isRtl ? "rtl" : "ltr"}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5">
              <HelpCircle className="h-4 w-4 text-amber-300" />
              <span className="text-sm text-emerald-100">
                {lang === "ar" ? "دليل المستخدم" : lang === "bn" ? "ব্যবহারকারীর গাইড" : lang === "ur" ? "صارف رہنمائی" : lang === "tr" ? "Kullanim Kilavuzu" : lang === "ms" ? "Panduan Pengguna" : lang === "id" ? "Panduan Pengguna" : "User Guide"}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              {GUIDE_PAGE_TEXTS.heading[lang]}
            </h1>
            <p className="text-emerald-200/80 text-base sm:text-lg max-w-2xl mx-auto">
              {GUIDE_PAGE_TEXTS.subtitle[lang]}
            </p>
            <div className="mt-6 font-arabic text-amber-300/50 text-lg">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </div>
          </motion.div>
        </section>

        {/* What is IhsanWealth? */}
        <section className="mx-auto max-w-4xl px-4 pt-8 sm:pt-10">
          <motion.div
            className="rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/50 to-white p-6 sm:p-8 relative overflow-hidden"
            variants={slideUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
          >
            {/* Subtle pattern */}
            <div className="absolute -top-10 -right-10 h-40 w-40 opacity-[0.03]">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 0L100 50L50 100L0 50Z" stroke="currentColor" strokeWidth="2" className="text-emerald-800" />
                <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="2" className="text-emerald-800" />
              </svg>
            </div>

            <div className="text-center mb-5">
              <p className="font-arabic text-2xl sm:text-3xl text-emerald-700 mb-2">إحسان الثروة</p>
              <h2 className="text-xl sm:text-2xl font-bold text-emerald-900">
                {lang === "bn" ? "\"ইহসান ওয়েলথ\" এর অর্থ কী?" : lang === "ur" ? "\"احسان ویلتھ\" کا کیا مطلب ہے؟" : lang === "ar" ? "ماذا يعني \"إحسان الثروة\"؟" : lang === "tr" ? "\"IhsanWealth\" Ne Anlama Gelir?" : lang === "ms" ? "Apakah Maksud \"IhsanWealth\"?" : lang === "id" ? "Apa Arti \"IhsanWealth\"?" : "What Does \"IhsanWealth\" Mean?"}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6" dir={isRtl ? "rtl" : "ltr"}>
              {/* Ihsan */}
              <div className="rounded-xl border border-emerald-100 bg-white p-4 sm:p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                    <span className="font-arabic text-lg text-emerald-700">إحسان</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-900">Ihsan (إحسان)</h3>
                    <p className="text-xs text-muted-foreground">
                      {lang === "bn" ? "উৎকর্ষতা ও পূর্ণতা" : lang === "ur" ? "عمدگی اور کمال" : lang === "ar" ? "التميز والإتقان" : lang === "tr" ? "Mukemmellik ve Kusursuzluk" : lang === "ms" ? "Kecemerlangan & Kesempurnaan" : lang === "id" ? "Keunggulan & Kesempurnaan" : "Excellence & Perfection"}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {lang === "bn" ? "ইহসান অর্থ 'উৎকর্ষতা', 'পূর্ণতা' বা 'সুন্দর কাজ করা'। এটি ইসলামে ঈমানের সর্বোচ্চ স্তর — আল্লাহকে এমনভাবে ইবাদত করা যেন আপনি তাঁকে দেখছেন, এবং জানা যে তিনি আপনাকে দেখছেন। এটি আন্তরিকতা ও সর্বোত্তম নিয়তের সাথে সবকিছু করাকে বোঝায়।"
                    : lang === "ur" ? "احسان کا مطلب ہے 'عمدگی'، 'کمال' یا 'خوبصورت اعمال'۔ یہ اسلام میں ایمان کا اعلیٰ ترین درجہ ہے — اللہ کی عبادت ایسے کرنا جیسے آپ اسے دیکھ رہے ہوں، یہ جانتے ہوئے کہ وہ آپ کو دیکھ رہے ہیں۔"
                    : lang === "ar" ? "الإحسان يعني 'التميز' و'الإتقان' و'فعل الجميل'. وهو أعلى مراتب الإيمان في الإسلام — أن تعبد الله كأنك تراه، فإن لم تكن تراه فإنه يراك. يمثل فعل كل شيء بإخلاص وأفضل النوايا."
                    : lang === "tr" ? "Ihsan, Arapcada 'mukemmellik', 'kusursuzluk' veya 'guzel ameller yapmak' anlamina gelir. Islamda imanin en yuksek derecesidir — Allahi goruyormus gibi ibadet etmek, Onun sizi gordugunu bilerek."
                    : lang === "ms" ? "Ihsan bermaksud 'kecemerlangan', 'kesempurnaan' atau 'melakukan kebaikan'. Ia adalah tahap iman tertinggi dalam Islam — beribadah kepada Allah seolah-olah anda melihat-Nya, dengan mengetahui bahawa Dia melihat anda."
                    : lang === "id" ? "Ihsan berarti 'keunggulan', 'kesempurnaan' atau 'berbuat kebaikan'. Ini adalah tingkat iman tertinggi dalam Islam — beribadah kepada Allah seolah-olah Anda melihat-Nya, dengan mengetahui bahwa Dia melihat Anda."
                    : "Ihsan means 'excellence', 'perfection', or 'doing beautiful deeds' in Arabic. It is the highest level of faith in Islam — to worship Allah as though you see Him, knowing that He sees you. It represents doing everything with sincerity and the best of intentions."}
                </p>
                <div className="mt-3 rounded-lg bg-emerald-50 p-3">
                  <p className="font-arabic text-sm text-emerald-700 text-center" dir="rtl">
                    أَنْ تَعْبُدَ اللَّهَ كَأَنَّكَ تَرَاهُ فَإِنْ لَمْ تَكُنْ تَرَاهُ فَإِنَّهُ يَرَاكَ
                  </p>
                  <p className="text-xs text-emerald-600/80 text-center mt-1 italic">
                    {lang === "bn" ? "\"আল্লাহর ইবাদত করো যেন তুমি তাঁকে দেখছো, আর যদি তাঁকে না দেখো তবে জেনে রাখো তিনি তোমাকে দেখছেন\" — সহীহ মুসলিম"
                      : lang === "ur" ? "\"اللہ کی عبادت ایسے کرو جیسے تم اسے دیکھ رہے ہو، اگر نہیں دیکھ سکتے تو جان لو وہ تمہیں دیکھ رہے ہیں\" — صحیح مسلم"
                      : lang === "ar" ? "\"أن تعبد الله كأنك تراه، فإن لم تكن تراه فإنه يراك\" — صحيح مسلم"
                      : lang === "tr" ? "\"Allaha Onu goruyormus gibi ibadet et, sen Onu goremesen de O seni goruyor\" — Sahih Muslim"
                      : lang === "ms" ? "\"Beribadah kepada Allah seolah-olah kamu melihat-Nya, jika kamu tidak melihat-Nya maka sesungguhnya Dia melihatmu\" — Sahih Muslim"
                      : lang === "id" ? "\"Beribadahlah kepada Allah seolah-olah kamu melihat-Nya, jika kamu tidak melihat-Nya maka sesungguhnya Dia melihatmu\" — Sahih Muslim"
                      : "\"To worship Allah as if you see Him, and if you cannot see Him, then He sees you\" — Sahih Muslim"}
                  </p>
                </div>
              </div>

              {/* Wealth */}
              <div className="rounded-xl border border-amber-100 bg-white p-4 sm:p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                    <span className="text-lg">💰</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-900">
                      {lang === "bn" ? "ওয়েলথ (الثروة)" : lang === "ur" ? "ویلتھ (الثروة)" : lang === "ar" ? "الثروة (Wealth)" : "Wealth (الثروة)"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {lang === "bn" ? "উদ্দেশ্যমূলক নেয়ামত পরিচালনা" : lang === "ur" ? "نعمتوں کا بامقصد انتظام" : lang === "ar" ? "إدارة النعم بهدف" : lang === "tr" ? "Nimetleri Amacli Yonetme" : lang === "ms" ? "Mengurus Nikmat dengan Tujuan" : lang === "id" ? "Mengelola Nikmat dengan Tujuan" : "Managing Blessings with Purpose"}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {lang === "bn" ? "ইসলামে সম্পদ আল্লাহর পক্ষ থেকে একটি আমানত (বিশ্বাস)। এটি শুধু টাকা নয় — সব নেয়ামত ও সম্পদ অন্তর্ভুক্ত। ইহসানের সাথে সম্পদ পরিচালনা মানে দায়িত্বশীল, উদার হওয়া এবং যাকাতের মতো বাধ্যবাধকতা পূরণ করা।"
                    : lang === "ur" ? "اسلام میں دولت اللہ کی طرف سے ایک امانت ہے۔ یہ صرف پیسے نہیں — اس میں تمام نعمتیں اور وسائل شامل ہیں۔ احسان کے ساتھ دولت کا انتظام کا مطلب ہے ذمہ دار، فیاض ہونا اور زکوٰۃ جیسے فرائض ادا کرنا۔"
                    : lang === "ar" ? "المال في الإسلام أمانة من الله. ليس مجرد نقود بل يشمل جميع النعم والموارد. إدارة المال بإحسان تعني المسؤولية والكرم وأداء الواجبات كالزكاة."
                    : lang === "tr" ? "Islamda servet Allah'tan bir emanettir. Sadece para degil — tum nimetleri ve kaynaklari icerir. Serveti ihsanla yonetmek sorumluluk, comertlik ve zekat gibi yukumlulukleri yerine getirmek demektir."
                    : lang === "ms" ? "Harta dalam Islam dianggap amanah daripada Allah. Bukan hanya wang — ia merangkumi semua nikmat dan sumber. Mengurus harta dengan ihsan bermakna bertanggungjawab, dermawan dan menunaikan kewajipan seperti zakat."
                    : lang === "id" ? "Harta dalam Islam dianggap sebagai amanah dari Allah. Bukan hanya uang — meliputi semua nikmat dan sumber daya. Mengelola harta dengan ihsan berarti bertanggung jawab, dermawan, dan menunaikan kewajiban seperti zakat."
                    : "Wealth in Islam is considered an amanah (trust) from Allah. It is not just money — it includes all blessings and resources. Managing wealth with ihsan means being responsible, generous, and fulfilling your obligations like Zakat."}
                </p>
                <div className="mt-3 rounded-lg bg-amber-50 p-3">
                  <p className="text-xs text-amber-700 text-center italic">
                    {lang === "bn" ? "একত্রে, \"ইহসান ওয়েলথ\" অর্থ \"উৎকর্ষতা ও আধ্যাত্মিক সচেতনতার সাথে সম্পদ পরিচালনা\" — আল্লাহর সচেতনতায় সুন্দরভাবে ও সঠিকভাবে ইসলামী আর্থিক দায়িত্ব পালন।"
                      : lang === "ur" ? "مل کر، \"احسان ویلتھ\" کا مطلب ہے \"عمدگی اور روحانی شعور کے ساتھ دولت کا انتظام\" — اللہ کے شعور میں خوبصورتی اور درستگی سے اسلامی مالی فرائض ادا کرنا۔"
                      : lang === "ar" ? "معاً، \"إحسان الثروة\" يعني \"إدارة المال بالتميز والوعي الروحي\" — أداء الواجبات المالية الإسلامية بإتقان ودقة وبوعي الله."
                      : lang === "tr" ? "Birlikte, \"IhsanWealth\" \"servetinizi mukemmellik ve manevi bilinçle yönetmek\" anlamına gelir."
                      : lang === "ms" ? "Bersama, \"IhsanWealth\" bermaksud \"mengurus harta anda dengan kecemerlangan dan kesedaran rohani\" — menunaikan kewajipan kewangan Islam dengan indah dan tepat."
                      : lang === "id" ? "Bersama, \"IhsanWealth\" berarti \"mengelola harta Anda dengan keunggulan dan kesadaran spiritual\" — menunaikan kewajiban keuangan Islam dengan indah dan tepat."
                      : "Together, \"IhsanWealth\" means \"managing your wealth with excellence and spiritual mindfulness\" — fulfilling your Islamic financial duties beautifully, accurately, and with the consciousness of Allah."}
                  </p>
                </div>
              </div>
            </div>

            {/* Native language translation */}
            <div className="mt-5 rounded-xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 p-4 text-center">
              <p className="text-sm text-emerald-100/80 mb-1">
                {lang === "bn" ? "বাংলায়" : lang === "ur" ? "اردو میں" : lang === "ar" ? "بالعربية" : lang === "tr" ? "Turkce" : lang === "ms" ? "Bahasa Melayu" : lang === "id" ? "Bahasa Indonesia" : "In Your Language"}
              </p>
              <p className="text-base sm:text-lg text-amber-300 font-medium" dir={isRtl ? "rtl" : "ltr"}>
                {lang === "bn" ? "ইহসান ওয়েলথ = সৌন্দর্য ও উৎকর্ষতার সাথে সম্পদ ব্যবস্থাপনা"
                  : lang === "ur" ? "احسان ویلتھ = عمدگی اور روحانی شعور سے دولت کا انتظام"
                  : lang === "ar" ? "إحسان الثروة = إدارة المال بالتميز والوعي الروحي"
                  : lang === "tr" ? "IhsanWealth = Serveti mukemmellik ve manevi bilinçle yonetmek"
                  : lang === "ms" ? "IhsanWealth = Mengurus harta dengan kecemerlangan dan kesedaran rohani"
                  : lang === "id" ? "IhsanWealth = Mengelola harta dengan keunggulan dan kesadaran spiritual"
                  : "IhsanWealth = Managing wealth with excellence & spiritual mindfulness"}
              </p>
              <p className="text-xs text-emerald-200/60 mt-1" dir={isRtl ? "rtl" : "ltr"}>
                {lang === "bn" ? "\"ইহসান\" অর্থ উৎকর্ষতা, সৌন্দর্য ও আল্লাহর সচেতনতা। \"ওয়েলথ\" অর্থ সম্পদ। একসাথে এর অর্থ হলো আল্লাহর সন্তুষ্টির জন্য সুন্দরভাবে সম্পদ পরিচালনা করা।"
                  : lang === "ur" ? "\"احسان\" کا مطلب ہے عمدگی، خوبصورتی اور اللہ کا شعور۔ \"ویلتھ\" کا مطلب ہے دولت۔ مل کر اس کا مطلب ہے اللہ کی رضا کے لیے خوبصورتی سے دولت کا انتظام۔"
                  : lang === "ar" ? "\"إحسان\" يعني التميز والجمال والوعي بالله. \"الثروة\" تعني المال. معاً يعني إدارة المال بإتقان لمرضاة الله."
                  : lang === "tr" ? "\"Ihsan\" mukemmellik, guzellik ve Allah bilincidir. \"Wealth\" servet demektir. Birlikte, Allahin rizasi icin serveti guzel yonetmek anlamina gelir."
                  : lang === "ms" ? "\"Ihsan\" bermaksud kecemerlangan, keindahan dan kesedaran terhadap Allah. \"Wealth\" bermaksud harta. Bersama ia bermaksud mengurus harta dengan indah untuk keredaan Allah."
                  : lang === "id" ? "\"Ihsan\" berarti keunggulan, keindahan dan kesadaran terhadap Allah. \"Wealth\" berarti harta. Bersama berarti mengelola harta dengan indah untuk ridha Allah."
                  : "\"Ihsan\" means excellence, beauty and consciousness of Allah. \"Wealth\" means resources. Together it means beautifully managing wealth for the pleasure of Allah."}
              </p>
            </div>
          </motion.div>
        </section>

        {/* Getting Started */}
        <section className="mx-auto max-w-4xl px-4 py-8 sm:py-10">
          <motion.div
            className="rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50/80 to-white p-6 sm:p-8"
            variants={slideUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
            dir={isRtl ? "rtl" : "ltr"}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-md shadow-amber-200">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-emerald-900 mb-2">
                  {GUIDE_PAGE_TEXTS.gettingStarted.title[lang]}
                </h2>
                <p className="text-sm leading-relaxed text-gray-600">
                  {GUIDE_PAGE_TEXTS.gettingStarted.description[lang]}
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Feature Sections */}
        <section className="mx-auto max-w-4xl px-4 pb-8 sm:pb-10">
          <motion.div
            className="space-y-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
          >
            {GUIDE_SECTIONS.map((section, i) => (
              <GuideSectionCard
                key={section.id}
                section={section}
                lang={lang}
                index={i}
              />
            ))}
          </motion.div>
        </section>

        {/* Decorative separator */}
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent" />
            <div className="font-arabic text-emerald-300/50 text-lg">&#10022;</div>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent" />
          </div>
        </div>

        {/* Need Help? */}
        <section className="mx-auto max-w-4xl px-4 py-8 sm:py-10">
          <motion.div
            className="rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/50 to-white p-6 sm:p-8 text-center"
            variants={slideUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
            dir={isRtl ? "rtl" : "ltr"}
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <HelpCircle className="h-7 w-7 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-emerald-900 mb-3">
              {GUIDE_PAGE_TEXTS.needHelp.title[lang]}
            </h2>
            <p className="text-sm leading-relaxed text-gray-600 max-w-2xl mx-auto">
              {GUIDE_PAGE_TEXTS.needHelp.description[lang]}
            </p>
            <div className="mt-5">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700"
              >
                <Calculator className="h-4 w-4" />
                {lang === "ar" ? "ابدأ حساب الزكاة" : lang === "bn" ? "যাকাত হিসাব শুরু করুন" : lang === "ur" ? "زکوٰۃ حساب شروع کریں" : lang === "tr" ? "Zekat Hesaplamaya Basla" : lang === "ms" ? "Mula Kira Zakat" : lang === "id" ? "Mulai Hitung Zakat" : "Start Calculating Zakat"}
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer countryCode={countryCode} />
    </div>
  );
}
