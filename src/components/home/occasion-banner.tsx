"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { gregorianToHijri, getHijriAdjustment } from "@/lib/hijri-utils";
import type { TransLang } from "@/lib/islamic-content";

interface OccasionBannerProps {
  lang: TransLang;
  countryCode: string;
}

// ─── Occasion definitions ───

interface Occasion {
  id: string;
  arabic: string;
  greeting: Record<TransLang, string>;
  reference: Record<TransLang, string>;
  source: string;
  theme: "emerald" | "amber" | "violet" | "rose" | "blue" | "teal";
}

const THEMES = {
  emerald: {
    border: "border-emerald-200",
    bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/40",
    arabicText: "text-emerald-700/70",
    heading: "text-emerald-900",
    ref: "text-emerald-700/70",
    source: "text-emerald-600/50",
    dot: "bg-emerald-500",
  },
  amber: {
    border: "border-amber-200",
    bg: "bg-gradient-to-br from-amber-50 to-amber-100/40",
    arabicText: "text-amber-700/70",
    heading: "text-amber-900",
    ref: "text-amber-700/70",
    source: "text-amber-600/50",
    dot: "bg-amber-500",
  },
  violet: {
    border: "border-violet-200",
    bg: "bg-gradient-to-br from-violet-50 to-violet-100/40",
    arabicText: "text-violet-700/70",
    heading: "text-violet-900",
    ref: "text-violet-700/70",
    source: "text-violet-600/50",
    dot: "bg-violet-500",
  },
  rose: {
    border: "border-rose-200",
    bg: "bg-gradient-to-br from-rose-50 to-rose-100/40",
    arabicText: "text-rose-700/70",
    heading: "text-rose-900",
    ref: "text-rose-700/70",
    source: "text-rose-600/50",
    dot: "bg-rose-500",
  },
  blue: {
    border: "border-blue-200",
    bg: "bg-gradient-to-br from-blue-50 to-blue-100/40",
    arabicText: "text-blue-700/70",
    heading: "text-blue-900",
    ref: "text-blue-700/70",
    source: "text-blue-600/50",
    dot: "bg-blue-500",
  },
  teal: {
    border: "border-teal-200",
    bg: "bg-gradient-to-br from-teal-50 to-teal-100/40",
    arabicText: "text-teal-700/70",
    heading: "text-teal-900",
    ref: "text-teal-700/70",
    source: "text-teal-600/50",
    dot: "bg-teal-500",
  },
};

const JUMMAH: Occasion = {
  id: "jummah",
  arabic: "جُمُعَة مُبَارَكَة",
  greeting: {
    en: "Jummah Mubarak",
    bn: "জুমআ মুবারাক",
    ur: "جمعہ مبارک",
    ar: "جمعة مباركة",
    tr: "Hayirli Cumalar",
    ms: "Jumaat Mubarakah",
    id: "Jumat Mubarakah",
  },
  reference: {
    en: "The best day on which the sun rises is Friday.",
    bn: "সূর্য উদিত হয় এমন দিনগুলোর মধ্যে সর্বোত্তম দিন হলো জুমআর দিন।",
    ur: "سورج جس دن طلوع ہوتا ہے ان میں سب سے بہتر دن جمعہ کا دن ہے۔",
    ar: "خَيْرُ يَوْمٍ طَلَعَتْ عَلَيْهِ الشَّمْسُ يَوْمُ الْجُمُعَةِ",
    tr: "Gunesin dogdugu en hayirli gun cuma gunudur.",
    ms: "Sebaik-baik hari matahari terbit ialah hari Jumaat.",
    id: "Sebaik-baik hari matahari terbit adalah hari Jumat.",
  },
  source: "Sahih Muslim 854",
  theme: "emerald",
};

const RAMADAN: Occasion = {
  id: "ramadan",
  arabic: "رَمَضَان كَرِيم",
  greeting: {
    en: "Ramadan Kareem",
    bn: "রমযান কারীম",
    ur: "رمضان کریم",
    ar: "رمضان كريم",
    tr: "Ramazan-i Serif",
    ms: "Ramadan Kareem",
    id: "Ramadhan Kareem",
  },
  reference: {
    en: "When Ramadan begins, the gates of Paradise are opened.",
    bn: "যখন রমযান আসে, জান্নাতের দরজাসমূহ খুলে দেওয়া হয়।",
    ur: "جب رمضان آتا ہے تو جنت کے دروازے کھول دیے جاتے ہیں۔",
    ar: "إِذَا دَخَلَ رَمَضَانُ فُتِّحَتْ أَبْوَابُ الْجَنَّةِ",
    tr: "Ramazan geldiginde cennet kapilari acilir.",
    ms: "Apabila tiba Ramadan, pintu-pintu syurga dibuka.",
    id: "Ketika Ramadhan tiba, pintu-pintu surga dibuka.",
  },
  source: "Sahih al-Bukhari 1899",
  theme: "amber",
};

const LAST_TEN_NIGHTS: Occasion = {
  id: "last10",
  arabic: "لَيْلَةُ الْقَدْرِ خَيْرٌ مِنْ أَلْفِ شَهْرٍ",
  greeting: {
    en: "Last 10 Nights of Ramadan",
    bn: "রমযানের শেষ ১০ রাত",
    ur: "رمضان کی آخری دس راتیں",
    ar: "العشر الأواخر من رمضان",
    tr: "Ramazanin Son 10 Gecesi",
    ms: "10 Malam Terakhir Ramadan",
    id: "10 Malam Terakhir Ramadhan",
  },
  reference: {
    en: "The Night of Decree is better than a thousand months.",
    bn: "লাইলাতুল কদর হাজার মাসের চেয়ে উত্তম।",
    ur: "شبِ قدر ہزار مہینوں سے بہتر ہے۔",
    ar: "لَيْلَةُ الْقَدْرِ خَيْرٌ مِنْ أَلْفِ شَهْرٍ",
    tr: "Kadir gecesi bin aydan daha hayirlidir.",
    ms: "Lailatulqadar lebih baik daripada seribu bulan.",
    id: "Lailatul Qadr lebih baik dari seribu bulan.",
  },
  source: "Surah Al-Qadr 97:3",
  theme: "violet",
};

const EID_AL_FITR: Occasion = {
  id: "eid-fitr",
  arabic: "عِيدُ الْفِطْرِ مُبَارَك",
  greeting: {
    en: "Eid Mubarak",
    bn: "ঈদ মুবারাক",
    ur: "عید مبارک",
    ar: "عيد مبارك",
    tr: "Bayramınız Kutlu Olsun",
    ms: "Selamat Hari Raya Aidilfitri",
    id: "Selamat Hari Raya Idul Fitri",
  },
  reference: {
    en: "For every people there is a feast and this is our feast.",
    bn: "প্রতিটি জাতির জন্য উৎসব আছে, আর এটি আমাদের উৎসব।",
    ur: "ہر قوم کی عید ہوتی ہے اور یہ ہماری عید ہے۔",
    ar: "إِنَّ لِكُلِّ قَوْمٍ عِيدًا وَهَذَا عِيدُنَا",
    tr: "Her milletin bir bayrami vardir, bu da bizim bayramimizdir.",
    ms: "Setiap umat ada hari rayanya, dan ini hari raya kita.",
    id: "Setiap umat ada hari rayanya, dan ini hari raya kita.",
  },
  source: "Sahih al-Bukhari 952",
  theme: "rose",
};

const EID_AL_ADHA: Occasion = {
  id: "eid-adha",
  arabic: "عِيدُ الْأَضْحَى مُبَارَك",
  greeting: {
    en: "Eid al-Adha Mubarak",
    bn: "ঈদুল আযহা মুবারাক",
    ur: "عید الاضحیٰ مبارک",
    ar: "عيد الأضحى مبارك",
    tr: "Kurban Bayraminiz Kutlu Olsun",
    ms: "Selamat Hari Raya Aidiladha",
    id: "Selamat Hari Raya Idul Adha",
  },
  reference: {
    en: "There is no deed more beloved to Allah on these days than good deeds.",
    bn: "এই দিনগুলোতে আল্লাহর কাছে নেক আমলের চেয়ে বেশি প্রিয় কোনো আমল নেই।",
    ur: "ان دنوں میں اللہ کو نیک عمل سے زیادہ پسندیدہ کوئی عمل نہیں۔",
    ar: "مَا مِنْ أَيَّامٍ الْعَمَلُ الصَّالِحُ فِيهَا أَحَبُّ إِلَى اللَّهِ",
    tr: "Bu gunlerde Allah'a salih amelden daha sevimli bir amel yoktur.",
    ms: "Tiada amalan yang lebih dikasihi Allah pada hari-hari ini.",
    id: "Tiada amalan yang lebih dicintai Allah pada hari-hari ini.",
  },
  source: "Sahih al-Bukhari 969",
  theme: "rose",
};

const DAY_OF_ARAFAH: Occasion = {
  id: "arafah",
  arabic: "يَوْمُ عَرَفَة",
  greeting: {
    en: "Day of Arafah",
    bn: "আরাফার দিন",
    ur: "یوم عرفہ",
    ar: "يوم عرفة",
    tr: "Arefe Gunu",
    ms: "Hari Arafah",
    id: "Hari Arafah",
  },
  reference: {
    en: "Fasting on the Day of Arafah expiates the sins of two years.",
    bn: "আরাফার দিনের রোযা দুই বছরের গুনাহ মাফ করে।",
    ur: "عرفہ کے دن کا روزہ دو سال کے گناہوں کا کفارہ ہے۔",
    ar: "صِيَامُ يَوْمِ عَرَفَةَ يُكَفِّرُ سَنَتَيْنِ",
    tr: "Arefe gunu orucu iki yillik gunahlara kefarettir.",
    ms: "Puasa hari Arafah menghapus dosa dua tahun.",
    id: "Puasa hari Arafah menghapus dosa dua tahun.",
  },
  source: "Sahih Muslim 1162",
  theme: "teal",
};

const DHUL_HIJJAH_FIRST_TEN: Occasion = {
  id: "dhul-hijjah",
  arabic: "عَشْرُ ذِي الْحِجَّة",
  greeting: {
    en: "Blessed Days of Dhul Hijjah",
    bn: "যিলহজের বরকতময় দিনসমূহ",
    ur: "ذوالحجہ کے مبارک ایام",
    ar: "أيام ذي الحجة المباركة",
    tr: "Zilhicce'nin Mubarek Gunleri",
    ms: "Hari-hari Zulhijjah yang Diberkati",
    id: "Hari-hari Dzulhijjah yang Diberkati",
  },
  reference: {
    en: "No days are greater and more beloved to Allah than these ten days.",
    bn: "এই দশ দিনের চেয়ে আল্লাহর কাছে উত্তম ও প্রিয় কোনো দিন নেই।",
    ur: "ان دس دنوں سے بڑھ کر اللہ کو محبوب کوئی دن نہیں۔",
    ar: "مَا مِنْ أَيَّامٍ أَعْظَمُ عِنْدَ اللَّهِ وَلَا أَحَبُّ إِلَيْهِ",
    tr: "Allah katinda bu on gunden daha buyuk ve sevimli gun yoktur.",
    ms: "Tiada hari yang lebih agung dan dicintai Allah daripada sepuluh hari ini.",
    id: "Tiada hari yang lebih agung dan dicintai Allah daripada sepuluh hari ini.",
  },
  source: "Sahih Ibn Hibban 3853",
  theme: "teal",
};

const ISRA_MIRAJ: Occasion = {
  id: "isra-miraj",
  arabic: "الْإِسْرَاءُ وَالْمِعْرَاجُ",
  greeting: {
    en: "Isra wal Mi'raj",
    bn: "শবে মেরাজ",
    ur: "شبِ معراج",
    ar: "الإسراء والمعراج",
    tr: "Mirac Kandili",
    ms: "Israk Mikraj",
    id: "Isra Mi'raj",
  },
  reference: {
    en: "Glory be to the One Who took His servant by night from the Sacred Mosque to the Farthest Mosque.",
    bn: "পবিত্র সেই সত্তা যিনি তাঁর বান্দাকে রাতে মসজিদুল হারাম থেকে মসজিদুল আকসায় নিয়ে গেছেন।",
    ur: "پاک ہے وہ ذات جو اپنے بندے کو رات میں مسجد حرام سے مسجد اقصیٰ لے گئی۔",
    ar: "سُبْحَانَ الَّذِي أَسْرَى بِعَبْدِهِ لَيْلًا مِنَ الْمَسْجِدِ الْحَرَامِ إِلَى الْمَسْجِدِ الْأَقْصَى",
    tr: "Kulunu bir gece Mescid-i Haram'dan Mescid-i Aksa'ya goturenin sani yucedir.",
    ms: "Maha Suci yang memperjalankan hamba-Nya pada malam hari dari Masjidilharam ke Masjidilaksa.",
    id: "Maha Suci yang memperjalankan hamba-Nya pada malam hari dari Masjidilharam ke Masjidilaqsa.",
  },
  source: "Surah Al-Isra 17:1",
  theme: "blue",
};

const SHAB_E_BARAT: Occasion = {
  id: "shab-e-barat",
  arabic: "لَيْلَةُ الْبَرَاءَة",
  greeting: {
    en: "Shab-e-Barat",
    bn: "শবে বরাত",
    ur: "شبِ برات",
    ar: "ليلة البراءة",
    tr: "Berat Kandili",
    ms: "Nisfu Syaaban",
    id: "Nisfu Sya'ban",
  },
  reference: {
    en: "Allah looks at His creation on the middle night of Sha'ban and forgives all except the polytheist and the one who harbors hatred.",
    bn: "আল্লাহ শাবানের মধ্য রাতে তাঁর সৃষ্টির দিকে তাকান এবং মুশরিক ও বিদ্বেষী ব্যতীত সকলকে ক্ষমা করেন।",
    ur: "اللہ شعبان کی درمیانی رات اپنی مخلوق کی طرف دیکھتا ہے اور مشرک اور کینہ رکھنے والے کے سوا سب کو معاف کر دیتا ہے۔",
    ar: "يَطَّلِعُ اللَّهُ إِلَى خَلْقِهِ فِي لَيْلَةِ النِّصْفِ مِنْ شَعْبَانَ فَيَغْفِرُ لِجَمِيعِ خَلْقِهِ",
    tr: "Allah, Saban'in ortasi gecesi kullarina nazar eder ve musrik ile kin besleyenler disinda hepsini bagislar.",
    ms: "Allah memandang makhluk-Nya pada malam Nisfu Syaaban dan mengampunkan semua kecuali musyrik dan yang berdendam.",
    id: "Allah memandang makhluk-Nya pada malam Nisfu Sya'ban dan mengampuni semua kecuali musyrik dan yang bermusuhan.",
  },
  source: "Sunan Ibn Majah 1390",
  theme: "blue",
};

const ASHURA: Occasion = {
  id: "ashura",
  arabic: "يَوْمُ عَاشُورَاء",
  greeting: {
    en: "Day of Ashura",
    bn: "আশুরার দিন",
    ur: "یومِ عاشوراء",
    ar: "يوم عاشوراء",
    tr: "Asure Gunu",
    ms: "Hari Asyura",
    id: "Hari Asyura",
  },
  reference: {
    en: "Fasting on the Day of Ashura, I hope that Allah will expiate the sins of the year before it.",
    bn: "আশুরার দিনের রোযা, আমি আশা করি আল্লাহ এর দ্বারা পূর্ববর্তী বছরের গুনাহ মাফ করবেন।",
    ur: "عاشوراء کے دن کا روزہ، مجھے امید ہے اللہ اس سے پچھلے سال کے گناہ معاف فرمائیں گے۔",
    ar: "صِيَامُ يَوْمِ عَاشُورَاءَ أَحْتَسِبُ عَلَى اللَّهِ أَنْ يُكَفِّرَ السَّنَةَ الَّتِي قَبْلَهُ",
    tr: "Asure gunu orucunun, gecen yilin gunahlarini kefaret etmesini umarim.",
    ms: "Puasa hari Asyura, saya berharap Allah mengampunkan dosa setahun sebelumnya.",
    id: "Puasa hari Asyura, saya berharap Allah mengampuni dosa setahun sebelumnya.",
  },
  source: "Sahih Muslim 1162",
  theme: "teal",
};

const ISLAMIC_NEW_YEAR: Occasion = {
  id: "new-year",
  arabic: "رَأْسُ السَّنَةِ الْهِجْرِيَّة",
  greeting: {
    en: "Islamic New Year",
    bn: "ইসলামী নববর্ষ",
    ur: "اسلامی نیا سال",
    ar: "رأس السنة الهجرية",
    tr: "Hicri Yilbasi",
    ms: "Tahun Baru Islam",
    id: "Tahun Baru Islam",
  },
  reference: {
    en: "Indeed, the number of months with Allah is twelve months in the Book of Allah.",
    bn: "নিশ্চয়ই আল্লাহর বিধানে মাসের সংখ্যা বারোটি, আল্লাহর কিতাব অনুসারে।",
    ur: "اللہ کے ہاں مہینوں کی تعداد بارہ ہے، اللہ کی کتاب میں۔",
    ar: "إِنَّ عِدَّةَ الشُّهُورِ عِنْدَ اللَّهِ اثْنَا عَشَرَ شَهْرًا فِي كِتَابِ اللَّهِ",
    tr: "Allah katinda aylarin sayisi on ikidir, Allah'in kitabinda.",
    ms: "Sesungguhnya bilangan bulan di sisi Allah ialah dua belas bulan dalam kitab Allah.",
    id: "Sesungguhnya bilangan bulan di sisi Allah adalah dua belas bulan dalam kitab Allah.",
  },
  source: "Surah At-Tawbah 9:36",
  theme: "emerald",
};

const MAWLID: Occasion = {
  id: "mawlid",
  arabic: "مَوْلِدُ النَّبِيِّ ﷺ",
  greeting: {
    en: "Mawlid al-Nabi",
    bn: "ঈদে মিলাদুন্নবী",
    ur: "عید میلاد النبی ﷺ",
    ar: "المولد النبوي الشريف",
    tr: "Mevlid Kandili",
    ms: "Maulidur Rasul",
    id: "Maulid Nabi",
  },
  reference: {
    en: "Indeed, Allah and His angels send blessings upon the Prophet.",
    bn: "নিশ্চয়ই আল্লাহ ও তাঁর ফেরেশতাগণ নবীর প্রতি দরূদ পাঠান।",
    ur: "بیشک اللہ اور اس کے فرشتے نبی پر درود بھیجتے ہیں۔",
    ar: "إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ",
    tr: "Allah ve melekleri, Peygamber'e salat ederler.",
    ms: "Sesungguhnya Allah dan malaikat-Nya berselawat ke atas Nabi.",
    id: "Sesungguhnya Allah dan malaikat-Nya berselawat ke atas Nabi.",
  },
  source: "Surah Al-Ahzab 33:56",
  theme: "emerald",
};

// ─── Detect active occasions ───

function getActiveOccasions(countryCode: string): Occasion[] {
  const now = new Date();
  const isFriday = now.getDay() === 5;
  const adjustment = getHijriAdjustment(countryCode);
  const hijri = gregorianToHijri(now, adjustment);
  const { month, day } = hijri;

  const occasions: Occasion[] = [];

  // Friday — always first
  if (isFriday) occasions.push(JUMMAH);

  // Muharram
  if (month === 1 && day === 1) occasions.push(ISLAMIC_NEW_YEAR);
  if (month === 1 && (day === 9 || day === 10)) occasions.push(ASHURA);

  // Rabi al-Awwal
  if (month === 3 && day >= 11 && day <= 12) occasions.push(MAWLID);

  // Rajab
  if (month === 7 && day === 27) occasions.push(ISRA_MIRAJ);

  // Sha'ban
  if (month === 8 && (day === 14 || day === 15)) occasions.push(SHAB_E_BARAT);

  // Ramadan
  if (month === 9) {
    if (day >= 21) {
      occasions.push(LAST_TEN_NIGHTS);
    } else {
      occasions.push(RAMADAN);
    }
  }

  // Shawwal (Eid al-Fitr)
  if (month === 10 && day >= 1 && day <= 3) occasions.push(EID_AL_FITR);

  // Dhul Hijjah
  if (month === 12 && day >= 1 && day <= 9) occasions.push(DHUL_HIJJAH_FIRST_TEN);
  if (month === 12 && day === 9) occasions.push(DAY_OF_ARAFAH);
  if (month === 12 && day >= 10 && day <= 13) occasions.push(EID_AL_ADHA);

  return occasions;
}

// ─── Component ───

export function OccasionBanner({ lang, countryCode }: OccasionBannerProps) {
  const occasions = useMemo(() => getActiveOccasions(countryCode), [countryCode]);

  if (occasions.length === 0) return null;

  const isRTL = lang === "ar" || lang === "ur";

  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      className="mx-auto max-w-5xl px-4 mt-3"
      dir={isRTL ? "rtl" : undefined}
    >
      <div className={`grid gap-2.5 ${occasions.length === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
        {occasions.map((occasion) => {
          const t = THEMES[occasion.theme];
          return (
            <div
              key={occasion.id}
              className={`relative overflow-hidden rounded-xl border ${t.border} ${t.bg} p-4`}
            >
              {/* Decorative geometric corner */}
              <div className="absolute -top-3 -right-3 w-20 h-20 opacity-[0.05] pointer-events-none">
                <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                  <path d="M40 0L80 40L40 80L0 40Z" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-900" />
                  <circle cx="40" cy="40" r="16" fill="none" stroke="currentColor" strokeWidth="0.6" className="text-gray-900" />
                  <circle cx="40" cy="40" r="6" fill="none" stroke="currentColor" strokeWidth="0.4" className="text-gray-900" />
                </svg>
              </div>

              <div className="relative">
                {/* Arabic text */}
                <p className={`font-arabic text-base ${t.arabicText} leading-relaxed mb-1`} dir="rtl">
                  {occasion.arabic}
                </p>

                {/* Greeting */}
                <h3 className={`text-base font-bold ${t.heading} mb-1.5`}>
                  {occasion.greeting[lang]}
                </h3>

                {/* Separator dot line */}
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className={`h-1 w-1 rounded-full ${t.dot} opacity-40`} />
                  <div className={`h-px flex-1 ${t.dot} opacity-15`} />
                  <div className={`h-1 w-1 rounded-full ${t.dot} opacity-40`} />
                </div>

                {/* Reference */}
                <p className={`text-xs ${t.ref} leading-relaxed`}>
                  &ldquo;{occasion.reference[lang]}&rdquo;
                </p>
                <p className={`text-[10px] ${t.source} mt-1 font-medium`}>
                  — {occasion.source}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
