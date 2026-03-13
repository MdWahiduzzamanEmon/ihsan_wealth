import { gregorianToHijri, getHijriAdjustment } from "@/lib/hijri-utils";
import type { TransLang } from "@/lib/islamic-content";

// ─── Occasion definitions ───

export interface RecommendedSurah {
  id: number;
  name: string;
  nameAr: string;
  nameLocal: Record<TransLang, string>;
  reason: Record<TransLang, string>;
  source: string;
}

export interface Occasion {
  id: string;
  arabic: string;
  greeting: Record<TransLang, string>;
  reference: Record<TransLang, string>;
  source: string;
  theme: "emerald" | "amber" | "violet" | "rose" | "blue" | "teal";
  recommendedSurahs?: RecommendedSurah[];
}

export const THEMES = {
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

// ─── Friday recommended surahs (from authentic hadith) ───

const FRIDAY_SURAHS: RecommendedSurah[] = [
  {
    id: 18,
    name: "Al-Kahf",
    nameAr: "الكهف",
    nameLocal: { en: "Al-Kahf", bn: "আল-কাহফ", ur: "الکہف", ar: "الكهف", tr: "Kehf", ms: "Al-Kahfi", id: "Al-Kahfi" },
    reason: {
      en: "Whoever reads Surah Al-Kahf on Friday, a light will shine for him between two Fridays.",
      bn: "যে ব্যক্তি জুমআর দিনে সূরা কাহফ পাঠ করবে, তার জন্য দুই জুমআর মধ্যবর্তী সময়ে নূর আলোকিত হবে।",
      ur: "جو شخص جمعہ کے دن سورہ کہف پڑھے اس کے لیے دو جمعوں کے درمیان نور روشن ہوگا۔",
      ar: "مَنْ قَرَأَ سُورَةَ الْكَهْفِ فِي يَوْمِ الْجُمُعَةِ أَضَاءَ لَهُ مِنَ النُّورِ مَا بَيْنَ الْجُمُعَتَيْنِ",
      tr: "Kim cuma günü Kehf suresini okursa, iki cuma arasını aydınlatan bir nur parlar.",
      ms: "Sesiapa membaca Surah Al-Kahfi pada hari Jumaat, cahaya akan menyinari antara dua Jumaat.",
      id: "Siapa yang membaca Surah Al-Kahfi pada hari Jumat, cahaya akan menerangi antara dua Jumat.",
    },
    source: "Sahih al-Jami 6470 (Al-Hakim, Al-Bayhaqi)",
  },
  {
    id: 36,
    name: "Ya-Sin",
    nameAr: "يس",
    nameLocal: { en: "Ya-Sin", bn: "ইয়াসীন", ur: "یٰسٓ", ar: "يس", tr: "Yasin", ms: "Ya-Sin", id: "Ya-Sin" },
    reason: {
      en: "Ya-Sin is the heart of the Quran. Reciting it brings blessings and ease.",
      bn: "ইয়াসীন কুরআনের হৃদয়। এটি পাঠ করলে বরকত ও সহজতা আসে।",
      ur: "یٰسٓ قرآن کا دل ہے۔ اس کی تلاوت برکت اور آسانی لاتی ہے۔",
      ar: "يس قلب القرآن، وتلاوتها تجلب البركة واليسر",
      tr: "Yasin, Kuran'ın kalbidir. Okumak bereket ve kolaylık getirir.",
      ms: "Ya-Sin adalah hati Al-Quran. Membacanya mendatangkan keberkatan dan kemudahan.",
      id: "Ya-Sin adalah hati Al-Quran. Membacanya mendatangkan keberkatan dan kemudahan.",
    },
    source: "At-Tirmidhi 2887, Ad-Darimi",
  },
  {
    id: 44,
    name: "Ad-Dukhan",
    nameAr: "الدخان",
    nameLocal: { en: "Ad-Dukhan", bn: "আদ-দুখান", ur: "الدخان", ar: "الدخان", tr: "Duhan", ms: "Ad-Dukhan", id: "Ad-Dukhan" },
    reason: {
      en: "Whoever recites Surah Ad-Dukhan on Friday night, he will be forgiven.",
      bn: "যে ব্যক্তি জুমআর রাতে সূরা দুখান পাঠ করবে, তাকে ক্ষমা করা হবে।",
      ur: "جو شخص جمعہ کی رات سورہ دخان پڑھے اسے معاف کر دیا جائے گا۔",
      ar: "مَنْ قَرَأَ سُورَةَ الدُّخَانِ لَيْلَةَ الْجُمُعَةِ غُفِرَ لَهُ",
      tr: "Kim cuma gecesi Duhan suresini okursa, affedilir.",
      ms: "Sesiapa membaca Surah Ad-Dukhan pada malam Jumaat, dia akan diampunkan.",
      id: "Siapa yang membaca Surah Ad-Dukhan pada malam Jumat, dia akan diampuni.",
    },
    source: "At-Tirmidhi 2889",
  },
  {
    id: 55,
    name: "Ar-Rahman",
    nameAr: "الرحمن",
    nameLocal: { en: "Ar-Rahman", bn: "আর-রহমান", ur: "الرحمٰن", ar: "الرحمن", tr: "Rahman", ms: "Ar-Rahman", id: "Ar-Rahman" },
    reason: {
      en: "The Surah of Mercy — reflecting on Allah's countless blessings is especially virtuous on the best day.",
      bn: "রহমতের সূরা — আল্লাহর অগণিত নিয়ামতের চিন্তা সর্বশ্রেষ্ঠ দিনে বিশেষভাবে ফযীলতপূর্ণ।",
      ur: "رحمت کی سورت — بہترین دن میں اللہ کی بے شمار نعمتوں پر غور کرنا خاص فضیلت رکھتا ہے۔",
      ar: "سورة الرحمة — التأمل في نعم الله التي لا تحصى فضيلة عظيمة في خير الأيام",
      tr: "Rahmet suresi — en hayırlı günde Allah'ın sayısız nimetlerini düşünmek özellikle faziletlidir.",
      ms: "Surah Rahmat — merenungi nikmat Allah yang tidak terhitung sangat mulia pada hari terbaik.",
      id: "Surah Rahmat — merenungkan nikmat Allah yang tak terhitung sangat mulia di hari terbaik.",
    },
    source: "Recommended for Friday reflection",
  },
  {
    id: 67,
    name: "Al-Mulk",
    nameAr: "الملك",
    nameLocal: { en: "Al-Mulk", bn: "আল-মুলক", ur: "الملک", ar: "الملك", tr: "Mülk", ms: "Al-Mulk", id: "Al-Mulk" },
    reason: {
      en: "There is a surah of thirty verses that intercedes for its companion until he is forgiven — Surah Al-Mulk.",
      bn: "ত্রিশ আয়াতের একটি সূরা আছে যা তার সঙ্গীর জন্য সুপারিশ করবে যতক্ষণ না তাকে ক্ষমা করা হয় — সূরা আল-মুলক।",
      ur: "تیس آیتوں کی ایک سورت ہے جو اپنے ساتھی کی شفاعت کرے گی یہاں تک کہ اسے معاف کر دیا جائے — سورۃ الملک۔",
      ar: "سُورَةٌ ثَلَاثُونَ آيَةً تَشْفَعُ لِصَاحِبِهَا حَتَّى يُغْفَرَ لَهُ — سورة الملك",
      tr: "Otuz ayetlik bir sure var ki sahibine sefaat eder, ta ki affedilinceye kadar — Mülk suresi.",
      ms: "Ada surah tiga puluh ayat yang memberi syafaat untuk sahabatnya sehingga dia diampunkan — Surah Al-Mulk.",
      id: "Ada surah tiga puluh ayat yang memberi syafaat untuk sahabatnya hingga dia diampuni — Surah Al-Mulk.",
    },
    source: "At-Tirmidhi 2891, Abu Dawud 1400",
  },
];

// ─── Occasion constants ───

export const JUMMAH: Occasion = {
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
  recommendedSurahs: FRIDAY_SURAHS,
};

export const RAMADAN: Occasion = {
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
  recommendedSurahs: [
    { id: 2, name: "Al-Baqarah", nameAr: "البقرة", nameLocal: { en: "Al-Baqarah", bn: "আল-বাকারা", ur: "البقرہ", ar: "البقرة", tr: "Bakara", ms: "Al-Baqarah", id: "Al-Baqarah" }, reason: { en: "Complete the Quran in Ramadan — Al-Baqarah protects and blesses the home.", bn: "রমযানে কুরআন খতম করুন — সূরা বাকারা ঘরকে রক্ষা ও বরকত দেয়।", ur: "رمضان میں قرآن ختم کریں — سورۃ البقرہ گھر کی حفاظت اور برکت دیتی ہے۔", ar: "اختموا القرآن في رمضان — سورة البقرة تحفظ البيت وتباركه", tr: "Ramazanda Kuran'ı hatmedin — Bakara suresi evi korur ve bereketlendirir.", ms: "Khatamkan Al-Quran di Ramadan — Al-Baqarah melindungi dan memberkati rumah.", id: "Khatamkan Al-Quran di Ramadhan — Al-Baqarah melindungi dan memberkati rumah." }, source: "Sahih Muslim 804" },
    { id: 36, name: "Ya-Sin", nameAr: "يس", nameLocal: { en: "Ya-Sin", bn: "ইয়াসীন", ur: "یٰسٓ", ar: "يس", tr: "Yasin", ms: "Ya-Sin", id: "Ya-Sin" }, reason: { en: "The heart of the Quran — recite for blessings and ease in Ramadan.", bn: "কুরআনের হৃদয় — রমযানে বরকত ও সহজতার জন্য পাঠ করুন।", ur: "قرآن کا دل — رمضان میں برکت اور آسانی کے لیے تلاوت کریں۔", ar: "قلب القرآن — اقرأها للبركة واليسر في رمضان", tr: "Kuran'ın kalbi — Ramadanda bereket ve kolaylık için okuyun.", ms: "Hati Al-Quran — baca untuk keberkatan dan kemudahan di Ramadan.", id: "Hati Al-Quran — baca untuk keberkatan dan kemudahan di Ramadhan." }, source: "At-Tirmidhi 2887" },
    { id: 67, name: "Al-Mulk", nameAr: "الملك", nameLocal: { en: "Al-Mulk", bn: "আল-মুলক", ur: "الملک", ar: "الملك", tr: "Mülk", ms: "Al-Mulk", id: "Al-Mulk" }, reason: { en: "Recite nightly — it intercedes for its reader and protects from the grave.", bn: "প্রতি রাতে পাঠ করুন — এটি পাঠকারীর জন্য সুপারিশ করে ও কবরের আযাব থেকে রক্ষা করে।", ur: "ہر رات پڑھیں — یہ اپنے پڑھنے والے کی شفاعت کرتی ہے اور قبر سے بچاتی ہے۔", ar: "اقرأها كل ليلة — تشفع لصاحبها وتحميه من عذاب القبر", tr: "Her gece okuyun — sahibine sefaat eder ve kabir azabından korur.", ms: "Baca setiap malam — memberi syafaat dan melindungi dari azab kubur.", id: "Baca setiap malam — memberi syafaat dan melindungi dari azab kubur." }, source: "At-Tirmidhi 2891" },
  ],
};

export const LAST_TEN_NIGHTS: Occasion = {
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
  recommendedSurahs: [
    { id: 97, name: "Al-Qadr", nameAr: "القدر", nameLocal: { en: "Al-Qadr", bn: "আল-ক্বদর", ur: "القدر", ar: "القدر", tr: "Kadir", ms: "Al-Qadr", id: "Al-Qadr" }, reason: { en: "The surah about the Night of Decree — recite and reflect on its magnificence.", bn: "লাইলাতুল কদর সম্পর্কে অবতীর্ণ সূরা — এর মহিমা নিয়ে চিন্তা করুন।", ur: "شبِ قدر کے بارے میں سورت — اس کی عظمت پر غور کریں۔", ar: "سورة ليلة القدر — اقرأها وتأمل عظمتها", tr: "Kadir gecesi suresi — büyüklüğünü tefekkür edin.", ms: "Surah tentang Lailatul Qadr — renungi keagungannya.", id: "Surah tentang Lailatul Qadr — renungkan keagungannya." }, source: "Quran 97:1-5" },
    { id: 44, name: "Ad-Dukhan", nameAr: "الدخان", nameLocal: { en: "Ad-Dukhan", bn: "আদ-দুখান", ur: "الدخان", ar: "الدخان", tr: "Duhan", ms: "Ad-Dukhan", id: "Ad-Dukhan" }, reason: { en: "Reciting Ad-Dukhan on Laylatul Qadr brings immense reward.", bn: "লাইলাতুল কদরে সূরা দুখান পাঠে অসীম সওয়াব।", ur: "لیلۃ القدر میں سورۃ دخان پڑھنا بے حد ثواب رکھتا ہے۔", ar: "قراءة الدخان في ليلة القدر لها أجر عظيم", tr: "Kadir gecesi Duhan suresi okumak büyük sevap kazandırır.", ms: "Membaca Ad-Dukhan pada Lailatul Qadr mendapat ganjaran besar.", id: "Membaca Ad-Dukhan pada Lailatul Qadr mendapat ganjaran besar." }, source: "At-Tirmidhi 2889" },
    { id: 112, name: "Al-Ikhlas", nameAr: "الإخلاص", nameLocal: { en: "Al-Ikhlas", bn: "আল-ইখলাস", ur: "الاخلاص", ar: "الإخلاص", tr: "İhlas", ms: "Al-Ikhlas", id: "Al-Ikhlas" }, reason: { en: "Equal to one-third of the Quran — recite abundantly in the blessed nights.", bn: "কুরআনের এক-তৃতীয়াংশের সমান — বরকতময় রাতে বেশি বেশি পাঠ করুন।", ur: "قرآن کے ایک تہائی کے برابر — مبارک راتوں میں کثرت سے پڑھیں۔", ar: "تعدل ثلث القرآن — أكثر من قراءتها في الليالي المباركة", tr: "Kuran'ın üçte birine denktir — mübarek gecelerde çokça okuyun.", ms: "Bersamaan sepertiga Al-Quran — baca banyak pada malam-malam berkat.", id: "Setara sepertiga Al-Quran — baca banyak pada malam-malam berkah." }, source: "Sahih al-Bukhari 5015" },
  ],
};

export const EID_AL_FITR: Occasion = {
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
  recommendedSurahs: [
    { id: 87, name: "Al-A'la", nameAr: "الأعلى", nameLocal: { en: "Al-A'la", bn: "আল-আ'লা", ur: "الاعلیٰ", ar: "الأعلى", tr: "A'la", ms: "Al-A'la", id: "Al-A'la" }, reason: { en: "The Prophet ﷺ recited Al-A'la in the Eid prayer.", bn: "নবী ﷺ ঈদের নামাযে সূরা আ'লা পাঠ করতেন।", ur: "نبی ﷺ عید کی نماز میں سورۃ الاعلیٰ پڑھتے تھے۔", ar: "كان النبي ﷺ يقرأ الأعلى في صلاة العيد", tr: "Peygamber ﷺ bayram namazında A'la suresini okurdu.", ms: "Nabi ﷺ membaca Al-A'la dalam solat Hari Raya.", id: "Nabi ﷺ membaca Al-A'la dalam sholat Hari Raya." }, source: "Sahih Muslim 878" },
    { id: 88, name: "Al-Ghashiyah", nameAr: "الغاشية", nameLocal: { en: "Al-Ghashiyah", bn: "আল-গাশিয়া", ur: "الغاشیہ", ar: "الغاشية", tr: "Gaşiye", ms: "Al-Ghashiyah", id: "Al-Ghashiyah" }, reason: { en: "The Prophet ﷺ recited Al-Ghashiyah in the Eid prayer.", bn: "নবী ﷺ ঈদের নামাযে সূরা গাশিয়া পাঠ করতেন।", ur: "نبی ﷺ عید کی نماز میں سورۃ الغاشیہ پڑھتے تھے۔", ar: "كان النبي ﷺ يقرأ الغاشية في صلاة العيد", tr: "Peygamber ﷺ bayram namazında Gaşiye suresini okurdu.", ms: "Nabi ﷺ membaca Al-Ghashiyah dalam solat Hari Raya.", id: "Nabi ﷺ membaca Al-Ghashiyah dalam sholat Hari Raya." }, source: "Sahih Muslim 878" },
  ],
};

export const EID_AL_ADHA: Occasion = {
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
  recommendedSurahs: [
    { id: 87, name: "Al-A'la", nameAr: "الأعلى", nameLocal: { en: "Al-A'la", bn: "আল-আ'লা", ur: "الاعلیٰ", ar: "الأعلى", tr: "A'la", ms: "Al-A'la", id: "Al-A'la" }, reason: { en: "Recited by the Prophet ﷺ in the Eid al-Adha prayer.", bn: "নবী ﷺ ঈদুল আযহার নামাযে পাঠ করতেন।", ur: "نبی ﷺ عید الاضحیٰ کی نماز میں پڑھتے تھے۔", ar: "قرأها النبي ﷺ في صلاة عيد الأضحى", tr: "Peygamber ﷺ Kurban Bayramı namazında okudu.", ms: "Dibaca oleh Nabi ﷺ dalam solat Aidiladha.", id: "Dibaca oleh Nabi ﷺ dalam sholat Idul Adha." }, source: "Sahih Muslim 878" },
    { id: 88, name: "Al-Ghashiyah", nameAr: "الغاشية", nameLocal: { en: "Al-Ghashiyah", bn: "আল-গাশিয়া", ur: "الغاشیہ", ar: "الغاشية", tr: "Gaşiye", ms: "Al-Ghashiyah", id: "Al-Ghashiyah" }, reason: { en: "Recited in the second rakat of the Eid prayer by the Prophet ﷺ.", bn: "নবী ﷺ ঈদের নামাযের দ্বিতীয় রাকাতে পাঠ করতেন।", ur: "نبی ﷺ عید کی نماز کی دوسری رکعت میں پڑھتے تھے۔", ar: "قرأها النبي ﷺ في الركعة الثانية من صلاة العيد", tr: "Peygamber ﷺ bayram namazının ikinci rekatında okudu.", ms: "Dibaca pada rakaat kedua solat Hari Raya oleh Nabi ﷺ.", id: "Dibaca pada rakaat kedua sholat Hari Raya oleh Nabi ﷺ." }, source: "Sahih Muslim 878" },
    { id: 22, name: "Al-Hajj", nameAr: "الحج", nameLocal: { en: "Al-Hajj", bn: "আল-হাজ্জ", ur: "الحج", ar: "الحج", tr: "Hac", ms: "Al-Hajj", id: "Al-Hajj" }, reason: { en: "The surah of Hajj — reflect on the rites and sacrifice of Ibrahim.", bn: "হজের সূরা — ইবরাহীমের কুরবানী ও আনুষ্ঠানিকতা নিয়ে চিন্তা করুন।", ur: "حج کی سورت — ابراہیم کی قربانی اور مناسک پر غور کریں۔", ar: "سورة الحج — تأمل في مناسك الحج وتضحية إبراهيم", tr: "Hac suresi — İbrahim'in kurbanı ve menasiki üzerine tefekkür edin.", ms: "Surah Al-Hajj — renungi ibadah haji dan pengorbanan Ibrahim.", id: "Surah Al-Hajj — renungkan ibadah haji dan pengorbanan Ibrahim." }, source: "Quran 22:27-37" },
  ],
};

export const DAY_OF_ARAFAH: Occasion = {
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
  recommendedSurahs: [
    { id: 2, name: "Al-Baqarah", nameAr: "البقرة", nameLocal: { en: "Al-Baqarah", bn: "আল-বাকারা", ur: "البقرہ", ar: "البقرة", tr: "Bakara", ms: "Al-Baqarah", id: "Al-Baqarah" }, reason: { en: "Contains the verse of Arafah (2:185) — the day religion was perfected.", bn: "এতে আরাফার আয়াত রয়েছে (২:১৮৫) — যেদিন দ্বীন পূর্ণ হয়েছিল।", ur: "اس میں عرفہ کی آیت ہے (2:185) — جس دن دین مکمل ہوا۔", ar: "تحتوي على آية عرفة — يوم أكمل الله الدين", tr: "Arafat ayetini içerir — dinin tamamlandığı gün.", ms: "Mengandungi ayat Arafah — hari agama disempurnakan.", id: "Mengandungi ayat Arafah — hari agama disempurnakan." }, source: "Sahih Muslim 3017" },
    { id: 112, name: "Al-Ikhlas", nameAr: "الإخلاص", nameLocal: { en: "Al-Ikhlas", bn: "আল-ইখলাস", ur: "الاخلاص", ar: "الإخلاص", tr: "İhlas", ms: "Al-Ikhlas", id: "Al-Ikhlas" }, reason: { en: "Recite abundantly on the Day of Arafah for immense reward.", bn: "আরাফার দিনে অসীম সওয়াবের জন্য বেশি বেশি পাঠ করুন।", ur: "عرفہ کے دن بے حد ثواب کے لیے کثرت سے پڑھیں۔", ar: "أكثر من قراءتها يوم عرفة للأجر العظيم", tr: "Arefe gününde büyük sevap için çokça okuyun.", ms: "Baca banyak pada Hari Arafah untuk ganjaran besar.", id: "Baca banyak pada Hari Arafah untuk ganjaran besar." }, source: "Sahih al-Bukhari 5015" },
  ],
};

export const DHUL_HIJJAH_FIRST_TEN: Occasion = {
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
  recommendedSurahs: [
    { id: 22, name: "Al-Hajj", nameAr: "الحج", nameLocal: { en: "Al-Hajj", bn: "আল-হাজ্জ", ur: "الحج", ar: "الحج", tr: "Hac", ms: "Al-Hajj", id: "Al-Hajj" }, reason: { en: "Recite the surah of Hajj during these blessed ten days.", bn: "এই বরকতময় দশ দিনে হজের সূরা পাঠ করুন।", ur: "ان مبارک دس دنوں میں سورۃ الحج پڑھیں۔", ar: "اقرأ سورة الحج في هذه الأيام العشر المباركة", tr: "Bu mübarek on günde Hac suresini okuyun.", ms: "Baca surah Al-Hajj dalam sepuluh hari yang diberkati ini.", id: "Baca surah Al-Hajj dalam sepuluh hari yang diberkati ini." }, source: "Quran 22:27-37" },
    { id: 103, name: "Al-Asr", nameAr: "العصر", nameLocal: { en: "Al-Asr", bn: "আল-আসর", ur: "العصر", ar: "العصر", tr: "Asr", ms: "Al-Asr", id: "Al-Asr" }, reason: { en: "Reflect on the value of time — do good deeds before the days pass.", bn: "সময়ের মূল্য নিয়ে চিন্তা করুন — দিনগুলো শেষ হওয়ার আগে আমল করুন।", ur: "وقت کی قدر پر غور کریں — دن گزرنے سے پہلے نیک عمل کریں۔", ar: "تأمل في قيمة الوقت — اعمل الخير قبل أن تمضي الأيام", tr: "Zamanın değerini tefekkür edin — günler geçmeden iyi ameller yapın.", ms: "Renungi nilai masa — beramal sebelum hari berlalu.", id: "Renungkan nilai waktu — beramal sebelum hari berlalu." }, source: "Quran 103:1-3" },
  ],
};

export const ISRA_MIRAJ: Occasion = {
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
  recommendedSurahs: [
    { id: 17, name: "Al-Isra", nameAr: "الإسراء", nameLocal: { en: "Al-Isra", bn: "আল-ইসরা", ur: "الاسراء", ar: "الإسراء", tr: "İsra", ms: "Al-Isra", id: "Al-Isra" }, reason: { en: "The surah that describes the miraculous night journey of the Prophet ﷺ.", bn: "যে সূরায় নবী ﷺ-এর অলৌকিক রাত্রি ভ্রমণের বর্ণনা রয়েছে।", ur: "وہ سورت جو نبی ﷺ کے معجزاتی سفر لیل کی وضاحت کرتی ہے۔", ar: "السورة التي تصف رحلة الإسراء المعجزة للنبي ﷺ", tr: "Peygamber ﷺ'in mucizevi gece yolculuğunu anlatan sure.", ms: "Surah yang menceritakan perjalanan malam Nabi ﷺ yang ajaib.", id: "Surah yang menceritakan perjalanan malam Nabi ﷺ yang ajaib." }, source: "Quran 17:1" },
    { id: 53, name: "An-Najm", nameAr: "النجم", nameLocal: { en: "An-Najm", bn: "আন-নাজম", ur: "النجم", ar: "النجم", tr: "Necm", ms: "An-Najm", id: "An-Najm" }, reason: { en: "Describes the Prophet's ﷺ ascension and what he witnessed in the heavens.", bn: "নবী ﷺ-এর ঊর্ধ্বারোহণ ও আসমানে তিনি যা দেখেছিলেন তার বর্ণনা।", ur: "نبی ﷺ کے معراج اور آسمانوں میں جو دیکھا اس کی تفصیل۔", ar: "تصف معراج النبي ﷺ وما رآه في السماوات", tr: "Peygamber ﷺ'in miracını ve göklerde gördüklerini anlatır.", ms: "Menceritakan mikraj Nabi ﷺ dan apa yang disaksikan di langit.", id: "Menceritakan mikraj Nabi ﷺ dan apa yang disaksikan di langit." }, source: "Quran 53:1-18" },
  ],
};

export const SHAB_E_BARAT: Occasion = {
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
  recommendedSurahs: [
    { id: 36, name: "Ya-Sin", nameAr: "يس", nameLocal: { en: "Ya-Sin", bn: "ইয়াসীন", ur: "یٰسٓ", ar: "يس", tr: "Yasin", ms: "Ya-Sin", id: "Ya-Sin" }, reason: { en: "Recite Ya-Sin on Shab-e-Barat — the heart of the Quran for mercy and forgiveness.", bn: "শবে বরাতে সূরা ইয়াসীন পাঠ করুন — রহমত ও ক্ষমার জন্য কুরআনের হৃদয়।", ur: "شبِ برات میں سورۃ یٰسٓ پڑھیں — رحمت اور مغفرت کے لیے قرآن کا دل۔", ar: "اقرأ يس في ليلة البراءة — قلب القرآن للرحمة والمغفرة", tr: "Berat Kandilinde Yasin okuyun — rahmet ve mağfiret için Kuran'ın kalbi.", ms: "Baca Ya-Sin pada Nisfu Syaaban — hati Al-Quran untuk rahmat dan keampunan.", id: "Baca Ya-Sin pada Nisfu Sya'ban — hati Al-Quran untuk rahmat dan ampunan." }, source: "At-Tirmidhi 2887" },
    { id: 44, name: "Ad-Dukhan", nameAr: "الدخان", nameLocal: { en: "Ad-Dukhan", bn: "আদ-দুখান", ur: "الدخان", ar: "الدخان", tr: "Duhan", ms: "Ad-Dukhan", id: "Ad-Dukhan" }, reason: { en: "Recite Ad-Dukhan on this blessed night for forgiveness.", bn: "এই বরকতময় রাতে ক্ষমার জন্য সূরা দুখান পাঠ করুন।", ur: "اس مبارک رات میں مغفرت کے لیے سورۃ دخان پڑھیں۔", ar: "اقرأ الدخان في هذه الليلة المباركة للمغفرة", tr: "Bu mübarek gecede mağfiret için Duhan okuyun.", ms: "Baca Ad-Dukhan pada malam berkat ini untuk keampunan.", id: "Baca Ad-Dukhan pada malam berkah ini untuk ampunan." }, source: "At-Tirmidhi 2889" },
  ],
};

export const ASHURA: Occasion = {
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
  recommendedSurahs: [
    { id: 10, name: "Yunus", nameAr: "يونس", nameLocal: { en: "Yunus", bn: "ইউনুস", ur: "یونس", ar: "يونس", tr: "Yunus", ms: "Yunus", id: "Yunus" }, reason: { en: "The story of Musa and Pharaoh on Ashura — Allah saved Bani Israel on this day.", bn: "আশুরার দিনে মুসা ও ফিরাউনের ঘটনা — আল্লাহ এই দিনে বনী ইসরাঈলকে রক্ষা করেছিলেন।", ur: "عاشوراء کے دن موسیٰ اور فرعون کا قصہ — اللہ نے اس دن بنی اسرائیل کو بچایا۔", ar: "قصة موسى وفرعون يوم عاشوراء — نجّى الله بني إسرائيل", tr: "Aşure gününde Musa ve Firavun kıssası — Allah İsrailoğullarını bu gün kurtardı.", ms: "Kisah Musa dan Firaun pada Asyura — Allah menyelamatkan Bani Israel.", id: "Kisah Musa dan Firaun pada Asyura — Allah menyelamatkan Bani Israel." }, source: "Quran 10:90-92, Sahih al-Bukhari 2004" },
    { id: 26, name: "Ash-Shu'ara", nameAr: "الشعراء", nameLocal: { en: "Ash-Shu'ara", bn: "আশ-শু'আরা", ur: "الشعراء", ar: "الشعراء", tr: "Şuara", ms: "Ash-Shu'ara", id: "Ash-Shu'ara" }, reason: { en: "The parting of the sea and rescue of Musa — the event we commemorate on Ashura.", bn: "সমুদ্র বিভক্ত হওয়া ও মুসার উদ্ধার — আশুরায় যে ঘটনা আমরা স্মরণ করি।", ur: "سمندر کا پھٹنا اور موسیٰ کی نجات — عاشوراء کا واقعہ۔", ar: "انفلاق البحر ونجاة موسى — الحدث الذي نحتفي به في عاشوراء", tr: "Denizin yarılması ve Musa'nın kurtuluşu — Aşure'de andığımız olay.", ms: "Terbelahnya laut dan penyelamatan Musa — peristiwa yang kita peringati.", id: "Terbelahnya laut dan penyelamatan Musa — peristiwa yang kita peringati." }, source: "Quran 26:61-68" },
  ],
};

export const ISLAMIC_NEW_YEAR: Occasion = {
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
  recommendedSurahs: [
    { id: 9, name: "At-Tawbah", nameAr: "التوبة", nameLocal: { en: "At-Tawbah", bn: "আত-তাওবাহ", ur: "التوبہ", ar: "التوبة", tr: "Tevbe", ms: "At-Tawbah", id: "At-Tawbah" }, reason: { en: "Contains the verse about the number of months — reflect on the new year.", bn: "মাসের সংখ্যা সম্পর্কিত আয়াত রয়েছে — নতুন বছর নিয়ে চিন্তা করুন।", ur: "مہینوں کی تعداد کی آیت — نئے سال پر غور کریں۔", ar: "تحتوي على آية عدد الشهور — تأمل في السنة الجديدة", tr: "Ayların sayısı hakkındaki ayeti içerir — yeni yılı tefekkür edin.", ms: "Mengandungi ayat bilangan bulan — renungi tahun baru.", id: "Mengandungi ayat bilangan bulan — renungkan tahun baru." }, source: "Quran 9:36" },
    { id: 1, name: "Al-Fatihah", nameAr: "الفاتحة", nameLocal: { en: "Al-Fatihah", bn: "আল-ফাতিহা", ur: "الفاتحہ", ar: "الفاتحة", tr: "Fatiha", ms: "Al-Fatihah", id: "Al-Fatihah" }, reason: { en: "Begin the new Islamic year with the Opening — seek guidance for the year ahead.", bn: "নতুন ইসলামী বছর শুরু করুন সূরা ফাতিহা দিয়ে — আগামী বছরের জন্য হিদায়াত চান।", ur: "نئے اسلامی سال کا آغاز فاتحہ سے کریں — آنے والے سال کے لیے ہدایت مانگیں۔", ar: "ابدأ السنة الهجرية الجديدة بالفاتحة — اطلب الهداية للعام القادم", tr: "Yeni İslami yıla Fatiha ile başlayın — önümüzdeki yıl için hidayet isteyin.", ms: "Mulakan tahun Islam baru dengan Al-Fatihah — mohon petunjuk.", id: "Mulailah tahun Islam baru dengan Al-Fatihah — mohon petunjuk." }, source: "Quran 1:1-7" },
  ],
};

export const MAWLID: Occasion = {
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
  recommendedSurahs: [
    { id: 33, name: "Al-Ahzab", nameAr: "الأحزاب", nameLocal: { en: "Al-Ahzab", bn: "আল-আহযাব", ur: "الاحزاب", ar: "الأحزاب", tr: "Ahzab", ms: "Al-Ahzab", id: "Al-Ahzab" }, reason: { en: "Contains the command to send blessings upon the Prophet ﷺ (33:56).", bn: "নবী ﷺ-এর প্রতি দরূদ পাঠের আদেশ রয়েছে (৩৩:৫৬)।", ur: "نبی ﷺ پر درود بھیجنے کا حکم ہے (33:56)۔", ar: "فيها الأمر بالصلاة على النبي ﷺ", tr: "Peygamber ﷺ'e salavat getirme emrini içerir (33:56).", ms: "Mengandungi perintah berselawat ke atas Nabi ﷺ (33:56).", id: "Mengandungi perintah berselawat ke atas Nabi ﷺ (33:56)." }, source: "Quran 33:56" },
    { id: 21, name: "Al-Anbiya", nameAr: "الأنبياء", nameLocal: { en: "Al-Anbiya", bn: "আল-আম্বিয়া", ur: "الانبیاء", ar: "الأنبياء", tr: "Enbiya", ms: "Al-Anbiya", id: "Al-Anbiya" }, reason: { en: "The surah of the Prophets — reflect on their stories and the final Messenger ﷺ.", bn: "নবীদের সূরা — তাঁদের কাহিনী ও শেষ রাসূল ﷺ নিয়ে চিন্তা করুন।", ur: "انبیاء کی سورت — ان کے قصے اور آخری رسول ﷺ پر غور کریں۔", ar: "سورة الأنبياء — تأمل في قصصهم والرسول الخاتم ﷺ", tr: "Peygamberler suresi — kıssaları ve son Elçi ﷺ'i tefekkür edin.", ms: "Surah para Nabi — renungi kisah mereka dan Rasul terakhir ﷺ.", id: "Surah para Nabi — renungkan kisah mereka dan Rasul terakhir ﷺ." }, source: "Quran 21:107" },
  ],
};

// ─── Detect active occasions ───

export function getActiveOccasions(countryCode: string): Occasion[] {
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
