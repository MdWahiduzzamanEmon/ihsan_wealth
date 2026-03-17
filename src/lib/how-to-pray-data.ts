import type { TransLang } from "@/lib/islamic-content";

// ─── Types ───────────────────────────────────────────────
export interface PrayerStep {
  stepNumber: number;
  action: Record<TransLang, string>;
  arabic: string;
  transliteration: string;
  meaning: Record<TransLang, string>;
}

export interface WuduStep {
  stepNumber: number;
  action: Record<TransLang, string>;
  arabic: string;
  transliteration: string;
}

export interface PrayerInfo {
  id: string;
  name: Record<TransLang, string>;
  arabicName: string;
  type: "fard" | "sunnah" | "nafl" | "wajib" | "special";
  category: "daily" | "special";
  totalRakats: string;
  rakatBreakdown: Record<TransLang, string>;
  time: Record<TransLang, string>;
  description: Record<TransLang, string>;
  steps: PrayerStep[];
  specialNotes?: Record<TransLang, string>;
}

export interface WuduInfo {
  name: Record<TransLang, string>;
  arabicName: string;
  description: Record<TransLang, string>;
  steps: WuduStep[];
}

// ─── Wudu Data ───────────────────────────────────────────
export const WUDU_DATA: WuduInfo = {
  name: { en: "Wudu (Ablution)", bn: "ওজু (অজু)", ur: "وضو", ar: "الوضوء", tr: "Abdest", ms: "Wuduk", id: "Wudhu" },
  arabicName: "الوضوء",
  description: {
    en: "Wudu is the Islamic ritual purification before prayer. It is a prerequisite for Salah.",
    bn: "ওজু হলো নামাজের পূর্বে ইসলামী পবিত্রতা অর্জনের পদ্ধতি। এটি সালাতের পূর্বশর্ত।",
    ur: "وضو نماز سے پہلے اسلامی طہارت کا طریقہ ہے۔ یہ نماز کی شرط ہے۔",
    ar: "الوضوء هو الطهارة الإسلامية قبل الصلاة. وهو شرط لصحة الصلاة.",
    tr: "Abdest, namazdan önce yapılan İslami temizliktir. Namaz için ön koşuldur.",
    ms: "Wuduk adalah penyucian Islam sebelum solat. Ia adalah prasyarat untuk solat.",
    id: "Wudhu adalah penyucian Islam sebelum shalat. Ini adalah prasyarat untuk shalat.",
  },
  steps: [
    { stepNumber: 1, action: { en: "Make intention (Niyyah) in your heart for Wudu", bn: "অন্তরে ওজুর নিয়ত করুন", ur: "دل میں وضو کی نیت کریں", ar: "انوِ الوضوء في قلبك", tr: "Kalbinizde abdest için niyet edin", ms: "Niat wuduk dalam hati", id: "Niat wudhu dalam hati" }, arabic: "بِسْمِ اللَّهِ", transliteration: "Bismillah" },
    { stepNumber: 2, action: { en: "Wash both hands up to the wrists 3 times", bn: "দুই হাত কব্জি পর্যন্ত ৩ বার ধুয়ে নিন", ur: "دونوں ہاتھ کلائی تک ۳ بار دھوئیں", ar: "اغسل يديك إلى الرسغين ثلاث مرات", tr: "İki elinizi bileklere kadar 3 kez yıkayın", ms: "Basuh kedua tangan hingga pergelangan 3 kali", id: "Basuh kedua tangan hingga pergelangan 3 kali" }, arabic: "", transliteration: "" },
    { stepNumber: 3, action: { en: "Rinse the mouth 3 times (Madmadah)", bn: "৩ বার কুলি করুন (মাদমাদাহ)", ur: "۳ بار کلی کریں (مضمضہ)", ar: "تمضمض ثلاث مرات", tr: "Ağzınızı 3 kez çalkalayın", ms: "Kumur mulut 3 kali", id: "Kumur mulut 3 kali" }, arabic: "", transliteration: "" },
    { stepNumber: 4, action: { en: "Sniff water into the nose 3 times and blow it out (Istinshaq)", bn: "৩ বার নাকে পানি দিন ও ঝেড়ে ফেলুন (ইস্তিনশাক)", ur: "۳ بار ناک میں پانی چڑھائیں اور صاف کریں (استنشاق)", ar: "استنشق الماء ثلاث مرات واستنثر", tr: "3 kez burna su çekin ve çıkarın", ms: "Hirup air ke hidung 3 kali dan hembuskan", id: "Hirup air ke hidung 3 kali dan hembuskan" }, arabic: "", transliteration: "" },
    { stepNumber: 5, action: { en: "Wash the face 3 times (from hairline to chin, ear to ear)", bn: "৩ বার মুখমণ্ডল ধুয়ে নিন (চুলের গোড়া থেকে চিবুক, কান থেকে কান)", ur: "چہرہ ۳ بار دھوئیں (بالوں سے ٹھوڑی تک، کان سے کان تک)", ar: "اغسل وجهك ثلاث مرات (من منابت الشعر إلى الذقن ومن الأذن إلى الأذن)", tr: "Yüzünüzü 3 kez yıkayın (saç çizgisinden çeneye, kulaktan kulağa)", ms: "Basuh muka 3 kali (dari garisan rambut ke dagu, telinga ke telinga)", id: "Basuh muka 3 kali (dari garis rambut ke dagu, telinga ke telinga)" }, arabic: "", transliteration: "" },
    { stepNumber: 6, action: { en: "Wash the right arm up to the elbow 3 times, then the left arm", bn: "ডান হাত কনুই পর্যন্ত ৩ বার ধুয়ে নিন, তারপর বাম হাত", ur: "دایاں بازو کہنی تک ۳ بار دھوئیں، پھر بایاں بازو", ar: "اغسل ذراعك الأيمن إلى المرفق ثلاث مرات ثم الأيسر", tr: "Sağ kolu dirseğe kadar 3 kez yıkayın, sonra sol kolu", ms: "Basuh tangan kanan hingga siku 3 kali, kemudian tangan kiri", id: "Basuh tangan kanan hingga siku 3 kali, kemudian tangan kiri" }, arabic: "", transliteration: "" },
    { stepNumber: 7, action: { en: "Wipe the head (Masah) once — wet hands from front to back and back to front", bn: "মাথা মাসেহ করুন ১ বার — ভেজা হাত সামনে থেকে পেছনে এবং পেছন থেকে সামনে", ur: "سر کا مسح کریں ۱ بار — گیلے ہاتھ آگے سے پیچھے اور پیچھے سے آگے", ar: "امسح رأسك مرة واحدة — من الأمام إلى الخلف ثم من الخلف إلى الأمام", tr: "Başınızı bir kez mesh edin — ıslak ellerle önden arkaya ve arkadan öne", ms: "Sapu kepala sekali — tangan basah dari depan ke belakang dan belakang ke depan", id: "Usap kepala sekali — tangan basah dari depan ke belakang dan belakang ke depan" }, arabic: "", transliteration: "" },
    { stepNumber: 8, action: { en: "Wipe the ears — insert index fingers in ear holes and wipe behind with thumbs", bn: "কান মাসেহ করুন — তর্জনী আঙুল কানের ছিদ্রে ঢুকান ও বুড়ো আঙুল দিয়ে পেছনে মুছুন", ur: "کانوں کا مسح کریں — شہادت کی انگلی کان کے سوراخ میں ڈالیں اور انگوٹھے سے پیچھے صاف کریں", ar: "امسح أذنيك — أدخل السبابتين في صماخ الأذنين وامسح خلفهما بالإبهامين", tr: "Kulaklarınızı mesh edin — işaret parmaklarını kulak deliğine, baş parmakları arkasına", ms: "Sapu telinga — masukkan jari telunjuk ke lubang telinga dan sapu belakang dengan ibu jari", id: "Usap telinga — masukkan jari telunjuk ke lubang telinga dan usap belakang dengan ibu jari" }, arabic: "", transliteration: "" },
    { stepNumber: 9, action: { en: "Wash the right foot up to the ankle 3 times, then the left foot", bn: "ডান পা টাখনু পর্যন্ত ৩ বার ধুয়ে নিন, তারপর বাম পা", ur: "دایاں پاؤں ٹخنے تک ۳ بار دھوئیں، پھر بایاں پاؤں", ar: "اغسل قدمك اليمنى إلى الكعبين ثلاث مرات ثم اليسرى", tr: "Sağ ayağı topuğa kadar 3 kez yıkayın, sonra sol ayağı", ms: "Basuh kaki kanan hingga buku lali 3 kali, kemudian kaki kiri", id: "Basuh kaki kanan hingga mata kaki 3 kali, kemudian kaki kiri" }, arabic: "", transliteration: "" },
    { stepNumber: 10, action: { en: "Recite the dua after Wudu", bn: "ওজুর পর দু'আ পড়ুন", ur: "وضو کے بعد دعا پڑھیں", ar: "اقرأ الدعاء بعد الوضوء", tr: "Abdest duasını okuyun", ms: "Baca doa selepas wuduk", id: "Baca doa setelah wudhu" }, arabic: "أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ", transliteration: "Ash-hadu an la ilaha illallahu wahdahu la sharika lahu, wa ash-hadu anna Muhammadan abduhu wa rasuluh" },
  ],
};

// ─── All Prayers ─────────────────────────────────────────
// Each prayer is in its own file for maintainability, imported and combined here.

import { FAJR_PRAYER } from "@/lib/prayers/fajr";
import { DHUHR_PRAYER } from "@/lib/prayers/dhuhr";
import { ASR_PRAYER } from "@/lib/prayers/asr";
import { MAGHRIB_PRAYER } from "@/lib/prayers/maghrib";
import { ISHA_PRAYER } from "@/lib/prayers/isha";
import { WITR_PRAYER } from "@/lib/prayers/witr";
import { JUMMAH_PRAYER } from "@/lib/prayers/jummah";
import { EID_PRAYER } from "@/lib/prayers/eid";
import { TARAWEEH_PRAYER } from "@/lib/prayers/taraweeh";
import { TAHAJJUD_PRAYER } from "@/lib/prayers/tahajjud";
import { JANAZAH_PRAYER } from "@/lib/prayers/janazah";
import { QADHA_PRAYER } from "@/lib/prayers/qadha";
import { ISTIKHARA_PRAYER } from "@/lib/prayers/istikhara";

export const ALL_PRAYERS: PrayerInfo[] = [
  // Daily prayers
  FAJR_PRAYER,
  DHUHR_PRAYER,
  ASR_PRAYER,
  MAGHRIB_PRAYER,
  ISHA_PRAYER,
  // Special prayers
  WITR_PRAYER,
  JUMMAH_PRAYER,
  EID_PRAYER,
  JANAZAH_PRAYER,
  TARAWEEH_PRAYER,
  TAHAJJUD_PRAYER,
  QADHA_PRAYER,
  ISTIKHARA_PRAYER,
];
