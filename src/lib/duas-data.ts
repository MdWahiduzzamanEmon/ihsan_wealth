export type DuaCategory =
  | "morning-evening"
  | "meals"
  | "prayer"
  | "travel"
  | "protection"
  | "forgiveness"
  | "gratitude"
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
  { id: "morning-evening", label: "Morning / Evening", labelAr: "الصباح والمساء", emoji: "🌅" },
  { id: "meals", label: "Meals", labelAr: "الطعام", emoji: "🍽" },
  { id: "prayer", label: "Prayer", labelAr: "الصلاة", emoji: "🕌" },
  { id: "travel", label: "Travel", labelAr: "السفر", emoji: "✈" },
  { id: "protection", label: "Protection", labelAr: "الحماية", emoji: "🛡" },
  { id: "forgiveness", label: "Forgiveness", labelAr: "المغفرة", emoji: "🤲" },
  { id: "gratitude", label: "Gratitude", labelAr: "الشكر", emoji: "💚" },
  { id: "general", label: "General", labelAr: "عامة", emoji: "📿" },
];

export const DUAS: Dua[] = [
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
