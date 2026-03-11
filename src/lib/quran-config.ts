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
}> = {
  en: {
    pageTitle: "Tafhimul Quran",
    subtitle: "Read the Holy Quran with Maududi's translation and commentary",
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
  },
  bn: {
    pageTitle: "তাফহীমুল কুরআন",
    subtitle: "মাওদূদীর অনুবাদ ও তাফসীর সহ পবিত্র কুরআন পড়ুন",
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
  },
  ur: {
    pageTitle: "تفہیم القرآن",
    subtitle: "مولانا مودودی کے ترجمے اور تفسیر کے ساتھ قرآن مجید پڑھیں",
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
  },
  ar: {
    pageTitle: "تفهيم القرآن",
    subtitle: "اقرأ القرآن الكريم مع ترجمة وتفسير المودودي",
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
  },
  tr: {
    pageTitle: "Tefhimul Kuran",
    subtitle: "Mevdudi'nin tercume ve tefsiri ile Kuran-i Kerim'i okuyun",
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
  },
  ms: {
    pageTitle: "Tafhimul Quran",
    subtitle: "Baca Al-Quran dengan terjemahan dan ulasan Maududi",
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
  },
  id: {
    pageTitle: "Tafhimul Quran",
    subtitle: "Baca Al-Quran dengan terjemahan dan tafsir Maududi",
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
