// Supported translation languages mapped from country codes
export type TransLang = "en" | "bn" | "ur" | "tr" | "ms" | "id" | "ar";

// Map country code -> translation language
const COUNTRY_TO_LANG: Record<string, TransLang> = {
  BD: "bn",
  PK: "ur",
  IN: "en", // India is diverse, default English
  SA: "ar",
  AE: "ar",
  KW: "ar",
  QA: "ar",
  BH: "ar",
  OM: "ar",
  JO: "ar",
  EG: "ar",
  TR: "tr",
  MY: "ms",
  ID: "id",
  NG: "en",
  US: "en",
  GB: "en",
  CA: "en",
  AU: "en",
  EU: "en",
};

export function getLangFromCountry(countryCode: string): TransLang {
  return COUNTRY_TO_LANG[countryCode] || "en";
}

export function getLangLabel(lang: TransLang): string {
  const labels: Record<TransLang, string> = {
    en: "English",
    bn: "বাংলা",
    ur: "اردو",
    tr: "Turkce",
    ms: "Bahasa Melayu",
    id: "Bahasa Indonesia",
    ar: "العربية",
  };
  return labels[lang];
}

// ─── Multi-language quote structure ───
export interface IslamicQuote {
  arabic: string;
  translations: Partial<Record<TransLang, string>>;
  source: string;
  type: "hadith" | "quran" | "dua";
}

export function getTranslation(quote: IslamicQuote, lang: TransLang): string {
  return quote.translations[lang] || quote.translations.en || "";
}

// ─── Quran & Hadith on Zakat ───
export const ZAKAT_HADITH: IslamicQuote[] = [
  {
    arabic: "مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ",
    translations: {
      en: "Charity does not decrease wealth.",
      bn: "দান-সদকা সম্পদ কমায় না।",
      ur: "صدقہ مال کو کم نہیں کرتا۔",
      tr: "Sadaka maldan eksiltmez.",
      ms: "Sedekah tidak mengurangkan harta.",
      id: "Sedekah tidak mengurangi harta.",
      ar: "الصدقة لا تنقص المال بل تزيده بركة.",
    },
    source: "Sahih Muslim 2588",
    type: "hadith",
  },
  {
    arabic: "خُذْ مِنْ أَمْوَالِهِمْ صَدَقَةً تُطَهِّرُهُمْ وَتُزَكِّيهِم بِهَا",
    translations: {
      en: "Take from their wealth a charity to purify them and cleanse them by it.",
      bn: "তাদের সম্পদ থেকে সদকা গ্রহণ করো, যা দিয়ে তুমি তাদের পবিত্র ও পরিশুদ্ধ করবে।",
      ur: "ان کے مالوں میں سے صدقہ لے لو جس سے تم انہیں پاک اور صاف کرو۔",
      tr: "Onların mallarından sadaka al; bununla onları temizlersin ve arıtırsın.",
      ms: "Ambillah sedekah dari harta mereka untuk membersihkan dan menyucikan mereka dengannya.",
      id: "Ambillah sedekah dari harta mereka untuk membersihkan dan menyucikan mereka dengannya.",
      ar: "خذ من أموالهم صدقة تطهرهم وتزكيهم بها وصل عليهم.",
    },
    source: "Quran 9:103",
    type: "quran",
  },
  {
    arabic: "وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ",
    translations: {
      en: "And establish prayer and give Zakat, and bow with those who bow [in worship].",
      bn: "আর তোমরা নামায কায়েম করো, যাকাত দাও এবং রুকুকারীদের সাথে রুকু করো।",
      ur: "اور نماز قائم کرو اور زکوٰۃ دو اور رکوع کرنے والوں کے ساتھ رکوع کرو۔",
      tr: "Namazı kılın, zekatı verin ve ruku edenlerle birlikte ruku edin.",
      ms: "Dan dirikanlah solat, tunaikanlah zakat, dan rukuklah beserta orang-orang yang rukuk.",
      id: "Dan dirikanlah shalat, tunaikanlah zakat, dan rukuklah beserta orang-orang yang rukuk.",
      ar: "وأقيموا الصلاة وآتوا الزكاة واركعوا مع الراكعين.",
    },
    source: "Quran 2:43",
    type: "quran",
  },
  {
    arabic: "مَنْ آتَاهُ اللَّهُ مَالًا فَلَمْ يُؤَدِّ زَكَاتَهُ مُثِّلَ لَهُ يَوْمَ الْقِيَامَةِ شُجَاعًا أَقْرَعَ",
    translations: {
      en: "Whoever is made wealthy by Allah and does not pay the Zakat of his wealth, then on the Day of Resurrection his wealth will be made like a bald-headed poisonous male snake.",
      bn: "আল্লাহ যাকে সম্পদ দান করেছেন অথচ সে তার যাকাত আদায় করেনি, কিয়ামতের দিন তার সম্পদকে একটি বিষধর টাকমাথা সাপের রূপ দেওয়া হবে।",
      ur: "جسے اللہ نے مال دیا اور اس نے اس کی زکوٰۃ ادا نہ کی، قیامت کے دن اس کا مال ایک زہریلے گنجے سانپ کی شکل میں آئے گا۔",
      tr: "Allah kime mal verip de o zekatını ödemezse, kıyamet gününde malı kel, zehirli bir yılana dönüştürülür.",
      ms: "Sesiapa yang dikurniakan Allah harta lalu tidak menunaikan zakatnya, pada Hari Kiamat hartanya akan dijelmakan menjadi seekor ular yang botak lagi berbisa.",
      id: "Barangsiapa yang diberi harta oleh Allah lalu tidak menunaikan zakatnya, maka pada Hari Kiamat hartanya akan dijelmakan menjadi seekor ular yang botak lagi berbisa.",
      ar: "من آتاه الله مالا فلم يؤد زكاته مثل له يوم القيامة شجاعا أقرع له زبيبتان.",
    },
    source: "Sahih al-Bukhari 1403",
    type: "hadith",
  },
  {
    arabic: "وَالَّذِينَ فِي أَمْوَالِهِمْ حَقٌّ مَّعْلُومٌ لِّلسَّائِلِ وَالْمَحْرُومِ",
    translations: {
      en: "And those in whose wealth there is a recognized right for the beggar and the deprived.",
      bn: "আর তাদের সম্পদে প্রার্থী ও বঞ্চিতদের জন্য একটি নির্ধারিত হক রয়েছে।",
      ur: "اور جن کے مال میں مانگنے والے اور محروم کا معلوم حق ہے۔",
      tr: "Onların mallarında, isteyen ve isteyemeyen yoksullar için belirli bir hak vardır.",
      ms: "Dan orang-orang yang dalam hartanya ada hak yang termaklum bagi orang yang meminta dan orang yang tidak meminta.",
      id: "Dan orang-orang yang dalam hartanya terdapat hak yang pasti bagi orang yang meminta-minta dan orang yang tidak mendapat bagian.",
      ar: "والذين في أموالهم حق معلوم للسائل والمحروم.",
    },
    source: "Quran 70:24-25",
    type: "quran",
  },
];

// ─── Duas ───
export const ZAKAT_DUAS: IslamicQuote[] = [
  {
    arabic: "اللَّهُمَّ اجْعَلْهَا مَغْنَمًا وَلَا تَجْعَلْهَا مَغْرَمًا",
    translations: {
      en: "O Allah, make it a gain and do not make it a loss.",
      bn: "হে আল্লাহ, এটাকে লাভজনক করুন এবং ক্ষতিকর করবেন না।",
      ur: "اے اللہ اسے فائدے کا ذریعہ بنا اور نقصان کا نہ بنا۔",
      tr: "Allah'ım, bunu kazanç kıl, zarar kılma.",
      ms: "Ya Allah, jadikanlah ia keuntungan dan janganlah jadikan ia kerugian.",
      id: "Ya Allah, jadikanlah ini keuntungan dan jangan jadikan kerugian.",
      ar: "اللهم اجعلها مغنما ولا تجعلها مغرما.",
    },
    source: "Dua when giving Zakat",
    type: "dua",
  },
  {
    arabic: "رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ",
    translations: {
      en: "Our Lord, accept [this] from us. Indeed, You are the All-Hearing, the All-Knowing.",
      bn: "হে আমাদের প্রতিপালক, আমাদের পক্ষ থেকে কবুল করুন। নিশ্চয়ই আপনি সর্বশ্রোতা, সর্বজ্ঞ।",
      ur: "اے ہمارے رب ہم سے قبول فرما۔ بے شک تو سننے والا جاننے والا ہے۔",
      tr: "Rabbimiz, bizden kabul buyur. Şüphesiz Sen her şeyi işiten, her şeyi bilensin.",
      ms: "Wahai Tuhan kami, terimalah daripada kami. Sesungguhnya Engkaulah Yang Maha Mendengar lagi Maha Mengetahui.",
      id: "Ya Tuhan kami, terimalah dari kami. Sungguh, Engkaulah Yang Maha Mendengar, Maha Mengetahui.",
      ar: "ربنا تقبل منا إنك أنت السميع العليم.",
    },
    source: "Quran 2:127",
    type: "dua",
  },
  {
    arabic: "اللَّهُمَّ بَارِكْ لَنَا فِي أَمْوَالِنَا وَطَهِّرْهَا",
    translations: {
      en: "O Allah, bless us in our wealth and purify it.",
      bn: "হে আল্লাহ, আমাদের সম্পদে বরকত দিন এবং তা পবিত্র করুন।",
      ur: "اے اللہ ہمارے مال میں برکت دے اور اسے پاک کر۔",
      tr: "Allah'ım mallarımızı bereketlendir ve temizle.",
      ms: "Ya Allah, berkatilah harta kami dan sucikanlah ia.",
      id: "Ya Allah, berkahilah harta kami dan sucikanlah.",
      ar: "اللهم بارك لنا في أموالنا وطهرها.",
    },
    source: "Dua for wealth purification",
    type: "dua",
  },
];

// ─── Bismillah ───
export const BISMILLAH = {
  arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
  translations: {
    en: "In the name of Allah, the Most Gracious, the Most Merciful",
    bn: "পরম করুণাময় অসীম দয়ালু আল্লাহর নামে",
    ur: "شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے",
    tr: "Rahman ve Rahim olan Allah'in adiyla",
    ms: "Dengan nama Allah Yang Maha Pemurah lagi Maha Penyayang",
    id: "Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang",
    ar: "بسم الله الرحمن الرحيم",
  } as Record<TransLang, string>,
};

// ─── Footer Dua ───
export const FOOTER_DUA = {
  arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
  translations: {
    en: "Our Lord, give us good in this world and good in the Hereafter, and protect us from the torment of the Fire.",
    bn: "হে আমাদের প্রতিপালক, আমাদের দুনিয়াতে কল্যাণ দিন, আখিরাতেও কল্যাণ দিন এবং আমাদের জাহান্নামের আযাব থেকে রক্ষা করুন।",
    ur: "اے ہمارے رب ہمیں دنیا میں بھی بھلائی دے اور آخرت میں بھی بھلائی دے اور ہمیں آگ کے عذاب سے بچا۔",
    tr: "Rabbimiz, bize dunyada da iyilik ver, ahirette de iyilik ver ve bizi ates azabindan koru.",
    ms: "Wahai Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan peliharalah kami dari azab neraka.",
    id: "Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab neraka.",
    ar: "ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار.",
  } as Record<TransLang, string>,
  source: "Quran 2:201",
};

// ─── UI Texts (localized) ───
export const UI_TEXTS: Record<TransLang, {
  zakatObligatory: string;
  belowNisab: string;
  yourZakatAmount: string;
  mayAllahAccept: string;
  notObligatory: string;
  sadaqahNote: string;
  knowledgeTitle: string;
  knowledgeSubtitle: string;
  thirdPillar: string;
  disclaimer: string;
  disclaimerText: string;
  jazakallah: string;
  signInToSave: string;
  viewCertificate: string;
  editRecalculate: string;
  ushrLabel: string;
  fitrLabel: string;
  totalDueLabel: string;
}> = {
  en: {
    zakatObligatory: "Zakat is Obligatory",
    belowNisab: "Below Nisab Threshold",
    yourZakatAmount: "Your Zakat Amount (2.5%)",
    mayAllahAccept: "May Allah accept from us and from you",
    notObligatory: "Zakat is not obligatory on you at this time",
    sadaqahNote: "Your net wealth is below the Nisab threshold. Alhamdulillah, you are not required to pay Zakat. You may still give voluntary charity (Sadaqah).",
    knowledgeTitle: "Knowledge & Wisdom on Zakat",
    knowledgeSubtitle: "Reflect upon these verses and sayings about the obligation and virtue of Zakat",
    thirdPillar: "The Third Pillar of Islam",
    disclaimer: "Important Notice",
    disclaimerText: "IhsanWealth provides Islamic tools — Zakat calculator, prayer times, Quran, Duas, and more — based on standard Fiqh rulings. These are for guidance only. For specific rulings, please consult a qualified Islamic scholar (Mufti).",
    jazakallah: "May Allah reward you with goodness",
    signInToSave: "Sign in to Save",
    viewCertificate: "View Certificate",
    editRecalculate: "Edit & Recalculate",
    ushrLabel: "Ushr:",
    fitrLabel: "Fitr:",
    totalDueLabel: "Total Due:",
  },
  bn: {
    zakatObligatory: "যাকাত আপনার উপর ফরয",
    belowNisab: "নিসাব পরিমাণের নিচে",
    yourZakatAmount: "আপনার যাকাতের পরিমাণ (২.৫%)",
    mayAllahAccept: "আল্লাহ আমাদের ও আপনাদের থেকে কবুল করুন",
    notObligatory: "এই মুহূর্তে আপনার উপর যাকাত ফরয নয়",
    sadaqahNote: "আপনার মোট সম্পদ নিসাব পরিমাণের নিচে। আলহামদুলিল্লাহ, আপনার উপর যাকাত ফরয নয়। তবে আপনি নফল সদকা দিতে পারেন।",
    knowledgeTitle: "যাকাত সম্পর্কে জ্ঞান ও প্রজ্ঞা",
    knowledgeSubtitle: "যাকাতের ফরযিয়াত ও ফযীলত সম্পর্কে এই আয়াত ও হাদীসগুলো চিন্তা করুন",
    thirdPillar: "ইসলামের তৃতীয় স্তম্ভ",
    disclaimer: "গুরুত্বপূর্ণ বিজ্ঞপ্তি",
    disclaimerText: "ইহসান ওয়েলথ ইসলামী টুলস প্রদান করে — যাকাত ক্যালকুলেটর, নামাযের সময়, কুরআন, দু'আ এবং আরও অনেক কিছু — যা মানক ফিকহী বিধান অনুযায়ী তৈরি। এগুলো শুধুমাত্র নির্দেশনার জন্য। নির্দিষ্ট বিষয়ে একজন যোগ্য ইসলামী আলেম (মুফতী) এর পরামর্শ নিন।",
    jazakallah: "আল্লাহ আপনাকে উত্তম প্রতিদান দিন",
    signInToSave: "সংরক্ষণ করতে সাইন ইন করুন",
    viewCertificate: "সনদপত্র দেখুন",
    editRecalculate: "সম্পাদনা ও পুনঃহিসাব",
    ushrLabel: "উশর:",
    fitrLabel: "ফিতর:",
    totalDueLabel: "মোট প্রদেয়:",
  },
  ur: {
    zakatObligatory: "زکوٰۃ آپ پر فرض ہے",
    belowNisab: "نصاب سے کم",
    yourZakatAmount: "آپ کی زکوٰۃ کی رقم (٢.٥٪)",
    mayAllahAccept: "اللہ ہم سے اور آپ سے قبول فرمائے",
    notObligatory: "اس وقت آپ پر زکوٰۃ فرض نہیں",
    sadaqahNote: "آپ کی کل دولت نصاب سے کم ہے۔ الحمدللہ آپ پر زکوٰۃ فرض نہیں۔ آپ نفلی صدقہ دے سکتے ہیں۔",
    knowledgeTitle: "زکوٰۃ کے بارے میں علم و حکمت",
    knowledgeSubtitle: "زکوٰۃ کی فرضیت اور فضیلت کے بارے میں ان آیات اور احادیث پر غور کریں",
    thirdPillar: "اسلام کا تیسرا رکن",
    disclaimer: "اہم اطلاع",
    disclaimerText: "احسان ویلتھ اسلامی ٹولز فراہم کرتا ہے — زکوٰۃ کیلکولیٹر، نماز کے اوقات، قرآن، دعائیں اور مزید — معیاری فقہی احکام کے مطابق۔ یہ صرف رہنمائی کے لیے ہیں۔ مخصوص مسائل میں کسی مستند عالم (مفتی) سے رجوع کریں۔",
    jazakallah: "اللہ آپ کو بہترین اجر عطا فرمائے",
    signInToSave: "محفوظ کرنے کے لیے سائن ان کریں",
    viewCertificate: "سرٹیفکیٹ دیکھیں",
    editRecalculate: "ترمیم اور دوبارہ حساب",
    ushrLabel: "عشر:",
    fitrLabel: "فطر:",
    totalDueLabel: "کل واجب الادا:",
  },
  tr: {
    zakatObligatory: "Zekat sizin uzerinize farzdır",
    belowNisab: "Nisab miktarinin altinda",
    yourZakatAmount: "Zekat Miktariniz (%2,5)",
    mayAllahAccept: "Allah bizden ve sizden kabul buyursun",
    notObligatory: "Su anda uzerinize zekat farz degildir",
    sadaqahNote: "Toplam servetiniz nisab miktarinin altindadir. Elhamdulillah, zekat vermeniz gerekmemektedir. Yine de gonullu sadaka verebilirsiniz.",
    knowledgeTitle: "Zekat Hakkinda Bilgi ve Hikmet",
    knowledgeSubtitle: "Zekatin farziyeti ve fazileti hakkindaki bu ayetleri ve hadisleri dusunun",
    thirdPillar: "Islamin Ucuncu Sarti",
    disclaimer: "Onemli Bilgi",
    disclaimerText: "IhsanWealth Islami araclar sunar — Zekat hesaplayici, namaz vakitleri, Kuran, dualar ve daha fazlasi — standart fikih hukumlerine gore. Bunlar yalnizca rehberlik amaclidir. Ozel hukumler icin ehil bir Islami alime danisiniz.",
    jazakallah: "Allah sizi hayirla mukafatlandirsin",
    signInToSave: "Kaydetmek icin giris yapin",
    viewCertificate: "Sertifikayi Goruntule",
    editRecalculate: "Duzenle ve Yeniden Hesapla",
    ushrLabel: "Usr:",
    fitrLabel: "Fitr:",
    totalDueLabel: "Toplam Borc:",
  },
  ms: {
    zakatObligatory: "Zakat wajib ke atas anda",
    belowNisab: "Di bawah nisab",
    yourZakatAmount: "Jumlah Zakat Anda (2.5%)",
    mayAllahAccept: "Semoga Allah menerima daripada kami dan anda",
    notObligatory: "Zakat tidak wajib ke atas anda pada masa ini",
    sadaqahNote: "Jumlah harta anda di bawah nisab. Alhamdulillah, zakat tidak wajib ke atas anda. Anda masih boleh memberi sedekah sunat.",
    knowledgeTitle: "Ilmu & Hikmah Tentang Zakat",
    knowledgeSubtitle: "Renungkanlah ayat-ayat dan hadis-hadis tentang kewajipan dan keutamaan zakat",
    thirdPillar: "Rukun Islam Ketiga",
    disclaimer: "Notis Penting",
    disclaimerText: "IhsanWealth menyediakan alat Islam — kalkulator Zakat, waktu solat, Al-Quran, doa dan lagi — berdasarkan hukum Fiqh standard. Ini hanya untuk panduan. Untuk hukum tertentu, sila rujuk ulama yang berkelayakan.",
    jazakallah: "Semoga Allah memberi ganjaran kebaikan kepada anda",
    signInToSave: "Log masuk untuk Simpan",
    viewCertificate: "Lihat Sijil",
    editRecalculate: "Edit & Kira Semula",
    ushrLabel: "Usyr:",
    fitrLabel: "Fitrah:",
    totalDueLabel: "Jumlah Perlu Dibayar:",
  },
  id: {
    zakatObligatory: "Zakat wajib atas Anda",
    belowNisab: "Di bawah nisab",
    yourZakatAmount: "Jumlah Zakat Anda (2,5%)",
    mayAllahAccept: "Semoga Allah menerima dari kami dan Anda",
    notObligatory: "Zakat tidak wajib atas Anda saat ini",
    sadaqahNote: "Total kekayaan Anda di bawah nisab. Alhamdulillah, Anda tidak wajib membayar zakat. Anda masih bisa bersedekah sunat.",
    knowledgeTitle: "Ilmu & Hikmah Tentang Zakat",
    knowledgeSubtitle: "Renungkanlah ayat-ayat dan hadis-hadis tentang kewajiban dan keutamaan zakat",
    thirdPillar: "Rukun Islam Ketiga",
    disclaimer: "Pemberitahuan Penting",
    disclaimerText: "IhsanWealth menyediakan alat Islam — kalkulator Zakat, waktu shalat, Al-Quran, doa dan lainnya — berdasarkan hukum Fiqh standar. Ini hanya untuk panduan. Untuk hukum tertentu, silakan berkonsultasi dengan ulama yang berkompeten.",
    jazakallah: "Semoga Allah membalas Anda dengan kebaikan",
    signInToSave: "Masuk untuk Menyimpan",
    viewCertificate: "Lihat Sertifikat",
    editRecalculate: "Edit & Hitung Ulang",
    ushrLabel: "Usyr:",
    fitrLabel: "Fitrah:",
    totalDueLabel: "Total yang Harus Dibayar:",
  },
  ar: {
    zakatObligatory: "الزكاة واجبة عليك",
    belowNisab: "دون نصاب الزكاة",
    yourZakatAmount: "مقدار زكاتك (٢.٥٪)",
    mayAllahAccept: "تقبل الله منا ومنكم",
    notObligatory: "الزكاة ليست واجبة عليك في الوقت الحالي",
    sadaqahNote: "إجمالي ثروتك أقل من النصاب. الحمد لله، لا تجب عليك الزكاة. يمكنك التصدق بالصدقة التطوعية.",
    knowledgeTitle: "علم وحكمة عن الزكاة",
    knowledgeSubtitle: "تأمل في هذه الآيات والأحاديث عن فرضية وفضل الزكاة",
    thirdPillar: "الركن الثالث من أركان الإسلام",
    disclaimer: "تنبيه مهم",
    disclaimerText: "إحسان الثروة يوفر أدوات إسلامية — حاسبة الزكاة، أوقات الصلاة، القرآن، الأدعية والمزيد — وفقاً لأحكام الفقه المعتمدة. هذه للإرشاد فقط. للأحكام الخاصة يرجى استشارة عالم مؤهل (مفتي).",
    jazakallah: "جزاكم الله خيراً",
    signInToSave: "سجّل الدخول للحفظ",
    viewCertificate: "عرض الشهادة",
    editRecalculate: "تعديل وإعادة الحساب",
    ushrLabel: "العشر:",
    fitrLabel: "الفطر:",
    totalDueLabel: "إجمالي المستحق:",
  },
};

// ─── Footer Link Texts ───
export const FOOTER_LINKS_TEXTS: Record<TransLang, {
  sitemap: string;
  privacyPolicy: string;
  usageRights: string;
}> = {
  en: { sitemap: "Sitemap", privacyPolicy: "Privacy Policy", usageRights: "Usage Rights" },
  bn: { sitemap: "সাইটম্যাপ", privacyPolicy: "প্রাইভেসী পলিসি", usageRights: "ব্যবহারের অধিকার" },
  ur: { sitemap: "سائٹ میپ", privacyPolicy: "رازداری کی پالیسی", usageRights: "استعمال کے حقوق" },
  ar: { sitemap: "خريطة الموقع", privacyPolicy: "سياسة الخصوصية", usageRights: "حقوق الاستخدام" },
  tr: { sitemap: "Site Haritası", privacyPolicy: "Gizlilik Politikası", usageRights: "Kullanım Hakları" },
  ms: { sitemap: "Peta Laman", privacyPolicy: "Dasar Privasi", usageRights: "Hak Penggunaan" },
  id: { sitemap: "Peta Situs", privacyPolicy: "Kebijakan Privasi", usageRights: "Hak Penggunaan" },
};

// ─── Footer Extra Texts ───
export const FOOTER_EXTRA_TEXTS: Record<TransLang, {
  features: string;
  legal: string;
  builtWithCareBy: string;
  visitors: string;
  brandDesc: string;
}> = {
  en: { features: "Features", legal: "Legal", builtWithCareBy: "Built with care by", visitors: "visitors", brandDesc: "Your complete Islamic companion — empowering Muslims worldwide with essential tools for worship and finance." },
  bn: { features: "ফিচারসমূহ", legal: "আইনি", builtWithCareBy: "যত্নসহকারে তৈরি করেছেন", visitors: "ভিজিটর", brandDesc: "আপনার সম্পূর্ণ ইসলামিক সহচর — ইবাদত ও অর্থের জন্য প্রয়োজনীয় টুলস দিয়ে বিশ্বব্যাপী মুসলিমদের ক্ষমতায়ন।" },
  ur: { features: "خصوصیات", legal: "قانونی", builtWithCareBy: "محبت سے بنایا", visitors: "وزیٹرز", brandDesc: "آپ کا مکمل اسلامی ساتھی — عبادت اور مالیات کے لیے ضروری ٹولز کے ساتھ دنیا بھر کے مسلمانوں کی مدد۔" },
  ar: { features: "الميزات", legal: "قانوني", builtWithCareBy: "صُنع بعناية بواسطة", visitors: "زائر", brandDesc: "رفيقك الإسلامي الشامل — تمكين المسلمين حول العالم بأدوات أساسية للعبادة والمالية." },
  tr: { features: "Ozellikler", legal: "Yasal", builtWithCareBy: "Ozenle yapan", visitors: "ziyaretci", brandDesc: "Eksiksiz Islam arkadasiniz — ibadet ve finans icin temel araclarla dunya genelinde Muslumanlari guclendiriyor." },
  ms: { features: "Ciri-ciri", legal: "Undang-undang", builtWithCareBy: "Dibina dengan kasih oleh", visitors: "pelawat", brandDesc: "Teman Islam lengkap anda — memperkasa umat Islam di seluruh dunia dengan alat penting untuk ibadat dan kewangan." },
  id: { features: "Fitur", legal: "Hukum", builtWithCareBy: "Dibuat dengan penuh perhatian oleh", visitors: "pengunjung", brandDesc: "Pendamping Islam lengkap Anda — memberdayakan Muslim di seluruh dunia dengan alat penting untuk ibadah dan keuangan." },
};

// ─── Duas Page Texts ───
export const DUAS_PAGE_TEXTS: Record<TransLang, {
  pageTitle: string;
  headerLabel: string;
  subtitle: string;
  showing: string;
  of: string;
  duas: string;
  noResultsTitle: string;
  noFavorites: string;
  noSearchResults: string;
  footerVerse: string;
}> = {
  en: {
    pageTitle: "Duas Collection",
    headerLabel: "Duas Collection",
    subtitle: "A curated collection of essential daily supplications from the Quran and Sunnah. Memorize, practice, and keep these duas close to your heart.",
    showing: "Showing",
    of: "of",
    duas: "duas",
    noResultsTitle: "No Results",
    noFavorites: "No favorite duas yet. Tap the heart icon on any dua to save it.",
    noSearchResults: "No duas found matching your search. Try a different keyword.",
    footerVerse: "And your Lord says, Call upon Me; I will respond to you.",
  },
  bn: {
    pageTitle: "দু'আ সংকলন",
    headerLabel: "দু'আ সংকলন",
    subtitle: "কুরআন ও সুন্নাহ থেকে প্রয়োজনীয় দৈনিক দু'আসমূহের একটি নির্বাচিত সংকলন। মুখস্থ করুন, অনুশীলন করুন এবং এই দু'আগুলো হৃদয়ে ধারণ করুন।",
    showing: "দেখানো হচ্ছে",
    of: "এর মধ্যে",
    duas: "দু'আ",
    noResultsTitle: "কোনো ফলাফল নেই",
    noFavorites: "এখনো কোনো প্রিয় দু'আ নেই। সংরক্ষণ করতে যেকোনো দু'আর হার্ট আইকনে ট্যাপ করুন।",
    noSearchResults: "আপনার অনুসন্ধানের সাথে মিলে এমন কোনো দু'আ পাওয়া যায়নি।",
    footerVerse: "তোমাদের রব বলেন, আমাকে ডাকো, আমি তোমাদের ডাকে সাড়া দেব।",
  },
  ur: {
    pageTitle: "دعاؤں کا مجموعہ",
    headerLabel: "دعاؤں کا مجموعہ",
    subtitle: "قرآن و سنت سے روزمرہ ضروری دعاؤں کا منتخب مجموعہ۔ یاد کریں، عمل کریں اور ان دعاؤں کو دل میں محفوظ رکھیں۔",
    showing: "دکھایا جا رہا ہے",
    of: "میں سے",
    duas: "دعائیں",
    noResultsTitle: "کوئی نتیجہ نہیں",
    noFavorites: "ابھی کوئی پسندیدہ دعا نہیں۔ کسی بھی دعا کے دل آئیکن پر ٹیپ کریں۔",
    noSearchResults: "آپ کی تلاش سے ملتی جلتی کوئی دعا نہیں ملی۔",
    footerVerse: "تمہارا رب فرماتا ہے مجھے پکارو میں تمہاری دعا قبول کروں گا۔",
  },
  tr: {
    pageTitle: "Dua Koleksiyonu",
    headerLabel: "Dua Koleksiyonu",
    subtitle: "Kur'an ve Sunnetten secilmis gunluk onemli dualarin derlemesi. Ezberleyin, uygulayin ve bu dualari kalbinize yakin tutun.",
    showing: "Gosterilen",
    of: "/",
    duas: "dua",
    noResultsTitle: "Sonuc Yok",
    noFavorites: "Henuz favori dua yok. Kaydetmek icin herhangi bir duanin kalp simgesine dokunun.",
    noSearchResults: "Aramanizla eslesen dua bulunamadi. Farkli bir kelime deneyin.",
    footerVerse: "Rabbiniz dedi ki: Bana dua edin, size icabet edeyim.",
  },
  ms: {
    pageTitle: "Koleksi Doa",
    headerLabel: "Koleksi Doa",
    subtitle: "Koleksi doa harian penting dari Al-Quran dan Sunnah. Hafal, amalkan dan simpan doa-doa ini dekat di hati.",
    showing: "Menunjukkan",
    of: "daripada",
    duas: "doa",
    noResultsTitle: "Tiada Hasil",
    noFavorites: "Belum ada doa kegemaran. Ketik ikon hati pada mana-mana doa untuk menyimpannya.",
    noSearchResults: "Tiada doa yang sepadan dengan carian anda. Cuba kata kunci lain.",
    footerVerse: "Dan Tuhan kamu berfirman: Berdoalah kepadaKu, nescaya Aku perkenankan doa kamu.",
  },
  id: {
    pageTitle: "Koleksi Doa",
    headerLabel: "Koleksi Doa",
    subtitle: "Kumpulan doa harian penting dari Al-Quran dan Sunnah. Hafalkan, amalkan dan simpan doa-doa ini dekat di hati.",
    showing: "Menampilkan",
    of: "dari",
    duas: "doa",
    noResultsTitle: "Tidak Ada Hasil",
    noFavorites: "Belum ada doa favorit. Ketuk ikon hati pada doa manapun untuk menyimpannya.",
    noSearchResults: "Tidak ada doa yang cocok dengan pencarian Anda. Coba kata kunci lain.",
    footerVerse: "Dan Tuhanmu berfirman: Berdoalah kepada-Ku, niscaya akan Aku perkenankan bagimu.",
  },
  ar: {
    pageTitle: "مجموعة الأدعية",
    headerLabel: "مجموعة الأدعية",
    subtitle: "مجموعة مختارة من الأدعية اليومية الأساسية من القرآن والسنة. احفظها وتعلمها واحتفظ بها قريبة من قلبك.",
    showing: "عرض",
    of: "من",
    duas: "دعاء",
    noResultsTitle: "لا نتائج",
    noFavorites: "لا توجد أدعية مفضلة بعد. اضغط على أيقونة القلب لحفظ أي دعاء.",
    noSearchResults: "لم يتم العثور على أدعية مطابقة لبحثك. جرب كلمة مختلفة.",
    footerVerse: "وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ",
  },
};

// ─── Calendar Page Texts ───
export const CALENDAR_PAGE_TEXTS: Record<TransLang, {
  subtitle: string;
  calculatedDate: string;
  adjustHint: string;
}> = {
  en: { subtitle: "Islamic (Hijri) Calendar", calculatedDate: "Calculated date", adjustHint: "Adjust if your local moon sighting differs" },
  bn: { subtitle: "ইসলামী (হিজরী) ক্যালেন্ডার", calculatedDate: "গণনাকৃত তারিখ", adjustHint: "আপনার স্থানীয় চাঁদ দেখার সাথে পার্থক্য থাকলে সামঞ্জস্য করুন" },
  ur: { subtitle: "اسلامی (ہجری) کیلنڈر", calculatedDate: "حساب شدہ تاریخ", adjustHint: "اگر آپ کی مقامی رؤیت ہلال مختلف ہو تو ایڈجسٹ کریں" },
  tr: { subtitle: "Islami (Hicri) Takvim", calculatedDate: "Hesaplanan tarih", adjustHint: "Yerel hilal gozetiminiz farkliysa ayarlayin" },
  ms: { subtitle: "Kalendar Islam (Hijrah)", calculatedDate: "Tarikh dikira", adjustHint: "Laraskan jika cerapan anak bulan tempatan anda berbeza" },
  id: { subtitle: "Kalender Islam (Hijriah)", calculatedDate: "Tanggal terhitung", adjustHint: "Sesuaikan jika pengamatan hilal lokal Anda berbeda" },
  ar: { subtitle: "التقويم الإسلامي (الهجري)", calculatedDate: "التاريخ المحسوب", adjustHint: "اضبط إذا كانت رؤية الهلال المحلية مختلفة" },
};

// ─── Prayer Times Page Texts ───
export const PRAYER_PAGE_TEXTS: Record<TransLang, {
  prayerTimes: string;
  dailyPrayerSchedule: string;
  dailyPrayerScheduleAr: string;
  subtitle: string;
  detectingLocation: string;
  nextPrayer: string;
  timeRemaining: string;
  method: string;
  asr: string;
  standard: string;
  hanafi: string;
  currentPrayer: string;
  tahajjudLabel: string;
  backToCalculator: string;
  footerVerse: string;
  footerVerseTranslation: string;
  footerVerseRef: string;
  disclaimer: string;
}> = {
  en: {
    prayerTimes: "Prayer Times",
    dailyPrayerSchedule: "Daily Prayer Schedule",
    dailyPrayerScheduleAr: "مواقيت الصلاة اليومية",
    subtitle: "Prayer times calculated based on your location using standard astronomical methods.",
    detectingLocation: "Detecting your location...",
    nextPrayer: "Next Prayer",
    timeRemaining: "Time Remaining",
    method: "Method:",
    asr: "Asr:",
    standard: "Standard",
    hanafi: "Hanafi",
    currentPrayer: "Current Prayer",
    tahajjudLabel: "Tahajjud (Last third of night)",
    backToCalculator: "Back to Calculator",
    footerVerse: "حافظوا على الصلوات والصلاة الوسطى",
    footerVerseTranslation: "Guard strictly your prayers, especially the middle prayer.",
    footerVerseRef: "Surah Al-Baqarah 2:238",
    disclaimer: "Prayer times are approximate and may vary slightly from local mosque schedules. Please verify with your local Islamic authority.",
  },
  bn: {
    prayerTimes: "নামাযের সময়সূচী",
    dailyPrayerSchedule: "দৈনিক নামাযের সময়সূচী",
    dailyPrayerScheduleAr: "مواقيت الصلاة اليومية",
    subtitle: "মানসম্মত জ্যোতির্বিদ্যা পদ্ধতি ব্যবহার করে আপনার অবস্থানের ভিত্তিতে নামাযের সময় গণনা করা হয়েছে।",
    detectingLocation: "আপনার অবস্থান শনাক্ত করা হচ্ছে...",
    nextPrayer: "পরবর্তী নামায",
    timeRemaining: "বাকি সময়",
    method: "পদ্ধতি:",
    asr: "আসর:",
    standard: "স্ট্যান্ডার্ড",
    hanafi: "হানাফী",
    currentPrayer: "বর্তমান নামায",
    tahajjudLabel: "তাহাজ্জুদ (রাতের শেষ তৃতীয়াংশ)",
    backToCalculator: "ক্যালকুলেটরে ফিরুন",
    footerVerse: "حافظوا على الصلوات والصلاة الوسطى",
    footerVerseTranslation: "তোমরা নামাযসমূহের হেফাযত করো, বিশেষত মধ্যবর্তী নামাযের।",
    footerVerseRef: "সূরা আল-বাকারা ২:২৩৮",
    disclaimer: "নামাযের সময় আনুমানিক এবং স্থানীয় মসজিদের সময়সূচী থেকে সামান্য ভিন্ন হতে পারে। আপনার স্থানীয় ইসলামী কর্তৃপক্ষের সাথে যাচাই করুন।",
  },
  ur: {
    prayerTimes: "نماز کے اوقات",
    dailyPrayerSchedule: "روزانہ نماز کا شیڈول",
    dailyPrayerScheduleAr: "مواقيت الصلاة اليومية",
    subtitle: "معیاری فلکیاتی طریقوں کا استعمال کرتے ہوئے آپ کے مقام کی بنیاد پر نماز کے اوقات کا حساب لگایا گیا ہے۔",
    detectingLocation: "آپ کا مقام معلوم کیا جا رہا ہے...",
    nextPrayer: "اگلی نماز",
    timeRemaining: "باقی وقت",
    method: "طریقہ:",
    asr: "عصر:",
    standard: "معیاری",
    hanafi: "حنفی",
    currentPrayer: "موجودہ نماز",
    tahajjudLabel: "تہجد (رات کا آخری تہائی)",
    backToCalculator: "کیلکولیٹر پر واپس",
    footerVerse: "حافظوا على الصلوات والصلاة الوسطى",
    footerVerseTranslation: "نمازوں کی حفاظت کرو، خاص طور پر درمیانی نماز کی۔",
    footerVerseRef: "سورۃ البقرہ ۲:۲۳۸",
    disclaimer: "نماز کے اوقات تخمینی ہیں اور مقامی مسجد کے شیڈول سے قدرے مختلف ہو سکتے ہیں۔ اپنے مقامی اسلامی اتھارٹی سے تصدیق کریں۔",
  },
  ar: {
    prayerTimes: "مواقيت الصلاة",
    dailyPrayerSchedule: "جدول الصلاة اليومي",
    dailyPrayerScheduleAr: "مواقيت الصلاة اليومية",
    subtitle: "أوقات الصلاة محسوبة بناءً على موقعك باستخدام الأساليب الفلكية المعتمدة.",
    detectingLocation: "جاري تحديد موقعك...",
    nextPrayer: "الصلاة القادمة",
    timeRemaining: "الوقت المتبقي",
    method: "الطريقة:",
    asr: "العصر:",
    standard: "المعيار",
    hanafi: "الحنفي",
    currentPrayer: "الصلاة الحالية",
    tahajjudLabel: "التهجد (الثلث الأخير من الليل)",
    backToCalculator: "العودة إلى الحاسبة",
    footerVerse: "حافظوا على الصلوات والصلاة الوسطى",
    footerVerseTranslation: "حافظوا على الصلوات والصلاة الوسطى وقوموا لله قانتين.",
    footerVerseRef: "سورة البقرة ٢:٢٣٨",
    disclaimer: "أوقات الصلاة تقريبية وقد تختلف قليلاً عن جداول المساجد المحلية. يرجى التحقق من الجهة الإسلامية المحلية.",
  },
  tr: {
    prayerTimes: "Namaz Vakitleri",
    dailyPrayerSchedule: "Gunluk Namaz Vakitleri",
    dailyPrayerScheduleAr: "مواقيت الصلاة اليومية",
    subtitle: "Namaz vakitleri, konumunuza gore standart astronomik yontemler kullanilarak hesaplanmistir.",
    detectingLocation: "Konumunuz tespit ediliyor...",
    nextPrayer: "Sonraki Namaz",
    timeRemaining: "Kalan Sure",
    method: "Yontem:",
    asr: "Ikindi:",
    standard: "Standart",
    hanafi: "Hanefi",
    currentPrayer: "Simdiki Namaz",
    tahajjudLabel: "Teheccud (Gecenin son ucte biri)",
    backToCalculator: "Hesaplayiciya Don",
    footerVerse: "حافظوا على الصلوات والصلاة الوسطى",
    footerVerseTranslation: "Namazlara, ozellikle orta namaza devam edin.",
    footerVerseRef: "Bakara Suresi 2:238",
    disclaimer: "Namaz vakitleri yaklasiktir ve yerel cami programlarindan hafifce farklilik gosterebilir. Lutfen yerel islami otoritenize danisin.",
  },
  ms: {
    prayerTimes: "Waktu Solat",
    dailyPrayerSchedule: "Jadual Solat Harian",
    dailyPrayerScheduleAr: "مواقيت الصلاة اليومية",
    subtitle: "Waktu solat dikira berdasarkan lokasi anda menggunakan kaedah astronomi standard.",
    detectingLocation: "Mengesan lokasi anda...",
    nextPrayer: "Solat Seterusnya",
    timeRemaining: "Masa Berbaki",
    method: "Kaedah:",
    asr: "Asar:",
    standard: "Standard",
    hanafi: "Hanafi",
    currentPrayer: "Solat Semasa",
    tahajjudLabel: "Tahajud (Sepertiga terakhir malam)",
    backToCalculator: "Kembali ke Kalkulator",
    footerVerse: "حافظوا على الصلوات والصلاة الوسطى",
    footerVerseTranslation: "Jagalah solat-solat kamu terutamanya solat pertengahan.",
    footerVerseRef: "Surah Al-Baqarah 2:238",
    disclaimer: "Waktu solat adalah anggaran dan mungkin berbeza sedikit daripada jadual masjid tempatan. Sila sahkan dengan pihak berkuasa Islam tempatan.",
  },
  id: {
    prayerTimes: "Waktu Shalat",
    dailyPrayerSchedule: "Jadwal Shalat Harian",
    dailyPrayerScheduleAr: "مواقيت الصلاة اليومية",
    subtitle: "Waktu shalat dihitung berdasarkan lokasi Anda menggunakan metode astronomi standar.",
    detectingLocation: "Mendeteksi lokasi Anda...",
    nextPrayer: "Shalat Berikutnya",
    timeRemaining: "Waktu Tersisa",
    method: "Metode:",
    asr: "Ashar:",
    standard: "Standar",
    hanafi: "Hanafi",
    currentPrayer: "Shalat Saat Ini",
    tahajjudLabel: "Tahajud (Sepertiga terakhir malam)",
    backToCalculator: "Kembali ke Kalkulator",
    footerVerse: "حافظوا على الصلوات والصلاة الوسطى",
    footerVerseTranslation: "Peliharalah semua shalat dan shalat wustha.",
    footerVerseRef: "Surah Al-Baqarah 2:238",
    disclaimer: "Waktu shalat bersifat perkiraan dan mungkin sedikit berbeda dari jadwal masjid setempat. Silakan verifikasi dengan otoritas Islam setempat.",
  },
};

// ─── History Page Texts ───
export const HISTORY_PAGE_TEXTS: Record<TransLang, {
  signInRequired: string;
  signInDesc: string;
  signIn: string;
  createAccount: string;
  zakatHistory: string;
  zakatHistoryAr: string;
  trackSubtitle: string;
  allYears: string;
  compareYears: string;
  clear: string;
  noRecords: string;
  noRecordsDesc: string;
  goToCalculator: string;
  back: string;
  aboveNisab: string;
  belowNisab: string;
  paid: string;
  markPaid: string;
  certificate: string;
  payments: string;
  paymentTracker: string;
  totalAssets: string;
  deductions: string;
  netWealth: string;
  zakatDue: string;
  amount: string;
  recipient: string;
  category: string;
  add: string;
  calculated: string;
  deleteTitle: string;
  deleteDescription: string;
  deleteConfirm: string;
  deleteCancel: string;
}> = {
  en: {
    signInRequired: "Sign In Required",
    signInDesc: "Please sign in to view your Zakat calculation history and track payments across years.",
    signIn: "Sign In",
    createAccount: "Create Account",
    zakatHistory: "Zakat History",
    zakatHistoryAr: "سجل الزكاة",
    trackSubtitle: "Track and compare your Zakat calculations across years",
    allYears: "All Years",
    compareYears: "Compare Years",
    clear: "Clear",
    noRecords: "No Records Yet",
    noRecordsDesc: "Calculate your Zakat and save it to start building your history.",
    goToCalculator: "Go to Calculator",
    back: "Back",
    aboveNisab: "Above Nisab",
    belowNisab: "Below Nisab",
    paid: "Paid",
    markPaid: "Mark Paid",
    certificate: "Certificate",
    payments: "Payments",
    paymentTracker: "Payment Tracker",
    totalAssets: "Total Assets",
    deductions: "Deductions",
    netWealth: "Net Wealth",
    zakatDue: "Zakat Due",
    amount: "Amount",
    recipient: "Recipient",
    category: "Category",
    add: "Add",
    calculated: "Calculated",
    deleteTitle: "Delete Zakat Record",
    deleteDescription: "Are you sure you want to delete this Zakat record? This action cannot be undone.",
    deleteConfirm: "Delete",
    deleteCancel: "Cancel",
  },
  bn: {
    signInRequired: "সাইন ইন প্রয়োজন",
    signInDesc: "আপনার যাকাত হিসাবের ইতিহাস দেখতে এবং বছরব্যাপী পেমেন্ট ট্র্যাক করতে সাইন ইন করুন।",
    signIn: "সাইন ইন",
    createAccount: "অ্যাকাউন্ট তৈরি করুন",
    zakatHistory: "যাকাত ইতিহাস",
    zakatHistoryAr: "سجل الزكاة",
    trackSubtitle: "বছরব্যাপী আপনার যাকাত হিসাব ট্র্যাক ও তুলনা করুন",
    allYears: "সকল বছর",
    compareYears: "বছর তুলনা করুন",
    clear: "মুছুন",
    noRecords: "এখনো কোনো রেকর্ড নেই",
    noRecordsDesc: "আপনার যাকাত হিসাব করুন এবং ইতিহাস তৈরি শুরু করতে সংরক্ষণ করুন।",
    goToCalculator: "ক্যালকুলেটরে যান",
    back: "পেছনে",
    aboveNisab: "নিসাবের উপরে",
    belowNisab: "নিসাবের নিচে",
    paid: "পরিশোধিত",
    markPaid: "পরিশোধিত চিহ্নিত করুন",
    certificate: "সার্টিফিকেট",
    payments: "পেমেন্ট",
    paymentTracker: "পেমেন্ট ট্র্যাকার",
    totalAssets: "মোট সম্পদ",
    deductions: "বাদ",
    netWealth: "নিট সম্পদ",
    zakatDue: "যাকাত প্রদেয়",
    amount: "পরিমাণ",
    recipient: "প্রাপক",
    category: "ক্যাটাগরি",
    add: "যোগ করুন",
    calculated: "গণনা করা হয়েছে",
    deleteTitle: "যাকাত রেকর্ড মুছুন",
    deleteDescription: "আপনি কি নিশ্চিত যে এই যাকাত রেকর্ড মুছতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।",
    deleteConfirm: "মুছুন",
    deleteCancel: "বাতিল",
  },
  ur: {
    signInRequired: "سائن ان ضروری ہے",
    signInDesc: "اپنی زکوٰۃ کی حسابی تاریخ دیکھنے اور سالانہ ادائیگیوں کو ٹریک کرنے کے لیے سائن ان کریں۔",
    signIn: "سائن ان",
    createAccount: "اکاؤنٹ بنائیں",
    zakatHistory: "زکوٰۃ کی تاریخ",
    zakatHistoryAr: "سجل الزكاة",
    trackSubtitle: "سالانہ اپنی زکوٰۃ کے حسابات ٹریک اور موازنہ کریں",
    allYears: "تمام سال",
    compareYears: "سالوں کا موازنہ",
    clear: "صاف کریں",
    noRecords: "ابھی کوئی ریکارڈ نہیں",
    noRecordsDesc: "اپنی زکوٰۃ کا حساب لگائیں اور تاریخ بنانا شروع کرنے کے لیے محفوظ کریں۔",
    goToCalculator: "کیلکولیٹر پر جائیں",
    back: "واپس",
    aboveNisab: "نصاب سے اوپر",
    belowNisab: "نصاب سے نیچے",
    paid: "ادا شدہ",
    markPaid: "ادا شدہ نشان زد کریں",
    certificate: "سرٹیفکیٹ",
    payments: "ادائیگیاں",
    paymentTracker: "ادائیگی ٹریکر",
    totalAssets: "کل اثاثے",
    deductions: "کٹوتیاں",
    netWealth: "خالص دولت",
    zakatDue: "واجب الادا زکوٰۃ",
    amount: "رقم",
    recipient: "وصول کنندہ",
    category: "زمرہ",
    add: "شامل کریں",
    calculated: "حساب لگایا گیا",
    deleteTitle: "زکوٰۃ ریکارڈ حذف کریں",
    deleteDescription: "کیا آپ واقعی اس زکوٰۃ ریکارڈ کو حذف کرنا چاہتے ہیں؟ یہ عمل واپس نہیں ہو سکتا۔",
    deleteConfirm: "حذف کریں",
    deleteCancel: "منسوخ",
  },
  ar: {
    signInRequired: "يجب تسجيل الدخول",
    signInDesc: "يرجى تسجيل الدخول لعرض سجل حسابات الزكاة وتتبع المدفوعات عبر السنوات.",
    signIn: "تسجيل الدخول",
    createAccount: "إنشاء حساب",
    zakatHistory: "سجل الزكاة",
    zakatHistoryAr: "سجل الزكاة",
    trackSubtitle: "تتبع وقارن حسابات الزكاة عبر السنوات",
    allYears: "جميع السنوات",
    compareYears: "مقارنة السنوات",
    clear: "مسح",
    noRecords: "لا توجد سجلات بعد",
    noRecordsDesc: "احسب زكاتك واحفظها لبدء بناء سجلك.",
    goToCalculator: "الذهاب إلى الحاسبة",
    back: "رجوع",
    aboveNisab: "فوق النصاب",
    belowNisab: "دون النصاب",
    paid: "مدفوعة",
    markPaid: "تحديد كمدفوعة",
    certificate: "شهادة",
    payments: "المدفوعات",
    paymentTracker: "متتبع المدفوعات",
    totalAssets: "إجمالي الأصول",
    deductions: "الخصومات",
    netWealth: "صافي الثروة",
    zakatDue: "الزكاة المستحقة",
    amount: "المبلغ",
    recipient: "المستلم",
    category: "الفئة",
    add: "إضافة",
    calculated: "تم الحساب",
    deleteTitle: "حذف سجل الزكاة",
    deleteDescription: "هل أنت متأكد من حذف سجل الزكاة هذا؟ لا يمكن التراجع عن هذا الإجراء.",
    deleteConfirm: "حذف",
    deleteCancel: "إلغاء",
  },
  tr: {
    signInRequired: "Giris Gerekli",
    signInDesc: "Zekat hesaplama gecmisinizi gormek ve yillar boyunca odemeleri takip etmek icin giris yapin.",
    signIn: "Giris Yap",
    createAccount: "Hesap Olustur",
    zakatHistory: "Zekat Gecmisi",
    zakatHistoryAr: "سجل الزكاة",
    trackSubtitle: "Yillar boyunca zekat hesaplamalarinizi takip edin ve karsilastirin",
    allYears: "Tum Yillar",
    compareYears: "Yillari Karsilastir",
    clear: "Temizle",
    noRecords: "Henuz Kayit Yok",
    noRecordsDesc: "Zekatinizi hesaplayin ve gecmisinizi olusturmaya baslamak icin kaydedin.",
    goToCalculator: "Hesaplayiciya Git",
    back: "Geri",
    aboveNisab: "Nisab Ustu",
    belowNisab: "Nisab Alti",
    paid: "Odendi",
    markPaid: "Odendi Isaretle",
    certificate: "Sertifika",
    payments: "Odemeler",
    paymentTracker: "Odeme Takibi",
    totalAssets: "Toplam Varliklar",
    deductions: "Kesintiler",
    netWealth: "Net Servet",
    zakatDue: "Odenecek Zekat",
    amount: "Miktar",
    recipient: "Alici",
    category: "Kategori",
    add: "Ekle",
    calculated: "Hesaplandi",
    deleteTitle: "Zekat Kaydini Sil",
    deleteDescription: "Bu zekat kaydini silmek istediginizden emin misiniz? Bu islem geri alinamaz.",
    deleteConfirm: "Sil",
    deleteCancel: "Iptal",
  },
  ms: {
    signInRequired: "Log Masuk Diperlukan",
    signInDesc: "Sila log masuk untuk melihat sejarah pengiraan zakat anda dan menjejak pembayaran merentasi tahun.",
    signIn: "Log Masuk",
    createAccount: "Cipta Akaun",
    zakatHistory: "Sejarah Zakat",
    zakatHistoryAr: "سجل الزكاة",
    trackSubtitle: "Jejak dan bandingkan pengiraan zakat anda merentasi tahun",
    allYears: "Semua Tahun",
    compareYears: "Bandingkan Tahun",
    clear: "Padam",
    noRecords: "Tiada Rekod Lagi",
    noRecordsDesc: "Kira zakat anda dan simpan untuk mula membina sejarah anda.",
    goToCalculator: "Pergi ke Kalkulator",
    back: "Kembali",
    aboveNisab: "Melebihi Nisab",
    belowNisab: "Di Bawah Nisab",
    paid: "Dibayar",
    markPaid: "Tandakan Dibayar",
    certificate: "Sijil",
    payments: "Pembayaran",
    paymentTracker: "Penjejak Pembayaran",
    totalAssets: "Jumlah Aset",
    deductions: "Potongan",
    netWealth: "Kekayaan Bersih",
    zakatDue: "Zakat Perlu Dibayar",
    amount: "Jumlah",
    recipient: "Penerima",
    category: "Kategori",
    add: "Tambah",
    calculated: "Dikira",
    deleteTitle: "Padam Rekod Zakat",
    deleteDescription: "Adakah anda pasti mahu memadamkan rekod zakat ini? Tindakan ini tidak boleh dibatalkan.",
    deleteConfirm: "Padam",
    deleteCancel: "Batal",
  },
  id: {
    signInRequired: "Perlu Masuk",
    signInDesc: "Silakan masuk untuk melihat riwayat perhitungan zakat Anda dan melacak pembayaran lintas tahun.",
    signIn: "Masuk",
    createAccount: "Buat Akun",
    zakatHistory: "Riwayat Zakat",
    zakatHistoryAr: "سجل الزكاة",
    trackSubtitle: "Lacak dan bandingkan perhitungan zakat Anda lintas tahun",
    allYears: "Semua Tahun",
    compareYears: "Bandingkan Tahun",
    clear: "Hapus",
    noRecords: "Belum Ada Catatan",
    noRecordsDesc: "Hitung zakat Anda dan simpan untuk mulai membangun riwayat.",
    goToCalculator: "Ke Kalkulator",
    back: "Kembali",
    aboveNisab: "Di Atas Nisab",
    belowNisab: "Di Bawah Nisab",
    paid: "Dibayar",
    markPaid: "Tandai Dibayar",
    certificate: "Sertifikat",
    payments: "Pembayaran",
    paymentTracker: "Pelacak Pembayaran",
    totalAssets: "Total Aset",
    deductions: "Potongan",
    netWealth: "Kekayaan Bersih",
    zakatDue: "Zakat Terutang",
    amount: "Jumlah",
    recipient: "Penerima",
    category: "Kategori",
    add: "Tambah",
    calculated: "Dihitung",
    deleteTitle: "Hapus Catatan Zakat",
    deleteDescription: "Apakah Anda yakin ingin menghapus catatan zakat ini? Tindakan ini tidak dapat dibatalkan.",
    deleteConfirm: "Hapus",
    deleteCancel: "Batal",
  },
};

// ─── Sadaqah Page Texts ───
export const SADAQAH_PAGE_TEXTS: Record<TransLang, {
  title: string;
  subtitle: string;
  hadithTranslation: string;
  signInTitle: string;
  signInDesc: string;
  signIn: string;
  createAccount: string;
  loading: string;
  loadingRecords: string;
  motivationalHadith: string;
  back: string;
}> = {
  en: {
    title: "Sadaqah Tracker",
    subtitle: "Track your voluntary charity and earn continuous rewards",
    hadithTranslation: "Charity extinguishes sin just as water extinguishes fire.",
    signInTitle: "Sign in to track your Sadaqah",
    signInDesc: "Your donations are saved securely to your account so you can track your giving history across devices.",
    signIn: "Sign In",
    createAccount: "Create Account",
    loading: "Loading...",
    loadingRecords: "Loading your records...",
    motivationalHadith: "Charity does not decrease wealth.",
    back: "Back",
  },
  bn: {
    title: "সদকা ট্র্যাকার",
    subtitle: "আপনার নফল দান ট্র্যাক করুন এবং ক্রমাগত সওয়াব অর্জন করুন",
    hadithTranslation: "সদকা গুনাহকে এমনভাবে নিভিয়ে দেয় যেমন পানি আগুন নিভিয়ে দেয়।",
    signInTitle: "সদকা ট্র্যাক করতে সাইন ইন করুন",
    signInDesc: "আপনার দানগুলো আপনার অ্যাকাউন্টে সুরক্ষিতভাবে সংরক্ষিত থাকে যাতে আপনি সব ডিভাইস থেকে ইতিহাস দেখতে পারেন।",
    signIn: "সাইন ইন",
    createAccount: "অ্যাকাউন্ট তৈরি করুন",
    loading: "লোড হচ্ছে...",
    loadingRecords: "আপনার রেকর্ড লোড হচ্ছে...",
    motivationalHadith: "দান-সদকা সম্পদ কমায় না।",
    back: "পেছনে",
  },
  ur: {
    title: "صدقہ ٹریکر",
    subtitle: "اپنے نفلی صدقات کو ٹریک کریں اور مسلسل اجر حاصل کریں",
    hadithTranslation: "صدقہ گناہوں کو ایسے بجھا دیتا ہے جیسے پانی آگ کو بجھا دیتا ہے۔",
    signInTitle: "صدقہ ٹریک کرنے کے لیے سائن ان کریں",
    signInDesc: "آپ کے عطیات آپ کے اکاؤنٹ میں محفوظ طریقے سے محفوظ رہتے ہیں۔",
    signIn: "سائن ان",
    createAccount: "اکاؤنٹ بنائیں",
    loading: "لوڈ ہو رہا ہے...",
    loadingRecords: "آپ کے ریکارڈ لوڈ ہو رہے ہیں...",
    motivationalHadith: "صدقہ مال کو کم نہیں کرتا۔",
    back: "واپس",
  },
  tr: {
    title: "Sadaka Takibi",
    subtitle: "Gonullu bagislarinizi takip edin ve surekli sevap kazanin",
    hadithTranslation: "Sadaka gunahlari sondurur, tipki suyun atesi sondurdugu gibi.",
    signInTitle: "Sadakanizi takip etmek icin giris yapin",
    signInDesc: "Bagislariniz hesabiniza guvenli sekilde kaydedilir.",
    signIn: "Giris Yap",
    createAccount: "Hesap Olustur",
    loading: "Yukleniyor...",
    loadingRecords: "Kayitlariniz yukleniyor...",
    motivationalHadith: "Sadaka maldan eksiltmez.",
    back: "Geri",
  },
  ms: {
    title: "Penjejak Sedekah",
    subtitle: "Jejak sedekah sunat anda dan raih pahala berterusan",
    hadithTranslation: "Sedekah memadamkan dosa seperti air memadamkan api.",
    signInTitle: "Log masuk untuk menjejak sedekah anda",
    signInDesc: "Derma anda disimpan dengan selamat dalam akaun anda.",
    signIn: "Log Masuk",
    createAccount: "Cipta Akaun",
    loading: "Memuatkan...",
    loadingRecords: "Memuatkan rekod anda...",
    motivationalHadith: "Sedekah tidak mengurangkan harta.",
    back: "Kembali",
  },
  id: {
    title: "Pelacak Sedekah",
    subtitle: "Lacak sedekah sunat Anda dan raih pahala terus-menerus",
    hadithTranslation: "Sedekah memadamkan dosa seperti air memadamkan api.",
    signInTitle: "Masuk untuk melacak sedekah Anda",
    signInDesc: "Donasi Anda disimpan dengan aman di akun Anda.",
    signIn: "Masuk",
    createAccount: "Buat Akun",
    loading: "Memuat...",
    loadingRecords: "Memuat catatan Anda...",
    motivationalHadith: "Sedekah tidak mengurangi harta.",
    back: "Kembali",
  },
  ar: {
    title: "متتبع الصدقات",
    subtitle: "تتبع صدقاتك التطوعية واكسب الأجر المستمر",
    hadithTranslation: "الصدقة تطفئ الخطيئة كما يطفئ الماء النار.",
    signInTitle: "سجّل الدخول لتتبع صدقاتك",
    signInDesc: "تبرعاتك محفوظة بأمان في حسابك.",
    signIn: "تسجيل الدخول",
    createAccount: "إنشاء حساب",
    loading: "جاري التحميل...",
    loadingRecords: "جاري تحميل سجلاتك...",
    motivationalHadith: "ما نقصت صدقة من مال.",
    back: "رجوع",
  },
};
