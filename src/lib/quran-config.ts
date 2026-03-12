import type { TransLang } from "@/lib/islamic-content";

// Translation resource IDs for quran.com API v4
export const TRANSLATION_IDS: Record<TransLang, number> = {
  en: 95,  // Maududi (Tafhim commentary)
  ur: 97,  // Tafheem e Qur'an - Syed Abu Ali Maududi
  bn: 161, // Taisirul Quran (no Maududi Bengali on quran.com)
  ar: 16,  // Tafsir Muyassar
  tr: 77,  // Diyanet translation
  ms: 39,  // Abdullah Muhammad Basmeih
  id: 33,  // Indonesian Islamic Affairs Ministry
};

export const QURAN_API_BASE = "https://api.quran.com/api/v4";

// Reciters for audio playback
export const RECITERS = [
  { id: 7, name: "Mishary Alafasy", nameAr: "مشاري العفاسي" },
  { id: 1, name: "Abdul Basit (Mujawwad)", nameAr: "عبد الباسط - مجود" },
  { id: 2, name: "Abdul Basit (Murattal)", nameAr: "عبد الباسط - مرتل" },
  { id: 4, name: "Abu Bakr Al-Shatri", nameAr: "أبو بكر الشاطري" },
];
export const DEFAULT_RECITER_ID = 7;

// UI texts for the Quran reader
export const QURAN_TEXTS: Record<TransLang, {
  pageTitle: string;
  subtitle: string;
  searchPlaceholder: string;
  verses: string;
  meccan: string;
  medinan: string;
  backToList: string;
  loading: string;
  loadMore: string;
  page: string;
  of: string;
  noResults: string;
  bismillah: string;
  verseCount: string;
  tafsir: string;
  showTafsir: string;
  hideTafsir: string;
  listenTafsir: string;
  stopTafsir: string;
  play: string;
  pause: string;
  playing: string;
  reciter: string;
  selectReciter: string;
  playFullSurah: string;
  nowPlaying: string;
  verse: string;
}> = {
  en: {
    pageTitle: "The Holy Quran",
    subtitle: "Read, reflect, and understand — with translation and Tafhimul Quran tafsir",
    searchPlaceholder: "Search surah by name or number...",
    verses: "verses",
    meccan: "Meccan",
    medinan: "Medinan",
    backToList: "Back to Surahs",
    loading: "Loading...",
    loadMore: "Load More Verses",
    page: "Page",
    of: "of",
    noResults: "No surahs found",
    bismillah: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
    verseCount: "verses",
    tafsir: "Tafsir",
    showTafsir: "Show Tafsir",
    hideTafsir: "Hide Tafsir",
    listenTafsir: "Listen",
    stopTafsir: "Stop",
    play: "Play",
    pause: "Pause",
    playing: "Playing",
    reciter: "Reciter",
    selectReciter: "Select Reciter",
    playFullSurah: "Play Surah",
    nowPlaying: "Now Playing",
    verse: "Verse",
  },
  bn: {
    pageTitle: "পবিত্র কুরআন",
    subtitle: "পড়ুন, চিন্তা করুন এবং বুঝুন — অনুবাদ ও তাফহীমুল কুরআন তাফসীর সহ",
    searchPlaceholder: "নাম বা নম্বর দিয়ে সূরা খুঁজুন...",
    verses: "আয়াত",
    meccan: "মক্কী",
    medinan: "মাদানী",
    backToList: "সূরা তালিকায় ফিরুন",
    loading: "লোড হচ্ছে...",
    loadMore: "আরও আয়াত লোড করুন",
    page: "পৃষ্ঠা",
    of: "এর",
    noResults: "কোনো সূরা পাওয়া যায়নি",
    bismillah: "বিসমিল্লাহির রাহমানির রাহীম",
    verseCount: "আয়াত",
    tafsir: "তাফসীর",
    showTafsir: "তাফসীর দেখুন",
    hideTafsir: "তাফসীর লুকান",
    listenTafsir: "শুনুন",
    stopTafsir: "থামান",
    play: "চালান",
    pause: "বিরতি",
    playing: "চলছে",
    reciter: "ক্বারী",
    selectReciter: "ক্বারী নির্বাচন করুন",
    playFullSurah: "সূরা চালান",
    nowPlaying: "চলছে",
    verse: "আয়াত",
  },
  ur: {
    pageTitle: "قرآن مجید",
    subtitle: "پڑھیں، غور کریں اور سمجھیں — ترجمے اور تفہیم القرآن تفسیر کے ساتھ",
    searchPlaceholder: "نام یا نمبر سے سورت تلاش کریں...",
    verses: "آیات",
    meccan: "مکی",
    medinan: "مدنی",
    backToList: "سورتوں کی فہرست",
    loading: "لوڈ ہو رہا ہے...",
    loadMore: "مزید آیات لوڈ کریں",
    page: "صفحہ",
    of: "کا",
    noResults: "کوئی سورت نہیں ملی",
    bismillah: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
    verseCount: "آیات",
    tafsir: "تفسیر",
    showTafsir: "تفسیر دیکھیں",
    hideTafsir: "تفسیر چھپائیں",
    listenTafsir: "سنیں",
    stopTafsir: "رکیں",
    play: "چلائیں",
    pause: "روکیں",
    playing: "چل رہا ہے",
    reciter: "قاری",
    selectReciter: "قاری منتخب کریں",
    playFullSurah: "سورت چلائیں",
    nowPlaying: "چل رہا ہے",
    verse: "آیت",
  },
  ar: {
    pageTitle: "القرآن الكريم",
    subtitle: "اقرأ وتدبر وافهم — مع الترجمة وتفسير تفهيم القرآن",
    searchPlaceholder: "ابحث عن سورة بالاسم أو الرقم...",
    verses: "آيات",
    meccan: "مكية",
    medinan: "مدنية",
    backToList: "العودة إلى السور",
    loading: "جاري التحميل...",
    loadMore: "تحميل المزيد من الآيات",
    page: "صفحة",
    of: "من",
    noResults: "لم يتم العثور على سور",
    bismillah: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
    verseCount: "آيات",
    tafsir: "تفسير",
    showTafsir: "عرض التفسير",
    hideTafsir: "إخفاء التفسير",
    listenTafsir: "استمع",
    stopTafsir: "إيقاف",
    play: "تشغيل",
    pause: "إيقاف مؤقت",
    playing: "قيد التشغيل",
    reciter: "القارئ",
    selectReciter: "اختر القارئ",
    playFullSurah: "تشغيل السورة",
    nowPlaying: "قيد التشغيل",
    verse: "آية",
  },
  tr: {
    pageTitle: "Kuran-i Kerim",
    subtitle: "Okuyun, dusunun ve anlayin — tercume ve Tefhimul Kuran tefsiri ile",
    searchPlaceholder: "Sure adi veya numarasiyla arayin...",
    verses: "ayet",
    meccan: "Mekki",
    medinan: "Medeni",
    backToList: "Surelere Don",
    loading: "Yukleniyor...",
    loadMore: "Daha Fazla Ayet Yukle",
    page: "Sayfa",
    of: "/",
    noResults: "Sure bulunamadi",
    bismillah: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
    verseCount: "ayet",
    tafsir: "Tefsir",
    showTafsir: "Tefsiri Goster",
    hideTafsir: "Tefsiri Gizle",
    listenTafsir: "Dinle",
    stopTafsir: "Durdur",
    play: "Oynat",
    pause: "Duraklat",
    playing: "Oynuyor",
    reciter: "Kari",
    selectReciter: "Kari Sec",
    playFullSurah: "Sureyi Oynat",
    nowPlaying: "Su an caliniyor",
    verse: "Ayet",
  },
  ms: {
    pageTitle: "Al-Quran Al-Karim",
    subtitle: "Baca, renungkan dan fahami — dengan terjemahan dan tafsir Tafhimul Quran",
    searchPlaceholder: "Cari surah mengikut nama atau nombor...",
    verses: "ayat",
    meccan: "Makkiyyah",
    medinan: "Madaniyyah",
    backToList: "Kembali ke Senarai Surah",
    loading: "Memuatkan...",
    loadMore: "Muatkan Lagi Ayat",
    page: "Halaman",
    of: "daripada",
    noResults: "Tiada surah ditemui",
    bismillah: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
    verseCount: "ayat",
    tafsir: "Tafsir",
    showTafsir: "Tunjukkan Tafsir",
    hideTafsir: "Sembunyikan Tafsir",
    listenTafsir: "Dengar",
    stopTafsir: "Berhenti",
    play: "Main",
    pause: "Jeda",
    playing: "Sedang bermain",
    reciter: "Qari",
    selectReciter: "Pilih Qari",
    playFullSurah: "Main Surah",
    nowPlaying: "Sedang dimainkan",
    verse: "Ayat",
  },
  id: {
    pageTitle: "Al-Quran Al-Karim",
    subtitle: "Baca, renungkan dan pahami — dengan terjemahan dan tafsir Tafhimul Quran",
    searchPlaceholder: "Cari surah berdasarkan nama atau nomor...",
    verses: "ayat",
    meccan: "Makkiyyah",
    medinan: "Madaniyyah",
    backToList: "Kembali ke Daftar Surah",
    loading: "Memuat...",
    loadMore: "Muat Lebih Banyak Ayat",
    page: "Halaman",
    of: "dari",
    noResults: "Tidak ada surah ditemukan",
    bismillah: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
    verseCount: "ayat",
    tafsir: "Tafsir",
    showTafsir: "Tampilkan Tafsir",
    hideTafsir: "Sembunyikan Tafsir",
    listenTafsir: "Dengarkan",
    stopTafsir: "Berhenti",
    play: "Putar",
    pause: "Jeda",
    playing: "Sedang diputar",
    reciter: "Qari",
    selectReciter: "Pilih Qari",
    playFullSurah: "Putar Surah",
    nowPlaying: "Sedang diputar",
    verse: "Ayat",
  },
};

// Types for quran.com API responses
export interface Chapter {
  id: number;
  revelation_place: "makkah" | "madinah";
  revelation_order: number;
  bismillah_pre: boolean;
  name_simple: string;
  name_complex: string;
  name_arabic: string;
  verses_count: number;
  pages: number[];
  translated_name: {
    language_name: string;
    name: string;
  };
}

export interface Verse {
  id: number;
  verse_number: number;
  verse_key: string;
  text_uthmani: string;
  translations: {
    id: number;
    resource_id: number;
    text: string;
  }[];
}

// Tafsir resource IDs for the tafsir endpoint (used for languages without Maududi footnotes)
export const TAFSIR_IDS: Partial<Record<TransLang, number>> = {
  bn: 164,  // Tafseer ibn Kathir (Bengali)
  ar: 14,   // Tafsir Ibn Kathir (Arabic)
  tr: 169,  // Ibn Kathir Abridged (English fallback)
  ms: 169,  // Ibn Kathir Abridged (English fallback)
  id: 169,  // Ibn Kathir Abridged (English fallback)
};

// Languages where Maududi translation includes footnotes (tafsir via foot_notes endpoint)
export const HAS_MAUDUDI_FOOTNOTES: TransLang[] = ["en", "ur"];

export interface FootNote {
  id: number;
  text: string;
  language_name: string;
}

export interface VersesResponse {
  verses: Verse[];
  pagination: {
    per_page: number;
    current_page: number;
    next_page: number | null;
    total_pages: number;
    total_records: number;
  };
}
