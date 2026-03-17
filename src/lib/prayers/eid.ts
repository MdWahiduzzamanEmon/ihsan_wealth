import type { TransLang } from "@/lib/islamic-content";
import type { PrayerInfo } from "@/lib/how-to-pray-data";

export const EID_PRAYER: PrayerInfo = {
  id: "eid",
  name: { en: "Eid Prayer", bn: "ঈদের নামাজ", ur: "عید کی نماز", ar: "صلاة العيد", tr: "Bayram Namazı", ms: "Solat Hari Raya", id: "Shalat Ied" },
  arabicName: "صلاة العيد",
  type: "wajib",
  category: "special",
  totalRakats: "2",
  rakatBreakdown: { en: "2 Wajib with extra Takbirs", bn: "২ ওয়াজিব অতিরিক্ত তাকবীর সহ", ur: "۲ واجب اضافی تکبیرات کے ساتھ", ar: "٢ واجبة مع تكبيرات زائدة", tr: "2 Vacip ekstra tekbirlerle", ms: "2 Wajib dengan takbir tambahan", id: "2 Wajib dengan takbir tambahan" },
  time: { en: "After sunrise (about 15–20 minutes after sunrise) on Eid day", bn: "ঈদের দিন সূর্যোদয়ের পর (সূর্যোদয়ের প্রায় ১৫–২০ মিনিট পর)", ur: "عید کے دن طلوع آفتاب کے بعد (طلوع آفتاب کے تقریباً ۱۵–۲۰ منٹ بعد)", ar: "بعد شروق الشمس (بحوالي ١٥–٢٠ دقيقة بعد الشروق) يوم العيد", tr: "Bayram günü güneş doğduktan sonra (yaklaşık 15–20 dakika sonra)", ms: "Selepas matahari terbit (kira-kira 15–20 minit selepas terbit) pada hari Raya", id: "Setelah matahari terbit (sekitar 15–20 menit setelah terbit) pada hari Ied" },
  description: { en: "Eid prayer consists of 2 rakats with extra Takbirs, followed by a Khutbah (sermon). It is performed in congregation on the mornings of Eid al-Fitr and Eid al-Adha.", bn: "ঈদের নামাজ ২ রাকাত অতিরিক্ত তাকবীর সহ, এরপর খুতবাহ (ভাষণ)। এটি ঈদুল ফিতর ও ঈদুল আযহার সকালে জামাতে আদায় করা হয়।", ur: "عید کی نماز ۲ رکعت اضافی تکبیرات کے ساتھ ہوتی ہے، اس کے بعد خطبہ ہوتا ہے۔ یہ عید الفطر اور عید الاضحی کی صبح جماعت سے ادا کی جاتی ہے۔", ar: "صلاة العيد ركعتان مع تكبيرات زائدة، تليها خطبة. تؤدى جماعةً صباح عيد الفطر وعيد الأضحى.", tr: "Bayram namazı ekstra tekbirlerle 2 rekattır, ardından hutbe okunur. Ramazan Bayramı ve Kurban Bayramı sabahlarında cemaatle kılınır.", ms: "Solat Hari Raya terdiri daripada 2 rakaat dengan takbir tambahan, diikuti Khutbah. Ia dilakukan secara berjemaah pada pagi Hari Raya Aidilfitri dan Aidiladha.", id: "Shalat Ied terdiri dari 2 rakaat dengan takbir tambahan, diikuti Khutbah. Dilakukan secara berjamaah pada pagi Idul Fitri dan Idul Adha." },
  steps: [
    // Step 1: Niyyah
    {
      stepNumber: 1,
      action: { en: "Stand facing Qibla and make intention (Niyyah) for 2 rakats of Eid prayer", bn: "কিবলামুখী দাঁড়ান এবং ঈদের নামাজের ২ রাকাতের নিয়ত করুন", ur: "قبلہ رخ کھڑے ہوں اور عید کی نماز کی ۲ رکعت کی نیت کریں", ar: "قف مستقبلاً القبلة وانوِ صلاة ركعتي العيد", tr: "Kıbleye dönüp 2 rekat bayram namazı için niyet edin", ms: "Berdiri menghadap Kiblat dan niat 2 rakaat solat Hari Raya", id: "Berdiri menghadap Kiblat dan niat 2 rakaat shalat Ied" },
      arabic: "",
      transliteration: "",
      meaning: { en: "", bn: "", ur: "", ar: "", tr: "", ms: "", id: "" },
    },
    // Step 2: Takbiratul Ihram
    {
      stepNumber: 2,
      action: { en: "Raise both hands to ear level and say Takbiratul Ihram", bn: "দুই হাত কানের লতি বরাবর উঠান এবং তাকবীরাতুল ইহরাম বলুন", ur: "دونوں ہاتھ کانوں تک اٹھائیں اور تکبیرۃ الاحرام کہیں", ar: "ارفع يديك حذو أذنيك وكبّر تكبيرة الإحرام", tr: "İki elinizi kulak seviyesine kaldırıp iftitah tekbiri getirin", ms: "Angkat kedua tangan ke paras telinga dan ucapkan takbiratul ihram", id: "Angkat kedua tangan ke telinga dan ucapkan takbiratul ihram" },
      arabic: "اللَّهُ أَكْبَرُ",
      transliteration: "Allahu Akbar",
      meaning: { en: "Allah is the Greatest", bn: "আল্লাহ সবচেয়ে মহান", ur: "اللہ سب سے بڑا ہے", ar: "الله أكبر", tr: "Allah en büyüktür", ms: "Allah Maha Besar", id: "Allah Maha Besar" },
    },
    // Step 3: Three extra Takbirs in the first rakat
    {
      stepNumber: 3,
      action: { en: "Say 3 extra Takbirs: raise hands and say Allahu Akbar each time, drop hands to sides after each, then raise again", bn: "৩টি অতিরিক্ত তাকবীর বলুন: প্রতিবার হাত উঠান ও আল্লাহু আকবার বলুন, প্রতিবার হাত নামিয়ে আবার উঠান", ur: "۳ اضافی تکبیریں کہیں: ہر بار ہاتھ اٹھائیں اور اللہ اکبر کہیں، ہر بار ہاتھ نیچے کریں پھر دوبارہ اٹھائیں", ar: "كبّر ٣ تكبيرات زائدة: ارفع يديك وقل الله أكبر في كل مرة، ثم أرسل يديك ثم ارفعهما مجدداً", tr: "3 ekstra tekbir getirin: her seferinde elleri kaldırıp Allahu Ekber deyin, elleri yanlarınıza bırakın, tekrar kaldırın", ms: "Ucapkan 3 takbir tambahan: angkat tangan dan ucap Allahu Akbar setiap kali, turunkan tangan kemudian angkat semula", id: "Ucapkan 3 takbir tambahan: angkat tangan dan ucap Allahu Akbar setiap kali, turunkan tangan lalu angkat kembali" },
      arabic: "اللَّهُ أَكْبَرُ ، اللَّهُ أَكْبَرُ ، اللَّهُ أَكْبَرُ",
      transliteration: "Allahu Akbar, Allahu Akbar, Allahu Akbar",
      meaning: { en: "Allah is the Greatest (3 times)", bn: "আল্লাহ সবচেয়ে মহান (৩ বার)", ur: "اللہ سب سے بڑا ہے (۳ بار)", ar: "الله أكبر (٣ مرات)", tr: "Allah en büyüktür (3 kez)", ms: "Allah Maha Besar (3 kali)", id: "Allah Maha Besar (3 kali)" },
    },
    // Step 4: Fold hands and recite Thana, Fatiha, and a Surah
    {
      stepNumber: 4,
      action: { en: "Fold hands, recite Thana (opening dua), then Surah Al-Fatiha, then another Surah", bn: "হাত বাঁধুন, সানা (প্রারম্ভিক দু'আ) পড়ুন, তারপর সূরা ফাতিহা, তারপর আরেকটি সূরা", ur: "ہاتھ باندھیں، ثنا پڑھیں، پھر سورۃ الفاتحہ، پھر کوئی اور سورت", ar: "ضع يديك واقرأ الثناء (دعاء الاستفتاح) ثم الفاتحة ثم سورة أخرى", tr: "Elleri bağlayın, Sena okuyun, sonra Fatiha, sonra başka bir sure", ms: "Lipat tangan, baca Thana (doa iftitah), kemudian Al-Fatihah, kemudian surah lain", id: "Lipat tangan, baca Thana (doa iftitah), kemudian Al-Fatihah, kemudian surah lain" },
      arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَىٰ جَدُّكَ وَلَا إِلَٰهَ غَيْرُكَ",
      transliteration: "Subhanaka Allahumma wa bihamdika, wa tabarakasmuka, wa ta'ala jadduka, wa la ilaha ghairuk",
      meaning: { en: "Glory be to You O Allah, and praise be to You. Blessed is Your name, exalted is Your majesty, and there is no god but You.", bn: "হে আল্লাহ! তুমি পবিত্র, তোমার প্রশংসা সহ। তোমার নাম বরকতময়, তোমার মর্যাদা সুউচ্চ, তুমি ছাড়া কোনো ইলাহ নেই।", ur: "اے اللہ! تو پاک ہے اور تیری حمد ہے۔ تیرا نام بابرکت ہے، تیری شان بلند ہے، اور تیرے سوا کوئی معبود نہیں۔", ar: "سبحانك اللهم وبحمدك وتبارك اسمك وتعالى جدك ولا إله غيرك", tr: "Allah'ım! Sen münezzehsin, hamdınla. İsmin mübarektir, şanın yücedir, Senden başka ilah yoktur.", ms: "Maha Suci Engkau ya Allah, dengan segala puji-Mu. Berkat nama-Mu, Maha Tinggi kebesaran-Mu, tiada Tuhan selain Engkau.", id: "Maha Suci Engkau ya Allah, dengan segala puji-Mu. Berkat nama-Mu, Maha Tinggi kebesaran-Mu, tiada Tuhan selain Engkau." },
    },
    // Step 5: Complete Ruku and Sajdahs for 1st rakat
    {
      stepNumber: 5,
      action: { en: "Complete Ruku (bowing) and two Sajdahs (prostrations) for the 1st rakat as in normal prayer", bn: "১ম রাকাতের জন্য স্বাভাবিক নামাজের মতো রুকু ও দুই সিজদা সম্পন্ন করুন", ur: "پہلی رکعت کے لیے عام نماز کی طرح رکوع اور دو سجدے مکمل کریں", ar: "أتمّ الركوع والسجدتين للركعة الأولى كالصلاة العادية", tr: "1. rekatın rükusunu ve iki secdesini normal namaz gibi tamamlayın", ms: "Sempurnakan rukuk dan dua sujud untuk rakaat pertama seperti solat biasa", id: "Sempurnakan rukuk dan dua sujud untuk rakaat pertama seperti shalat biasa" },
      arabic: "سُبْحَانَ رَبِّيَ الْعَظِيمِ / سُبْحَانَ رَبِّيَ الْأَعْلَىٰ",
      transliteration: "Subhana Rabbiyal-Adheem (in Ruku) / Subhana Rabbiyal-A'la (in Sajdah)",
      meaning: { en: "Glory be to my Lord, the Most Great / Glory be to my Lord, the Most High", bn: "আমার মহান রবের পবিত্রতা / আমার সর্বোচ্চ রবের পবিত্রতা", ur: "پاک ہے میرا رب بڑی عظمت والا / پاک ہے میرا رب سب سے بلند", ar: "سبحان ربي العظيم / سبحان ربي الأعلى", tr: "Yüce Rabbimi tesbih ederim / En Yüce Rabbimi tesbih ederim", ms: "Maha Suci Tuhanku Yang Maha Agung / Maha Suci Tuhanku Yang Maha Tinggi", id: "Maha Suci Tuhanku Yang Maha Agung / Maha Suci Tuhanku Yang Maha Tinggi" },
    },
    // Step 6: Stand for 2nd rakat with 3 extra Takbirs before Ruku
    {
      stepNumber: 6,
      action: { en: "Stand for the 2nd rakat: recite Surah Al-Fatiha and another Surah, then say 3 extra Takbirs BEFORE going into Ruku", bn: "২য় রাকাতের জন্য দাঁড়ান: সূরা ফাতিহা ও আরেকটি সূরা পড়ুন, তারপর রুকুতে যাওয়ার আগে ৩টি অতিরিক্ত তাকবীর বলুন", ur: "دوسری رکعت کے لیے کھڑے ہوں: سورۃ الفاتحہ اور ایک اور سورت پڑھیں، پھر رکوع سے پہلے ۳ اضافی تکبیریں کہیں", ar: "قم للركعة الثانية: اقرأ الفاتحة وسورة أخرى، ثم كبّر ٣ تكبيرات زائدة قبل الركوع", tr: "2. rekat için kalkın: Fatiha ve başka bir sure okuyun, sonra rükuya gitmeden ÖNCE 3 ekstra tekbir getirin", ms: "Berdiri untuk rakaat ke-2: baca Al-Fatihah dan surah lain, kemudian ucapkan 3 takbir tambahan SEBELUM rukuk", id: "Berdiri untuk rakaat ke-2: baca Al-Fatihah dan surah lain, kemudian ucapkan 3 takbir tambahan SEBELUM rukuk" },
      arabic: "اللَّهُ أَكْبَرُ ، اللَّهُ أَكْبَرُ ، اللَّهُ أَكْبَرُ",
      transliteration: "Allahu Akbar, Allahu Akbar, Allahu Akbar",
      meaning: { en: "Allah is the Greatest (3 times before Ruku)", bn: "আল্লাহ সবচেয়ে মহান (রুকুর আগে ৩ বার)", ur: "اللہ سب سے بڑا ہے (رکوع سے پہلے ۳ بار)", ar: "الله أكبر (٣ مرات قبل الركوع)", tr: "Allah en büyüktür (rükudan önce 3 kez)", ms: "Allah Maha Besar (3 kali sebelum rukuk)", id: "Allah Maha Besar (3 kali sebelum rukuk)" },
    },
    // Step 7: Complete Ruku, Sajdahs, Tashahhud, Durood, and Salam
    {
      stepNumber: 7,
      action: { en: "Complete Ruku, two Sajdahs, then sit for Tashahhud, Durood Ibrahim, and end with Salam to both sides", bn: "রুকু, দুই সিজদা সম্পন্ন করুন, তারপর তাশাহহুদ, দরূদ ইবরাহীম পড়ে দুই দিকে সালাম দিয়ে শেষ করুন", ur: "رکوع، دو سجدے مکمل کریں، پھر تشہد، درود ابراہیم پڑھیں اور دونوں طرف سلام سے نماز ختم کریں", ar: "أتمّ الركوع والسجدتين، ثم اجلس للتشهد والصلاة الإبراهيمية، وسلّم على الجانبين", tr: "Rüku, iki secdeyi tamamlayın, sonra Tahiyyat, Salli-Barik okuyup iki tarafa selam verin", ms: "Sempurnakan rukuk, dua sujud, kemudian duduk untuk Tahiyyat, Selawat Ibrahim, dan akhiri dengan salam ke kedua belah", id: "Sempurnakan rukuk, dua sujud, kemudian duduk untuk Tahiyyat, Shalawat Ibrahim, dan akhiri dengan salam ke kedua sisi" },
      arabic: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ",
      transliteration: "Assalamu 'alaikum wa rahmatullah (right side, then left side)",
      meaning: { en: "Peace and mercy of Allah be upon you", bn: "আপনাদের উপর আল্লাহর শান্তি ও রহমত বর্ষিত হোক", ur: "تم پر اللہ کی سلامتی اور رحمت ہو", ar: "السلام عليكم ورحمة الله", tr: "Allah'ın selamı ve rahmeti üzerinize olsun", ms: "Salam dan rahmat Allah ke atas kamu", id: "Salam dan rahmat Allah atas kamu" },
    },
    // Step 8: Listen to Eid Khutbah
    {
      stepNumber: 8,
      action: { en: "Listen to the Eid Khutbah (2 sermons delivered by the Imam after the prayer)", bn: "ঈদের খুতবাহ শুনুন (নামাজের পর ইমাম কর্তৃক প্রদত্ত ২টি ভাষণ)", ur: "عید کا خطبہ سنیں (نماز کے بعد امام کے ۲ خطبے)", ar: "استمع إلى خطبة العيد (خطبتان يلقيهما الإمام بعد الصلاة)", tr: "Bayram hutbesini dinleyin (namazdan sonra imamın verdiği 2 hutbe)", ms: "Dengar Khutbah Hari Raya (2 khutbah oleh imam selepas solat)", id: "Dengarkan Khutbah Ied (2 khutbah oleh imam setelah shalat)" },
      arabic: "",
      transliteration: "",
      meaning: { en: "", bn: "", ur: "", ar: "", tr: "", ms: "", id: "" },
    },
  ],
  specialNotes: { en: "Eid prayer is Wajib according to the Hanafi school. There is no Adhan or Iqamah for Eid prayer. It is Sunnah to eat dates before the Eid al-Fitr prayer and not to eat before the Eid al-Adha prayer. Takbir-e-Tashreeq is recited from the 9th to the 13th of Dhul Hijjah.", bn: "হানাফী মাযহাব অনুযায়ী ঈদের নামাজ ওয়াজিব। ঈদের নামাজের জন্য আযান বা ইকামাত নেই। ঈদুল ফিতরের নামাজের আগে খেজুর খাওয়া সুন্নাত এবং ঈদুল আযহার নামাজের আগে না খাওয়া সুন্নাত। ৯ই থেকে ১৩ই জিলহজ পর্যন্ত তাকবীরে তাশরীক পড়া হয়।", ur: "حنفی مسلک کے مطابق عید کی نماز واجب ہے۔ عید کی نماز کے لیے اذان یا اقامت نہیں ہے۔ عید الفطر کی نماز سے پہلے کھجوریں کھانا سنت ہے اور عید الاضحی کی نماز سے پہلے نہ کھانا سنت ہے۔ ۹ ذی الحجہ سے ۱۳ ذی الحجہ تک تکبیرِ تشریق پڑھی جاتی ہے۔", ar: "صلاة العيد واجبة عند الحنفية. لا أذان ولا إقامة لصلاة العيد. يُسنّ أكل التمر قبل صلاة عيد الفطر وعدم الأكل قبل صلاة عيد الأضحى. يُكبَّر تكبيرات التشريق من ٩ إلى ١٣ ذي الحجة.", tr: "Bayram namazı Hanefi mezhebine göre vaciptir. Bayram namazı için ezan ve kamet okunmaz. Ramazan Bayramı namazından önce hurma yemek sünnettir, Kurban Bayramı namazından önce yememek sünnettir. Teşrik tekbirleri 9–13 Zilhicce arasında okunur.", ms: "Solat Hari Raya adalah Wajib menurut mazhab Hanafi. Tiada Azan atau Iqamah untuk solat Hari Raya. Sunat makan kurma sebelum solat Aidilfitri dan tidak makan sebelum solat Aidiladha. Takbir Tasyrik dibaca dari 9 hingga 13 Zulhijjah.", id: "Shalat Ied adalah Wajib menurut mazhab Hanafi. Tidak ada Adzan atau Iqamah untuk shalat Ied. Sunnah makan kurma sebelum shalat Idul Fitri dan tidak makan sebelum shalat Idul Adha. Takbir Tasyrik dibaca dari tanggal 9 hingga 13 Dzulhijjah." },
};
