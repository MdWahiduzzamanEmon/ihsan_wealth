"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getLangFromCountry, type TransLang } from "@/lib/islamic-content";
import { staggerContainer, staggerItem } from "@/lib/animations";
import {
  HandHeart,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  BookOpen,
  Scale,
} from "lucide-react";


/* ─── UI translations ─── */
const T: Record<string, Record<TransLang, string>> = {
  sectionTitle: {
    en: "Zakat Eligibility Guide",
    bn: "যাকাত যোগ্যতা নির্দেশিকা",
    ur: "زکوٰۃ کی اہلیت رہنمائی",
    ar: "دليل أهلية الزكاة",
    tr: "Zekat Uygunluk Rehberi",
    ms: "Panduan Kelayakan Zakat",
    id: "Panduan Kelayakan Zakat",
  },
  sectionSubtitle: {
    en: "Learn who is obligated to give Zakat and who is eligible to receive it according to the Quran and Sunnah",
    bn: "কুরআন ও সুন্নাহ অনুসারে কে যাকাত দিতে বাধ্য এবং কে যাকাত পাওয়ার যোগ্য তা জানুন",
    ur: "قرآن و سنت کے مطابق جانیں کہ کس پر زکوٰۃ فرض ہے اور کون زکوٰۃ لینے کا مستحق ہے",
    ar: "تعرف على من تجب عليه الزكاة ومن يستحق أن يأخذها وفق القرآن والسنة",
    tr: "Kuran ve Sunnete gore zekat kimin uzerine farz ve kimin almaya hakkı oldugunu ogrenin",
    ms: "Ketahui siapa yang wajib memberi zakat dan siapa yang layak menerimanya menurut al-Quran dan Sunnah",
    id: "Pelajari siapa yang wajib memberi zakat dan siapa yang berhak menerimanya menurut al-Quran dan Sunnah",
  },
  tabRecipients: {
    en: "Who Can Receive",
    bn: "কে যাকাত পাবে",
    ur: "زکوٰۃ کے مستحق",
    ar: "من يستحق الزكاة",
    tr: "Kimler Alabilir",
    ms: "Siapa Boleh Terima",
    id: "Siapa yang Berhak",
  },
  tabGivers: {
    en: "Who Must Give",
    bn: "কে যাকাত দেবে",
    ur: "زکوٰۃ کس پر فرض",
    ar: "من تجب عليه الزكاة",
    tr: "Kimler Vermeli",
    ms: "Siapa Wajib Beri",
    id: "Siapa Wajib Memberi",
  },
  quranVerse: {
    en: "Zakah expenditures are only for the poor and for the needy and for those employed for it and for bringing hearts together and for freeing captives and for those in debt and for the cause of Allah and for the [stranded] traveler — an obligation by Allah. And Allah is Knowing and Wise.",
    bn: "যাকাত শুধুমাত্র ফকির, মিসকিন, এর কর্মচারী, অন্তর আকৃষ্ট করার জন্য, দাসমুক্তি, ঋণগ্রস্ত, আল্লাহর পথে এবং বিপদগ্রস্ত মুসাফিরদের জন্য — আল্লাহর পক্ষ থেকে ফরয। আল্লাহ সর্বজ্ঞ, প্রজ্ঞাময়।",
    ur: "صدقات (زکوٰۃ) صرف فقیروں، مسکینوں، اس کے عاملوں، جن کے دل مائل کیے جائیں، غلاموں کی آزادی، قرضداروں، اللہ کی راہ اور مسافروں کے لیے ہے — اللہ کی طرف سے فرض ہے۔ اللہ علم والا حکمت والا ہے۔",
    ar: "إِنَّمَا الصَّدَقَاتُ لِلْفُقَرَاءِ وَالْمَسَاكِينِ وَالْعَامِلِينَ عَلَيْهَا وَالْمُؤَلَّفَةِ قُلُوبُهُمْ وَفِي الرِّقَابِ وَالْغَارِمِينَ وَفِي سَبِيلِ اللَّهِ وَابْنِ السَّبِيلِ فَرِيضَةً مِّنَ اللَّهِ وَاللَّهُ عَلِيمٌ حَكِيمٌ",
    tr: "Sadakalar (zekat) ancak fakirlere, yoksullara, onun uzerinde calisanlara, kalpleri Islama isitilacaklara, kolelere, borcululara, Allah yolunda ve yolculara mahsustur — Allah tarafindan farz kilindi. Allah bilendir, hikmet sahibidir.",
    ms: "Sedekah (zakat) hanyalah untuk orang-orang fakir, orang-orang miskin, amil-amil yang mengurusnya, orang-orang muallaf yang dijinakkan hatinya, untuk memerdekakan hamba, orang-orang yang berhutang, untuk jalan Allah dan orang-orang musafir — sebagai ketetapan daripada Allah. Allah Maha Mengetahui lagi Maha Bijaksana.",
    id: "Sesungguhnya zakat hanya untuk orang-orang fakir, orang miskin, amil zakat, orang yang dilunakkan hatinya (mualaf), untuk memerdekakan hamba, orang yang berhutang, untuk jalan Allah, dan untuk orang yang sedang dalam perjalanan — sebagai kewajiban dari Allah. Allah Maha Mengetahui, Maha Bijaksana.",
  },
  hadithPillar: {
    en: "Islam is built upon five pillars... and giving Zakat",
    bn: "ইসলাম পাঁচটি স্তম্ভের উপর প্রতিষ্ঠিত... এবং যাকাত প্রদান",
    ur: "اسلام پانچ ستونوں پر قائم ہے... اور زکوٰۃ ادا کرنا",
    ar: "بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ... وَإِيتَاءِ الزَّكَاةِ",
    tr: "Islam bes esas uzerine kurulmustur... ve zekat vermek",
    ms: "Islam didirikan atas lima tiang... dan menunaikan zakat",
    id: "Islam dibangun atas lima tiang... dan menunaikan zakat",
  },
  canReceiveIf: {
    en: "Can Receive Zakat If:",
    bn: "যাকাত পেতে পারবে যদি:",
    ur: "زکوٰۃ لے سکتے ہیں اگر:",
    ar: "يستحق الزكاة إذا:",
    tr: "Zekat alabilir eger:",
    ms: "Boleh terima zakat jika:",
    id: "Berhak menerima zakat jika:",
  },
  cannotReceiveIf: {
    en: "Cannot Receive If:",
    bn: "যাকাত পাবে না যদি:",
    ur: "زکوٰۃ نہیں لے سکتے اگر:",
    ar: "لا يستحق الزكاة إذا:",
    tr: "Zekat alamaz eger:",
    ms: "Tidak boleh terima jika:",
    id: "Tidak berhak jika:",
  },
  cannotReceiveTitle: {
    en: "Who Cannot Receive Zakat",
    bn: "যারা যাকাত পাবে না",
    ur: "جو زکوٰۃ نہیں لے سکتے",
    ar: "من لا يستحق الزكاة",
    tr: "Zekat Kimlere Verilmez",
    ms: "Siapa Tidak Boleh Terima Zakat",
    id: "Siapa yang Tidak Berhak Menerima Zakat",
  },
  selfCheckTitle: {
    en: "Quick Self-Check: Is Zakat Obligatory on You?",
    bn: "দ্রুত আত্ম-পরীক্ষা: আপনার উপর কি যাকাত ফরয?",
    ur: "فوری خود جانچ: کیا آپ پر زکوٰۃ فرض ہے؟",
    ar: "فحص سريع: هل الزكاة واجبة عليك؟",
    tr: "Hizli Kontrol: Zekat Size Farz mi?",
    ms: "Semakan Cepat: Adakah Zakat Wajib ke Atas Anda?",
    id: "Cek Cepat: Apakah Zakat Wajib Atas Anda?",
  },
  selfCheckFooter: {
    en: "If all conditions above apply to you, then Zakat is obligatory (fard) upon you. Use our calculator to determine your exact amount.",
    bn: "যদি উপরের সব শর্ত আপনার ক্ষেত্রে প্রযোজ্য হয়, তাহলে আপনার উপর যাকাত ফরয। আপনার সঠিক পরিমাণ জানতে আমাদের ক্যালকুলেটর ব্যবহার করুন।",
    ur: "اگر اوپر کی تمام شرائط آپ پر لاگو ہوتی ہیں تو آپ پر زکوٰۃ فرض ہے۔ اپنی صحیح رقم جاننے کے لیے ہمارا کیلکولیٹر استعمال کریں۔",
    ar: "إذا انطبقت عليك جميع الشروط أعلاه، فالزكاة واجبة (فرض) عليك. استخدم حاسبتنا لمعرفة المبلغ الدقيق.",
    tr: "Yukaridaki tum sartlar sizin icin gecerliyse zekat size farzdir. Tam miktarinizi belirlemek icin hesaplayicimizi kullanin.",
    ms: "Jika semua syarat di atas terpakai pada anda, maka zakat wajib (fardhu) ke atas anda. Gunakan kalkulator kami untuk menentukan jumlah tepat anda.",
    id: "Jika semua syarat di atas berlaku bagi Anda, maka zakat wajib (fardhu) atas Anda. Gunakan kalkulator kami untuk menentukan jumlah pasti Anda.",
  },
};

/* ─── Translated Recipients ─── */
interface RecipientData {
  arabic: string;
  name: Record<TransLang, string>;
  color: string;
  icon: string;
  description: Record<TransLang, string>;
  canReceive: Record<TransLang, string[]>;
  cannotReceive: Record<TransLang, string[]>;
}

const ZAKAT_RECIPIENTS: RecipientData[] = [
  {
    arabic: "الفقراء",
    name: {
      en: "Al-Fuqara (The Poor)", bn: "আল-ফুকারা (দরিদ্র)", ur: "الفقراء (غریب)", ar: "الفقراء",
      tr: "El-Fukara (Yoksullar)", ms: "Al-Fuqara (Orang Fakir)", id: "Al-Fuqara (Orang Fakir)",
    },
    color: "#10b981",
    icon: "🤲",
    description: {
      en: "Those who do not have enough to meet their basic needs — food, clothing, and shelter.",
      bn: "যাদের মৌলিক চাহিদা পূরণের জন্য যথেষ্ট নেই — খাদ্য, বস্ত্র ও বাসস্থান।",
      ur: "وہ لوگ جن کے پاس بنیادی ضروریات پوری کرنے کے لیے کافی نہیں — کھانا، کپڑا اور مکان۔",
      ar: "الذين لا يملكون ما يكفي لسد احتياجاتهم الأساسية من طعام وكساء ومأوى.",
      tr: "Temel ihtiyaclarini karsilayacak yeterli imkani olmayanlar — yiyecek, giyecek ve barinma.",
      ms: "Mereka yang tidak mempunyai cukup untuk keperluan asas — makanan, pakaian dan tempat tinggal.",
      id: "Mereka yang tidak memiliki cukup untuk kebutuhan dasar — makanan, pakaian, dan tempat tinggal.",
    },
    canReceive: {
      en: ["Cannot afford basic necessities", "Income far below nisab", "Unable to earn due to disability or illness"],
      bn: ["মৌলিক প্রয়োজনীয়তা বহন করতে অক্ষম", "আয় নিসাবের অনেক নিচে", "অক্ষমতা বা অসুস্থতার কারণে উপার্জনে অক্ষম"],
      ur: ["بنیادی ضروریات برداشت نہیں کر سکتے", "آمدنی نصاب سے بہت کم", "معذوری یا بیماری کی وجہ سے کمانے سے قاصر"],
      ar: ["لا يستطيع توفير الاحتياجات الأساسية", "دخله أقل بكثير من النصاب", "عاجز عن الكسب بسبب إعاقة أو مرض"],
      tr: ["Temel ihtiyaclarini karsilayamaz", "Geliri nisabin cok altinda", "Engellilik veya hastalik nedeniyle kazanamaz"],
      ms: ["Tidak mampu memenuhi keperluan asas", "Pendapatan jauh di bawah nisab", "Tidak mampu bekerja kerana kecacatan atau penyakit"],
      id: ["Tidak mampu memenuhi kebutuhan dasar", "Penghasilan jauh di bawah nisab", "Tidak mampu bekerja karena disabilitas atau sakit"],
    },
    cannotReceive: {
      en: ["Owns wealth above nisab", "Has sufficient income for basic needs"],
      bn: ["নিসাবের উপরে সম্পদ আছে", "মৌলিক চাহিদার জন্য পর্যাপ্ত আয় আছে"],
      ur: ["نصاب سے زیادہ مال ہو", "بنیادی ضروریات کے لیے کافی آمدنی ہو"],
      ar: ["يملك مالاً فوق النصاب", "لديه دخل كافٍ لسد الاحتياجات الأساسية"],
      tr: ["Nisab uzerinde serveti var", "Temel ihtiyaclarini karsilayacak geliri var"],
      ms: ["Memiliki harta melebihi nisab", "Mempunyai pendapatan mencukupi untuk keperluan asas"],
      id: ["Memiliki harta di atas nisab", "Memiliki penghasilan cukup untuk kebutuhan dasar"],
    },
  },
  {
    arabic: "المساكين",
    name: {
      en: "Al-Masakin (The Needy)", bn: "আল-মাসাকীন (অভাবী)", ur: "المساکین (مسکین)", ar: "المساكين",
      tr: "El-Mesakin (Muhtaclar)", ms: "Al-Masakin (Orang Miskin)", id: "Al-Masakin (Orang Miskin)",
    },
    color: "#3b82f6",
    icon: "🏚️",
    description: {
      en: "Those who have some income but not sufficient to meet all basic needs.",
      bn: "যাদের কিছু আয় আছে কিন্তু সব মৌলিক চাহিদা পূরণে অপর্যাপ্ত।",
      ur: "جن کی کچھ آمدنی ہے مگر تمام بنیادی ضروریات پوری کرنے کے لیے کافی نہیں۔",
      ar: "من لديهم بعض الدخل لكنه لا يكفي لسد جميع الاحتياجات الأساسية.",
      tr: "Bir miktar geliri olan ancak tum temel ihtiyaclarini karsilayamayan kisiler.",
      ms: "Mereka yang mempunyai sedikit pendapatan tetapi tidak mencukupi untuk semua keperluan asas.",
      id: "Mereka yang memiliki sedikit penghasilan tetapi tidak cukup untuk semua kebutuhan dasar.",
    },
    canReceive: {
      en: ["Has income but not enough for basic needs", "Struggles to pay rent or medical bills", "Cannot maintain a dignified life"],
      bn: ["আয় আছে কিন্তু মৌলিক চাহিদার জন্য যথেষ্ট নয়", "ভাড়া বা চিকিৎসা খরচ দিতে কষ্ট হয়", "সম্মানজনক জীবন বজায় রাখতে পারে না"],
      ur: ["آمدنی ہے مگر بنیادی ضروریات کے لیے کافی نہیں", "کرایہ یا طبی بل ادا کرنا مشکل", "باعزت زندگی گزار نہیں سکتے"],
      ar: ["لديه دخل لكنه لا يكفي للاحتياجات الأساسية", "يعاني في دفع الإيجار أو الفواتير الطبية", "لا يستطيع العيش بكرامة"],
      tr: ["Geliri var ama temel ihtiyaclar icin yeterli degil", "Kira veya saglik giderlerini odemekte zorlanir", "Onurlu bir hayat surduremez"],
      ms: ["Ada pendapatan tetapi tidak mencukupi untuk keperluan asas", "Sukar membayar sewa atau bil perubatan", "Tidak dapat menjalani kehidupan yang bermaruah"],
      id: ["Ada penghasilan tetapi tidak cukup untuk kebutuhan dasar", "Kesulitan membayar sewa atau biaya medis", "Tidak dapat hidup secara bermartabat"],
    },
    cannotReceive: {
      en: ["Owns wealth above nisab", "Can comfortably meet all basic needs"],
      bn: ["নিসাবের উপরে সম্পদ আছে", "সব মৌলিক চাহিদা সহজে পূরণ করতে পারে"],
      ur: ["نصاب سے زیادہ مال ہو", "تمام بنیادی ضروریات آرام سے پوری کر سکتے ہوں"],
      ar: ["يملك مالاً فوق النصاب", "يستطيع تلبية جميع الاحتياجات الأساسية بسهولة"],
      tr: ["Nisab uzerinde serveti var", "Tum temel ihtiyaclarini rahatca karsilayabilir"],
      ms: ["Memiliki harta melebihi nisab", "Dapat memenuhi semua keperluan asas dengan selesa"],
      id: ["Memiliki harta di atas nisab", "Dapat memenuhi semua kebutuhan dasar dengan nyaman"],
    },
  },
  {
    arabic: "العاملين عليها",
    name: {
      en: "Amil Zakat (Zakat Collectors)", bn: "আমিল যাকাত (যাকাত আদায়কারী)", ur: "عاملین زکوٰۃ (زکوٰۃ جمع کرنے والے)", ar: "العاملين عليها",
      tr: "Amil Zekat (Zekat Toplayicilar)", ms: "Amil Zakat (Pemungut Zakat)", id: "Amil Zakat (Pengumpul Zakat)",
    },
    color: "#8b5cf6",
    icon: "📋",
    description: {
      en: "Those employed to collect, manage, and distribute Zakat.",
      bn: "যাকাত সংগ্রহ, ব্যবস্থাপনা ও বিতরণে নিয়োজিত ব্যক্তিরা।",
      ur: "زکوٰۃ جمع کرنے، انتظام اور تقسیم کے لیے مقرر لوگ۔",
      ar: "المكلفون بجمع الزكاة وإدارتها وتوزيعها.",
      tr: "Zekat toplama, yonetme ve dagitma isinde gorevli kisiler.",
      ms: "Mereka yang ditugaskan untuk mengutip, mengurus dan mengagihkan zakat.",
      id: "Mereka yang ditugaskan untuk mengumpulkan, mengelola, dan mendistribusikan zakat.",
    },
    canReceive: {
      en: ["Appointed by Islamic authority to collect Zakat", "Works in Zakat distribution", "Compensation for Zakat administration"],
      bn: ["ইসলামী কর্তৃপক্ষ কর্তৃক যাকাত আদায়ে নিয়োজিত", "যাকাত বিতরণে কাজ করেন", "যাকাত প্রশাসনের পারিশ্রমিক"],
      ur: ["اسلامی اتھارٹی نے زکوٰۃ جمع کرنے پر مقرر کیا ہو", "زکوٰۃ کی تقسیم میں کام کرتے ہوں", "زکوٰۃ انتظامیہ کا معاوضہ"],
      ar: ["مُعيَّن من سلطة إسلامية لجمع الزكاة", "يعمل في توزيع الزكاة", "تعويض عن عمله في إدارة الزكاة"],
      tr: ["Islami otorite tarafindan zekat toplama goreviyle atanmis", "Zekat dagitiminda calisir", "Zekat yonetimi icin tazminat"],
      ms: ["Dilantik oleh pihak berkuasa Islam untuk mengutip zakat", "Bekerja dalam pengagihan zakat", "Pampasan untuk pentadbiran zakat"],
      id: ["Ditunjuk oleh otoritas Islam untuk mengumpulkan zakat", "Bekerja dalam distribusi zakat", "Kompensasi untuk administrasi zakat"],
    },
    cannotReceive: {
      en: ["Self-appointed without authority", "Already receiving adequate salary from other sources"],
      bn: ["কর্তৃপক্ষ ছাড়া স্ব-নিযুক্ত", "অন্য উৎস থেকে পর্যাপ্ত বেতন পান"],
      ur: ["بغیر اتھارٹی خود مقرر", "دوسرے ذرائع سے پہلے سے کافی تنخواہ لے رہے ہوں"],
      ar: ["عيّن نفسه بدون تكليف", "يتقاضى راتباً كافياً من مصادر أخرى"],
      tr: ["Yetkisiz olarak kendini atamis", "Baska kaynaklardan yeterli maas aliyor"],
      ms: ["Melantik diri sendiri tanpa kebenaran", "Sudah menerima gaji mencukupi daripada sumber lain"],
      id: ["Menunjuk diri sendiri tanpa wewenang", "Sudah menerima gaji cukup dari sumber lain"],
    },
  },
  {
    arabic: "المؤلفة قلوبهم",
    name: {
      en: "Al-Mu'allafatu Qulubuhum (New Muslims)", bn: "আল-মুআল্লাফাতু কুলুবুহুম (নও মুসলিম)", ur: "المؤلفۃ قلوبہم (نو مسلم)", ar: "المؤلفة قلوبهم",
      tr: "Muellefe-i Kulub (Yeni Muslumanlar)", ms: "Mualaf (Saudara Baru Islam)", id: "Mualaf (Muslim Baru)",
    },
    color: "#f59e0b",
    icon: "💛",
    description: {
      en: "New converts to Islam who need financial support, or those whose hearts are inclined towards Islam.",
      bn: "ইসলামে নব দীক্ষিত যাদের আর্থিক সহায়তা প্রয়োজন, বা যাদের হৃদয় ইসলামের প্রতি আকৃষ্ট।",
      ur: "نو مسلم جنہیں مالی مدد کی ضرورت ہو، یا وہ جن کے دل اسلام کی طرف مائل ہوں۔",
      ar: "المسلمون الجدد الذين يحتاجون دعماً مالياً، أو من تميل قلوبهم نحو الإسلام.",
      tr: "Mali destege ihtiyac duyan yeni Muslumanlar veya kalpleri Islama yonelen kisiler.",
      ms: "Saudara baru Islam yang memerlukan sokongan kewangan, atau mereka yang hatinya cenderung kepada Islam.",
      id: "Muslim baru yang membutuhkan dukungan finansial, atau mereka yang hatinya condong kepada Islam.",
    },
    canReceive: {
      en: ["Recently accepted Islam and needs support", "Lost family/job support due to converting", "Heart inclined towards Islam"],
      bn: ["সম্প্রতি ইসলাম গ্রহণ করেছে এবং সহায়তা প্রয়োজন", "ধর্মান্তরের কারণে পরিবার/চাকরির সমর্থন হারিয়েছে", "হৃদয় ইসলামের প্রতি আকৃষ্ট"],
      ur: ["حال ہی میں اسلام قبول کیا اور مدد درکار ہے", "اسلام قبول کرنے سے خاندان/نوکری کی حمایت کھو دی", "دل اسلام کی طرف مائل"],
      ar: ["أسلم حديثاً ويحتاج دعماً", "فقد دعم عائلته أو عمله بسبب إسلامه", "قلبه مائل نحو الإسلام"],
      tr: ["Yakin zamanda Islam'i kabul etti ve destege ihtiyaci var", "Din degistirmesi nedeniyle aile/is destegini kaybetti", "Kalbi Islam'a meyilli"],
      ms: ["Baru memeluk Islam dan memerlukan sokongan", "Kehilangan sokongan keluarga/pekerjaan kerana memeluk Islam", "Hati cenderung kepada Islam"],
      id: ["Baru masuk Islam dan membutuhkan dukungan", "Kehilangan dukungan keluarga/pekerjaan karena masuk Islam", "Hati condong kepada Islam"],
    },
    cannotReceive: {
      en: ["Wealthy new Muslims who don't need support", "Insincere purposes"],
      bn: ["ধনী নও মুসলিম যাদের সহায়তার প্রয়োজন নেই", "অসৎ উদ্দেশ্যে"],
      ur: ["دولتمند نو مسلم جنہیں مدد کی ضرورت نہیں", "غلط مقاصد کے لیے"],
      ar: ["المسلمون الجدد الأثرياء الذين لا يحتاجون دعماً", "لأغراض غير صادقة"],
      tr: ["Destege ihtiyaci olmayan zengin yeni Muslumanlar", "Samimiyetsiz amaclar icin"],
      ms: ["Mualaf kaya yang tidak memerlukan sokongan", "Tujuan yang tidak ikhlas"],
      id: ["Mualaf kaya yang tidak membutuhkan dukungan", "Tujuan yang tidak tulus"],
    },
  },
  {
    arabic: "في الرقاب",
    name: {
      en: "Ar-Riqab (Freeing Captives)", bn: "আর-রিকাব (দাসমুক্তি)", ur: "فی الرقاب (غلاموں کی آزادی)", ar: "في الرقاب",
      tr: "Er-Rikab (Koleleri Ozgurlestirme)", ms: "Ar-Riqab (Memerdekakan Hamba)", id: "Ar-Riqab (Memerdekakan Hamba)",
    },
    color: "#ef4444",
    icon: "⛓️",
    description: {
      en: "Historically for freeing slaves. In modern context: helping human trafficking victims, bonded laborers, or unjustly imprisoned.",
      bn: "ঐতিহাসিকভাবে দাসমুক্তির জন্য। আধুনিক প্রেক্ষাপটে: পাচারের শিকার, বন্ধক শ্রমিক বা অন্যায়ভাবে কারাবন্দীদের সাহায্য।",
      ur: "تاریخی طور پر غلاموں کی آزادی۔ جدید تناظر میں: انسانی سمگلنگ کے شکار، بندھوا مزدور یا ناحق قیدیوں کی مدد۔",
      ar: "تاريخياً لتحرير العبيد. في السياق الحديث: مساعدة ضحايا الاتجار بالبشر والعمال المستعبدين والمسجونين ظلماً.",
      tr: "Tarihsel olarak koleleri ozgurlestirmek icin. Modern baglamda: insan ticareti magdurlarina, zorla calistirilan isgilere yardim.",
      ms: "Secara sejarah untuk memerdekakan hamba. Dalam konteks moden: membantu mangsa pemerdagangan manusia, buruh paksa atau orang yang dipenjara secara zalim.",
      id: "Secara historis untuk memerdekakan budak. Dalam konteks modern: membantu korban perdagangan manusia, buruh paksa, atau yang dipenjara secara zalim.",
    },
    canReceive: {
      en: ["Victims of human trafficking", "Bonded laborers", "Unjustly imprisoned needing bail/legal help"],
      bn: ["পাচারের শিকার", "বন্ধক শ্রমিক", "অন্যায়ভাবে কারাবন্দী যাদের জামিন/আইনি সাহায্য প্রয়োজন"],
      ur: ["انسانی سمگلنگ کے شکار", "بندھوا مزدور", "ناحق قیدی جنہیں ضمانت/قانونی مدد چاہیے"],
      ar: ["ضحايا الاتجار بالبشر", "العمال المستعبدون", "المسجونون ظلماً ويحتاجون كفالة أو مساعدة قانونية"],
      tr: ["Insan ticareti magdurlari", "Zorla calistirilan isciler", "Haksiz yere hapse giren ve kefalet/hukuki yardima ihtiyac duyanlar"],
      ms: ["Mangsa pemerdagangan manusia", "Buruh paksa", "Orang yang dipenjara secara zalim yang memerlukan jaminan/bantuan undang-undang"],
      id: ["Korban perdagangan manusia", "Buruh paksa", "Yang dipenjara secara zalim dan butuh jaminan/bantuan hukum"],
    },
    cannotReceive: {
      en: ["Criminals justly imprisoned", "Not in any form of bondage"],
      bn: ["ন্যায়সঙ্গতভাবে কারাবন্দী অপরাধী", "কোনো ধরনের বন্দীত্বে নেই"],
      ur: ["جرم کی سزا پانے والے مجرم", "کسی بھی قسم کی غلامی میں نہیں"],
      ar: ["المجرمون المسجونون بحق", "ليسوا في أي شكل من أشكال العبودية"],
      tr: ["Hakli olarak hapse giren sucular", "Herhangi bir esaret icinde olmayanlar"],
      ms: ["Penjenayah yang dipenjara dengan adil", "Tidak dalam apa-apa bentuk perhambaan"],
      id: ["Penjahat yang dipenjara secara adil", "Tidak dalam bentuk perbudakan apa pun"],
    },
  },
  {
    arabic: "الغارمين",
    name: {
      en: "Al-Gharimin (Those in Debt)", bn: "আল-গারিমীন (ঋণগ্রস্ত)", ur: "الغارمین (قرضدار)", ar: "الغارمين",
      tr: "El-Garimin (Borclular)", ms: "Al-Gharimin (Orang Berhutang)", id: "Al-Gharimin (Orang Berhutang)",
    },
    color: "#06b6d4",
    icon: "📊",
    description: {
      en: "Those in debt for halal purposes who genuinely cannot repay.",
      bn: "হালাল উদ্দেশ্যে ঋণগ্রস্ত যারা সত্যিই পরিশোধ করতে পারে না।",
      ur: "حلال مقاصد کے لیے مقروض جو واقعی ادائیگی نہیں کر سکتے۔",
      ar: "المدينون لأغراض حلال ولا يستطيعون السداد فعلاً.",
      tr: "Helal amaclarla borclanan ve gercekten odeyemeyen kisiler.",
      ms: "Orang yang berhutang untuk tujuan halal dan benar-benar tidak mampu membayar.",
      id: "Orang yang berhutang untuk tujuan halal dan benar-benar tidak mampu membayar.",
    },
    canReceive: {
      en: ["In debt for basic needs (medical, housing)", "Debt for halal purposes", "Unable to repay despite trying", "Debt taken to reconcile communities"],
      bn: ["মৌলিক চাহিদায় ঋণ (চিকিৎসা, বাসস্থান)", "হালাল উদ্দেশ্যে ঋণ", "চেষ্টা সত্ত্বেও পরিশোধে অক্ষম", "সমাজে মিলমিশ করতে ঋণ নেওয়া"],
      ur: ["بنیادی ضروریات کے لیے قرض (طبی، رہائش)", "حلال مقاصد کے لیے قرض", "کوشش کے باوجود ادائیگی سے قاصر", "لوگوں میں صلح کے لیے لیا گیا قرض"],
      ar: ["مدين لاحتياجات أساسية (طبية، سكن)", "دين لأغراض حلال", "عاجز عن السداد رغم المحاولة", "دين أُخذ للإصلاح بين الناس"],
      tr: ["Temel ihtiyaclar icin borclu (saglik, barinma)", "Helal amaclar icin borc", "Calismasina ragmen odeyemiyor", "Topluluklar arasi uzlasma icin alinan borc"],
      ms: ["Berhutang untuk keperluan asas (perubatan, perumahan)", "Hutang untuk tujuan halal", "Tidak mampu membayar walaupun berusaha", "Hutang diambil untuk mendamaikan masyarakat"],
      id: ["Berhutang untuk kebutuhan dasar (medis, perumahan)", "Hutang untuk tujuan halal", "Tidak mampu membayar meski sudah berusaha", "Hutang diambil untuk mendamaikan masyarakat"],
    },
    cannotReceive: {
      en: ["Debt for haram purposes (gambling, alcohol)", "Wealthy person who can pay off debt", "Deliberately avoiding repayment"],
      bn: ["হারাম কাজের জন্য ঋণ (জুয়া, মদ)", "ধনী ব্যক্তি যে ঋণ পরিশোধ করতে পারে", "ইচ্ছাকৃতভাবে পরিশোধ এড়ানো"],
      ur: ["حرام مقاصد کے لیے قرض (جوا، شراب)", "دولتمند شخص جو قرض ادا کر سکتا ہے", "جان بوجھ کر ادائیگی سے گریز"],
      ar: ["دين لأغراض حرام (قمار، خمر)", "شخص ثري يستطيع سداد دينه", "يتعمد التهرب من السداد"],
      tr: ["Haram amaclar icin borc (kumar, alkol)", "Borcunu odeyebilecek zengin kisi", "Kasitli olarak geri odemekten kacinan"],
      ms: ["Hutang untuk tujuan haram (judi, arak)", "Orang kaya yang mampu membayar hutang", "Sengaja mengelak pembayaran"],
      id: ["Hutang untuk tujuan haram (judi, alkohol)", "Orang kaya yang mampu melunasi hutang", "Sengaja menghindari pembayaran"],
    },
  },
  {
    arabic: "في سبيل الله",
    name: {
      en: "Fi Sabilillah (In Allah's Cause)", bn: "ফী সাবীলিল্লাহ (আল্লাহর পথে)", ur: "فی سبیل اللہ (اللہ کی راہ میں)", ar: "في سبيل الله",
      tr: "Fi Sebilillah (Allah Yolunda)", ms: "Fi Sabilillah (Jalan Allah)", id: "Fi Sabilillah (Jalan Allah)",
    },
    color: "#ec4899",
    icon: "🕌",
    description: {
      en: "Those striving in Allah's path: Islamic education, da'wah, building mosques, serving the Muslim community.",
      bn: "আল্লাহর পথে প্রচেষ্টারত: ইসলামী শিক্ষা, দাওয়াত, মসজিদ নির্মাণ, মুসলিম সম্প্রদায়ের সেবা।",
      ur: "اللہ کی راہ میں جہد کرنے والے: اسلامی تعلیم، دعوت، مسجد تعمیر، مسلم کمیونٹی کی خدمت۔",
      ar: "المجاهدون في سبيل الله: التعليم الإسلامي، الدعوة، بناء المساجد، خدمة المجتمع المسلم.",
      tr: "Allah yolunda calisan kisiler: Islami egitim, davet, cami yapimi, Musluman topluluguna hizmet.",
      ms: "Mereka yang berjuang di jalan Allah: pendidikan Islam, dakwah, pembinaan masjid, khidmat kepada ummah.",
      id: "Mereka yang berjuang di jalan Allah: pendidikan Islam, dakwah, pembangunan masjid, melayani umat.",
    },
    canReceive: {
      en: ["Students of Islamic knowledge who can't afford it", "Da'wah workers", "Projects serving Muslim community", "Defending Muslim rights"],
      bn: ["ইসলামী জ্ঞানের শিক্ষার্থী যারা খরচ বহন করতে পারে না", "দাওয়াত কর্মী", "মুসলিম সম্প্রদায়ের সেবামূলক প্রকল্প", "মুসলিমদের অধিকার রক্ষা"],
      ur: ["اسلامی علم کے طالب علم جو خرچ نہیں اٹھا سکتے", "دعوت کارکن", "مسلم کمیونٹی کی خدمت کے منصوبے", "مسلمانوں کے حقوق کا دفاع"],
      ar: ["طلاب العلم الشرعي غير القادرين على الإنفاق", "العاملون في الدعوة", "مشاريع خدمة المجتمع المسلم", "الدفاع عن حقوق المسلمين"],
      tr: ["Egitim masraflarini karsilayamayan Islam ilmi ogrencileri", "Davet calisanlari", "Musluman topluluguna hizmet eden projeler", "Musluman haklarini savunanlar"],
      ms: ["Pelajar ilmu Islam yang tidak mampu", "Pekerja dakwah", "Projek yang berkhidmat untuk ummah", "Mempertahankan hak-hak Muslim"],
      id: ["Pelajar ilmu Islam yang tidak mampu", "Pekerja dakwah", "Proyek yang melayani umat Islam", "Membela hak-hak umat Islam"],
    },
    cannotReceive: {
      en: ["Wealthy individuals doing voluntary work", "Projects with sufficient funding"],
      bn: ["স্বেচ্ছাসেবী ধনী ব্যক্তি", "পর্যাপ্ত তহবিলযুক্ত প্রকল্প"],
      ur: ["رضاکارانہ کام کرنے والے امیر لوگ", "کافی فنڈنگ والے منصوبے"],
      ar: ["الأثرياء المتطوعون", "المشاريع ذات التمويل الكافي"],
      tr: ["Gonullu calisma yapan zengin bireyler", "Yeterli finansmana sahip projeler"],
      ms: ["Individu kaya yang melakukan kerja sukarela", "Projek yang mempunyai dana mencukupi"],
      id: ["Individu kaya yang bekerja sukarela", "Proyek yang sudah cukup dana"],
    },
  },
  {
    arabic: "ابن السبيل",
    name: {
      en: "Ibn As-Sabil (The Stranded Traveler)", bn: "ইবনুস সাবীল (বিপদগ্রস্ত মুসাফির)", ur: "ابن السبیل (مسافر)", ar: "ابن السبيل",
      tr: "Ibnussebil (Yolda Kalmis Yolcu)", ms: "Ibnu Sabil (Musafir Terlantar)", id: "Ibnu Sabil (Musafir Terlantar)",
    },
    color: "#84cc16",
    icon: "🧳",
    description: {
      en: "A stranded traveler with no access to funds, even if wealthy at home. They need help to complete their journey.",
      bn: "অর্থের প্রবেশাধিকার নেই এমন আটকে পড়া মুসাফির, বাড়িতে ধনী হলেও। তাদের যাত্রা সম্পন্ন করতে সাহায্য প্রয়োজন।",
      ur: "سفر میں پھنسا ہوا شخص جس کی رسائی اپنے مال تک نہیں، چاہے گھر پر دولتمند ہو۔",
      ar: "مسافر علق في الطريق ولا يستطيع الوصول لأمواله حتى لو كان غنياً في بلده.",
      tr: "Fonlarina erislemeyen, yolda kalmis bir yolcu — evde zengin olsa bile.",
      ms: "Musafir yang tersekat tanpa akses kepada dananya, walaupun kaya di negara asal.",
      id: "Musafir yang terlantar tanpa akses ke dananya, meskipun kaya di kampung halaman.",
    },
    canReceive: {
      en: ["Stranded with no access to funds", "Lost money/documents while traveling", "Refugee or displaced person", "Cannot afford to return home"],
      bn: ["অর্থে প্রবেশাধিকার নেই", "ভ্রমণকালে টাকা/কাগজপত্র হারিয়েছে", "শরণার্থী বা বাস্তুচ্যুত", "বাড়ি ফেরার সামর্থ্য নেই"],
      ur: ["رسائی اپنے مال تک نہیں", "سفر میں پیسے/دستاویزات کھو دیے", "مہاجر یا بے گھر شخص", "گھر واپسی کی استطاعت نہیں"],
      ar: ["علق بدون وصول لأمواله", "فقد أمواله/وثائقه أثناء السفر", "لاجئ أو نازح", "لا يستطيع العودة لبلده"],
      tr: ["Fonlarina erislemeyen", "Seyahat sirasinda para/belgelerini kaybetmis", "Multeci veya yerinden edilmis kisi", "Eve donmeyi karsilayamiyor"],
      ms: ["Tersekat tanpa akses kepada dana", "Kehilangan wang/dokumen semasa bermusafir", "Pelarian atau orang terlantar", "Tidak mampu pulang ke rumah"],
      id: ["Terlantar tanpa akses ke dana", "Kehilangan uang/dokumen saat bepergian", "Pengungsi atau orang terlantar", "Tidak mampu pulang ke rumah"],
    },
    cannotReceive: {
      en: ["Traveling for haram purposes", "Has access to funds but won't use them", "Wealthy traveler with available resources"],
      bn: ["হারাম উদ্দেশ্যে ভ্রমণ", "অর্থে প্রবেশাধিকার আছে কিন্তু ব্যবহার করবে না", "সম্পদ আছে এমন ধনী মুসাফির"],
      ur: ["حرام مقصد سے سفر", "مال تک رسائی ہے مگر استعمال نہیں کرتے", "وسائل والا دولتمند مسافر"],
      ar: ["يسافر لأغراض حرام", "لديه أموال لكنه لا يستخدمها", "مسافر ثري لديه موارد متاحة"],
      tr: ["Haram amaclarla seyahat eden", "Fonlarina erisebildigi halde kullanmayan", "Kaynaklara sahip zengin yolcu"],
      ms: ["Bermusafir untuk tujuan haram", "Mempunyai akses kepada dana tetapi tidak mahu menggunakan", "Musafir kaya yang mempunyai sumber"],
      id: ["Bepergian untuk tujuan haram", "Memiliki akses dana tapi tidak mau menggunakan", "Musafir kaya yang memiliki sumber daya"],
    },
  },
];

/* ─── Translated Givers Conditions ─── */
interface GiverCondition {
  icon: string;
  title: Record<TransLang, string>;
  description: Record<TransLang, string>;
}

const ZAKAT_GIVERS_CONDITIONS: GiverCondition[] = [
  {
    icon: "☪️",
    title: {
      en: "Muslim", bn: "মুসলিম", ur: "مسلمان", ar: "مسلم", tr: "Musluman", ms: "Muslim", id: "Muslim",
    },
    description: {
      en: "Zakat is obligatory only upon Muslims. Non-Muslims are not required to pay Zakat.",
      bn: "যাকাত শুধুমাত্র মুসলিমদের উপর ফরয। অমুসলিমদের যাকাত দিতে হয় না।",
      ur: "زکوٰۃ صرف مسلمانوں پر فرض ہے۔ غیر مسلموں پر زکوٰۃ واجب نہیں۔",
      ar: "الزكاة واجبة على المسلمين فقط. غير المسلمين ليسوا مطالبين بدفع الزكاة.",
      tr: "Zekat yalnizca Muslumanlara farzdir. Gayrimuslimlerin zekat odemesi gerekmez.",
      ms: "Zakat hanya wajib ke atas orang Islam. Orang bukan Islam tidak diwajibkan membayar zakat.",
      id: "Zakat hanya wajib atas umat Islam. Non-Muslim tidak diwajibkan membayar zakat.",
    },
  },
  {
    icon: "🧠",
    title: {
      en: "Sane (Aaqil)", bn: "সুস্থ মস্তিষ্ক (আকিল)", ur: "عاقل", ar: "عاقل", tr: "Akilli (Akil)", ms: "Berakal (Aqil)", id: "Berakal (Aqil)",
    },
    description: {
      en: "The person must be mentally sound. Most scholars agree insane persons are exempt.",
      bn: "ব্যক্তিকে মানসিকভাবে সুস্থ হতে হবে। অধিকাংশ আলেম একমত যে পাগল ব্যক্তি ব্যতিক্রম।",
      ur: "شخص کو ذہنی طور پر صحت مند ہونا چاہیے۔ اکثر علماء متفق ہیں کہ پاگل معاف ہے۔",
      ar: "يجب أن يكون الشخص عاقلاً. أغلب العلماء يتفقون على إعفاء المجنون.",
      tr: "Kisinin akli saglikli olmasi gerekir. Cogu alim akil hastalarinin muaf oldugunu kabul eder.",
      ms: "Seseorang mestilah waras. Kebanyakan ulama bersetuju orang gila dikecualikan.",
      id: "Seseorang harus berakal sehat. Kebanyakan ulama sepakat orang gila dikecualikan.",
    },
  },
  {
    icon: "🧑",
    title: {
      en: "Adult (Baligh)", bn: "প্রাপ্তবয়স্ক (বালিগ)", ur: "بالغ", ar: "بالغ", tr: "Yetiskin (Balig)", ms: "Dewasa (Baligh)", id: "Dewasa (Baligh)",
    },
    description: {
      en: "Must have reached the age of puberty. However, Shafi'i and Hanbali scholars say Zakat is due on a minor's wealth too.",
      bn: "বয়ঃসন্ধিতে পৌঁছাতে হবে। তবে শাফেঈ ও হাম্বলী আলেমগণ বলেন নাবালেগের সম্পদেও যাকাত ফরয।",
      ur: "بلوغت تک پہنچا ہونا ضروری ہے۔ تاہم شافعی اور حنبلی علماء کہتے ہیں نابالغ کے مال پر بھی زکوٰۃ واجب ہے۔",
      ar: "يجب أن يكون بالغاً. لكن الشافعية والحنابلة يرون وجوب الزكاة في مال الصبي أيضاً.",
      tr: "Ergenlik cagina ulasmis olmali. Ancak Safii ve Hanbeli alimlere gore cocugun malinda da zekat vardir.",
      ms: "Mesti sudah baligh. Namun ulama Syafii dan Hanbali berpendapat zakat wajib ke atas harta kanak-kanak juga.",
      id: "Harus sudah baligh. Namun ulama Syafi'i dan Hanbali berpendapat zakat wajib atas harta anak-anak juga.",
    },
  },
  {
    icon: "💰",
    title: {
      en: "Possesses Nisab", bn: "নিসাব পরিমাণ সম্পদ", ur: "نصاب کا مالک", ar: "مالك للنصاب", tr: "Nisab Sahibi", ms: "Memiliki Nisab", id: "Memiliki Nisab",
    },
    description: {
      en: "Must own wealth equal to or above the nisab threshold (87.48g of gold or 612.36g of silver equivalent).",
      bn: "নিসাব পরিমাণ (৮৭.৪৮ গ্রাম স্বর্ণ বা ৬১২.৩৬ গ্রাম রৌপ্যের সমতুল্য) সম্পদ থাকতে হবে।",
      ur: "نصاب کے برابر یا اس سے زیادہ مال ہونا چاہیے (۸۷.۴۸ گرام سونا یا ۶۱۲.۳۶ گرام چاندی)۔",
      ar: "يجب أن يمتلك مالاً بقيمة النصاب أو أكثر (87.48 غرام ذهب أو 612.36 غرام فضة).",
      tr: "Nisab miktarinda veya uzerinde servete sahip olmali (87.48g altin veya 612.36g gumus).",
      ms: "Mesti memiliki harta sama dengan atau melebihi nisab (87.48g emas atau 612.36g perak).",
      id: "Harus memiliki harta senilai atau melebihi nisab (87,48g emas atau 612,36g perak).",
    },
  },
  {
    icon: "📅",
    title: {
      en: "One Lunar Year (Hawl)", bn: "এক চন্দ্র বছর (হাওল)", ur: "ایک قمری سال (حول)", ar: "حولان الحول", tr: "Bir Kameri Yil (Havl)", ms: "Satu Tahun Hijri (Haul)", id: "Satu Tahun Hijriah (Haul)",
    },
    description: {
      en: "The wealth must have been held for one complete lunar year (354 days). Agricultural produce is exempt from this condition.",
      bn: "সম্পদ এক পূর্ণ চন্দ্র বছর (৩৫৪ দিন) ধরে থাকতে হবে। কৃষিজ ফসল এই শর্ত থেকে অব্যাহতিপ্রাপ্ত।",
      ur: "مال ایک مکمل قمری سال (۳۵۴ دن) تک رکھا ہونا چاہیے۔ زرعی پیداوار اس شرط سے مستثنیٰ ہے۔",
      ar: "يجب أن يمر على المال حول كامل (354 يوماً). المحاصيل الزراعية معفاة من هذا الشرط.",
      tr: "Servet bir tam kameri yil (354 gun) boyunca elde tutulmus olmali. Tarimsal urunler bu sarttan muaftir.",
      ms: "Harta mesti dimiliki selama satu tahun Hijri penuh (354 hari). Hasil pertanian dikecualikan daripada syarat ini.",
      id: "Harta harus dimiliki selama satu tahun Hijriah penuh (354 hari). Hasil pertanian dikecualikan dari syarat ini.",
    },
  },
  {
    icon: "✅",
    title: {
      en: "Full Ownership", bn: "পূর্ণ মালিকানা", ur: "مکمل ملکیت", ar: "الملكية التامة", tr: "Tam Mulkiyet", ms: "Pemilikan Penuh", id: "Kepemilikan Penuh",
    },
    description: {
      en: "Must have full and complete ownership of the wealth. Shared or disputed assets may have different rulings.",
      bn: "সম্পদের পূর্ণ ও সম্পূর্ণ মালিকানা থাকতে হবে। ভাগ করা বা বিতর্কিত সম্পদে ভিন্ন বিধান হতে পারে।",
      ur: "مال کی مکمل ملکیت ہونی چاہیے۔ مشترکہ یا متنازعہ اثاثوں کے مختلف احکام ہو سکتے ہیں۔",
      ar: "يجب أن تكون الملكية تامة وكاملة. الأصول المشتركة أو المتنازع عليها قد يكون لها أحكام مختلفة.",
      tr: "Servetin tam ve eksiksiz mulkiyetine sahip olmali. Ortak veya tartismali varliklar farkli hukumlere tabi olabilir.",
      ms: "Mesti mempunyai pemilikan penuh dan lengkap terhadap harta. Harta kongsi atau dipertikaikan mungkin mempunyai hukum berbeza.",
      id: "Harus memiliki kepemilikan penuh atas harta. Aset bersama atau yang disengketakan mungkin memiliki hukum berbeda.",
    },
  },
];

/* ─── Translated Cannot Receive ─── */
interface CannotReceiveItem {
  text: Record<TransLang, string>;
  icon: typeof XCircle;
}

const CANNOT_RECEIVE: CannotReceiveItem[] = [
  {
    text: {
      en: "The wealthy (those above nisab)", bn: "ধনী ব্যক্তি (নিসাবের উপরে)", ur: "دولتمند (نصاب سے اوپر)",
      ar: "الأغنياء (فوق النصاب)", tr: "Zenginler (nisab uzerinde)", ms: "Orang kaya (melebihi nisab)", id: "Orang kaya (di atas nisab)",
    },
    icon: XCircle,
  },
  {
    text: {
      en: "Non-Muslims (for Zakat; Sadaqah can be given to anyone)", bn: "অমুসলিম (যাকাতের জন্য; সদকা যে কাউকে দেওয়া যায়)", ur: "غیر مسلم (زکوٰۃ کے لیے؛ صدقہ کسی کو بھی دیا جا سکتا ہے)",
      ar: "غير المسلمين (للزكاة تحديداً؛ الصدقة يمكن إعطاؤها لأي شخص)", tr: "Gayrimuslimlere (zekat icin; sadaka herkese verilebilir)", ms: "Bukan Islam (untuk zakat; sedekah boleh diberikan kepada sesiapa)", id: "Non-Muslim (untuk zakat; sedekah bisa diberikan kepada siapa saja)",
    },
    icon: XCircle,
  },
  {
    text: {
      en: "Direct family: parents, grandparents, children, grandchildren", bn: "সরাসরি পরিবার: মা-বাবা, দাদা-দাদি, সন্তান, নাতি-নাতনি", ur: "براہ راست خاندان: والدین، دادا دادی، اولاد، پوتے پوتیاں",
      ar: "الأسرة المباشرة: الوالدان، الأجداد، الأبناء، الأحفاد", tr: "Yakin aile: ebeveynler, buyukanne-babalar, cocuklar, torunlar", ms: "Keluarga langsung: ibu bapa, datuk nenek, anak-anak, cucu-cicit", id: "Keluarga langsung: orang tua, kakek nenek, anak-anak, cucu",
    },
    icon: XCircle,
  },
  {
    text: {
      en: "Spouse (husband or wife)", bn: "স্বামী বা স্ত্রী", ur: "شریک حیات (شوہر یا بیوی)",
      ar: "الزوج أو الزوجة", tr: "Es (koca veya kari)", ms: "Pasangan (suami atau isteri)", id: "Pasangan (suami atau istri)",
    },
    icon: XCircle,
  },
  {
    text: {
      en: "Descendants of Prophet Muhammad ﷺ (Banu Hashim)", bn: "রাসূলুল্লাহ ﷺ এর বংশধর (বনু হাশিম)", ur: "نبی کریم ﷺ کی اولاد (بنو ہاشم)",
      ar: "ذرية النبي محمد ﷺ (بنو هاشم)", tr: "Hz. Muhammed ﷺ'in soyundan gelenler (Benu Hasim)", ms: "Keturunan Nabi Muhammad ﷺ (Banu Hasyim)", id: "Keturunan Nabi Muhammad ﷺ (Banu Hasyim)",
    },
    icon: XCircle,
  },
];

/* ─── Translated self-check items ─── */
const SELF_CHECK_ITEMS: Record<TransLang, string[]> = {
  en: [
    "I am a Muslim",
    "I am sane and have reached puberty",
    "I own wealth equal to or above the nisab threshold",
    "I have held this wealth for one lunar year (hawl)",
    "I have full ownership of this wealth (not shared/disputed)",
    "My wealth is beyond my basic needs and debts",
  ],
  bn: [
    "আমি একজন মুসলিম",
    "আমি সুস্থ মস্তিষ্ক ও বালেগ",
    "আমার নিসাব পরিমাণ বা তার বেশি সম্পদ আছে",
    "আমি এক চন্দ্র বছর ধরে এই সম্পদ রেখেছি (হাওল)",
    "এই সম্পদে আমার পূর্ণ মালিকানা আছে (ভাগ করা/বিতর্কিত নয়)",
    "আমার সম্পদ মৌলিক চাহিদা ও ঋণের বাইরে",
  ],
  ur: [
    "میں مسلمان ہوں",
    "میں عاقل اور بالغ ہوں",
    "میرے پاس نصاب کے برابر یا اس سے زیادہ مال ہے",
    "یہ مال ایک قمری سال سے میرے پاس ہے (حول)",
    "اس مال کی مکمل ملکیت میری ہے (مشترکہ/متنازعہ نہیں)",
    "میرا مال بنیادی ضروریات اور قرضوں سے زیادہ ہے",
  ],
  ar: [
    "أنا مسلم",
    "أنا عاقل وبالغ",
    "أملك مالاً يساوي النصاب أو أكثر",
    "مر على هذا المال حول كامل",
    "لدي ملكية تامة لهذا المال (ليس مشتركاً أو متنازعاً عليه)",
    "مالي يفوق احتياجاتي الأساسية وديوني",
  ],
  tr: [
    "Ben Muslumanim",
    "Akil sagligim yerinde ve ergenlige ulasmisim",
    "Nisab miktarinda veya uzerinde servete sahibim",
    "Bu serveti bir kameri yil boyunca tuttum (havl)",
    "Bu servetin tam mulkiyetine sahibim (ortak/tartismali degil)",
    "Servetim temel ihtiyaclarim ve borclarimin otesinde",
  ],
  ms: [
    "Saya seorang Muslim",
    "Saya waras dan sudah baligh",
    "Saya memiliki harta sama dengan atau melebihi nisab",
    "Saya telah memegang harta ini selama satu tahun Hijri (haul)",
    "Saya mempunyai pemilikan penuh terhadap harta ini (bukan kongsi/dipertikaikan)",
    "Harta saya melebihi keperluan asas dan hutang",
  ],
  id: [
    "Saya seorang Muslim",
    "Saya berakal sehat dan sudah baligh",
    "Saya memiliki harta senilai atau melebihi nisab",
    "Saya telah memegang harta ini selama satu tahun Hijriah (haul)",
    "Saya memiliki kepemilikan penuh atas harta ini (bukan bersama/disengketakan)",
    "Harta saya melebihi kebutuhan dasar dan hutang",
  ],
};

/* ─── Component ─── */
interface ZakatEligibilitySectionProps {
  countryCode?: string;
}

export function ZakatEligibilitySection({ countryCode = "US" }: ZakatEligibilitySectionProps) {
  const [activeTab, setActiveTab] = useState<"recipients" | "givers">("recipients");
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const lang = getLangFromCountry(countryCode);
  const isRtl = lang === "ar" || lang === "ur";

  return (
    <section className="mx-auto max-w-4xl px-3 sm:px-4 py-8 sm:py-10" dir={isRtl ? "rtl" : "ltr"}>
      {/* Section Header */}
      <div className="text-center mb-6 sm:mb-8 px-2">
        <p className="font-arabic text-xl sm:text-2xl text-amber-600/80 mb-1">
          أحكام الزكاة
        </p>
        <h2 className="text-xl sm:text-2xl font-bold text-emerald-900">
          {T.sectionTitle[lang]}
        </h2>
        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
          {T.sectionSubtitle[lang]}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-2 mb-6 px-1">
        <button
          onClick={() => setActiveTab("recipients")}
          className={cn(
            "flex items-center gap-1.5 sm:gap-2 rounded-full px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-medium transition-all",
            activeTab === "recipients"
              ? "bg-emerald-700 text-white shadow-md shadow-emerald-200"
              : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
          )}
        >
          <HandHeart className="h-4 w-4" />
          <span>{T.tabRecipients[lang]}</span>
          <span className="font-arabic text-[10px] sm:text-xs opacity-70 hidden sm:inline">مستحقون</span>
        </button>
        <button
          onClick={() => setActiveTab("givers")}
          className={cn(
            "flex items-center gap-1.5 sm:gap-2 rounded-full px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-medium transition-all",
            activeTab === "givers"
              ? "bg-emerald-700 text-white shadow-md shadow-emerald-200"
              : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
          )}
        >
          <Scale className="h-4 w-4" />
          <span>{T.tabGivers[lang]}</span>
          <span className="font-arabic text-[10px] sm:text-xs opacity-70 hidden sm:inline">واجب</span>
        </button>
      </div>

      {activeTab === "recipients" ? (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          key="recipients"
        >
          {/* Quran verse reference */}
          <motion.div variants={staggerItem} className="mb-5">
            <div className="rounded-xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 p-4 sm:p-5 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="elig-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M20 0L40 20L20 40L0 20Z" fill="none" stroke="white" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#elig-pattern)" />
                </svg>
              </div>
              <div className="relative">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <BookOpen className="h-4 w-4 text-amber-300" />
                  <span className="text-xs text-emerald-200 font-medium">Surah At-Tawbah 9:60</span>
                </div>
                <p className="font-arabic text-base sm:text-lg leading-[2] text-amber-300/90 mb-2" dir="rtl">
                  إِنَّمَا الصَّدَقَاتُ لِلْفُقَرَاءِ وَالْمَسَاكِينِ وَالْعَامِلِينَ عَلَيْهَا وَالْمُؤَلَّفَةِ قُلُوبُهُمْ وَفِي الرِّقَابِ وَالْغَارِمِينَ وَفِي سَبِيلِ اللَّهِ وَابْنِ السَّبِيلِ
                </p>
                <p className="text-xs text-emerald-100/80 italic max-w-2xl mx-auto" dir={isRtl ? "rtl" : "ltr"}>
                  &ldquo;{T.quranVerse[lang]}&rdquo;
                </p>
              </div>
            </div>
          </motion.div>

          {/* 8 Recipients Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ZAKAT_RECIPIENTS.map((recipient, i) => (
              <motion.div key={i} variants={staggerItem}>
                <Card
                  className={cn(
                    "border-l-4 overflow-hidden cursor-pointer transition-shadow hover:shadow-md",
                    isRtl && "border-l-0 border-r-4",
                    expandedCard === i ? "shadow-md" : ""
                  )}
                  style={isRtl ? { borderRightColor: recipient.color } : { borderLeftColor: recipient.color }}
                >
                  <CardContent className="p-0">
                    <button
                      onClick={() => setExpandedCard(expandedCard === i ? null : i)}
                      className="w-full text-left p-3 sm:p-4"
                      dir={isRtl ? "rtl" : "ltr"}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{recipient.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-arabic text-sm text-muted-foreground">{recipient.arabic}</span>
                            <span
                              className="inline-block h-2 w-2 rounded-full"
                              style={{ backgroundColor: recipient.color }}
                            />
                          </div>
                          <h3 className="text-sm font-semibold text-emerald-900 leading-tight mt-0.5">
                            {recipient.name[lang]}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {recipient.description[lang]}
                          </p>
                        </div>
                        <div className="shrink-0 mt-1">
                          {expandedCard === i ? (
                            <ChevronUp className="h-4 w-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </button>

                    {expandedCard === i && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="border-t border-gray-100 px-3 sm:px-4 pb-3 sm:pb-4 pt-3"
                        dir={isRtl ? "rtl" : "ltr"}
                      >
                        <div className="mb-3">
                          <h4 className="text-xs font-semibold text-emerald-700 mb-1.5 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" /> {T.canReceiveIf[lang]}
                          </h4>
                          <ul className="space-y-1">
                            {recipient.canReceive[lang].map((item, j) => (
                              <li key={j} className="flex items-start gap-2 text-xs text-gray-600">
                                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-red-600 mb-1.5 flex items-center gap-1">
                            <XCircle className="h-3 w-3" /> {T.cannotReceiveIf[lang]}
                          </h4>
                          <ul className="space-y-1">
                            {recipient.cannotReceive[lang].map((item, j) => (
                              <li key={j} className="flex items-start gap-2 text-xs text-gray-600">
                                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-red-400" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* General exclusions */}
          <motion.div variants={staggerItem} className="mt-5">
            <Card className="border-red-200 bg-red-50/50">
              <CardContent className="p-4 sm:p-5">
                <h3 className="text-sm font-bold text-red-800 mb-3 flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  {T.cannotReceiveTitle[lang]}
                </h3>
                <ul className="space-y-2">
                  {CANNOT_RECEIVE.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-red-700/80">
                      <item.icon className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
                      {item.text[lang]}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          key="givers"
        >
          {/* Hadith reference */}
          <motion.div variants={staggerItem} className="mb-5">
            <div className="rounded-xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 p-4 sm:p-5 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="giver-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M20 0L40 20L20 40L0 20Z" fill="none" stroke="white" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#giver-pattern)" />
                </svg>
              </div>
              <div className="relative">
                <p className="font-arabic text-base sm:text-lg leading-[2] text-amber-300/90 mb-2" dir="rtl">
                  بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ ... وَإِيتَاءِ الزَّكَاةِ
                </p>
                <p className="text-xs text-emerald-100/80 italic" dir={isRtl ? "rtl" : "ltr"}>
                  &ldquo;{T.hadithPillar[lang]}&rdquo; — Sahih al-Bukhari 8
                </p>
              </div>
            </div>
          </motion.div>

          {/* Conditions grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ZAKAT_GIVERS_CONDITIONS.map((condition, i) => (
              <motion.div key={i} variants={staggerItem}>
                <Card className="border-emerald-100 hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{condition.icon}</span>
                      <div>
                        <h3 className="text-sm font-bold text-emerald-900">{condition.title[lang]}</h3>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {condition.description[lang]}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick checklist */}
          <motion.div variants={staggerItem} className="mt-5">
            <Card className="border-emerald-200 bg-emerald-50/50">
              <CardContent className="p-4 sm:p-5">
                <h3 className="text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  {T.selfCheckTitle[lang]}
                </h3>
                <div className="space-y-2">
                  {SELF_CHECK_ITEMS[lang].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm text-emerald-700">
                      <div className="h-5 w-5 shrink-0 rounded border-2 border-emerald-300 bg-white flex items-center justify-center">
                        <span className="text-[10px] text-emerald-500 font-bold">{i + 1}</span>
                      </div>
                      {item}
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-emerald-600/80 italic">
                  {T.selfCheckFooter[lang]}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
