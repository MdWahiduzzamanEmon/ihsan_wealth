import type { TransLang } from "@/lib/islamic-content";
import {
  Coins,
  Clock,
  ListChecks,
  Compass,
  BookOpen,
  HandHelping,
  Calendar,
  HandCoins,
  History,
  Sparkles,
  Lightbulb,
  Infinity,
  BookMarked,
  UserCircle,
  Heart,
  GraduationCap,
  PartyPopper,
  type LucideIcon,
} from "lucide-react";

export interface AppFeature {
  id: string;
  href: string;
  icon: LucideIcon;
  /** Lucide icon name string (for guide-content.ts matching) */
  iconName: string;
  label: Record<TransLang, string>;
  arabic: string;
  description: Record<TransLang, string>;
  /** Gradient colors for features grid */
  color: string;
  /** Icon background for features grid */
  iconBg: string;
  /** Where this feature appears in the header nav */
  nav: "primary" | "more";
  /** Whether to show on the features grid on home page */
  showInGrid: boolean;
  /** Whether to show on the site map */
  showInSiteMap: boolean;
}

/**
 * Single source of truth for all app features.
 * Adding a feature here automatically adds it to:
 * - Header navigation (primary or "More" dropdown)
 * - Features grid on home page
 * - Site map page
 *
 * Guide content is in guide-content.ts (requires manual content writing).
 */
export const APP_FEATURES: AppFeature[] = [
  {
    id: "calculator",
    href: "/calculator",
    icon: Coins,
    iconName: "Coins",
    label: {
      en: "Zakat Calculator", bn: "যাকাত ক্যালকুলেটর", ur: "زکوٰۃ کیلکولیٹر",
      ar: "حاسبة الزكاة", tr: "Zekat Hesaplayici", ms: "Kalkulator Zakat", id: "Kalkulator Zakat",
    },
    arabic: "حاسبة الزكاة",
    description: {
      en: "Calculate your Zakat with live gold & silver prices, multiple asset types, and Madhab support",
      bn: "সরাসরি সোনা ও রূপার দামে, একাধিক সম্পদের ধরন এবং মাযহাব সমর্থন সহ আপনার যাকাত হিসাব করুন",
      ur: "سونے اور چاندی کی براہ راست قیمتوں، مختلف اثاثوں اور مذہب کی سہولت کے ساتھ اپنی زکوٰۃ کا حساب لگائیں",
      ar: "احسب زكاتك بأسعار الذهب والفضة الحية وأنواع متعددة من الأصول ودعم المذاهب",
      tr: "Canli altin ve gumus fiyatlari, cesitli varlik turleri ve mezhep destegi ile zekatinizi hesaplayin",
      ms: "Kira zakat anda dengan harga emas & perak langsung, pelbagai jenis aset, dan sokongan Mazhab",
      id: "Hitung zakat Anda dengan harga emas & perak langsung, berbagai jenis aset, dan dukungan Mazhab",
    },
    color: "from-emerald-500 to-emerald-700",
    iconBg: "bg-emerald-100 text-emerald-700",
    nav: "primary",
    showInGrid: true,
    showInSiteMap: true,
  },
  {
    id: "salat-tracker",
    href: "/salat-tracker",
    icon: ListChecks,
    iconName: "ListChecks",
    label: {
      en: "Salat Tracker", bn: "সালাত ট্র্যাকার", ur: "سلات ٹریکر",
      ar: "متتبع الصلاة", tr: "Salat Takipçisi", ms: "Penjejak Solat", id: "Pelacak Salat",
    },
    arabic: "متتبع الصلاة",
    description: {
      en: "Track your daily prayers, build streaks, view reports, and compete on the leaderboard",
      bn: "আপনার দৈনিক নামাজ ট্র্যাক করুন, ধারা তৈরি করুন, রিপোর্ট দেখুন এবং লিডারবোর্ডে প্রতিযোগিতা করুন",
      ur: "اپنی روزانہ نمازیں ٹریک کریں، تسلسل بنائیں، رپورٹیں دیکھیں اور لیڈربورڈ پر مقابلہ کریں",
      ar: "تتبع صلواتك اليومية وابنِ تسلسلات واعرض التقارير وتنافس على لوحة المتصدرين",
      tr: "Günlük namazlarınızı takip edin, seriler oluşturun, raporları görün ve sıralamada yarışın",
      ms: "Jejak solat harian anda, bina rangkaian, lihat laporan, dan bersaing di papan pendahulu",
      id: "Lacak shalat harian Anda, bangun rangkaian, lihat laporan, dan bersaing di papan peringkat",
    },
    color: "from-green-500 to-green-700",
    iconBg: "bg-green-100 text-green-700",
    nav: "primary",
    showInGrid: true,
    showInSiteMap: true,
  },
  {
    id: "prayer",
    href: "/prayer-times",
    icon: Clock,
    iconName: "Clock",
    label: {
      en: "Salat Times", bn: "সালাতের সময়", ur: "سلات کے اوقات",
      ar: "أوقات الصلاة", tr: "Salat Vakitleri", ms: "Waktu Solat", id: "Waktu Salat",
    },
    arabic: "مواقيت الصلاة",
    description: {
      en: "Accurate salat times based on your location with live countdown to next prayer",
      bn: "আপনার অবস্থান অনুযায়ী সঠিক সালাতের সময় এবং পরবর্তী সালাতের কাউন্টডাউন",
      ur: "آپ کے مقام کی بنیاد پر سلات کے درست اوقات اور اگلی سلات کا کاؤنٹ ڈاؤن",
      ar: "أوقات صلاة دقيقة بناءً على موقعك مع عد تنازلي للصلاة التالية",
      tr: "Konumunuza gore dogru salat vakitleri ve bir sonraki salata geri sayim",
      ms: "Waktu solat tepat berdasarkan lokasi anda dengan undur detik ke solat seterusnya",
      id: "Waktu salat akurat berdasarkan lokasi Anda dengan hitung mundur ke salat berikutnya",
    },
    color: "from-blue-500 to-blue-700",
    iconBg: "bg-blue-100 text-blue-700",
    nav: "primary",
    showInGrid: true,
    showInSiteMap: true,
  },
  {
    id: "qibla",
    href: "/qibla",
    icon: Compass,
    iconName: "Compass",
    label: {
      en: "Qibla Finder", bn: "কিবলা খুঁজুন", ur: "قبلہ فائنڈر",
      ar: "اتجاه القبلة", tr: "Kible Bulucu", ms: "Pencari Kiblat", id: "Pencari Kiblat",
    },
    arabic: "اتجاه القبلة",
    description: {
      en: "Find the direction of the Kaaba with an interactive compass and GPS",
      bn: "ইন্টারেক্টিভ কম্পাস এবং জিপিএস দিয়ে কাবার দিক খুঁজুন",
      ur: "انٹرایکٹو کمپاس اور جی پی ایس سے کعبے کی سمت معلوم کریں",
      ar: "اعثر على اتجاه الكعبة باستخدام بوصلة تفاعلية ونظام GPS",
      tr: "Interaktif pusula ve GPS ile Kabe yonunu bulun",
      ms: "Cari arah Kaabah dengan kompas interaktif dan GPS",
      id: "Temukan arah Kakbah dengan kompas interaktif dan GPS",
    },
    color: "from-amber-500 to-amber-700",
    iconBg: "bg-amber-100 text-amber-700",
    nav: "more",
    showInGrid: true,
    showInSiteMap: true,
  },
  {
    id: "quran",
    href: "/quran",
    icon: BookOpen,
    iconName: "BookOpen",
    label: {
      en: "Quran", bn: "কুরআন", ur: "قرآن",
      ar: "القرآن", tr: "Kuran", ms: "Al-Quran", id: "Al-Quran",
    },
    arabic: "تفهيم القرآن",
    description: {
      en: "Read the Holy Quran with Maududi's Tafhimul Quran translation and tafsir commentary",
      bn: "মাওদূদীর তাফহীমুল কুরআন অনুবাদ ও তাফসীর সহ পবিত্র কুরআন পড়ুন",
      ur: "مولانا مودودی کی تفہیم القرآن ترجمے اور تفسیر کے ساتھ قرآن مجید پڑھیں",
      ar: "اقرأ القرآن الكريم مع ترجمة وتفسير تفهيم القرآن للمودودي",
      tr: "Mevdudi'nin Tefhimul Kuran tercume ve tefsiri ile Kuran-i Kerim'i okuyun",
      ms: "Baca Al-Quran dengan terjemahan dan tafsir Tafhimul Quran oleh Maududi",
      id: "Baca Al-Quran dengan terjemahan dan tafsir Tafhimul Quran oleh Maududi",
    },
    color: "from-cyan-500 to-cyan-700",
    iconBg: "bg-cyan-100 text-cyan-700",
    nav: "primary",
    showInGrid: true,
    showInSiteMap: true,
  },
  {
    id: "duas",
    href: "/duas",
    icon: HandHelping,
    iconName: "HandHelping",
    label: {
      en: "Duas", bn: "দু'আ", ur: "دعائیں",
      ar: "الأدعية", tr: "Dualar", ms: "Doa", id: "Doa",
    },
    arabic: "مجموعة الأدعية",
    description: {
      en: "30+ essential daily duas with Arabic, transliteration, and translation",
      bn: "আরবি, উচ্চারণ এবং অনুবাদ সহ ৩০+ প্রয়োজনীয় দৈনিক দু'আ",
      ur: "عربی، اردو ترجمے اور تلفظ کے ساتھ ۳۰+ ضروری روزمرہ دعائیں",
      ar: "أكثر من ٣٠ دعاء يومي أساسي بالعربية والترجمة والتحويل الصوتي",
      tr: "Arapca, transliterasyon ve tercume ile 30+ temel gunluk dua",
      ms: "30+ doa harian penting dengan Arab, transliterasi, dan terjemahan",
      id: "30+ doa harian penting dengan Arab, transliterasi, dan terjemahan",
    },
    color: "from-purple-500 to-purple-700",
    iconBg: "bg-purple-100 text-purple-700",
    nav: "primary",
    showInGrid: true,
    showInSiteMap: true,
  },
  {
    id: "tasbih",
    href: "/tasbih",
    icon: Infinity,
    iconName: "Infinity",
    label: {
      en: "Tasbih", bn: "তাসবিহ", ur: "تسبیح",
      ar: "التسبيح", tr: "Tesbih", ms: "Tasbih", id: "Tasbih",
    },
    arabic: "عدّاد التسبيح",
    description: {
      en: "Digital dhikr counter with preset targets, vibration, and daily stats",
      bn: "প্রিসেট লক্ষ্য, ভাইব্রেশন এবং দৈনিক পরিসংখ্যান সহ ডিজিটাল যিকর কাউন্টার",
      ur: "پری سیٹ اہداف، وائبریشن اور روزانہ اعداد و شمار کے ساتھ ڈیجیٹل ذکر کاؤنٹر",
      ar: "عدّاد ذكر رقمي مع أهداف محددة واهتزاز وإحصائيات يومية",
      tr: "Hedef, titresim ve gunluk istatistiklerle dijital zikir sayaci",
      ms: "Pembilang zikir digital dengan sasaran, getaran dan statistik harian",
      id: "Penghitung zikir digital dengan target, getaran, dan statistik harian",
    },
    color: "from-violet-500 to-violet-700",
    iconBg: "bg-violet-100 text-violet-700",
    nav: "primary",
    showInGrid: true,
    showInSiteMap: true,
  },
  {
    id: "hadith",
    href: "/hadith",
    icon: BookMarked,
    iconName: "BookMarked",
    label: {
      en: "Hadith", bn: "হাদিস", ur: "حদیث",
      ar: "الحديث", tr: "Hadis", ms: "Hadis", id: "Hadis",
    },
    arabic: "حديث اليوم",
    description: {
      en: "Daily hadith with translations, favorites, and sharing",
      bn: "অনুবাদ, পছন্দসমূহ এবং শেয়ারিং সহ দৈনিক হাদিস",
      ur: "ترجمے، پسندیدہ اور شیئرنگ کے ساتھ روزانہ حدیث",
      ar: "حديث يومي مع الترجمة والمفضلة والمشاركة",
      tr: "Tercume, favoriler ve paylasim ile gunluk hadis",
      ms: "Hadis harian dengan terjemahan, kegemaran dan perkongsian",
      id: "Hadis harian dengan terjemahan, favorit, dan berbagi",
    },
    color: "from-cyan-500 to-cyan-700",
    iconBg: "bg-cyan-100 text-cyan-700",
    nav: "more",
    showInGrid: true,
    showInSiteMap: true,
  },
  {
    id: "calendar",
    href: "/calendar",
    icon: Calendar,
    iconName: "Calendar",
    label: {
      en: "Calendar", bn: "ক্যালেন্ডার", ur: "کیلنڈر",
      ar: "التقويم", tr: "Takvim", ms: "Kalendar", id: "Kalender",
    },
    arabic: "التقويم الهجري",
    description: {
      en: "Islamic calendar with events, date converter, and important dates highlighted",
      bn: "ইভেন্ট, তারিখ রূপান্তরকারী এবং গুরুত্বপূর্ণ তারিখ সহ ইসলামিক ক্যালেন্ডার",
      ur: "واقعات، تاریخ تبدیلی اور اہم تاریخوں کے ساتھ اسلامی کیلنڈر",
      ar: "التقويم الإسلامي مع الأحداث ومحول التاريخ وأبرز التواريخ المهمة",
      tr: "Etkinlikler, tarih donusturucu ve onemli tarihlerle Islam takvimi",
      ms: "Kalendar Islam dengan acara, penukar tarikh, dan tarikh penting",
      id: "Kalender Islam dengan acara, konverter tanggal, dan tanggal penting",
    },
    color: "from-teal-500 to-teal-700",
    iconBg: "bg-teal-100 text-teal-700",
    nav: "more",
    showInGrid: true,
    showInSiteMap: true,
  },
  {
    id: "sadaqah",
    href: "/sadaqah",
    icon: HandCoins,
    iconName: "HandCoins",
    label: {
      en: "Sadaqah", bn: "সদকা", ur: "صدقہ",
      ar: "الصدقة", tr: "Sadaka", ms: "Sedekah", id: "Sedekah",
    },
    arabic: "متتبع الصدقة",
    description: {
      en: "Track your voluntary charity donations with categories and monthly analytics",
      bn: "বিভাগ এবং মাসিক বিশ্লেষণ সহ আপনার নফল দান-সদকা ট্র্যাক করুন",
      ur: "اقسام اور ماہانہ تجزیات کے ساتھ اپنے نفلی صدقات ٹریک کریں",
      ar: "تتبع تبرعاتك التطوعية مع التصنيفات والتحليلات الشهرية",
      tr: "Kategoriler ve aylik analizlerle gonullu bagislarinizi takip edin",
      ms: "Jejak derma sedekah sunat anda dengan kategori dan analitik bulanan",
      id: "Lacak donasi sedekah sunat Anda dengan kategori dan analitik bulanan",
    },
    color: "from-rose-500 to-rose-700",
    iconBg: "bg-rose-100 text-rose-700",
    nav: "more",
    showInGrid: true,
    showInSiteMap: true,
  },
  {
    id: "history",
    href: "/history",
    icon: History,
    iconName: "History",
    label: {
      en: "Zakat History", bn: "যাকাত ইতিহাস", ur: "زکوٰۃ ہسٹری",
      ar: "سجل الزكاة", tr: "Zekat Gecmisi", ms: "Sejarah Zakat", id: "Riwayat Zakat",
    },
    arabic: "سجل الزكاة",
    description: {
      en: "View your past Zakat calculations, compare years, and track payments",
      bn: "আপনার অতীতের যাকাত হিসাব দেখুন, বছর তুলনা করুন এবং পেমেন্ট ট্র্যাক করুন",
      ur: "اپنے ماضی کے زکوٰۃ حسابات دیکھیں، سالوں کا موازنہ کریں اور ادائیگیاں ٹریک کریں",
      ar: "اعرض حسابات زكاتك السابقة وقارن بين السنوات وتتبع المدفوعات",
      tr: "Gecmis zekat hesaplamalanizi gorun, yillari karsilastirin ve odemeleri takip edin",
      ms: "Lihat pengiraan zakat lepas anda, bandingkan tahun, dan jejak pembayaran",
      id: "Lihat perhitungan zakat sebelumnya, bandingkan tahun, dan lacak pembayaran",
    },
    color: "from-slate-500 to-slate-700",
    iconBg: "bg-slate-100 text-slate-700",
    nav: "more",
    showInGrid: true,
    showInSiteMap: true,
  },
  {
    id: "assistant",
    href: "/assistant",
    icon: Sparkles,
    iconName: "Sparkles",
    label: {
      en: "IhsanAI", bn: "AI সহায়ক", ur: "AI معاون",
      ar: "مساعد AI", tr: "AI Asistan", ms: "Pembantu AI", id: "Asisten AI",
    },
    arabic: "المساعد الذكي",
    description: {
      en: "Ask Islamic finance questions and get AI-powered guidance",
      bn: "ইসলামী অর্থনীতি সম্পর্কে প্রশ্ন করুন এবং AI-চালিত নির্দেশনা পান",
      ur: "اسلامی مالیات کے سوالات پوچھیں اور AI کی رہنمائی حاصل کریں",
      ar: "اطرح أسئلة التمويل الإسلامي واحصل على إرشادات مدعومة بالذكاء الاصطناعي",
      tr: "Islam finansi sorulari sorun ve yapay zeka destekli rehberlik alin",
      ms: "Tanya soalan kewangan Islam dan dapatkan bimbingan berkuasa AI",
      id: "Ajukan pertanyaan keuangan Islam dan dapatkan panduan bertenaga AI",
    },
    color: "from-indigo-500 to-indigo-700",
    iconBg: "bg-indigo-100 text-indigo-700",
    nav: "more",
    showInGrid: false,
    showInSiteMap: true,
  },
  {
    id: "profile",
    href: "/profile",
    icon: UserCircle,
    iconName: "UserCircle",
    label: {
      en: "Profile", bn: "প্রোফাইল", ur: "پروفائل",
      ar: "الملف الشخصي", tr: "Profil", ms: "Profil", id: "Profil",
    },
    arabic: "الملف الشخصي",
    description: {
      en: "View your spiritual journey with progress stats, charts, and activity overview",
      bn: "অগ্রগতি পরিসংখ্যান, চার্ট এবং কার্যকলাপ সারসংক্ষেপ সহ আপনার আধ্যাত্মিক যাত্রা দেখুন",
      ur: "پیشرفت کے اعداد و شمار، چارٹس اور سرگرمی کے جائزے کے ساتھ اپنا روحانی سفر دیکھیں",
      ar: "اعرض رحلتك الروحانية مع إحصائيات التقدم والرسوم البيانية ونظرة عامة على النشاط",
      tr: "Ilerleme istatistikleri, grafikler ve aktivite ozeti ile manevi yolculugunuzu gorun",
      ms: "Lihat perjalanan rohani anda dengan statistik kemajuan, carta dan gambaran aktiviti",
      id: "Lihat perjalanan spiritual Anda dengan statistik kemajuan, grafik, dan ringkasan aktivitas",
    },
    color: "from-sky-500 to-sky-700",
    iconBg: "bg-sky-100 text-sky-700",
    nav: "more",
    showInGrid: false,
    showInSiteMap: false,
  },
  {
    id: "99-names",
    href: "/99-names",
    icon: Heart,
    iconName: "Heart",
    label: {
      en: "99 Names of Allah", bn: "আল্লাহর ৯৯ নাম", ur: "اللہ کے ۹۹ نام",
      ar: "أسماء الله الحسنى", tr: "Allah'ın 99 İsmi", ms: "99 Nama Allah", id: "99 Nama Allah",
    },
    arabic: "أسماء الله الحسنى",
    description: {
      en: "Explore the 99 Beautiful Names of Allah with meanings and Quran references",
      bn: "অর্থ এবং কুরআনের রেফারেন্স সহ আল্লাহর ৯৯টি সুন্দর নাম অন্বেষণ করুন",
      ur: "معانی اور قرآنی حوالوں کے ساتھ اللہ کے ۹۹ خوبصورت نام دریافت کریں",
      ar: "استكشف أسماء الله الحسنى التسعة والتسعين مع المعاني والمراجع القرآنية",
      tr: "Anlamları ve Kur'an referansları ile Allah'ın 99 Güzel İsmi'ni keşfedin",
      ms: "Terokai 99 Nama Indah Allah dengan makna dan rujukan Al-Quran",
      id: "Jelajahi 99 Nama Indah Allah dengan makna dan referensi Al-Quran",
    },
    color: "from-rose-500 to-pink-700",
    iconBg: "bg-rose-100 text-rose-700",
    nav: "more",
    showInGrid: true,
    showInSiteMap: true,
  },
  {
    id: "how-to-pray",
    href: "/how-to-pray",
    icon: GraduationCap,
    iconName: "GraduationCap",
    label: {
      en: "How to Pray", bn: "নামাজ শেখা", ur: "نماز سیکھیں",
      ar: "كيفية الصلاة", tr: "Namaz Nasıl Kılınır", ms: "Cara Solat", id: "Cara Shalat",
    },
    arabic: "كيفية الصلاة",
    description: {
      en: "Step-by-step guide to Wudu, all 5 daily prayers, Eid, Janazah, Witr and more in 7 languages",
      bn: "ওজু, পাঁচ ওয়াক্ত নামাজ, ঈদ, জানাযা, বিতর এবং আরও অনেক কিছুর ধাপে ধাপে নির্দেশিকা",
      ur: "وضو، پانچ نمازیں، عید، جنازہ، وتر اور مزید کی مرحلہ وار رہنمائی",
      ar: "دليل خطوة بخطوة للوضوء وصلوات اليوم الخمس وصلاة العيد والجنازة والوتر",
      tr: "Abdest, beş vakit namaz, Bayram, Cenaze, Vitir ve daha fazlası için adım adım rehber",
      ms: "Panduan langkah demi langkah untuk Wudu, 5 solat harian, Eid, Jenazah, Witir dan lagi",
      id: "Panduan langkah demi langkah untuk Wudu, 5 shalat harian, Eid, Jenazah, Witir dan lainnya",
    },
    color: "from-orange-500 to-amber-600",
    iconBg: "bg-orange-100 text-orange-700",
    nav: "more",
    showInGrid: true,
    showInSiteMap: true,
  },
  {
    id: "eid",
    href: "/eid",
    icon: PartyPopper,
    iconName: "PartyPopper",
    label: {
      en: "Eid Greetings", bn: "ঈদের শুভেচ্ছা", ur: "عید مبارکباد",
      ar: "تهاني العيد", tr: "Bayram Tebriği", ms: "Ucapan Hari Raya", id: "Ucapan Hari Raya",
    },
    arabic: "تهاني العيد",
    description: {
      en: "Create beautiful Eid greeting cards and share heartfelt wishes with loved ones",
      bn: "সুন্দর ঈদ গ্রিটিং কার্ড তৈরি করুন এবং প্রিয়জনদের সাথে হৃদয়স্পর্শী শুভেচ্ছা শেয়ার করুন",
      ur: "خوبصورت عید گریٹنگ کارڈ بنائیں اور اپنوں کے ساتھ دلی مبارکباد شیئر کریں",
      ar: "أنشئ بطاقات تهنئة جميلة للعيد وشارك تمنياتك الصادقة مع أحبائك",
      tr: "Güzel bayram tebrik kartları oluşturun ve sevdiklerinizle içten dilekler paylaşın",
      ms: "Cipta kad ucapan Hari Raya yang cantik dan kongsikan ucapan ikhlas dengan orang tersayang",
      id: "Buat kartu ucapan Hari Raya yang cantik dan bagikan ucapan tulus dengan orang tercinta",
    },
    color: "from-amber-500 to-orange-600",
    iconBg: "bg-amber-100 text-amber-700",
    nav: "more",
    showInGrid: true,
    showInSiteMap: true,
  },
  {
    id: "guide",
    href: "/guide",
    icon: Lightbulb,
    iconName: "Lightbulb",
    label: {
      en: "Guide", bn: "গাইড", ur: "گائیڈ",
      ar: "الدليل", tr: "Rehber", ms: "Panduan", id: "Panduan",
    },
    arabic: "دليل الاستخدام",
    description: {
      en: "Learn how to use all features of IhsanWealth",
      bn: "ইহসান ওয়েলথ-এর সকল বৈশিষ্ট্য কিভাবে ব্যবহার করবেন শিখুন",
      ur: "احسان ویلتھ کے تمام فیچرز استعمال کرنا سیکھیں",
      ar: "تعلم كيفية استخدام جميع ميزات إحسان الثروة",
      tr: "IhsanWealth'in tum ozelliklerini nasil kullanacaginizi ogrenin",
      ms: "Pelajari cara menggunakan semua ciri IhsanWealth",
      id: "Pelajari cara menggunakan semua fitur IhsanWealth",
    },
    color: "from-gray-500 to-gray-700",
    iconBg: "bg-gray-100 text-gray-700",
    nav: "more",
    showInGrid: false,
    showInSiteMap: true,
  },
];

// Derived lists for different consumers
export const PRIMARY_NAV_FEATURES = APP_FEATURES.filter((f) => f.nav === "primary");
export const MORE_NAV_FEATURES = APP_FEATURES.filter((f) => f.nav === "more");
export const ALL_NAV_FEATURES = [...PRIMARY_NAV_FEATURES, ...MORE_NAV_FEATURES];
export const GRID_FEATURES = APP_FEATURES.filter((f) => f.showInGrid);
export const SITEMAP_FEATURES = APP_FEATURES.filter((f) => f.showInSiteMap);

// Translated section header texts for features grid
export const FEATURES_GRID_TEXTS: Record<TransLang, {
  bismillah: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
}> = {
  en: {
    bismillah: "بِسْمِ اللَّهِ توكلنا",
    title: "Your Complete",
    titleHighlight: "Islamic",
    subtitle: "All the tools a Muslim needs — Zakat, Prayer, Qibla, Duas, Quran, Calendar, and more. Completely free.",
  },
  bn: {
    bismillah: "বিসমিল্লাহি তাওয়াক্কালনা",
    title: "আপনার সম্পূর্ণ",
    titleHighlight: "ইসলামী",
    subtitle: "একজন মুসলিমের প্রয়োজনীয় সকল সরঞ্জাম — যাকাত, নামায, কিবলা, দু'আ, কুরআন, ক্যালেন্ডার এবং আরও অনেক কিছু। সম্পূর্ণ বিনামূল্যে।",
  },
  ur: {
    bismillah: "بسم اللہ توکلنا",
    title: "آپ کا مکمل",
    titleHighlight: "اسلامی",
    subtitle: "ایک مسلمان کو درکار تمام آلات — زکوٰۃ، نماز، قبلہ، دعائیں، قرآن، کیلنڈر اور مزید۔ بالکل مفت۔",
  },
  ar: {
    bismillah: "بِسْمِ اللَّهِ توكلنا",
    title: "رفيقك الإسلامي",
    titleHighlight: "الشامل",
    subtitle: "جميع الأدوات التي يحتاجها المسلم — الزكاة، الصلاة، القبلة، الأدعية، القرآن، التقويم والمزيد. مجاني بالكامل.",
  },
  tr: {
    bismillah: "بِسْمِ اللَّهِ توكلنا",
    title: "Eksiksiz",
    titleHighlight: "Islami",
    subtitle: "Bir Muslumanin ihtiyac duydugu tum araclar — Zekat, Namaz, Kible, Dualar, Kuran, Takvim ve daha fazlasi. Tamamen ucretsiz.",
  },
  ms: {
    bismillah: "بِسْمِ اللَّهِ توكلنا",
    title: "Teman Islam",
    titleHighlight: "Lengkap",
    subtitle: "Semua alat yang diperlukan seorang Muslim — Zakat, Solat, Kiblat, Doa, Al-Quran, Kalendar dan lagi. Percuma sepenuhnya.",
  },
  id: {
    bismillah: "بِسْمِ اللَّهِ توكلنا",
    title: "Pendamping Islam",
    titleHighlight: "Lengkap",
    subtitle: "Semua alat yang dibutuhkan seorang Muslim — Zakat, Shalat, Kiblat, Doa, Al-Quran, Kalender dan lainnya. Sepenuhnya gratis.",
  },
};
