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
    disclaimer: "Islamic Disclaimer",
    disclaimerText: "This calculator provides an estimation based on standard Islamic Fiqh rulings. For specific cases, please consult a qualified Islamic scholar (Mufti) regarding your individual obligations.",
    jazakallah: "May Allah reward you with goodness",
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
    disclaimer: "ইসলামী দ্রষ্টব্য",
    disclaimerText: "এই ক্যালকুলেটর ইসলামী ফিকহের মানক বিধান অনুসারে একটি অনুমান প্রদান করে। নির্দিষ্ট ক্ষেত্রে, আপনার ব্যক্তিগত বাধ্যবাধকতা সম্পর্কে একজন যোগ্য ইসলামী আলেম (মুফতী) এর পরামর্শ নিন।",
    jazakallah: "আল্লাহ আপনাকে উত্তম প্রতিদান দিন",
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
    disclaimer: "اسلامی تنبیہ",
    disclaimerText: "یہ کیلکولیٹر معیاری اسلامی فقہ کے مطابق ایک تخمینہ فراہم کرتا ہے۔ مخصوص معاملات میں کسی مستند عالم (مفتی) سے رجوع کریں۔",
    jazakallah: "اللہ آپ کو بہترین اجر عطا فرمائے",
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
    disclaimer: "Islami Uyari",
    disclaimerText: "Bu hesaplayici standart Islami fikih hukumlerine gore bir tahmin sunmaktadir. Ozel durumlar icin ehil bir Islami alime (muftiye) danisiniz.",
    jazakallah: "Allah sizi hayirla mukafatlandirsin",
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
    disclaimer: "Peringatan Islam",
    disclaimerText: "Kalkulator ini memberikan anggaran berdasarkan hukum Fiqh Islam standard. Untuk kes tertentu, sila rujuk ulama yang berkelayakan.",
    jazakallah: "Semoga Allah memberi ganjaran kebaikan kepada anda",
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
    disclaimer: "Peringatan Islami",
    disclaimerText: "Kalkulator ini memberikan perkiraan berdasarkan hukum Fiqh Islam standar. Untuk kasus tertentu, silakan berkonsultasi dengan ulama yang berkompeten.",
    jazakallah: "Semoga Allah membalas Anda dengan kebaikan",
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
    disclaimer: "تنبيه شرعي",
    disclaimerText: "هذه الحاسبة تقدم تقديراً بناءً على أحكام الفقه الإسلامي المعتمدة. للحالات الخاصة يرجى استشارة عالم مؤهل (مفتي).",
    jazakallah: "جزاكم الله خيراً",
  },
};
