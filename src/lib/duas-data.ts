export type DuaCategory =
  | "durud"
  | "munajat"
  | "friday"
  | "morning-evening"
  | "meals"
  | "prayer"
  | "travel"
  | "protection"
  | "forgiveness"
  | "gratitude"
  | "daily-life"
  | "health"
  | "general";

export interface Dua {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  translations?: Partial<Record<string, string>>;
  source: string;
  category: DuaCategory;
}

export const DUA_CATEGORIES: { id: DuaCategory; label: string; labelAr: string; emoji: string }[] = [
  { id: "durud", label: "Durud / Salawat", labelAr: "الصلاة على النبي ﷺ", emoji: "🌹" },
  { id: "munajat", label: "Munajat / Prayers", labelAr: "المناجاة", emoji: "🤲" },
  { id: "friday", label: "Friday / Jummah", labelAr: "الجمعة", emoji: "🕌" },
  { id: "morning-evening", label: "Morning / Evening", labelAr: "الصباح والمساء", emoji: "🌅" },
  { id: "daily-life", label: "Daily Life", labelAr: "الحياة اليومية", emoji: "🏠" },
  { id: "meals", label: "Meals", labelAr: "الطعام", emoji: "🍽" },
  { id: "prayer", label: "Prayer", labelAr: "الصلاة", emoji: "🕌" },
  { id: "travel", label: "Travel", labelAr: "السفر", emoji: "✈" },
  { id: "protection", label: "Protection", labelAr: "الحماية", emoji: "🛡" },
  { id: "health", label: "Health & Healing", labelAr: "الصحة والشفاء", emoji: "🩺" },
  { id: "forgiveness", label: "Forgiveness", labelAr: "المغفرة", emoji: "🤲" },
  { id: "gratitude", label: "Gratitude", labelAr: "الشكر", emoji: "💚" },
  { id: "general", label: "General", labelAr: "عامة", emoji: "📿" },
];

export const DUAS: Dua[] = [
  // ── Durud / Salawat (Blessings upon the Prophet ﷺ) ─────
  {
    id: "durud-ibrahim",
    arabic: "اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ. اللَّهُمَّ بَارِكْ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ",
    transliteration: "Allahumma salli 'ala Muhammadin wa 'ala ali Muhammad, kama sallayta 'ala Ibrahima wa 'ala ali Ibrahim, innaka Hameedun Majeed. Allahumma barik 'ala Muhammadin wa 'ala ali Muhammad, kama barakta 'ala Ibrahima wa 'ala ali Ibrahim, innaka Hameedun Majeed.",
    translation: "O Allah, send prayers upon Muhammad and upon the family of Muhammad, as You sent prayers upon Ibrahim and the family of Ibrahim. You are indeed Praiseworthy, Glorious. O Allah, bless Muhammad and the family of Muhammad, as You blessed Ibrahim and the family of Ibrahim. You are indeed Praiseworthy, Glorious.",
    translations: {
      bn: "হে আল্লাহ, মুহাম্মাদ ও তাঁর পরিবারের উপর রহমত বর্ষণ করুন, যেমন আপনি ইবরাহীম ও তাঁর পরিবারের উপর রহমত বর্ষণ করেছেন। নিশ্চয়ই আপনি প্রশংসিত, মহিমান্বিত। হে আল্লাহ, মুহাম্মাদ ও তাঁর পরিবারের উপর বরকত দান করুন, যেমন আপনি ইবরাহীম ও তাঁর পরিবারের উপর বরকত দান করেছেন। নিশ্চয়ই আপনি প্রশংসিত, মহিমান্বিত।",
      ur: "اے اللہ، محمد ﷺ اور آل محمد پر رحمتیں بھیج، جیسے تو نے ابراہیم اور آل ابراہیم پر رحمتیں بھیجیں۔ بے شک تو حمد والا بزرگی والا ہے۔ اے اللہ، محمد ﷺ اور آل محمد پر برکتیں نازل فرما، جیسے تو نے ابراہیم اور آل ابراہیم پر برکتیں نازل فرمائیں۔ بے شک تو حمد والا بزرگی والا ہے۔",
      ar: "اللهم صل على محمد وعلى آل محمد كما صليت على إبراهيم وعلى آل إبراهيم إنك حميد مجيد. اللهم بارك على محمد وعلى آل محمد كما باركت على إبراهيم وعلى آل إبراهيم إنك حميد مجيد.",
    },
    source: "Al-Bukhari 3370, Muslim 406 — Durud Ibrahim (recited in Salah)",
    category: "durud",
  },
  {
    id: "durud-short",
    arabic: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَىٰ نَبِيِّنَا مُحَمَّدٍ",
    transliteration: "Allahumma salli wa sallim 'ala nabiyyina Muhammad.",
    translation: "O Allah, send prayers and peace upon our Prophet Muhammad.",
    translations: {
      bn: "হে আল্লাহ, আমাদের নবী মুহাম্মাদ ﷺ-এর উপর দরূদ ও সালাম বর্ষণ করুন।",
      ur: "اے اللہ، ہمارے نبی محمد ﷺ پر درود و سلام بھیج۔",
      ar: "اللهم صل وسلم على نبينا محمد.",
    },
    source: "Short form of Salawat — recommended frequently",
    category: "durud",
  },
  {
    id: "durud-nariya",
    arabic: "اللَّهُمَّ صَلِّ صَلَاةً كَامِلَةً وَسَلِّمْ سَلَامًا تَامًّا عَلَىٰ سَيِّدِنَا مُحَمَّدٍ الَّذِي تَنْحَلُّ بِهِ الْعُقَدُ وَتَنْفَرِجُ بِهِ الْكُرَبُ وَتُقْضَىٰ بِهِ الْحَوَائِجُ وَتُنَالُ بِهِ الرَّغَائِبُ وَحُسْنُ الْخَوَاتِمِ وَيُسْتَسْقَى الْغَمَامُ بِوَجْهِهِ الْكَرِيمِ وَعَلَىٰ آلِهِ وَصَحْبِهِ فِي كُلِّ لَمْحَةٍ وَنَفَسٍ بِعَدَدِ كُلِّ مَعْلُومٍ لَكَ",
    transliteration: "Allahumma salli salatan kamilatan wa sallim salaman tamman 'ala sayyidina Muhammadin-illadhi tanhallu bihil-'uqadu wa tanfariju bihil-kurabu wa tuqdha bihil-hawa'iju wa tunalu bihir-ragha'ibu wa husnul-khawatimi wa yustasqal-ghamamu bi-wajhihil-karimi wa 'ala alihi wa sahbihi fi kulli lamhatin wa nafasin bi-'adadi kulli ma'lumin lak.",
    translation: "O Allah, bestow complete blessings and perfect peace upon our master Muhammad, through whom knots are untied, hardships are relieved, needs are fulfilled, desires are attained, and good endings are achieved, and rain is sought through his noble face. And upon his family and companions, in every glance and every breath, by the number of everything known to You.",
    translations: {
      bn: "হে আল্লাহ, আমাদের সরদার মুহাম্মাদ ﷺ-এর উপর পরিপূর্ণ দরূদ ও সম্পূর্ণ সালাম বর্ষণ করুন, যাঁর মাধ্যমে গিঁট খোলে, কষ্ট দূর হয়, প্রয়োজন পূরণ হয়, আকাঙ্ক্ষা অর্জিত হয়, শুভ পরিণতি লাভ হয় এবং তাঁর মহান চেহারার উসিলায় বৃষ্টি প্রার্থনা করা হয়। এবং তাঁর পরিবার ও সাহাবীদের উপরও, প্রতিটি দৃষ্টিপাত ও শ্বাস-প্রশ্বাসে, আপনার জানা সকল কিছুর সংখ্যায়।",
      ur: "اے اللہ، ہمارے سردار محمد ﷺ پر کامل درود اور مکمل سلام بھیج، جن کے ذریعے گرہیں کھلتی ہیں، مشکلات دور ہوتی ہیں، حاجتیں پوری ہوتی ہیں، مرادیں حاصل ہوتی ہیں، خاتمہ بالخیر ہوتا ہے، اور ان کے کریم چہرے کے وسیلے سے بارش طلب کی جاتی ہے۔ اور ان کی آل اور اصحاب پر بھی، ہر نظر اور سانس میں، تیرے ہر معلوم کی تعداد کے برابر۔",
      ar: "اللهم صل صلاة كاملة وسلم سلاماً تاماً على سيدنا محمد الذي تنحل به العقد وتنفرج به الكرب وتقضى به الحوائج وتنال به الرغائب وحسن الخواتم ويستسقى الغمام بوجهه الكريم وعلى آله وصحبه في كل لمحة ونفس بعدد كل معلوم لك.",
    },
    source: "Durud Nariya (Salat al-Tafrijiyya) — widely recited for relief from hardships",
    category: "durud",
  },
  {
    id: "durud-tunjina",
    arabic: "اللَّهُمَّ صَلِّ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ صَلَاةً تُنْجِينَا بِهَا مِنْ جَمِيعِ الْأَهْوَالِ وَالْآفَاتِ، وَتَقْضِي لَنَا بِهَا جَمِيعَ الْحَاجَاتِ، وَتُطَهِّرُنَا بِهَا مِنْ جَمِيعِ السَّيِّئَاتِ، وَتَرْفَعُنَا بِهَا عِنْدَكَ أَعْلَى الدَّرَجَاتِ، وَتُبَلِّغُنَا بِهَا أَقْصَى الْغَايَاتِ، مِنْ جَمِيعِ الْخَيْرَاتِ فِي الْحَيَاةِ وَبَعْدَ الْمَمَاتِ",
    transliteration: "Allahumma salli 'ala sayyidina Muhammadin salatan tunjina biha min jami'il-ahwali wal-afat, wa taqdhi lana biha jami'al-hajat, wa tutahhiruna biha min jami'is-sayyi'at, wa tarfa'una biha 'indaka a'lad-darajat, wa tuballighuna biha aqsal-ghayat, min jami'il-khayrati fil-hayati wa ba'dal-mamat.",
    translation: "O Allah, send prayers upon our master Muhammad, prayers that will save us from all fears and calamities, fulfill all our needs, purify us from all sins, elevate us to the highest ranks in Your sight, and deliver us to the utmost goals of all goodness in life and after death.",
    translations: {
      bn: "হে আল্লাহ, আমাদের সরদার মুহাম্মাদ ﷺ-এর উপর এমন দরূদ পাঠান যা আমাদের সকল ভয় ও বিপদ থেকে রক্ষা করবে, আমাদের সকল প্রয়োজন পূরণ করবে, সকল পাপ থেকে পবিত্র করবে, আপনার নিকট সর্বোচ্চ মর্যাদায় উন্নীত করবে এবং জীবনে ও মৃত্যুর পরে সকল কল্যাণের চরম লক্ষ্যে পৌঁছে দেবে।",
      ur: "اے اللہ، ہمارے سردار محمد ﷺ پر ایسا درود بھیج جو ہمیں تمام خوف اور آفات سے بچائے، ہماری تمام حاجتیں پوری کرے، تمام گناہوں سے پاک کرے، تیرے نزدیک بلند ترین درجات تک پہنچائے، اور زندگی میں اور موت کے بعد تمام خیر کی انتہا تک پہنچائے۔",
      ar: "اللهم صل على سيدنا محمد صلاة تنجينا بها من جميع الأهوال والآفات وتقضي لنا بها جميع الحاجات وتطهرنا بها من جميع السيئات وترفعنا بها عندك أعلى الدرجات وتبلغنا بها أقصى الغايات من جميع الخيرات في الحياة وبعد الممات.",
    },
    source: "Durud Tunjina — recited for protection and fulfillment of needs",
    category: "durud",
  },
  {
    id: "durud-taj",
    arabic: "اللَّهُمَّ صَلِّ عَلَىٰ سَيِّدِنَا وَمَوْلَانَا مُحَمَّدٍ صَاحِبِ التَّاجِ وَالْمِعْرَاجِ وَالْبُرَاقِ وَالْعَلَمِ، دَافِعِ الْبَلَاءِ وَالْوَبَاءِ وَالْقَحْطِ وَالْمَرَضِ وَالْأَلَمِ، اسْمُهُ مَكْتُوبٌ مَرْفُوعٌ مَشْفُوعٌ مَنْقُوشٌ فِي اللَّوْحِ وَالْقَلَمِ، سَيِّدِ الْعَرَبِ وَالْعَجَمِ، جِسْمُهُ مُقَدَّسٌ مُعَطَّرٌ مُطَهَّرٌ مُنَوَّرٌ فِي الْبَيْتِ وَالْحَرَمِ",
    transliteration: "Allahumma salli 'ala sayyidina wa mawlana Muhammadin sahibit-taji wal-mi'raji wal-buraqi wal-'alam, dafi'il-bala'i wal-waba'i wal-qahti wal-maradi wal-alam, ismuhu maktubun marfu'un mashfu'un manqushun fil-lawhi wal-qalam, sayyidil-'arabi wal-'ajam, jismuhu muqaddasun mu'attarun mutahharun munawwarun fil-bayti wal-haram.",
    translation: "O Allah, send blessings upon our master and patron Muhammad, the owner of the crown, the Ascension, the Buraq, and the standard. The repeller of affliction, plague, drought, disease, and pain. His name is written, exalted, interceding, and inscribed on the Preserved Tablet and Pen. The leader of Arabs and non-Arabs. His body is sanctified, perfumed, purified, and illuminated in the House and the Sacred Mosque.",
    translations: {
      bn: "হে আল্লাহ, আমাদের সরদার ও অভিভাবক মুহাম্মাদ ﷺ-এর উপর দরূদ পাঠান, যিনি তাজ, মি'রাজ, বুরাক ও পতাকার অধিকারী। বিপদ, মহামারী, দুর্ভিক্ষ, রোগ ও যন্ত্রণা দূরকারী। তাঁর নাম লওহে মাহফুজ ও কলমে লিখিত, উন্নীত, সুপারিশকৃত ও খোদিত। আরব ও অনারবের সরদার। তাঁর দেহ পবিত্র, সুগন্ধময়, পরিশুদ্ধ ও আলোকিত বাইতুল্লাহ ও হারামে।",
      ur: "اے اللہ، ہمارے سردار اور مولا محمد ﷺ پر درود بھیج، جو تاج، معراج، براق اور عَلم کے مالک ہیں۔ بلاؤں، وباؤں، قحط، بیماری اور درد کو دور کرنے والے۔ ان کا نام لوح و قلم میں لکھا، بلند، شفاعت کردہ اور کندہ ہے۔ عرب و عجم کے سردار۔ ان کا جسم بیت اللہ اور حرم میں مقدس، معطر، مطہر اور منور ہے۔",
      ar: "اللهم صل على سيدنا ومولانا محمد صاحب التاج والمعراج والبراق والعلم دافع البلاء والوباء والقحط والمرض والألم اسمه مكتوب مرفوع مشفوع منقوش في اللوح والقلم سيد العرب والعجم جسمه مقدس معطر مطهر منور في البيت والحرم.",
    },
    source: "Durud Taj — popular in South Asia, recited for blessings and protection",
    category: "durud",
  },
  {
    id: "durud-lakhi",
    arabic: "اللَّهُمَّ صَلِّ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ وَعَلَىٰ آلِ سَيِّدِنَا مُحَمَّدٍ بِعَدَدِ كُلِّ دَاءٍ وَدَوَاءٍ وَبَارِكْ وَسَلِّمْ عَلَيْهِ وَعَلَيْهِمْ كَثِيرًا كَثِيرًا",
    transliteration: "Allahumma salli 'ala sayyidina Muhammadin wa 'ala ali sayyidina Muhammadin bi-'adadi kulli da'in wa dawa'in wa barik wa sallim 'alayhi wa 'alayhim kathiran kathira.",
    translation: "O Allah, send blessings upon our master Muhammad and upon the family of our master Muhammad, by the number of every disease and every cure, and bestow abundant peace and blessings upon him and upon them.",
    translations: {
      bn: "হে আল্লাহ, আমাদের সরদার মুহাম্মাদ ﷺ ও তাঁর পরিবারের উপর প্রতিটি রোগ ও প্রতিটি ঔষধের সংখ্যায় দরূদ পাঠান এবং তাঁর ও তাঁদের উপর অসংখ্য শান্তি ও বরকত বর্ষণ করুন।",
      ur: "اے اللہ، ہمارے سردار محمد ﷺ اور ان کی آل پر ہر بیماری اور ہر دوا کی تعداد کے برابر درود بھیج اور ان پر اور ان سب پر بہت بہت سلام اور برکت نازل فرما۔",
      ar: "اللهم صل على سيدنا محمد وعلى آل سيدنا محمد بعدد كل داء ودواء وبارك وسلم عليه وعليهم كثيراً كثيراً.",
    },
    source: "Durud Lakhi — recited 100,000 times in gatherings for immense blessings",
    category: "durud",
  },
  {
    id: "durud-akbar",
    arabic: "اللَّهُمَّ صَلِّ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ وَعَلَىٰ آلِهِ بِعَدَدِ أَنْفَاسِ الْخَلَائِقِ",
    transliteration: "Allahumma salli 'ala sayyidina Muhammadin wa 'ala alihi bi-'adadi anfasil-khala'iq.",
    translation: "O Allah, send blessings upon our master Muhammad and his family, by the number of breaths of all creation.",
    translations: {
      bn: "হে আল্লাহ, আমাদের সরদার মুহাম্মাদ ﷺ ও তাঁর পরিবারের উপর সৃষ্টির সকল প্রাণীর শ্বাস-প্রশ্বাসের সংখ্যায় দরূদ পাঠান।",
      ur: "اے اللہ، ہمارے سردار محمد ﷺ اور ان کی آل پر تمام مخلوقات کی سانسوں کی تعداد کے برابر درود بھیج۔",
      ar: "اللهم صل على سيدنا محمد وعلى آله بعدد أنفاس الخلائق.",
    },
    source: "Durud Akbar — short powerful form with vast reward",
    category: "durud",
  },
  {
    id: "durud-sharif-simple",
    arabic: "صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ",
    transliteration: "Sallallahu 'alayhi wa sallam.",
    translation: "May Allah's peace and blessings be upon him.",
    translations: {
      bn: "আল্লাহ তাঁর উপর শান্তি ও রহমত বর্ষণ করুন।",
      ur: "اللہ اُن پر رحمت اور سلامتی نازل فرمائے۔",
      ar: "صلى الله عليه وسلم.",
    },
    source: "Standard Salawat — said whenever the Prophet's ﷺ name is mentioned",
    category: "durud",
  },
  {
    id: "durud-mahi",
    arabic: "اللَّهُمَّ صَلِّ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ النَّبِيِّ الْأُمِّيِّ وَعَلَىٰ آلِهِ وَصَحْبِهِ وَسَلِّمْ",
    transliteration: "Allahumma salli 'ala sayyidina Muhammadin-Nabiyyil-Ummiyyi wa 'ala alihi wa sahbihi wa sallim.",
    translation: "O Allah, send blessings upon our master Muhammad, the unlettered Prophet, and upon his family and companions, and grant them peace.",
    translations: {
      bn: "হে আল্লাহ, আমাদের সরদার উম্মী নবী মুহাম্মাদ ﷺ এবং তাঁর পরিবার ও সাহাবীদের উপর দরূদ ও সালাম পাঠান।",
      ur: "اے اللہ، ہمارے سردار نبی اُمّی محمد ﷺ اور ان کی آل اور اصحاب پر درود و سلام بھیج۔",
      ar: "اللهم صل على سيدنا محمد النبي الأمي وعلى آله وصحبه وسلم.",
    },
    source: "Abu Dawud 1508 — Durud on the Unlettered Prophet",
    category: "durud",
  },
  {
    id: "durud-e-tanjeena",
    arabic: "اللَّهُمَّ صَلِّ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ وَعَلَىٰ آلِ سَيِّدِنَا مُحَمَّدٍ صَلَاةً تُنَجِّينَا بِهَا مِنْ جَمِيعِ الْأَهْوَالِ وَالْآفَاتِ وَتَقْضِي لَنَا جَمِيعَ الْحَاجَاتِ وَتُطَهِّرُنَا بِهَا مِنْ جَمِيعِ السَّيِّئَاتِ وَتَرْفَعُنَا بِهَا أَعْلَى الدَّرَجَاتِ وَتُبَلِّغُنَا بِهَا أَقْصَى الْغَايَاتِ مِنْ جَمِيعِ الْخَيْرَاتِ فِي الْحَيَاةِ وَبَعْدَ الْمَمَاتِ إِنَّكَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration: "Allahumma salli 'ala sayyidina Muhammadin wa 'ala ali sayyidina Muhammadin salatan tunajjina biha min jami'il-ahwali wal-afat, wa taqdhi lana jami'al-hajat, wa tutahhiruna biha min jami'is-sayyi'at, wa tarfa'una biha a'lad-darajat, wa tuballighuna biha aqsal-ghayat, min jami'il-khayrati fil-hayati wa ba'dal-mamat, innaka 'ala kulli shay'in Qadeer.",
    translation: "O Allah, send blessings upon our master Muhammad and the family of our master Muhammad — blessings that save us from all fears and calamities, fulfill all our needs, purify us from all sins, raise us to the highest ranks, and deliver us to the utmost goals of all goodness in this life and after death. Indeed, You are capable of all things.",
    translations: {
      bn: "হে আল্লাহ, আমাদের সরদার মুহাম্মাদ ﷺ ও তাঁর পরিবারের উপর এমন দরূদ পাঠান যা আমাদের সকল ভয় ও বিপদ থেকে রক্ষা করবে, সকল প্রয়োজন পূরণ করবে, সকল পাপ থেকে পবিত্র করবে, সর্বোচ্চ মর্যাদায় উন্নীত করবে এবং জীবনে ও মৃত্যুর পরে সকল কল্যাণের চূড়ান্ত লক্ষ্যে পৌঁছে দেবে। নিশ্চয়ই আপনি সবকিছুর উপর সর্বশক্তিমান।",
      ur: "اے اللہ، ہمارے سردار محمد ﷺ اور ان کی آل پر ایسا درود بھیج جو ہمیں تمام خوف و آفات سے بچائے، تمام حاجتیں پوری کرے، تمام گناہوں سے پاک کرے، بلند ترین درجات تک پہنچائے، اور زندگی اور موت کے بعد تمام خیرات کی انتہا تک پہنچائے۔ بے شک تو ہر چیز پر قادر ہے۔",
      ar: "اللهم صل على سيدنا محمد وعلى آل سيدنا محمد صلاة تنجينا بها من جميع الأهوال والآفات وتقضي لنا جميع الحاجات وتطهرنا بها من جميع السيئات وترفعنا بها أعلى الدرجات وتبلغنا بها أقصى الغايات من جميع الخيرات في الحياة وبعد الممات إنك على كل شيء قدير.",
    },
    source: "Durud Tanjeena — recited for deliverance from difficulties",
    category: "durud",
  },
  {
    id: "durud-1000-virtues",
    arabic: "اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَأَنْزِلْهُ الْمَقْعَدَ الْمُقَرَّبَ عِنْدَكَ يَوْمَ الْقِيَامَةِ",
    transliteration: "Allahumma salli 'ala Muhammadin wa anzilhul-maq'adal-muqarraba 'indaka yawmal-qiyamah.",
    translation: "O Allah, send blessings upon Muhammad and grant him the closest seat near You on the Day of Resurrection.",
    translations: {
      bn: "হে আল্লাহ, মুহাম্মাদ ﷺ-এর উপর দরূদ পাঠান এবং কিয়ামতের দিন তাঁকে আপনার নিকটতম আসনে অধিষ্ঠিত করুন।",
      ur: "اے اللہ، محمد ﷺ پر درود بھیج اور قیامت کے دن انہیں اپنے پاس قریب ترین مقام عطا فرما۔",
      ar: "اللهم صل على محمد وأنزله المقعد المقرب عندك يوم القيامة.",
    },
    source: "At-Tabrani — Hadith on earning the Prophet's ﷺ intercession",
    category: "durud",
  },

  // ── Munajat (Supplications & Intimate Prayers to Allah) ─────
  {
    id: "munajat-rabbana-atina",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    transliteration: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhabannar.",
    translation: "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",
    translations: {
      bn: "হে আমাদের রব, আমাদের দুনিয়াতে কল্যাণ দিন, আখিরাতেও কল্যাণ দিন এবং জাহান্নামের আযাব থেকে রক্ষা করুন।",
      ur: "اے ہمارے رب، ہمیں دنیا میں بھلائی دے اور آخرت میں بھلائی دے اور ہمیں آگ کے عذاب سے بچا۔",
      ar: "ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار.",
    },
    source: "Quran 2:201 — Most comprehensive Quranic dua",
    category: "munajat",
  },
  {
    id: "munajat-rabbana-la-tuzigh",
    arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً إِنَّكَ أَنْتَ الْوَهَّابُ",
    transliteration: "Rabbana la tuzigh qulubana ba'da idh hadaytana wa hab lana min ladunka rahmah, innaka Antal-Wahhab.",
    translation: "Our Lord, do not let our hearts deviate after You have guided us, and grant us mercy from Yourself. Indeed, You are the Bestower.",
    translations: {
      bn: "হে আমাদের রব, আপনি আমাদের হেদায়েত দেওয়ার পর আমাদের অন্তরকে বিপথগামী করবেন না এবং আপনার পক্ষ থেকে আমাদের রহমত দান করুন। নিশ্চয়ই আপনি মহাদাতা।",
      ur: "اے ہمارے رب، ہدایت دینے کے بعد ہمارے دلوں کو ٹیڑھا نہ کر اور ہمیں اپنے پاس سے رحمت عطا فرما۔ بے شک تو بڑا عطا کرنے والا ہے۔",
      ar: "ربنا لا تزغ قلوبنا بعد إذ هديتنا وهب لنا من لدنك رحمة إنك أنت الوهاب.",
    },
    source: "Quran 3:8",
    category: "munajat",
  },
  {
    id: "munajat-rabbi-zidni",
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    transliteration: "Rabbi zidni 'ilma.",
    translation: "My Lord, increase me in knowledge.",
    translations: {
      bn: "হে আমার রব, আমার জ্ঞান বৃদ্ধি করুন।",
      ur: "اے میرے رب، میرا علم بڑھا دے۔",
      ar: "رب زدني علماً.",
    },
    source: "Quran 20:114",
    category: "munajat",
  },
  {
    id: "munajat-rabbana-taqabbal",
    arabic: "رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ وَتُبْ عَلَيْنَا إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ",
    transliteration: "Rabbana taqabbal minna innaka Antas-Sami'ul-'Aleem, wa tub 'alayna innaka Antat-Tawwabur-Raheem.",
    translation: "Our Lord, accept from us. Indeed, You are the All-Hearing, the All-Knowing. And turn to us in forgiveness. Indeed, You are the Acceptor of repentance, the Most Merciful.",
    translations: {
      bn: "হে আমাদের রব, আমাদের থেকে কবুল করুন। নিশ্চয়ই আপনি সর্বশ্রোতা, সর্বজ্ঞ। এবং আমাদের তওবা কবুল করুন। নিশ্চয়ই আপনি তওবা কবুলকারী, পরম দয়ালু।",
      ur: "اے ہمارے رب، ہم سے قبول فرما۔ بے شک تو سب کچھ سننے والا، جاننے والا ہے۔ اور ہماری توبہ قبول فرما۔ بے شک تو توبہ قبول کرنے والا، رحم کرنے والا ہے۔",
      ar: "ربنا تقبل منا إنك أنت السميع العليم وتب علينا إنك أنت التواب الرحيم.",
    },
    source: "Quran 2:127-128 — Dua of Ibrahim & Ismail",
    category: "munajat",
  },
  {
    id: "munajat-rabbi-habli",
    arabic: "رَبِّ هَبْ لِي مِنْ لَدُنْكَ ذُرِّيَّةً طَيِّبَةً إِنَّكَ سَمِيعُ الدُّعَاءِ",
    transliteration: "Rabbi hab li min ladunka dhurriyyatan tayyibah, innaka Sami'ud-du'a.",
    translation: "My Lord, grant me from Yourself righteous offspring. Indeed, You are the Hearer of supplication.",
    translations: {
      bn: "হে আমার রব, আপনার পক্ষ থেকে আমাকে পবিত্র সন্তান দান করুন। নিশ্চয়ই আপনি দু'আ শ্রবণকারী।",
      ur: "اے میرے رب، مجھے اپنے پاس سے پاکیزہ اولاد عطا فرما۔ بے شک تو دعا سننے والا ہے۔",
      ar: "رب هب لي من لدنك ذرية طيبة إنك سميع الدعاء.",
    },
    source: "Quran 3:38 — Dua of Zakariyya",
    category: "munajat",
  },
  {
    id: "munajat-rabbana-dhalamna",
    arabic: "رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ",
    transliteration: "Rabbana dhalamna anfusana wa in lam taghfir lana wa tarhamna lanakoonanna minal-khasireen.",
    translation: "Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers.",
    translations: {
      bn: "হে আমাদের রব, আমরা নিজেদের উপর জুলুম করেছি। যদি আপনি আমাদের ক্ষমা না করেন এবং দয়া না করেন, তবে আমরা অবশ্যই ক্ষতিগ্রস্তদের অন্তর্ভুক্ত হব।",
      ur: "اے ہمارے رب، ہم نے اپنی جانوں پر ظلم کیا۔ اگر تو ہمیں معاف نہ کرے اور رحم نہ فرمائے تو ہم نقصان اٹھانے والوں میں سے ہو جائیں گے۔",
      ar: "ربنا ظلمنا أنفسنا وإن لم تغفر لنا وترحمنا لنكونن من الخاسرين.",
    },
    source: "Quran 7:23 — Dua of Adam & Hawa",
    category: "munajat",
  },
  {
    id: "munajat-la-ilaha-illa-anta",
    arabic: "لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
    transliteration: "La ilaha illa Anta Subhanaka inni kuntu minaz-zalimeen.",
    translation: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.",
    translations: {
      bn: "আপনি ছাড়া কোনো ইলাহ নেই, আপনি পবিত্র। নিশ্চয়ই আমি জালিমদের অন্তর্ভুক্ত ছিলাম।",
      ur: "تیرے سوا کوئی معبود نہیں، تو پاک ہے۔ بے شک میں ظالموں میں سے تھا۔",
      ar: "لا إله إلا أنت سبحانك إني كنت من الظالمين.",
    },
    source: "Quran 21:87 — Dua of Yunus (Jonah) — never fails when sincerely recited (Tirmidhi 3505)",
    category: "munajat",
  },
  {
    id: "munajat-hasbi-allah",
    arabic: "حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
    transliteration: "Hasbiyal-lahu la ilaha illa Huwa, 'alayhi tawakkaltu wa Huwa Rabbul-'Arshil-'Adheem.",
    translation: "Sufficient for me is Allah; there is no deity except Him. On Him I have relied, and He is the Lord of the Great Throne.",
    translations: {
      bn: "আল্লাহই আমার জন্য যথেষ্ট; তিনি ছাড়া কোনো ইলাহ নেই। আমি তাঁর উপরই তাওয়াক্কুল করেছি এবং তিনিই মহান আরশের রব।",
      ur: "مجھے اللہ کافی ہے، اس کے سوا کوئی معبود نہیں۔ میں نے اسی پر بھروسہ کیا اور وہ عرش عظیم کا رب ہے۔",
      ar: "حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم.",
    },
    source: "Quran 9:129 — Recite 7 times morning and evening (Abu Dawud 5081)",
    category: "munajat",
  },
  {
    id: "munajat-rabbij-alni",
    arabic: "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاءِ",
    transliteration: "Rabbij-'alni muqimas-salati wa min dhurriyyati, Rabbana wa taqabbal du'a.",
    translation: "My Lord, make me an establisher of prayer, and from my descendants. Our Lord, and accept my supplication.",
    translations: {
      bn: "হে আমার রব, আমাকে নামায কায়েমকারী বানান এবং আমার বংশধরদের মধ্য থেকেও। হে আমাদের রব, আমার দু'আ কবুল করুন।",
      ur: "اے میرے رب، مجھے نماز قائم کرنے والا بنا اور میری اولاد میں سے بھی۔ اے ہمارے رب، میری دعا قبول فرما۔",
      ar: "رب اجعلني مقيم الصلاة ومن ذريتي ربنا وتقبل دعاء.",
    },
    source: "Quran 14:40 — Dua of Ibrahim",
    category: "munajat",
  },
  {
    id: "munajat-rabbi-awzini",
    arabic: "رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَىٰ وَالِدَيَّ وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ وَأَدْخِلْنِي بِرَحْمَتِكَ فِي عِبَادِكَ الصَّالِحِينَ",
    transliteration: "Rabbi awzi'ni an ashkura ni'matakal-lati an'amta 'alayya wa 'ala walidayya wa an a'mala salihan tardahu wa adkhilni bi-rahmatika fi 'ibadikas-saliheen.",
    translation: "My Lord, enable me to be grateful for Your favor which You have bestowed upon me and upon my parents, and to do righteousness of which You approve. And admit me by Your mercy into the ranks of Your righteous servants.",
    translations: {
      bn: "হে আমার রব, আমাকে তৌফিক দিন যেন আমি আপনার সেই নেয়ামতের শুকরিয়া আদায় করি যা আপনি আমাকে ও আমার পিতামাতাকে দান করেছেন এবং যেন আমি এমন সৎকর্ম করি যা আপনি পছন্দ করেন। আর আপনার রহমতে আমাকে আপনার নেক বান্দাদের অন্তর্ভুক্ত করুন।",
      ur: "اے میرے رب، مجھے توفیق دے کہ میں تیری اس نعمت کا شکر ادا کروں جو تو نے مجھے اور میرے والدین کو عطا کی اور یہ کہ میں ایسے نیک عمل کروں جو تجھے پسند ہوں۔ اور اپنی رحمت سے مجھے اپنے نیک بندوں میں داخل فرما۔",
      ar: "رب أوزعني أن أشكر نعمتك التي أنعمت علي وعلى والدي وأن أعمل صالحاً ترضاه وأدخلني برحمتك في عبادك الصالحين.",
    },
    source: "Quran 27:19 — Dua of Sulaiman",
    category: "munajat",
  },

  // ── Friday / Jummah ────────────────────────────────────
  {
    id: "friday-salawat",
    arabic: "اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ. اللَّهُمَّ بَارِكْ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ",
    transliteration: "Allahumma salli 'ala Muhammadin wa 'ala ali Muhammad, kama sallayta 'ala Ibrahima wa 'ala ali Ibrahim, innaka Hameedun Majeed. Allahumma barik 'ala Muhammadin wa 'ala ali Muhammad, kama barakta 'ala Ibrahima wa 'ala ali Ibrahim, innaka Hameedun Majeed.",
    translation: "O Allah, send prayers upon Muhammad and upon the family of Muhammad, as You sent prayers upon Ibrahim and upon the family of Ibrahim. You are indeed Praiseworthy, Glorious. O Allah, bless Muhammad and the family of Muhammad, as You blessed Ibrahim and the family of Ibrahim. You are indeed Praiseworthy, Glorious.",
    translations: {
      bn: "হে আল্লাহ, মুহাম্মাদ ও তাঁর পরিবারের উপর রহমত বর্ষণ করুন, যেমন আপনি ইবরাহীম ও তাঁর পরিবারের উপর রহমত বর্ষণ করেছেন। নিশ্চয়ই আপনি প্রশংসিত, মহিমান্বিত। হে আল্লাহ, মুহাম্মাদ ও তাঁর পরিবারের উপর বরকত দান করুন, যেমন আপনি ইবরাহীম ও তাঁর পরিবারের উপর বরকত দান করেছেন। নিশ্চয়ই আপনি প্রশংসিত, মহিমান্বিত।",
    },
    source: "Al-Bukhari 3370 — Send abundant Salawat on Friday (Abu Dawud 1047)",
    category: "friday",
  },
  {
    id: "friday-dua-asr-maghrib",
    arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration: "La ilaha illallahu wahdahu la shareeka lah, lahul-mulku wa lahul-hamdu wa huwa 'ala kulli shay'in qadeer.",
    translation: "None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and praise, and He is over all things omnipotent. (Recite between Asr and Maghrib on Friday — the hour of acceptance)",
    translations: {
      bn: "আল্লাহ ছাড়া কোনো ইলাহ নেই, তিনি একক, তাঁর কোনো শরীক নেই। সকল সার্বভৌমত্ব ও প্রশংসা তাঁরই এবং তিনি সকল কিছুর উপর ক্ষমতাবান। (জুমআর দিনে আসর ও মাগরিবের মধ্যে পড়ুন — দু'আ কবুলের সময়)",
    },
    source: "Sahih Muslim 852, Abu Dawud 1046 — Hour of acceptance on Friday",
    category: "friday",
  },
  {
    id: "friday-kahf-first10",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَنْزَلَ عَلَىٰ عَبْدِهِ الْكِتَابَ وَلَمْ يَجْعَلْ لَهُ عِوَجًا ۜ قَيِّمًا لِيُنْذِرَ بَأْسًا شَدِيدًا مِنْ لَدُنْهُ وَيُبَشِّرَ الْمُؤْمِنِينَ الَّذِينَ يَعْمَلُونَ الصَّالِحَاتِ أَنَّ لَهُمْ أَجْرًا حَسَنًا",
    transliteration: "Alhamdu lillahil-ladhi anzala 'ala 'abdihil-Kitaba wa lam yaj'al lahu 'iwaja. Qayyimal-liyundhira ba'san shadeedam-min ladunhu wa yubashshiral-mu'mineenal-ladheena ya'maloonas-salihati anna lahum ajran hasana.",
    translation: "All praise is due to Allah, who has sent down upon His Servant the Book and has not made therein any deviance. [He has made it] straight, to warn of severe punishment from Him and to give good tidings to the believers who do righteous deeds that they will have a good reward. (First verses of Surah Al-Kahf — recite on Friday for light between two Fridays)",
    translations: {
      bn: "সকল প্রশংসা আল্লাহর যিনি তাঁর বান্দার উপর কিতাব অবতীর্ণ করেছেন এবং তাতে কোনো বক্রতা রাখেননি। সরল, যাতে তাঁর পক্ষ থেকে কঠিন শাস্তি সম্পর্কে সতর্ক করেন এবং মুমিনদের সুসংবাদ দেন যারা সৎকর্ম করে, তাদের জন্য রয়েছে উত্তম প্রতিদান। (সূরা কাহফের প্রথম আয়াত — জুমআর দিনে পাঠ করলে দুই জুমআর মধ্যে নূর থাকবে)",
    },
    source: "Quran 18:1-2 — Sahih al-Jami 6470",
    category: "friday",
  },
  {
    id: "friday-dua-forgiveness",
    arabic: "رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ",
    transliteration: "Rabbighfir li wa tub 'alayya innaka Antat-Tawwabur-Raheem.",
    translation: "My Lord, forgive me and accept my repentance. Indeed, You are the Acceptor of repentance, the Most Merciful. (Seek forgiveness abundantly on Friday)",
    translations: {
      bn: "হে আমার রব, আমাকে ক্ষমা করুন এবং আমার তওবা কবুল করুন। নিশ্চয়ই আপনি তওবা কবুলকারী, পরম দয়ালু। (জুমআর দিনে বেশি বেশি ইস্তিগফার করুন)",
    },
    source: "At-Tirmidhi 3434 — Recommended on Friday",
    category: "friday",
  },
  {
    id: "friday-surah-kahf-dua",
    arabic: "رَبَّنَا آتِنَا مِنْ لَدُنْكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا",
    transliteration: "Rabbana atina min ladunka rahmatan wa hayyi' lana min amrina rashada.",
    translation: "Our Lord, grant us from Yourself mercy and prepare for us from our affair right guidance. (Dua of the People of the Cave — Surah Al-Kahf 18:10)",
    translations: {
      bn: "হে আমাদের রব, আপনার পক্ষ থেকে আমাদের রহমত দান করুন এবং আমাদের কাজকর্মে সঠিক পথের ব্যবস্থা করুন। (আসহাবে কাহফের দু'আ — সূরা কাহফ ১৮:১০)",
    },
    source: "Quran 18:10 (Surah Al-Kahf — Dua of the People of the Cave)",
    category: "friday",
  },
  {
    id: "friday-surah-mulk-dua",
    arabic: "قُلْ هُوَ الرَّحْمَٰنُ آمَنَّا بِهِ وَعَلَيْهِ تَوَكَّلْنَا ۖ فَسَتَعْلَمُونَ مَنْ هُوَ فِي ضَلَالٍ مُبِينٍ",
    transliteration: "Qul Huwar-Rahmanu amanna bihi wa 'alayhi tawakkalna fasata'lamoona man huwa fi dalalim-mubeen.",
    translation: "Say, He is the Most Merciful; we have believed in Him, and upon Him we have relied. And you will come to know who is in clear error. (Surah Al-Mulk 67:29 — The surah that intercedes for its reciter)",
    translations: {
      bn: "বলুন, তিনি পরম দয়ালু, আমরা তাঁর প্রতি ঈমান এনেছি এবং তাঁরই উপর তাওয়াক্কুল করেছি। শীঘ্রই তোমরা জানতে পারবে কে সুস্পষ্ট ভ্রান্তিতে। (সূরা আল-মুলক ৬৭:২৯ — যে সূরা তার পাঠকারীর জন্য সুপারিশ করবে)",
    },
    source: "Quran 67:29 — At-Tirmidhi 2891 (Surah Al-Mulk intercedes)",
    category: "friday",
  },

  // ── Morning / Evening ──────────────────────────────────
  {
    id: "morning-1",
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration: "Asbahna wa asbahal-mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la shareeka lah, lahul-mulku wa lahul-hamdu wa huwa 'ala kulli shay'in qadeer.",
    translation: "We have reached the morning and at this very time the whole kingdom belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and praise, and He is over all things omnipotent.",
    translations: {
      bn: "আমরা সকালে উপনীত হয়েছি এবং এই সময়ে সমস্ত রাজত্ব আল্লাহর। সকল প্রশংসা আল্লাহর। আল্লাহ ছাড়া কোনো ইলাহ নেই, তিনি একক, তাঁর কোনো শরীক নেই। সকল সার্বভৌমত্ব ও প্রশংসা তাঁরই এবং তিনি সকল কিছুর উপর ক্ষমতাবান।",
    },
    source: "Abu Dawud 4:317",
    category: "morning-evening",
  },
  {
    id: "morning-2",
    arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ",
    transliteration: "Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namootu, wa ilaykan-nushoor.",
    translation: "O Allah, by Your leave we have reached the morning and by Your leave we have reached the evening, by Your leave we live and die, and unto You is our resurrection.",
    translations: {
      bn: "হে আল্লাহ, আপনার অনুগ্রহে আমরা সকালে উপনীত হয়েছি এবং আপনার অনুগ্রহে সন্ধ্যায় উপনীত হয়েছি, আপনার অনুগ্রহে আমরা জীবিত থাকি ও মৃত্যুবরণ করি, এবং আপনার কাছেই পুনরুত্থান।",
    },
    source: "At-Tirmidhi 5:466",
    category: "morning-evening",
  },
  {
    id: "morning-ayatul-kursi",
    arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    transliteration: "Allahu la ilaha illa Huwal-Hayyul-Qayyum. La ta'khudhuhu sinatun wa la nawm. Lahu ma fis-samawati wa ma fil-ard. Man dhal-ladhi yashfa'u 'indahu illa bi-idhnih. Ya'lamu ma bayna aydihim wa ma khalfahum. Wa la yuheetuna bi shay'im-min 'ilmihi illa bima sha'. Wasi'a kursiyyuhus-samawati wal-ard. Wa la ya'uduhu hifdhuhuma. Wa Huwal-'Aliyyul-'Adheem.",
    translation: "Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.",
    translations: {
      bn: "আল্লাহ — তিনি ছাড়া কোনো ইলাহ নেই, তিনি চিরঞ্জীব, সর্বসত্তার ধারক। তাঁকে তন্দ্রা বা নিদ্রা স্পর্শ করে না। আসমানসমূহে ও জমিনে যা কিছু আছে সব তাঁরই। কে আছে যে তাঁর অনুমতি ছাড়া তাঁর কাছে সুপারিশ করবে? তাদের সামনে ও পেছনে যা আছে তা তিনি জানেন। তাঁর জ্ঞানের কোনো কিছুকেই তারা পরিবেষ্টন করতে পারে না, তবে তিনি যতটুকু চান। তাঁর কুরসী আসমানসমূহ ও জমিনকে পরিব্যাপ্ত করে আছে এবং এগুলোর রক্ষণাবেক্ষণ তাঁকে ক্লান্ত করে না। তিনি সর্বোচ্চ, সর্বমহান।",
    },
    source: "Quran 2:255 (Ayatul Kursi)",
    category: "morning-evening",
  },
  {
    id: "evening-1",
    arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration: "Amsayna wa amsal-mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la shareeka lah, lahul-mulku wa lahul-hamdu wa huwa 'ala kulli shay'in qadeer.",
    translation: "We have reached the evening and at this very time the whole kingdom belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and praise, and He is over all things omnipotent.",
    translations: {
      bn: "আমরা সন্ধ্যায় উপনীত হয়েছি এবং এই সময়ে সমস্ত রাজত্ব আল্লাহর। সকল প্রশংসা আল্লাহর। আল্লাহ ছাড়া কোনো ইলাহ নেই, তিনি একক, তাঁর কোনো শরীক নেই। সকল সার্বভৌমত্ব ও প্রশংসা তাঁরই এবং তিনি সকল কিছুর উপর ক্ষমতাবান।",
    },
    source: "Abu Dawud 4:318",
    category: "morning-evening",
  },

  // ── Meals ──────────────────────────────────────────────
  {
    id: "before-eating",
    arabic: "بِسْمِ اللَّهِ",
    transliteration: "Bismillah.",
    translation: "In the name of Allah.",
    translations: {
      bn: "আল্লাহর নামে।",
    },
    source: "Abu Dawud 3:347, At-Tirmidhi 4:288",
    category: "meals",
  },
  {
    id: "forgot-bismillah",
    arabic: "بِسْمِ اللَّهِ فِي أَوَّلِهِ وَآخِرِهِ",
    transliteration: "Bismillahi fi awwalihi wa aakhirih.",
    translation: "In the name of Allah at the beginning and at the end of it.",
    translations: {
      bn: "আল্লাহর নামে এর শুরুতে এবং শেষে।",
    },
    source: "Abu Dawud 3:347, At-Tirmidhi 4:288",
    category: "meals",
  },
  {
    id: "after-eating",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَٰذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
    transliteration: "Alhamdu lillahil-ladhi at'amani hadha wa razaqaneehi min ghayri hawlin minni wa la quwwah.",
    translation: "All praise is for Allah who fed me this and provided it for me without any might or power from myself.",
    translations: {
      bn: "সকল প্রশংসা আল্লাহর যিনি আমাকে এই খাবার খাওয়ালেন এবং আমার কোনো শক্তি বা সামর্থ্য ছাড়াই আমাকে এটি দান করলেন।",
    },
    source: "Abu Dawud 4:42, At-Tirmidhi 5:507",
    category: "meals",
  },

  // ── Prayer ─────────────────────────────────────────────
  {
    id: "entering-masjid",
    arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    transliteration: "Allahumma-ftah li abwaba rahmatik.",
    translation: "O Allah, open the gates of Your mercy for me.",
    translations: {
      bn: "হে আল্লাহ, আমার জন্য আপনার রহমতের দরজাসমূহ খুলে দিন।",
    },
    source: "Muslim 1:494",
    category: "prayer",
  },
  {
    id: "leaving-masjid",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
    transliteration: "Allahumma inni as'aluka min fadlik.",
    translation: "O Allah, I ask You from Your favour.",
    translations: {
      bn: "হে আল্লাহ, আমি আপনার অনুগ্রহ প্রার্থনা করি।",
    },
    source: "Muslim 1:494",
    category: "prayer",
  },
  {
    id: "dua-qunoot",
    arabic: "اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ، وَعَافِنِي فِيمَنْ عَافَيْتَ، وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ، وَبَارِكْ لِي فِيمَا أَعْطَيْتَ، وَقِنِي شَرَّ مَا قَضَيْتَ، فَإِنَّكَ تَقْضِي وَلَا يُقْضَىٰ عَلَيْكَ، إِنَّهُ لَا يَذِلُّ مَنْ وَالَيْتَ، وَلَا يَعِزُّ مَنْ عَادَيْتَ، تَبَارَكْتَ رَبَّنَا وَتَعَالَيْتَ",
    transliteration: "Allahumma-hdini feeman hadayt, wa 'afini feeman 'afayt, wa tawallani feeman tawallayt, wa barik li feema a'tayt, wa qini sharra ma qadayt, fa innaka taqdi wa la yuqda 'alayk, innahu la yadhillu man walayt, wa la ya'izzu man 'adayt, tabarakta Rabbana wa ta'alayt.",
    translation: "O Allah, guide me among those You have guided, pardon me among those You have pardoned, turn to me in friendship among those on whom You have turned in friendship, and bless me in what You have bestowed, and save me from the evil of what You have decreed. For verily You decree and none can influence You; and he is not humiliated whom You have befriended. Blessed are You, our Lord, and Exalted.",
    translations: {
      bn: "হে আল্লাহ, আপনি যাদের হিদায়াত দিয়েছেন তাদের মধ্যে আমাকেও হিদায়াত দিন, যাদের ক্ষমা করেছেন তাদের মধ্যে আমাকেও ক্ষমা করুন, যাদের অভিভাবকত্ব নিয়েছেন তাদের মধ্যে আমারও অভিভাবকত্ব নিন, আপনি যা দান করেছেন তাতে বরকত দিন এবং আপনি যা নির্ধারণ করেছেন তার অনিষ্ট থেকে আমাকে রক্ষা করুন। নিশ্চয়ই আপনি ফায়সালা করেন, আপনার উপর কেউ ফায়সালা করতে পারে না; আপনি যাকে বন্ধু বানান সে অপমানিত হয় না। আপনি বরকতময়, হে আমাদের রব, এবং সুমহান।",
    },
    source: "Abu Dawud 2:65, At-Tirmidhi 2:328",
    category: "prayer",
  },
  {
    id: "after-adhan",
    arabic: "اللَّهُمَّ رَبَّ هَٰذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ",
    transliteration: "Allahumma Rabba hadhihid-da'watit-tammah, was-salatil-qa'imah, ati Muhammadanil-waseelata wal-fadeelah, wab'ath-hu maqamam-mahmoodanil-ladhi wa'adtah.",
    translation: "O Allah, Lord of this perfect call and established prayer, grant Muhammad the intercession and favor, and raise him to the honored station You have promised him.",
    translations: {
      bn: "হে আল্লাহ, এই পরিপূর্ণ আহ্বান ও প্রতিষ্ঠিত নামাযের প্রভু, মুহাম্মাদকে ওয়াসীলা ও ফযীলত দান করুন এবং তাঁকে সেই প্রশংসিত মাকামে উন্নীত করুন যার প্রতিশ্রুতি আপনি তাঁকে দিয়েছেন।",
    },
    source: "Al-Bukhari 1:152",
    category: "prayer",
  },

  // ── Travel ─────────────────────────────────────────────
  {
    id: "travel-1",
    arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنْقَلِبُونَ",
    transliteration: "Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrineen. Wa inna ila Rabbina lamunqaliboon.",
    translation: "Glory be to Him who has subjected this to us, and we could never have it (by our efforts). And verily, to our Lord we shall return.",
    translations: {
      bn: "পবিত্র তিনি যিনি এটিকে আমাদের বশীভূত করে দিয়েছেন, অথচ আমরা এটিকে বশীভূত করতে সক্ষম ছিলাম না। এবং নিশ্চয়ই আমরা আমাদের রবের কাছেই ফিরে যাব।",
    },
    source: "Quran 43:13-14",
    category: "travel",
  },
  {
    id: "travel-2",
    arabic: "اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَٰذَا الْبِرَّ وَالتَّقْوَىٰ، وَمِنَ الْعَمَلِ مَا تَرْضَىٰ، اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَٰذَا وَاطْوِ عَنَّا بُعْدَهُ",
    transliteration: "Allahumma inna nas'aluka fi safarina hadhal-birra wat-taqwa, wa minal-'amali ma tarda. Allahumma hawwin 'alayna safarana hadha watwi 'anna bu'dah.",
    translation: "O Allah, we ask You for righteousness and piety in this journey of ours, and we ask You for deeds which please You. O Allah, make this journey of ours easy and shorten for us its distance.",
    translations: {
      bn: "হে আল্লাহ, আমরা আমাদের এই সফরে আপনার কাছে নেকী ও তাকওয়া প্রার্থনা করি এবং এমন আমল চাই যা আপনাকে সন্তুষ্ট করে। হে আল্লাহ, আমাদের এই সফরকে সহজ করে দিন এবং এর দূরত্ব সংক্ষিপ্ত করে দিন।",
    },
    source: "Muslim 2:978",
    category: "travel",
  },
  {
    id: "entering-home",
    arabic: "بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَىٰ رَبِّنَا تَوَكَّلْنَا",
    transliteration: "Bismillahi walajna, wa bismillahi kharajna, wa 'ala Rabbina tawakkalna.",
    translation: "In the name of Allah we enter, and in the name of Allah we leave, and upon our Lord we place our trust.",
    translations: {
      bn: "আল্লাহর নামে আমরা প্রবেশ করি, আল্লাহর নামে আমরা বের হই এবং আমাদের রবের উপর আমরা তাওয়াক্কুল করি।",
    },
    source: "Abu Dawud 4:325",
    category: "travel",
  },
  {
    id: "leaving-home",
    arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    transliteration: "Bismillah, tawakkaltu 'alallah, wa la hawla wa la quwwata illa billah.",
    translation: "In the name of Allah, I place my trust in Allah, and there is no might nor power except with Allah.",
    translations: {
      bn: "আল্লাহর নামে, আমি আল্লাহর উপর ভরসা করি, এবং আল্লাহর সাহায্য ছাড়া কোনো শক্তি বা সামর্থ্য নেই।",
    },
    source: "Abu Dawud 4:325, At-Tirmidhi 5:490",
    category: "travel",
  },

  // ── Protection ─────────────────────────────────────────
  {
    id: "protection-evil-eye",
    arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    transliteration: "A'udhu bikalimatil-lahit-tammati min sharri ma khalaq.",
    translation: "I seek refuge in the perfect words of Allah from the evil of what He has created.",
    translations: {
      bn: "আমি আল্লাহর পরিপূর্ণ কালামসমূহের মাধ্যমে তাঁর সৃষ্টির অনিষ্ট থেকে আশ্রয় চাই।",
    },
    source: "Muslim 4:2080",
    category: "protection",
  },
  {
    id: "protection-anxiety",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ",
    transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazan, wa a'udhu bika minal-'ajzi wal-kasal, wa a'udhu bika minal-jubni wal-bukhl, wa a'udhu bika min ghalabatid-dayni wa qahrir-rijal.",
    translation: "O Allah, I seek refuge in You from anxiety and sorrow, weakness and laziness, miserliness and cowardice, the burden of debts and from being overpowered by men.",
    translations: {
      bn: "হে আল্লাহ, আমি আপনার কাছে দুশ্চিন্তা ও দুঃখ থেকে, অক্ষমতা ও অলসতা থেকে, কৃপণতা ও ভীরুতা থেকে, ঋণের বোঝা ও মানুষের দমন-পীড়ন থেকে আশ্রয় চাই।",
    },
    source: "Al-Bukhari 7:158",
    category: "protection",
  },
  {
    id: "protection-sleep",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    transliteration: "Bismika Allahumma amootu wa ahya.",
    translation: "In Your name, O Allah, I die and I live.",
    translations: {
      bn: "হে আল্লাহ, আপনার নামে আমি মৃত্যুবরণ করি এবং জীবিত হই।",
    },
    source: "Al-Bukhari 11:113",
    category: "protection",
  },
  {
    id: "waking-up",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    transliteration: "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushoor.",
    translation: "All praise is for Allah who gave us life after having taken it from us, and unto Him is the resurrection.",
    translations: {
      bn: "সকল প্রশংসা আল্লাহর যিনি আমাদের মৃত্যুর পর পুনরায় জীবিত করেছেন এবং তাঁর কাছেই পুনরুত্থান।",
    },
    source: "Al-Bukhari 11:113",
    category: "protection",
  },
  {
    id: "protection-surat-ikhlas",
    arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
    transliteration: "Qul huwa Allahu ahad. Allahus-samad. Lam yalid wa lam yoolad. Wa lam yakun lahu kufuwan ahad.",
    translation: "Say, He is Allah, [who is] One. Allah, the Eternal Refuge. He neither begets nor is born. Nor is there to Him any equivalent.",
    translations: {
      bn: "বলুন, তিনি আল্লাহ, এক-অদ্বিতীয়। আল্লাহ অমুখাপেক্ষী। তিনি কাউকে জন্ম দেননি এবং কেউ তাঁকে জন্ম দেয়নি। এবং তাঁর সমতুল্য কেউ নেই।",
    },
    source: "Quran 112:1-4 (Surah Al-Ikhlas)",
    category: "protection",
  },
  {
    id: "protection-surat-falaq",
    arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِنْ شَرِّ مَا خَلَقَ ۝ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ",
    transliteration: "Qul a'udhu bi Rabbil-falaq. Min sharri ma khalaq. Wa min sharri ghasiqin idha waqab. Wa min sharrin-naffathati fil-'uqad. Wa min sharri hasidin idha hasad.",
    translation: "Say, I seek refuge in the Lord of daybreak. From the evil of that which He created. And from the evil of darkness when it settles. And from the evil of the blowers in knots. And from the evil of an envier when he envies.",
    translations: {
      bn: "বলুন, আমি ঊষার রবের আশ্রয় চাই। তিনি যা সৃষ্টি করেছেন তার অনিষ্ট থেকে। অন্ধকার রাতের অনিষ্ট থেকে যখন তা গভীর হয়। গিরায় ফুঁকদানকারিণীদের অনিষ্ট থেকে। এবং হিংসুকের অনিষ্ট থেকে যখন সে হিংসা করে।",
    },
    source: "Quran 113:1-5 (Surah Al-Falaq)",
    category: "protection",
  },

  // ── Daily Life ────────────────────────────────────────
  {
    id: "daily-entering-bathroom",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
    transliteration: "Allahumma inni a'udhu bika minal-khubuthi wal-khaba'ith.",
    translation: "O Allah, I seek refuge in You from evil male and female jinn.",
    translations: {
      bn: "হে আল্লাহ, আমি আপনার কাছে পুরুষ ও নারী জিন থেকে আশ্রয় চাই।",
    },
    source: "Al-Bukhari 1:142, Muslim 1:375",
    category: "daily-life",
  },
  {
    id: "daily-leaving-bathroom",
    arabic: "غُفْرَانَكَ",
    transliteration: "Ghufranaka.",
    translation: "I seek Your forgiveness.",
    translations: {
      bn: "আমি আপনার ক্ষমা চাই।",
    },
    source: "Abu Dawud 1:30, At-Tirmidhi 1:5",
    category: "daily-life",
  },
  {
    id: "daily-looking-mirror",
    arabic: "اللَّهُمَّ أَنْتَ حَسَّنْتَ خَلْقِي فَحَسِّنْ خُلُقِي",
    transliteration: "Allahumma Anta hassanta khalqi fahassin khuluqi.",
    translation: "O Allah, as You have made my outward form beautiful, make my character beautiful too.",
    translations: {
      bn: "হে আল্লাহ, আপনি আমার আকৃতি সুন্দর করেছেন, তাই আমার চরিত্রও সুন্দর করে দিন।",
    },
    source: "Ahmad 1:403, Ibn Hibban",
    category: "daily-life",
  },
  {
    id: "daily-wearing-new-clothes",
    arabic: "اللَّهُمَّ لَكَ الْحَمْدُ أَنْتَ كَسَوْتَنِيهِ، أَسْأَلُكَ مِنْ خَيْرِهِ وَخَيْرِ مَا صُنِعَ لَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّهِ وَشَرِّ مَا صُنِعَ لَهُ",
    transliteration: "Allahumma lakal-hamdu Anta kasawtaneehi, as'aluka min khayrihi wa khayri ma suni'a lah, wa a'udhu bika min sharrihi wa sharri ma suni'a lah.",
    translation: "O Allah, all praise is for You. You have clothed me with it. I ask You for its good and the good for which it was made, and I seek refuge from its evil and the evil for which it was made.",
    translations: {
      bn: "হে আল্লাহ, সকল প্রশংসা আপনার। আপনি আমাকে এটি পরিধান করিয়েছেন। আমি এর কল্যাণ ও যে কল্যাণের জন্য এটি তৈরি হয়েছে তা চাই, এবং এর অনিষ্ট ও যে অনিষ্টের জন্য এটি তৈরি হয়েছে তা থেকে আশ্রয় চাই।",
    },
    source: "Abu Dawud 4:41, At-Tirmidhi 4:280",
    category: "daily-life",
  },
  {
    id: "daily-when-it-rains",
    arabic: "اللَّهُمَّ صَيِّبًا نَافِعًا",
    transliteration: "Allahumma sayyiban nafi'a.",
    translation: "O Allah, let it be a beneficial rain.",
    translations: {
      bn: "হে আল্লাহ, এটিকে উপকারী বৃষ্টি বানান।",
    },
    source: "Al-Bukhari 2:32",
    category: "daily-life",
  },
  {
    id: "daily-after-sneezing",
    arabic: "الْحَمْدُ لِلَّهِ",
    transliteration: "Alhamdulillah.",
    translation: "All praise is for Allah.",
    translations: {
      bn: "সকল প্রশংসা আল্লাহর।",
    },
    source: "Al-Bukhari 7:125",
    category: "daily-life",
  },
  {
    id: "daily-reply-to-sneezer",
    arabic: "يَرْحَمُكَ اللَّهُ",
    transliteration: "Yarhamukallah.",
    translation: "May Allah have mercy on you.",
    translations: {
      bn: "আল্লাহ আপনার উপর রহম করুন।",
    },
    source: "Al-Bukhari 7:125",
    category: "daily-life",
  },
  {
    id: "daily-when-angry",
    arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
    transliteration: "A'udhu billahi minash-shaytanir-rajeem.",
    translation: "I seek refuge in Allah from the accursed Satan.",
    translations: {
      bn: "আমি বিতাড়িত শয়তান থেকে আল্লাহর আশ্রয় চাই।",
    },
    source: "Al-Bukhari 7:99, Muslim 4:2015",
    category: "daily-life",
  },
  {
    id: "daily-in-distress",
    arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَٰهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَٰهَ إِلَّا اللَّهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ",
    transliteration: "La ilaha illallahul-'Adheemul-Haleem. La ilaha illallahu Rabbul-'Arshil-'Adheem. La ilaha illallahu Rabbus-samawati wa Rabbul-ardi wa Rabbul-'Arshil-Kareem.",
    translation: "None has the right to be worshipped except Allah, the Mighty, the Forbearing. None has the right to be worshipped except Allah, Lord of the Magnificent Throne. None has the right to be worshipped except Allah, Lord of the heavens, Lord of the earth, and Lord of the Noble Throne.",
    translations: {
      bn: "আল্লাহ ছাড়া কোনো ইলাহ নেই, তিনি মহান ও সহনশীল। আল্লাহ ছাড়া কোনো ইলাহ নেই, তিনি মহান আরশের রব। আল্লাহ ছাড়া কোনো ইলাহ নেই, তিনি আসমানসমূহের রব, জমিনের রব এবং সম্মানিত আরশের রব।",
    },
    source: "Al-Bukhari 8:154, Muslim 4:2092",
    category: "daily-life",
  },
  {
    id: "daily-before-drinking-water",
    arabic: "بِسْمِ اللَّهِ",
    transliteration: "Bismillah.",
    translation: "In the name of Allah.",
    translations: {
      bn: "আল্লাহর নামে।",
    },
    source: "Muslim 3:1599",
    category: "daily-life",
  },
  {
    id: "daily-after-drinking-water",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي سَقَانَا عَذْبًا فُرَاتًا بِرَحْمَتِهِ وَلَمْ يَجْعَلْهُ مِلْحًا أُجَاجًا بِذُنُوبِنَا",
    transliteration: "Alhamdu lillahil-ladhi saqana 'adhban furatan birahmatihi wa lam yaj'alhu milhan ujajan bidhunubina.",
    translation: "All praise is for Allah who gave us sweet and fresh water to drink by His mercy and did not make it salty and bitter due to our sins.",
    translations: {
      bn: "সকল প্রশংসা আল্লাহর যিনি তাঁর রহমতে আমাদের মিষ্টি ও সুপেয় পানি পান করিয়েছেন এবং আমাদের গুনাহর কারণে তা লবণাক্ত ও তিক্ত করেননি।",
    },
    source: "Tabarani",
    category: "daily-life",
  },
  {
    id: "daily-entering-market",
    arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ حَيٌّ لَا يَمُوتُ بِيَدِهِ الْخَيْرُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration: "La ilaha illallahu wahdahu la shareeka lah, lahul-mulku wa lahul-hamdu, yuhyi wa yumeetu, wa Huwa Hayyun la yamootu, biyadihil-khayr, wa Huwa 'ala kulli shay'in Qadeer.",
    translation: "None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and praise. He gives life and causes death, and He is living and does not die. In His hand is all good, and He is over all things omnipotent.",
    translations: {
      bn: "আল্লাহ ছাড়া কোনো ইলাহ নেই, তিনি একক, তাঁর কোনো শরীক নেই। সকল সার্বভৌমত্ব ও প্রশংসা তাঁরই। তিনি জীবন দেন ও মৃত্যু দেন এবং তিনি চিরঞ্জীব, মৃত্যুহীন। তাঁর হাতেই সকল কল্যাণ এবং তিনি সকল কিছুর উপর ক্ষমতাবান।",
    },
    source: "At-Tirmidhi 5:291, Ibn Majah 2:752",
    category: "daily-life",
  },
  {
    id: "daily-before-sleeping",
    arabic: "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ",
    transliteration: "Bismika Rabbi wada'tu janbi, wa bika arfa'uh. Fa in amsakta nafsi farhamha, wa in arsaltaha fahfadhha bima tahfadhu bihi 'ibadakas-saliheen.",
    translation: "In Your name my Lord, I lie down and in Your name I rise, so if You should take my soul then have mercy upon it, and if You should return it then protect it in the manner You protect Your righteous servants.",
    translations: {
      bn: "হে আমার রব, আপনার নামে আমি শুয়ে পড়লাম এবং আপনার নামেই উঠব। যদি আপনি আমার প্রাণ নিয়ে নেন তবে তার প্রতি দয়া করুন, আর যদি ফিরিয়ে দেন তবে তাকে সেভাবে রক্ষা করুন যেভাবে আপনি আপনার নেককার বান্দাদের রক্ষা করেন।",
    },
    source: "Al-Bukhari 11:126, Muslim 4:2083",
    category: "daily-life",
  },

  // ── Health & Healing ─────────────────────────────────
  {
    id: "health-visiting-sick",
    arabic: "أَسْأَلُ اللَّهَ الْعَظِيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفِيَكَ",
    transliteration: "As'alullaha al-'Adheema Rabbal-'Arshil-'Adheemi an yashfiyak.",
    translation: "I ask Allah the Mighty, the Lord of the Magnificent Throne, to cure you. (Recite 7 times)",
    translations: {
      bn: "আমি মহান আল্লাহর কাছে, মহান আরশের রবের কাছে প্রার্থনা করি যেন তিনি আপনাকে সুস্থ করেন। (৭ বার পড়ুন)",
    },
    source: "Abu Dawud 3:187, At-Tirmidhi",
    category: "health",
  },
  {
    id: "health-dua-for-cure",
    arabic: "اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَأْسَ، اشْفِهِ وَأَنْتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا",
    transliteration: "Allahumma Rabban-nas, adhhibil-ba's, ishfihi wa Antash-Shafi, la shifa'a illa shifa'uk, shifa'an la yughadiru saqama.",
    translation: "O Allah, Lord of mankind, remove the affliction. Cure him, for You are the One who cures. There is no cure except Your cure — a cure that leaves no illness behind.",
    translations: {
      bn: "হে আল্লাহ, মানবজাতির রব, কষ্ট দূর করুন। তাকে সুস্থ করুন, কেননা আপনিই আরোগ্যদানকারী। আপনার আরোগ্য ছাড়া কোনো আরোগ্য নেই — এমন আরোগ্য যা কোনো রোগ অবশিষ্ট রাখে না।",
    },
    source: "Al-Bukhari 7:131, Muslim 4:1721",
    category: "health",
  },
  {
    id: "health-dua-for-pain",
    arabic: "أَعُوذُ بِعِزَّةِ اللَّهِ وَقُدْرَتِهِ مِنْ شَرِّ مَا أَجِدُ وَأُحَاذِرُ",
    transliteration: "A'udhu bi'izzatillahi wa qudratihi min sharri ma ajidu wa uhadhir.",
    translation: "I seek refuge in the might and power of Allah from the evil of what I feel and fear. (Place hand on area of pain and recite 7 times)",
    translations: {
      bn: "আমি আল্লাহর ইজ্জত ও কুদরতের আশ্রয় চাই, আমি যা অনুভব করছি ও যা আশঙ্কা করছি তার অনিষ্ট থেকে। (ব্যথার স্থানে হাত রেখে ৭ বার পড়ুন)",
    },
    source: "Muslim 4:1728",
    category: "health",
  },
  {
    id: "health-ruqyah",
    arabic: "بِسْمِ اللَّهِ أَرْقِيكَ، مِنْ كُلِّ شَيْءٍ يُؤْذِيكَ، مِنْ شَرِّ كُلِّ نَفْسٍ أَوْ عَيْنِ حَاسِدٍ اللَّهُ يَشْفِيكَ، بِسْمِ اللَّهِ أَرْقِيكَ",
    transliteration: "Bismillahi arqeek, min kulli shay'in yu'dheek, min sharri kulli nafsin aw 'ayni hasidin Allahu yashfeek, bismillahi arqeek.",
    translation: "In the name of Allah I perform ruqyah for you, from everything that is harming you, from the evil of every soul or envious eye. May Allah heal you, in the name of Allah I perform ruqyah for you.",
    translations: {
      bn: "আল্লাহর নামে আমি আপনার জন্য ঝাড়ফুঁক করছি, সব কিছু থেকে যা আপনাকে কষ্ট দিচ্ছে, প্রতিটি আত্মা বা হিংসুকের চোখের অনিষ্ট থেকে। আল্লাহ আপনাকে সুস্থ করুন, আল্লাহর নামে আমি আপনার জন্য ঝাড়ফুঁক করছি।",
    },
    source: "Muslim 4:1718",
    category: "health",
  },
  {
    id: "health-general-wellbeing",
    arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَٰهَ إِلَّا أَنْتَ",
    transliteration: "Allahumma 'afini fi badani, Allahumma 'afini fi sam'i, Allahumma 'afini fi basari, la ilaha illa Anta.",
    translation: "O Allah, grant me health in my body. O Allah, grant me health in my hearing. O Allah, grant me health in my sight. None has the right to be worshipped but You. (Recite 3 times)",
    translations: {
      bn: "হে আল্লাহ, আমার শরীরে সুস্থতা দান করুন। হে আল্লাহ, আমার শ্রবণশক্তিতে সুস্থতা দান করুন। হে আল্লাহ, আমার দৃষ্টিশক্তিতে সুস্থতা দান করুন। আপনি ছাড়া কোনো ইলাহ নেই। (৩ বার পড়ুন)",
    },
    source: "Abu Dawud 4:324",
    category: "health",
  },
  {
    id: "health-patience-illness",
    arabic: "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ، اللَّهُمَّ أْجُرْنِي فِي مُصِيبَتِي وَأَخْلِفْ لِي خَيْرًا مِنْهَا",
    transliteration: "Inna lillahi wa inna ilayhi raji'oon. Allahumma-jurni fi museebati wa akhlif li khayran minha.",
    translation: "To Allah we belong and to Him we shall return. O Allah, reward me in my affliction and replace it for me with something better.",
    translations: {
      bn: "নিশ্চয়ই আমরা আল্লাহর এবং তাঁর কাছেই ফিরে যাব। হে আল্লাহ, আমার বিপদে আমাকে সওয়াব দান করুন এবং এর বিনিময়ে আমাকে এর চেয়ে উত্তম কিছু দান করুন।",
    },
    source: "Muslim 2:632",
    category: "health",
  },

  // ── Forgiveness ────────────────────────────────────────
  {
    id: "sayyidul-istighfar",
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
    transliteration: "Allahumma Anta Rabbi la ilaha illa Anta, khalaqtani wa ana 'abduka, wa ana 'ala 'ahdika wa wa'dika mastata'tu, a'udhu bika min sharri ma sana'tu, abu'u laka bi ni'matika 'alayya, wa abu'u laka bidhanbi faghfir li fa innahu la yaghfirudh-dhunuba illa Anta.",
    translation: "O Allah, You are my Lord, none has the right to be worshipped except You, You created me and I am Your servant and I abide to Your covenant and promise as best I can, I take refuge in You from the evil of what I have done. I acknowledge Your favour upon me and I acknowledge my sin, so forgive me, for verily none can forgive sins except You.",
    translations: {
      bn: "হে আল্লাহ, আপনি আমার রব, আপনি ছাড়া কোনো ইলাহ নেই, আপনি আমাকে সৃষ্টি করেছেন এবং আমি আপনার বান্দা, আমি যথাসাধ্য আপনার অঙ্গীকার ও প্রতিশ্রুতির উপর আছি, আমি আমার কৃতকর্মের অনিষ্ট থেকে আপনার আশ্রয় চাই। আমি আমার উপর আপনার নিয়ামতের স্বীকৃতি দিচ্ছি এবং আমার গুনাহের স্বীকৃতি দিচ্ছি, তাই আমাকে ক্ষমা করুন, কেননা আপনি ছাড়া কেউ গুনাহ ক্ষমা করতে পারে না।",
    },
    source: "Al-Bukhari 7:150 (Sayyidul Istighfar)",
    category: "forgiveness",
  },
  {
    id: "forgiveness-simple",
    arabic: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْحَيَّ الْقَيُّومَ وَأَتُوبُ إِلَيْهِ",
    transliteration: "Astaghfirullaha al-'Adheemal-ladhi la ilaha illa Huwal-Hayyul-Qayyumu wa atubu ilayh.",
    translation: "I seek the forgiveness of Allah the Mighty, whom there is none worthy of worship except Him, the Living, the Sustainer, and I turn to Him in repentance.",
    translations: {
      bn: "আমি মহান আল্লাহর কাছে ক্ষমা চাই, যিনি ছাড়া কোনো ইলাহ নেই, তিনি চিরঞ্জীব, সর্বসত্তার ধারক, এবং আমি তাঁর কাছে তওবা করি।",
    },
    source: "Abu Dawud 2:85, At-Tirmidhi 5:569",
    category: "forgiveness",
  },
  {
    id: "forgiveness-parents",
    arabic: "رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ",
    transliteration: "Rabbighfir li wa liwalidayya wa lil-mu'mineena yawma yaqumul-hisab.",
    translation: "Our Lord, forgive me and my parents and the believers the Day the account is established.",
    translations: {
      bn: "হে আমাদের রব, আমাকে, আমার পিতা-মাতাকে এবং সকল মুমিনকে ক্ষমা করুন যেদিন হিসাব প্রতিষ্ঠিত হবে।",
    },
    source: "Quran 14:41",
    category: "forgiveness",
  },

  // ── Gratitude ──────────────────────────────────────────
  {
    id: "gratitude-general",
    arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    transliteration: "Alhamdu lillahi Rabbil-'aalameen.",
    translation: "All praise is due to Allah, Lord of all the worlds.",
    translations: {
      bn: "সকল প্রশংসা আল্লাহর, যিনি সমগ্র বিশ্বজগতের প্রতিপালক।",
    },
    source: "Quran 1:2",
    category: "gratitude",
  },
  {
    id: "gratitude-blessing",
    arabic: "اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ",
    transliteration: "Allahumma ma asbaha bi min ni'matin aw bi-ahadin min khalqika faminka wahdaka la shareeka lak, falakal-hamdu wa lakash-shukr.",
    translation: "O Allah, what blessing I or any of Your creation have risen upon, is from You alone, without partner. So for You is all praise and unto You all thanks.",
    translations: {
      bn: "হে আল্লাহ, আমার বা আপনার কোনো সৃষ্টির কাছে যে নিয়ামতই সকালে এসেছে তা কেবল আপনার পক্ষ থেকে, আপনার কোনো শরীক নেই। সুতরাং সকল প্রশংসা আপনারই এবং সকল শুকরিয়া আপনারই।",
    },
    source: "Abu Dawud 4:318",
    category: "gratitude",
  },

  // ── General ────────────────────────────────────────────
  {
    id: "istikhara",
    arabic: "اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلَا أَقْدِرُ، وَتَعْلَمُ وَلَا أَعْلَمُ، وَأَنْتَ عَلَّامُ الْغُيُوبِ",
    transliteration: "Allahumma inni astakhiruka bi'ilmik, wa astaqdiruka biqudratik, wa as'aluka min fadlikal-'adheem, fa innaka taqdiru wa la aqdir, wa ta'lamu wa la a'lam, wa Anta 'allamul-ghuyub.",
    translation: "O Allah, I seek Your guidance by virtue of Your knowledge, and I seek ability by virtue of Your power, and I ask You of Your great bounty. You have power; I have none. And You know; I know not. You are the Knower of hidden things.",
    translations: {
      bn: "হে আল্লাহ, আমি আপনার জ্ঞানের মাধ্যমে আপনার কাছে কল্যাণ চাই, আপনার কুদরতের মাধ্যমে আপনার কাছে শক্তি চাই এবং আপনার মহান অনুগ্রহ চাই। আপনি সক্ষম, আমি সক্ষম নই। আপনি জানেন, আমি জানি না। আপনি গায়েবের সকল বিষয় জানেন।",
    },
    source: "Al-Bukhari 7:162 (Istikhara)",
    category: "general",
  },
  {
    id: "dua-parents",
    arabic: "رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
    transliteration: "Rabbir-hamhuma kama rabbayani sagheera.",
    translation: "My Lord, have mercy upon them as they brought me up when I was small.",
    translations: {
      bn: "হে আমার রব, তাদের প্রতি দয়া করুন যেমন তারা আমাকে ছোটকালে লালন-পালন করেছেন।",
    },
    source: "Quran 17:24",
    category: "general",
  },
  {
    id: "dua-knowledge",
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    transliteration: "Rabbi zidni 'ilma.",
    translation: "My Lord, increase me in knowledge.",
    translations: {
      bn: "হে আমার রব, আমার জ্ঞান বৃদ্ধি করে দিন।",
    },
    source: "Quran 20:114",
    category: "general",
  },
  {
    id: "dua-steadfastness",
    arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً ۚ إِنَّكَ أَنْتَ الْوَهَّابُ",
    transliteration: "Rabbana la tuzigh quloobana ba'da idh hadaytana wa hab lana min ladunka rahmah. Innaka Antal-Wahhab.",
    translation: "Our Lord, let not our hearts deviate after You have guided us and grant us from Yourself mercy. Indeed, You are the Bestower.",
    translations: {
      bn: "হে আমাদের রব, আমাদের হিদায়াত দেওয়ার পর আমাদের অন্তরকে বিপথগামী করবেন না এবং আপনার পক্ষ থেকে আমাদের রহমত দান করুন। নিশ্চয়ই আপনি মহাদাতা।",
    },
    source: "Quran 3:8",
    category: "general",
  },
  {
    id: "dua-dunya-akhira",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    transliteration: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar.",
    translation: "Our Lord, give us in this world that which is good and in the Hereafter that which is good and protect us from the punishment of the Fire.",
    translations: {
      bn: "হে আমাদের রব, আমাদের দুনিয়াতে কল্যাণ দিন, আখিরাতেও কল্যাণ দিন এবং আমাদের জাহান্নামের আযাব থেকে রক্ষা করুন।",
    },
    source: "Quran 2:201",
    category: "general",
  },
  {
    id: "la-hawla",
    arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    transliteration: "La hawla wa la quwwata illa billah.",
    translation: "There is no power nor strength except with Allah.",
    translations: {
      bn: "আল্লাহর সাহায্য ছাড়া কোনো শক্তি বা সামর্থ্য নেই।",
    },
    source: "Al-Bukhari 11:213, Muslim 4:2076",
    category: "general",
  },
];
