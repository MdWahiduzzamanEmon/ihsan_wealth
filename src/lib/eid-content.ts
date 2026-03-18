import type { TransLang } from "@/lib/islamic-content";
import { gregorianToHijri, hijriToGregorian, getHijriAdjustment, getHijriMonthName } from "@/lib/hijri-utils";

// ─── Eid Greeting Messages ───

export interface EidMessage {
  id: string;
  category: "formal" | "family" | "friend" | "religious" | "heartfelt" | "fun";
  arabic?: string;
  message: Record<TransLang, string>;
}

export const EID_MESSAGE_CATEGORIES: Record<
  EidMessage["category"],
  Record<TransLang, string>
> = {
  formal: {
    en: "Formal",
    bn: "আনুষ্ঠানিক",
    ur: "رسمی",
    ar: "رسمي",
    tr: "Resmi",
    ms: "Rasmi",
    id: "Formal",
  },
  family: {
    en: "Family",
    bn: "পরিবার",
    ur: "خاندان",
    ar: "عائلي",
    tr: "Aile",
    ms: "Keluarga",
    id: "Keluarga",
  },
  friend: {
    en: "Friends",
    bn: "বন্ধু",
    ur: "دوست",
    ar: "أصدقاء",
    tr: "Arkadaş",
    ms: "Rakan",
    id: "Teman",
  },
  religious: {
    en: "Religious",
    bn: "ধর্মীয়",
    ur: "مذہبی",
    ar: "ديني",
    tr: "Dini",
    ms: "Keagamaan",
    id: "Keagamaan",
  },
  heartfelt: {
    en: "Heartfelt",
    bn: "হৃদয়স্পর্শী",
    ur: "دلی",
    ar: "صادق",
    tr: "İçten",
    ms: "Tulus",
    id: "Tulus",
  },
  fun: {
    en: "Cheerful",
    bn: "আনন্দময়",
    ur: "خوشگوار",
    ar: "مرح",
    tr: "Neşeli",
    ms: "Ceria",
    id: "Ceria",
  },
};

export const EID_MESSAGES: EidMessage[] = [
  // ─── Formal ───
  {
    id: "f1",
    category: "formal",
    arabic: "تقبل الله منا ومنكم",
    message: {
      en: "Eid Mubarak! May Allah accept our good deeds and yours. Wishing you and your family a blessed celebration filled with peace and joy.",
      bn: "ঈদ মোবারক! আল্লাহ আমাদের ও আপনাদের নেক আমল কবুল করুন। শান্তি ও আনন্দে ভরা ঈদের শুভেচ্ছা।",
      ur: "عید مبارک! اللہ ہماری اور آپ کی نیکیاں قبول فرمائے۔ آپ اور آپ کے خاندان کو مبارک عید۔",
      ar: "عيد مبارك! تقبل الله منا ومنكم صالح الأعمال. أتمنى لكم ولعائلتكم عيداً مباركاً مليئاً بالسلام والفرح.",
      tr: "Bayramınız mübarek olsun! Allah iyi amellerimizi kabul etsin. Size ve ailenize huzur ve sevinç dolu kutlu bir bayram dilerim.",
      ms: "Selamat Hari Raya! Semoga Allah menerima amal baik kita. Semoga Hari Raya ini dipenuhi kedamaian dan kegembiraan.",
      id: "Selamat Hari Raya! Semoga Allah menerima amal baik kita. Semoga perayaan ini dipenuhi kedamaian dan kegembiraan.",
    },
  },
  {
    id: "f2",
    category: "formal",
    arabic: "كل عام وأنتم بخير",
    message: {
      en: "On this blessed occasion of Eid, may your life be filled with happiness, prosperity, and the blessings of the Almighty. Eid Mubarak!",
      bn: "ঈদের এই মুবারক উপলক্ষে, আপনার জীবন সুখ, সমৃদ্ধি এবং আল্লাহর রহমতে পরিপূর্ণ হোক। ঈদ মোবারক!",
      ur: "عید کے اس مبارک موقع پر، آپ کی زندگی خوشیوں، خوشحالی اور اللہ کی رحمتوں سے بھر جائے۔ عید مبارک!",
      ar: "في هذه المناسبة المباركة، أتمنى أن تملأ حياتكم بالسعادة والرخاء وبركات الله. عيد مبارك!",
      tr: "Bu mübarek bayram vesilesiyle, hayatınız mutluluk, refah ve Allah'ın bereketleriyle dolsun. Bayramınız mübarek olsun!",
      ms: "Pada kesempatan Hari Raya yang mulia ini, semoga hidup anda dipenuhi kebahagiaan, kemakmuran, dan rahmat Allah. Selamat Hari Raya!",
      id: "Pada kesempatan Hari Raya yang mulia ini, semoga hidup Anda dipenuhi kebahagiaan, kemakmuran, dan rahmat Allah. Selamat Hari Raya!",
    },
  },
  // ─── Family ───
  {
    id: "fam1",
    category: "family",
    arabic: "عيد سعيد يا أهلي",
    message: {
      en: "To my beloved family — Eid Mubarak! You make every celebration special. May this Eid strengthen our bonds and fill our home with laughter and love.",
      bn: "আমার প্রিয় পরিবার — ঈদ মোবারক! তোমরাই প্রতিটি উৎসবকে বিশেষ করে তোলো। এই ঈদ আমাদের বন্ধনকে আরও মজবুত করুক।",
      ur: "میرے پیارے خاندان — عید مبارک! آپ ہر جشن کو خاص بناتے ہیں۔ یہ عید ہمارے رشتوں کو مضبوط کرے۔",
      ar: "لعائلتي الحبيبة — عيد مبارك! أنتم تجعلون كل احتفال مميزاً. عسى أن تقوي هذه العيد روابطنا.",
      tr: "Sevgili aileme — Bayramınız mübarek olsun! Siz her kutlamayı özel kılıyorsunuz. Bu bayram bağlarımızı güçlendirsin.",
      ms: "Kepada keluarga tersayang — Selamat Hari Raya! Anda menjadikan setiap perayaan istimewa. Semoga Hari Raya ini mengeratkan hubungan kita.",
      id: "Kepada keluarga tercinta — Selamat Hari Raya! Kalian membuat setiap perayaan istimewa. Semoga Hari Raya ini memperkuat ikatan kita.",
    },
  },
  {
    id: "fam2",
    category: "family",
    message: {
      en: "Eid Mubarak, dear family! From the morning Eid prayer to the festive meals — every moment is better because we share it together. Love you all!",
      bn: "ঈদ মোবারক, প্রিয় পরিবার! ঈদের নামাজ থেকে উৎসবের খাবার — প্রতিটি মুহূর্ত সুন্দর কারণ আমরা একসাথে উদযাপন করি। সবাইকে ভালোবাসি!",
      ur: "عید مبارک، پیارے خاندان! عید کی نماز سے لے کر تہوار کے کھانوں تک — ہر لمحہ خوبصورت ہے کیونکہ ہم ساتھ ہیں۔",
      ar: "عيد مبارك يا عائلتي! من صلاة العيد إلى الولائم — كل لحظة أجمل لأننا معاً. أحبكم جميعاً!",
      tr: "Bayramınız mübarek olsun, sevgili ailem! Bayram namazından şenlik sofralarına — her an güzel çünkü birlikte paylaşıyoruz.",
      ms: "Selamat Hari Raya, keluarga! Dari solat Hari Raya hingga juadah perayaan — setiap detik lebih bermakna kerana kita bersama.",
      id: "Selamat Hari Raya, keluarga! Dari shalat Hari Raya hingga hidangan perayaan — setiap momen lebih indah karena kita bersama.",
    },
  },
  // ─── Friends ───
  {
    id: "fr1",
    category: "friend",
    message: {
      en: "Eid Mubarak, my friend! May your Eid be as awesome as you are. Here's to great food, good vibes, and amazing memories together!",
      bn: "ঈদ মোবারক, বন্ধু! তোমার ঈদ তোমার মতোই দারুণ হোক। দারুণ খাবার, দারুণ সময় এবং দারুণ স্মৃতি তৈরি হোক!",
      ur: "عید مبارک، دوست! تمہاری عید تمہاری طرح زبردست ہو۔ بہترین کھانے، اچھا وقت اور شاندار یادیں!",
      ar: "عيد مبارك يا صديقي! عسى أن يكون عيدك رائعاً مثلك. إليك طعاماً شهياً وأجواءً جميلة وذكريات رائعة!",
      tr: "Bayramın mübarek olsun dostum! Bayramın senin kadar harika olsun. Güzel yemeklere, güzel anlara!",
      ms: "Selamat Hari Raya, kawan! Semoga Hari Raya anda seindah anda. Jom makan besar dan buat kenangan indah!",
      id: "Selamat Hari Raya, temanku! Semoga Hari Raya kamu seindah dirimu. Mari makan besar dan buat kenangan indah!",
    },
  },
  {
    id: "fr2",
    category: "friend",
    message: {
      en: "Hey! Eid Mubarak! Another Eid, another excuse to eat way too much. May your plate be full and your heart be fuller. Miss you, friend!",
      bn: "হেই! ঈদ মোবারক! আরেকটা ঈদ, আরেকটা বেশি খাওয়ার অজুহাত। তোমার থালা ভর্তি থাকুক, হৃদয় আরও ভর্তি হোক। তোমাকে মিস করি!",
      ur: "ارے! عید مبارک! ایک اور عید، زیادہ کھانے کا ایک اور بہانہ۔ تمہاری پلیٹ بھری رہے اور دل اور بھرا رہے!",
      ar: "عيد مبارك! عيد آخر وفرصة أخرى لتناول الكثير من الطعام. عسى أن يمتلئ طبقك وقلبك أكثر!",
      tr: "Bayramın mübarek olsun! Bir bayram daha, çok yemek yemek için bir bahane daha. Tabağın dolu, kalbin daha dolu olsun!",
      ms: "Selamat Hari Raya! Satu lagi Hari Raya, satu lagi alasan makan berlebihan. Piring penuh, hati lebih penuh!",
      id: "Selamat Hari Raya! Satu lagi Hari Raya, satu lagi alasan makan berlebihan. Piring penuh, hati lebih penuh!",
    },
  },
  // ─── Religious ───
  {
    id: "r1",
    category: "religious",
    arabic: "اللهم تقبل صيامنا وقيامنا",
    message: {
      en: "May Allah accept our fasting, prayers, and good deeds. May He forgive our sins and grant us Jannah. Eid Mubarak — may this day bring us closer to His mercy.",
      bn: "আল্লাহ আমাদের রোযা, নামাজ ও নেক আমল কবুল করুন। আমাদের গুনাহ মাফ করুন এবং জান্নাত দান করুন। ঈদ মোবারক — এই দিন আমাদের তাঁর রহমতের কাছে নিয়ে যাক।",
      ur: "اللہ ہمارے روزے، نمازیں اور نیکیاں قبول فرمائے۔ ہمارے گناہ معاف فرمائے اور جنت عطا فرمائے۔ عید مبارک!",
      ar: "اللهم تقبل صيامنا وقيامنا وصالح أعمالنا. اغفر لنا ذنوبنا وأدخلنا الجنة. عيد مبارك!",
      tr: "Allah orucumuzu, namazlarımızı ve iyi amellerimizi kabul etsin. Günahlarımızı bağışlasın ve bize Cennet nasip etsin. Bayramınız mübarek olsun!",
      ms: "Semoga Allah menerima puasa, solat dan amal baik kita. Semoga Dia mengampuni dosa kita dan memberikan kita Syurga. Selamat Hari Raya!",
      id: "Semoga Allah menerima puasa, shalat dan amal baik kita. Semoga Dia mengampuni dosa kita dan memberikan kita Surga. Selamat Hari Raya!",
    },
  },
  {
    id: "r2",
    category: "religious",
    arabic: "وَلِتُكَبِّرُوا اللَّهَ عَلَى مَا هَدَاكُمْ",
    message: {
      en: "\"...and glorify Allah for having guided you, so that you may be grateful.\" (Quran 2:185) — Eid Mubarak! Let us celebrate with gratitude in our hearts.",
      bn: "\"...এবং তিনি তোমাদের যে হেদায়েত দিয়েছেন তার জন্য আল্লাহর মহিমা ঘোষণা করো, যাতে তোমরা কৃতজ্ঞ হতে পারো।\" (কুরআন ২:১৮৫) — ঈদ মোবারক!",
      ur: "\"...اور اللہ کی بڑائی بیان کرو اس ہدایت پر جو اس نے تمہیں دی ہے تاکہ تم شکرگزار بنو۔\" (قرآن ۲:۱۸۵) — عید مبارک!",
      ar: "\"وَلِتُكَبِّرُوا اللَّهَ عَلَى مَا هَدَاكُمْ وَلَعَلَّكُمْ تَشْكُرُونَ\" (البقرة: ١٨٥) — عيد مبارك!",
      tr: "\"...sizi doğru yola ilettiği için Allah'ı büyük tanımanız ve şükretmeniz için.\" (Bakara: 185) — Bayramınız mübarek olsun!",
      ms: "\"...dan supaya kamu membesarkan Allah atas petunjuk-Nya kepadamu, agar kamu bersyukur.\" (Al-Baqarah: 185) — Selamat Hari Raya!",
      id: "\"...dan agar kamu mengagungkan Allah atas petunjuk-Nya kepadamu, agar kamu bersyukur.\" (Al-Baqarah: 185) — Selamat Hari Raya!",
    },
  },
  // ─── Heartfelt ───
  {
    id: "h1",
    category: "heartfelt",
    message: {
      en: "This Eid, I want you to know how much you mean to me. May Allah bless you with everything your heart desires. You deserve all the happiness in the world. Eid Mubarak!",
      bn: "এই ঈদে আমি চাই তুমি জানো তুমি আমার কাছে কতটা গুরুত্বপূর্ণ। আল্লাহ তোমার হৃদয়ের সব চাওয়া পূরণ করুন। ঈদ মোবারক!",
      ur: "اس عید پر میں چاہتا ہوں کہ آپ جانیں کہ آپ میرے لیے کتنے اہم ہیں۔ اللہ آپ کو وہ سب کچھ عطا فرمائے جو آپ کا دل چاہے۔ عید مبارک!",
      ar: "في هذا العيد أريدك أن تعرف كم تعني لي. بارك الله فيك وحقق أمنيات قلبك. عيد مبارك!",
      tr: "Bu bayramda benim için ne kadar değerli olduğunu bilmeni istiyorum. Allah kalbinin arzuladığı her şeyle seni mübarek kılsın. Bayramınız mübarek olsun!",
      ms: "Hari Raya ini, saya ingin anda tahu betapa pentingnya anda bagi saya. Semoga Allah memberikan segala yang hati anda impikan. Selamat Hari Raya!",
      id: "Hari Raya ini, saya ingin Anda tahu betapa pentingnya Anda bagi saya. Semoga Allah memberikan segala yang hati Anda impikan. Selamat Hari Raya!",
    },
  },
  {
    id: "h2",
    category: "heartfelt",
    message: {
      en: "Eid isn't just about celebrations — it's about the people who make life beautiful. Thank you for being one of those people. Eid Mubarak, from the bottom of my heart.",
      bn: "ঈদ শুধু উৎসব নয় — এটা সেই মানুষদের নিয়ে যারা জীবনকে সুন্দর করে তোলে। সেই মানুষদের একজন হওয়ার জন্য ধন্যবাদ। হৃদয়ের গভীর থেকে ঈদ মোবারক।",
      ur: "عید صرف جشن نہیں — یہ ان لوگوں کے بارے میں ہے جو زندگی کو خوبصورت بناتے ہیں۔ ان لوگوں میں سے ایک ہونے کا شکریہ۔ دل کی گہرائیوں سے عید مبارک۔",
      ar: "العيد ليس فقط احتفالاً — إنه عن الأشخاص الذين يجعلون الحياة جميلة. شكراً لكونك واحداً منهم. عيد مبارك من أعماق قلبي.",
      tr: "Bayram sadece kutlama değil — hayatı güzel kılan insanlarla ilgili. O insanlardan biri olduğun için teşekkürler. Kalpten bayramın mübarek olsun.",
      ms: "Hari Raya bukan sekadar perayaan — ia tentang orang yang menjadikan hidup indah. Terima kasih kerana menjadi salah seorang daripada mereka. Selamat Hari Raya dari hati.",
      id: "Hari Raya bukan sekadar perayaan — ia tentang orang yang menjadikan hidup indah. Terima kasih karena menjadi salah satu dari mereka. Selamat Hari Raya dari hati.",
    },
  },
  // ─── Fun / Cheerful ───
  {
    id: "fun1",
    category: "fun",
    message: {
      en: "Eid Mubarak! Time to eat like there's no tomorrow, take a hundred selfies, and pretend we're not going back to routine next week. Let's gooo!",
      bn: "ঈদ মোবারক! এখন সময় মনভরে খাওয়ার, শত সেলফি তোলার, আর ভান করার যে আগামী সপ্তাহে রুটিনে ফিরতে হবে না। চলো শুরু করি!",
      ur: "عید مبارک! اب وقت ہے دل کھول کر کھانے کا، سو سیلفیز لینے کا، اور یہ بہانا کرنے کا کہ اگلے ہفتے معمول پر نہیں لوٹنا۔ چلو!",
      ar: "عيد مبارك! حان وقت الأكل بلا حدود والتقاط مئة سيلفي والتظاهر بأننا لن نعود للروتين الأسبوع القادم!",
      tr: "Bayramınız mübarek olsun! Yarın yokmuş gibi yemek yeme, yüz selfie çekme ve gelecek hafta rutine dönmeyecekmiş gibi yapma zamanı!",
      ms: "Selamat Hari Raya! Masa untuk makan macam tiada esok, ambil seratus selfie, dan buat-buat tak perlu balik kerja minggu depan!",
      id: "Selamat Hari Raya! Waktunya makan seperti tidak ada besok, ambil seratus selfie, dan pura-pura tidak harus kembali ke rutinitas minggu depan!",
    },
  },
  {
    id: "fun2",
    category: "fun",
    message: {
      en: "Eid checklist: New clothes? Check. Amazing food? Check. Collecting Eidi? DOUBLE CHECK! Wishing you an Eid full of blessings and pocket money!",
      bn: "ঈদ চেকলিস্ট: নতুন জামা? চেক। দারুণ খাবার? চেক। ঈদী সংগ্রহ? ডাবল চেক! বরকত ও পকেট মানিতে ভরা ঈদের শুভেচ্ছা!",
      ur: "عید چیک لسٹ: نئے کپڑے? چیک۔ لاجواب کھانا? چیک۔ عیدی جمع کرنا? ڈبل چیک! عیدی اور برکتوں سے بھری عید مبارک!",
      ar: "قائمة العيد: ملابس جديدة؟ تم. طعام رائع؟ تم. جمع العيدية؟ تم مرتين! عيد مليء بالبركات والعيديات!",
      tr: "Bayram kontrol listesi: Yeni kıyafet? Tamam. Harika yemek? Tamam. Bayram harçlığı toplama? ÇİFT TAMAM!",
      ms: "Senarai semak Raya: Baju baru? Semak. Makanan sedap? Semak. Kutip duit raya? SEMAK DUA KALI!",
      id: "Daftar cek Lebaran: Baju baru? Cek. Makanan enak? Cek. Kumpulkan angpao? CEK DUA KALI!",
    },
  },
];

// ─── Card Designs ───

export interface CardDesign {
  id: string;
  name: string;
  /** Tailwind gradient for card background */
  bg: string;
  /** Text color for the card */
  textColor: string;
  /** Accent color for decorative elements */
  accent: string;
  /** Secondary accent */
  accent2: string;
  /** Border styling */
  border: string;
  /** Pattern style identifier */
  pattern: "geometric" | "floral" | "stars" | "mosque" | "lantern" | "crescent";
}

export const CARD_DESIGNS: CardDesign[] = [
  {
    id: "emerald-gold",
    name: "Emerald & Gold",
    bg: "bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950",
    textColor: "text-amber-50",
    accent: "text-amber-400",
    accent2: "text-emerald-300",
    border: "border-amber-500/30",
    pattern: "geometric",
  },
  {
    id: "royal-blue",
    name: "Royal Blue",
    bg: "bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-950",
    textColor: "text-blue-50",
    accent: "text-sky-300",
    accent2: "text-blue-200",
    border: "border-sky-400/30",
    pattern: "stars",
  },
  {
    id: "sunset-rose",
    name: "Sunset Rose",
    bg: "bg-gradient-to-br from-rose-800 via-pink-800 to-rose-900",
    textColor: "text-rose-50",
    accent: "text-amber-300",
    accent2: "text-rose-200",
    border: "border-amber-400/30",
    pattern: "floral",
  },
  {
    id: "midnight-purple",
    name: "Midnight Purple",
    bg: "bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-950",
    textColor: "text-purple-50",
    accent: "text-amber-300",
    accent2: "text-violet-200",
    border: "border-amber-400/20",
    pattern: "crescent",
  },
  {
    id: "desert-sand",
    name: "Desert Sand",
    bg: "bg-gradient-to-br from-amber-800 via-orange-800 to-amber-900",
    textColor: "text-amber-50",
    accent: "text-amber-200",
    accent2: "text-orange-200",
    border: "border-amber-300/30",
    pattern: "mosque",
  },
  {
    id: "ocean-teal",
    name: "Ocean Teal",
    bg: "bg-gradient-to-br from-teal-900 via-cyan-900 to-teal-950",
    textColor: "text-teal-50",
    accent: "text-cyan-300",
    accent2: "text-teal-200",
    border: "border-cyan-400/30",
    pattern: "lantern",
  },
  {
    id: "ivory-cream",
    name: "Ivory & Cream",
    bg: "bg-gradient-to-br from-stone-100 via-amber-50 to-stone-200",
    textColor: "text-stone-800",
    accent: "text-amber-700",
    accent2: "text-stone-500",
    border: "border-amber-600/20",
    pattern: "geometric",
  },
  {
    id: "forest-green",
    name: "Forest Green",
    bg: "bg-gradient-to-br from-green-900 via-green-800 to-emerald-900",
    textColor: "text-green-50",
    accent: "text-lime-300",
    accent2: "text-green-200",
    border: "border-lime-400/20",
    pattern: "floral",
  },
  {
    id: "crimson-night",
    name: "Crimson Night",
    bg: "bg-gradient-to-br from-red-950 via-red-900 to-rose-950",
    textColor: "text-red-50",
    accent: "text-amber-400",
    accent2: "text-red-200",
    border: "border-amber-500/20",
    pattern: "stars",
  },
  {
    id: "slate-silver",
    name: "Slate Silver",
    bg: "bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900",
    textColor: "text-gray-100",
    accent: "text-sky-300",
    accent2: "text-slate-300",
    border: "border-sky-400/20",
    pattern: "mosque",
  },
  {
    id: "warm-coral",
    name: "Warm Coral",
    bg: "bg-gradient-to-br from-orange-700 via-red-600 to-orange-800",
    textColor: "text-orange-50",
    accent: "text-yellow-200",
    accent2: "text-orange-200",
    border: "border-yellow-300/30",
    pattern: "lantern",
  },
  {
    id: "peacock-blue",
    name: "Peacock Blue",
    bg: "bg-gradient-to-br from-cyan-900 via-blue-800 to-teal-900",
    textColor: "text-cyan-50",
    accent: "text-amber-300",
    accent2: "text-cyan-200",
    border: "border-amber-400/20",
    pattern: "crescent",
  },
];

// ─── Card Layouts ───

export type CardLayout = "portrait" | "landscape" | "square";

export const CARD_LAYOUT_CONFIG: Record<CardLayout, { aspectRatio: string; maxWidth: string }> = {
  portrait: { aspectRatio: "3 / 4", maxWidth: "440px" },
  landscape: { aspectRatio: "16 / 9", maxWidth: "600px" },
  square: { aspectRatio: "1 / 1", maxWidth: "480px" },
};

// ─── Font Styles ───

export interface FontStyleOption {
  id: string;
  label: Record<TransLang, string>;
  className: string;
  preview: string;
}

export const FONT_STYLES: FontStyleOption[] = [
  { id: "default", label: { en: "Modern", bn: "আধুনিক", ur: "جدید", ar: "عصري", tr: "Modern", ms: "Moden", id: "Modern" }, className: "font-sans", preview: "Aa" },
  { id: "serif", label: { en: "Elegant", bn: "মার্জিত", ur: "خوبصورت", ar: "أنيق", tr: "Zarif", ms: "Elegan", id: "Elegan" }, className: "font-serif", preview: "Aa" },
  { id: "arabic", label: { en: "Arabic", bn: "আরবি", ur: "عربی", ar: "عربي", tr: "Arapca", ms: "Arab", id: "Arab" }, className: "font-arabic", preview: "عربي" },
];

// ─── Eid Checklist Items ───

export interface ChecklistItem {
  id: string;
  label: Record<TransLang, string>;
  icon: string;
}

export const EID_CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: "ghusl", label: { en: "Take Ghusl (bath)", bn: "গোসল করা", ur: "غسل کرنا", ar: "الاغتسال", tr: "Gusül abdesti almak", ms: "Mandi sunat", id: "Mandi wajib" }, icon: "🚿" },
  { id: "clothes", label: { en: "Wear best clothes", bn: "সেরা পোশাক পরা", ur: "بہترین لباس پہننا", ar: "ارتداء أفضل الثياب", tr: "En güzel kıyafetleri giymek", ms: "Pakai pakaian terbaik", id: "Pakai pakaian terbaik" }, icon: "👔" },
  { id: "eat", label: { en: "Eat dates before prayer", bn: "নামাজের আগে খেজুর খাওয়া", ur: "نماز سے پہلے کھجوریں کھانا", ar: "أكل التمر قبل الصلاة", tr: "Namazdan önce hurma yemek", ms: "Makan kurma sebelum solat", id: "Makan kurma sebelum salat" }, icon: "🌴" },
  { id: "takbeer", label: { en: "Recite Takbeer", bn: "তাকবীর পড়া", ur: "تکبیر پڑھنا", ar: "التكبير", tr: "Tekbir getirmek", ms: "Bertakbir", id: "Bertakbir" }, icon: "🕌" },
  { id: "prayer", label: { en: "Attend Eid prayer", bn: "ঈদের নামাজ পড়া", ur: "عید کی نماز پڑھنا", ar: "صلاة العيد", tr: "Bayram namazına katılmak", ms: "Solat Hari Raya", id: "Salat Hari Raya" }, icon: "🤲" },
  { id: "fitr", label: { en: "Give Zakat al-Fitr", bn: "ফিতরা দেওয়া", ur: "زکوٰۃ الفطر دینا", ar: "إخراج زكاة الفطر", tr: "Fitre vermek", ms: "Bayar Zakat Fitrah", id: "Bayar Zakat Fitrah" }, icon: "💝" },
  { id: "visit", label: { en: "Visit family & friends", bn: "পরিবার ও বন্ধুদের সাথে দেখা", ur: "خاندان اور دوستوں سے ملنا", ar: "زيارة الأهل والأصدقاء", tr: "Aile ve arkadaşları ziyaret etmek", ms: "Ziarah keluarga & rakan", id: "Kunjungi keluarga & teman" }, icon: "👨‍👩‍👧‍👦" },
  { id: "greet", label: { en: "Exchange Eid greetings", bn: "ঈদের শুভেচ্ছা বিনিময়", ur: "عید کی مبارکباد دینا", ar: "تبادل تهاني العيد", tr: "Bayram tebriği paylaşmak", ms: "Tukar ucapan Raya", id: "Tukar ucapan Raya" }, icon: "🤝" },
];

// ─── Eid Date Utilities ───

export interface EidDateInfo {
  date: Date;
  name: string;
  eidType: "fitr" | "adha";
  daysLeft: number;
  isEidToday: boolean;
  hijriStr: string;
}

/** Get the next Eid date for a given country, accounting for moon sighting adjustment. */
export function getNextEidInfo(countryCode: string): EidDateInfo {
  const adjustment = getHijriAdjustment(countryCode);
  const now = new Date();
  const hijri = gregorianToHijri(now, adjustment);
  const month = getHijriMonthName(hijri.month);
  const hijriStr = `${hijri.day} ${month.english} ${hijri.year}`;

  // Check if today IS Eid
  const isEidToday =
    (hijri.month === 10 && hijri.day >= 1 && hijri.day <= 3) ||
    (hijri.month === 12 && hijri.day >= 10 && hijri.day <= 13);

  if (isEidToday) {
    const eidType = hijri.month === 10 ? "fitr" as const : "adha" as const;
    const name = eidType === "fitr" ? "Eid al-Fitr" : "Eid al-Adha";
    return { date: now, name, eidType, daysLeft: 0, isEidToday: true, hijriStr };
  }

  // Find next Eid
  const candidates: { m: number; d: number; name: string; eidType: "fitr" | "adha"; year: number }[] = [];
  for (const yr of [hijri.year, hijri.year + 1]) {
    candidates.push({ m: 10, d: 1, name: "Eid al-Fitr", eidType: "fitr", year: yr });
    candidates.push({ m: 12, d: 10, name: "Eid al-Adha", eidType: "adha", year: yr });
  }

  let closest: { date: Date; name: string; eidType: "fitr" | "adha" } | null = null;

  for (const c of candidates) {
    const gregDate = hijriToGregorian({ year: c.year, month: c.m, day: c.d });
    // Adjust for local moon sighting: BD adjustment=-1 → local Eid is 1 day later
    gregDate.setDate(gregDate.getDate() - adjustment);

    if (gregDate.getTime() >= now.getTime() - 86400000) {
      if (!closest || gregDate.getTime() < closest.date.getTime()) {
        closest = { date: gregDate, name: c.name, eidType: c.eidType };
      }
    }
  }

  const eid = closest || { date: now, name: "Eid", eidType: "fitr" as const };
  const daysLeft = Math.max(0, Math.floor((eid.date.getTime() - now.getTime()) / 86400000));

  return { ...eid, daysLeft, isEidToday: false, hijriStr };
}

// ─── Page texts ───

export const EID_PAGE_TEXTS: Record<TransLang, {
  pageTitle: string;
  pageSubtitle: string;
  messagesTitle: string;
  messagesSubtitle: string;
  cardCreatorTitle: string;
  cardCreatorSubtitle: string;
  createCard: string;
  browseMessages: string;
  copyMessage: string;
  copied: string;
  yourMessage: string;
  yourName: string;
  chooseDesign: string;
  messageSize: string;
  nameSize: string;
  preview: string;
  download: string;
  share: string;
  shareEmail: string;
  emailSubject: string;
  emailBody: string;
  generating: string;
  generateAI: string;
  small: string;
  medium: string;
  large: string;
  verifyTitle: string;
  verifyPrompt: string;
  verify: string;
  wrongAnswer: string;
  recipientEmail: string;
  sendEmail: string;
  cancel: string;
  eidMubarak: string;
  allCategories: string;
  cardSettings: string;
  back: string;
  // Feature 2: Recipient
  recipientName: string;
  toLabel: string;
  fromLabel: string;
  // Feature 3: Layouts
  chooseLayout: string;
  portrait: string;
  landscape: string;
  square: string;
  // Feature 4: Fonts
  chooseFont: string;
  // Feature 5: Takbeer
  playTakbeer: string;
  pauseTakbeer: string;
  // Feature 6: WhatsApp
  shareWhatsApp: string;
  // Feature 7: Animation
  replayAnimation: string;
  // Feature 8: Checklist
  eidChecklist: string;
  checklistSubtitle: string;
  progress: string;
  // Feature 9: Clipboard
  copyToClipboard: string;
  copiedToClipboard: string;
  // Feature 10: Reminder
  setReminder: string;
  reminderSet: string;
  reminderDesc: string;
  // Feature 1: Countdown
  countdown: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  eidToday: string;
}> = {
  en: {
    pageTitle: "Eid Mubarak!",
    pageSubtitle: "Celebrate Eid with beautiful wishes and greeting cards",
    messagesTitle: "Eid Wishes & Messages",
    messagesSubtitle: "Choose from heartfelt messages for every occasion",
    cardCreatorTitle: "Create Your Eid Card",
    cardCreatorSubtitle: "Design a beautiful greeting card and share it with loved ones",
    createCard: "Create Eid Card",
    browseMessages: "Browse Messages",
    copyMessage: "Copy",
    copied: "Copied!",
    yourMessage: "Your Message",
    yourName: "Your Name",
    chooseDesign: "Choose Design",
    messageSize: "Message Size",
    nameSize: "Name Size",
    preview: "Preview",
    download: "Download Card",
    share: "Share",
    shareEmail: "Share via Email",
    emailSubject: "Eid Mubarak Greeting",
    emailBody: "Assalamu Alaikum! I've sent you a beautiful Eid greeting card. Eid Mubarak!",
    generating: "Generating...",
    generateAI: "AI Message",
    small: "Small",
    medium: "Medium",
    large: "Large",
    verifyTitle: "Quick Verification",
    verifyPrompt: "Solve this to send:",
    verify: "Verify & Send",
    wrongAnswer: "Incorrect answer, please try again",
    recipientEmail: "Recipient's Email",
    sendEmail: "Send Email",
    cancel: "Cancel",
    eidMubarak: "Eid Mubarak",
    allCategories: "All",
    cardSettings: "Card Settings",
    back: "Back",
    recipientName: "Recipient's Name",
    toLabel: "To",
    fromLabel: "From",
    chooseLayout: "Card Layout",
    portrait: "Portrait",
    landscape: "Landscape",
    square: "Square",
    chooseFont: "Font Style",
    playTakbeer: "Play Takbeer",
    pauseTakbeer: "Pause",
    shareWhatsApp: "WhatsApp",
    replayAnimation: "Replay",
    eidChecklist: "Eid Day Checklist",
    checklistSubtitle: "Sunnah acts for a blessed Eid day",
    progress: "Progress",
    copyToClipboard: "Copy Image",
    copiedToClipboard: "Copied!",
    setReminder: "Remind me on Eid",
    reminderSet: "Reminder set!",
    reminderDesc: "We'll remind you when you visit on Eid day",
    countdown: "Eid Countdown",
    days: "Days",
    hours: "Hours",
    minutes: "Min",
    seconds: "Sec",
    eidToday: "Today is Eid!",
  },
  bn: {
    pageTitle: "ঈদ মোবারক!",
    pageSubtitle: "সুন্দর শুভেচ্ছা ও গ্রিটিং কার্ড দিয়ে ঈদ উদযাপন করুন",
    messagesTitle: "ঈদের শুভেচ্ছা ও বার্তা",
    messagesSubtitle: "প্রতিটি উপলক্ষের জন্য হৃদয়স্পর্শী বার্তা বেছে নিন",
    cardCreatorTitle: "আপনার ঈদ কার্ড তৈরি করুন",
    cardCreatorSubtitle: "সুন্দর গ্রিটিং কার্ড তৈরি করে প্রিয়জনদের সাথে শেয়ার করুন",
    createCard: "ঈদ কার্ড তৈরি",
    browseMessages: "বার্তা দেখুন",
    copyMessage: "কপি",
    copied: "কপি হয়েছে!",
    yourMessage: "আপনার বার্তা",
    yourName: "আপনার নাম",
    chooseDesign: "ডিজাইন বেছে নিন",
    messageSize: "বার্তার আকার",
    nameSize: "নামের আকার",
    preview: "প্রিভিউ",
    download: "কার্ড ডাউনলোড",
    share: "শেয়ার",
    shareEmail: "ইমেইলে শেয়ার",
    emailSubject: "ঈদ মোবারক শুভেচ্ছা",
    emailBody: "আসসালামু আলাইকুম! আমি আপনাকে একটি সুন্দর ঈদ গ্রিটিং কার্ড পাঠিয়েছি। ঈদ মোবারক!",
    generating: "তৈরি হচ্ছে...",
    generateAI: "AI বার্তা",
    small: "ছোট",
    medium: "মাঝারি",
    large: "বড়",
    verifyTitle: "দ্রুত যাচাই",
    verifyPrompt: "পাঠাতে সমাধান করুন:",
    verify: "যাচাই ও পাঠান",
    wrongAnswer: "ভুল উত্তর, আবার চেষ্টা করুন",
    recipientEmail: "প্রাপকের ইমেইল",
    sendEmail: "ইমেইল পাঠান",
    cancel: "বাতিল",
    eidMubarak: "ঈদ মোবারক",
    allCategories: "সব",
    cardSettings: "কার্ড সেটিংস",
    back: "ফিরে যান",
    recipientName: "প্রাপকের নাম",
    toLabel: "প্রতি",
    fromLabel: "প্রেরক",
    chooseLayout: "কার্ড লেআউট",
    portrait: "পোর্ট্রেট",
    landscape: "ল্যান্ডস্কেপ",
    square: "বর্গক্ষেত্র",
    chooseFont: "ফন্ট স্টাইল",
    playTakbeer: "তাকবীর চালু",
    pauseTakbeer: "বিরতি",
    shareWhatsApp: "হোয়াটসঅ্যাপ",
    replayAnimation: "রিপ্লে",
    eidChecklist: "ঈদের দিনের চেকলিস্ট",
    checklistSubtitle: "বরকতময় ঈদের জন্য সুন্নাত আমলসমূহ",
    progress: "অগ্রগতি",
    copyToClipboard: "ছবি কপি",
    copiedToClipboard: "কপি হয়েছে!",
    setReminder: "ঈদের দিন মনে করিয়ে দিন",
    reminderSet: "রিমাইন্ডার সেট হয়েছে!",
    reminderDesc: "ঈদের দিনে ভিজিট করলে আমরা মনে করিয়ে দেব",
    countdown: "ঈদ কাউন্টডাউন",
    days: "দিন",
    hours: "ঘন্টা",
    minutes: "মিনিট",
    seconds: "সেকেন্ড",
    eidToday: "আজ ঈদ!",
  },
  ur: {
    pageTitle: "عید مبارک!",
    pageSubtitle: "خوبصورت مبارکباد اور گریٹنگ کارڈز کے ساتھ عید منائیں",
    messagesTitle: "عید کی مبارکباد اور پیغامات",
    messagesSubtitle: "ہر موقع کے لیے دلی پیغامات چنیں",
    cardCreatorTitle: "اپنا عید کارڈ بنائیں",
    cardCreatorSubtitle: "خوبصورت گریٹنگ کارڈ بنائیں اور اپنوں کے ساتھ شیئر کریں",
    createCard: "عید کارڈ بنائیں",
    browseMessages: "پیغامات دیکھیں",
    copyMessage: "کاپی",
    copied: "کاپی ہو گیا!",
    yourMessage: "آپ کا پیغام",
    yourName: "آپ کا نام",
    chooseDesign: "ڈیزائن چنیں",
    messageSize: "پیغام کا سائز",
    nameSize: "نام کا سائز",
    preview: "پیش نظارہ",
    download: "کارڈ ڈاؤنلوڈ",
    share: "شیئر",
    shareEmail: "ای میل سے شیئر",
    emailSubject: "عید مبارک مبارکباد",
    emailBody: "السلام علیکم! میں نے آپ کو ایک خوبصورت عید گریٹنگ کارڈ بھیجا ہے۔ عید مبارک!",
    generating: "بن رہا ہے...",
    generateAI: "AI پیغام",
    small: "چھوٹا",
    medium: "درمیانہ",
    large: "بڑا",
    verifyTitle: "فوری تصدیق",
    verifyPrompt: "بھیجنے کے لیے حل کریں:",
    verify: "تصدیق اور بھیجیں",
    wrongAnswer: "غلط جواب، دوبارہ کوشش کریں",
    recipientEmail: "وصول کنندہ کا ای میل",
    sendEmail: "ای میل بھیجیں",
    cancel: "منسوخ",
    eidMubarak: "عید مبارک",
    allCategories: "سب",
    cardSettings: "کارڈ سیٹنگز",
    back: "واپس",
    recipientName: "وصول کنندہ کا نام",
    toLabel: "بنام",
    fromLabel: "از",
    chooseLayout: "کارڈ لے آؤٹ",
    portrait: "پورٹریٹ",
    landscape: "لینڈسکیپ",
    square: "مربع",
    chooseFont: "فونٹ سٹائل",
    playTakbeer: "تکبیر چلائیں",
    pauseTakbeer: "روکیں",
    shareWhatsApp: "واٹس ایپ",
    replayAnimation: "دوبارہ",
    eidChecklist: "عید کی چیک لسٹ",
    checklistSubtitle: "بابرکت عید کے لیے سنت اعمال",
    progress: "پیشرفت",
    copyToClipboard: "تصویر کاپی",
    copiedToClipboard: "کاپی ہو گیا!",
    setReminder: "عید پر یاد دلائیں",
    reminderSet: "یاد دہانی سیٹ!",
    reminderDesc: "عید کے دن وزٹ کرنے پر ہم یاد دلائیں گے",
    countdown: "عید کاؤنٹ ڈاؤن",
    days: "دن",
    hours: "گھنٹے",
    minutes: "منٹ",
    seconds: "سیکنڈ",
    eidToday: "آج عید ہے!",
  },
  ar: {
    pageTitle: "عيد مبارك!",
    pageSubtitle: "احتفل بالعيد مع أجمل التهاني وبطاقات المعايدة",
    messagesTitle: "تهاني ورسائل العيد",
    messagesSubtitle: "اختر من رسائل صادقة لكل مناسبة",
    cardCreatorTitle: "أنشئ بطاقة عيدك",
    cardCreatorSubtitle: "صمم بطاقة تهنئة جميلة وشاركها مع أحبائك",
    createCard: "إنشاء بطاقة العيد",
    browseMessages: "تصفح الرسائل",
    copyMessage: "نسخ",
    copied: "تم النسخ!",
    yourMessage: "رسالتك",
    yourName: "اسمك",
    chooseDesign: "اختر التصميم",
    messageSize: "حجم الرسالة",
    nameSize: "حجم الاسم",
    preview: "معاينة",
    download: "تحميل البطاقة",
    share: "مشاركة",
    shareEmail: "مشاركة عبر البريد",
    emailSubject: "تهنئة عيد مبارك",
    emailBody: "السلام عليكم! أرسلت لك بطاقة تهنئة جميلة بالعيد. عيد مبارك!",
    generating: "جارٍ الإنشاء...",
    generateAI: "رسالة AI",
    small: "صغير",
    medium: "متوسط",
    large: "كبير",
    verifyTitle: "تحقق سريع",
    verifyPrompt: "حل المسألة للإرسال:",
    verify: "تحقق وأرسل",
    wrongAnswer: "إجابة خاطئة، حاول مرة أخرى",
    recipientEmail: "بريد المستلم",
    sendEmail: "إرسال البريد",
    cancel: "إلغاء",
    eidMubarak: "عيد مبارك",
    allCategories: "الكل",
    cardSettings: "إعدادات البطاقة",
    back: "رجوع",
    recipientName: "اسم المستلم",
    toLabel: "إلى",
    fromLabel: "من",
    chooseLayout: "تخطيط البطاقة",
    portrait: "عمودي",
    landscape: "أفقي",
    square: "مربع",
    chooseFont: "نمط الخط",
    playTakbeer: "تشغيل التكبير",
    pauseTakbeer: "إيقاف",
    shareWhatsApp: "واتساب",
    replayAnimation: "إعادة",
    eidChecklist: "قائمة يوم العيد",
    checklistSubtitle: "سنن يوم العيد المبارك",
    progress: "التقدم",
    copyToClipboard: "نسخ الصورة",
    copiedToClipboard: "تم النسخ!",
    setReminder: "ذكرني يوم العيد",
    reminderSet: "تم ضبط التذكير!",
    reminderDesc: "سنذكرك عند زيارتك يوم العيد",
    countdown: "العد التنازلي للعيد",
    days: "أيام",
    hours: "ساعات",
    minutes: "دقائق",
    seconds: "ثوانٍ",
    eidToday: "اليوم عيد!",
  },
  tr: {
    pageTitle: "Bayramınız Mübarek Olsun!",
    pageSubtitle: "Güzel dilekler ve tebrik kartları ile bayramı kutlayın",
    messagesTitle: "Bayram Dilekleri ve Mesajları",
    messagesSubtitle: "Her durum için içten mesajlar seçin",
    cardCreatorTitle: "Bayram Kartınızı Oluşturun",
    cardCreatorSubtitle: "Güzel bir tebrik kartı tasarlayın ve sevdiklerinizle paylaşın",
    createCard: "Bayram Kartı Oluştur",
    browseMessages: "Mesajlara Göz At",
    copyMessage: "Kopyala",
    copied: "Kopyalandı!",
    yourMessage: "Mesajınız",
    yourName: "Adınız",
    chooseDesign: "Tasarım Seçin",
    messageSize: "Mesaj Boyutu",
    nameSize: "İsim Boyutu",
    preview: "Önizleme",
    download: "Kartı İndir",
    share: "Paylaş",
    shareEmail: "E-posta ile Paylaş",
    emailSubject: "Bayram Tebriği",
    emailBody: "Selamün aleyküm! Size güzel bir bayram tebrik kartı gönderdim. Bayramınız mübarek olsun!",
    generating: "Oluşturuluyor...",
    generateAI: "AI Mesaj",
    small: "Küçük",
    medium: "Orta",
    large: "Büyük",
    verifyTitle: "Hızlı Doğrulama",
    verifyPrompt: "Göndermek için çözün:",
    verify: "Doğrula ve Gönder",
    wrongAnswer: "Yanlış cevap, tekrar deneyin",
    recipientEmail: "Alıcı E-postası",
    sendEmail: "E-posta Gönder",
    cancel: "İptal",
    eidMubarak: "Bayramınız Mübarek Olsun",
    allCategories: "Tümü",
    cardSettings: "Kart Ayarları",
    back: "Geri",
    recipientName: "Alıcının Adı",
    toLabel: "Kime",
    fromLabel: "Kimden",
    chooseLayout: "Kart Düzeni",
    portrait: "Dikey",
    landscape: "Yatay",
    square: "Kare",
    chooseFont: "Yazı Tipi",
    playTakbeer: "Tekbir Çal",
    pauseTakbeer: "Durdur",
    shareWhatsApp: "WhatsApp",
    replayAnimation: "Tekrar",
    eidChecklist: "Bayram Günü Listesi",
    checklistSubtitle: "Mübarek bayram için sünnet ameller",
    progress: "İlerleme",
    copyToClipboard: "Resmi Kopyala",
    copiedToClipboard: "Kopyalandı!",
    setReminder: "Bayramda hatırlat",
    reminderSet: "Hatırlatma kuruldu!",
    reminderDesc: "Bayram günü ziyaret ettiğinizde hatırlatacağız",
    countdown: "Bayram Geri Sayımı",
    days: "Gün",
    hours: "Saat",
    minutes: "Dk",
    seconds: "Sn",
    eidToday: "Bugün Bayram!",
  },
  ms: {
    pageTitle: "Selamat Hari Raya!",
    pageSubtitle: "Raikan Hari Raya dengan ucapan dan kad ucapan yang indah",
    messagesTitle: "Ucapan & Mesej Hari Raya",
    messagesSubtitle: "Pilih mesej yang ikhlas untuk setiap kesempatan",
    cardCreatorTitle: "Cipta Kad Hari Raya Anda",
    cardCreatorSubtitle: "Reka bentuk kad ucapan yang cantik dan kongsikan dengan orang tersayang",
    createCard: "Cipta Kad Raya",
    browseMessages: "Lihat Mesej",
    copyMessage: "Salin",
    copied: "Disalin!",
    yourMessage: "Mesej Anda",
    yourName: "Nama Anda",
    chooseDesign: "Pilih Reka Bentuk",
    messageSize: "Saiz Mesej",
    nameSize: "Saiz Nama",
    preview: "Pratonton",
    download: "Muat Turun Kad",
    share: "Kongsi",
    shareEmail: "Kongsi melalui E-mel",
    emailSubject: "Ucapan Selamat Hari Raya",
    emailBody: "Assalamualaikum! Saya telah menghantar kad ucapan Hari Raya yang cantik. Selamat Hari Raya!",
    generating: "Menjana...",
    generateAI: "Mesej AI",
    small: "Kecil",
    medium: "Sederhana",
    large: "Besar",
    verifyTitle: "Pengesahan Pantas",
    verifyPrompt: "Selesaikan untuk menghantar:",
    verify: "Sahkan & Hantar",
    wrongAnswer: "Jawapan salah, sila cuba lagi",
    recipientEmail: "E-mel Penerima",
    sendEmail: "Hantar E-mel",
    cancel: "Batal",
    eidMubarak: "Selamat Hari Raya",
    allCategories: "Semua",
    cardSettings: "Tetapan Kad",
    back: "Kembali",
    recipientName: "Nama Penerima",
    toLabel: "Kepada",
    fromLabel: "Daripada",
    chooseLayout: "Susun Atur Kad",
    portrait: "Potret",
    landscape: "Landskap",
    square: "Segi Empat",
    chooseFont: "Gaya Fon",
    playTakbeer: "Main Takbir",
    pauseTakbeer: "Jeda",
    shareWhatsApp: "WhatsApp",
    replayAnimation: "Main Semula",
    eidChecklist: "Senarai Hari Raya",
    checklistSubtitle: "Amalan sunat untuk Hari Raya yang diberkati",
    progress: "Kemajuan",
    copyToClipboard: "Salin Imej",
    copiedToClipboard: "Disalin!",
    setReminder: "Ingatkan pada Hari Raya",
    reminderSet: "Peringatan ditetapkan!",
    reminderDesc: "Kami akan mengingatkan apabila anda melawat pada Hari Raya",
    countdown: "Undur Detik Hari Raya",
    days: "Hari",
    hours: "Jam",
    minutes: "Min",
    seconds: "Saat",
    eidToday: "Hari ini Hari Raya!",
  },
  id: {
    pageTitle: "Selamat Hari Raya!",
    pageSubtitle: "Rayakan Hari Raya dengan ucapan dan kartu ucapan yang indah",
    messagesTitle: "Ucapan & Pesan Hari Raya",
    messagesSubtitle: "Pilih pesan tulus untuk setiap kesempatan",
    cardCreatorTitle: "Buat Kartu Hari Raya Anda",
    cardCreatorSubtitle: "Desain kartu ucapan yang cantik dan bagikan dengan orang tercinta",
    createCard: "Buat Kartu Raya",
    browseMessages: "Lihat Pesan",
    copyMessage: "Salin",
    copied: "Disalin!",
    yourMessage: "Pesan Anda",
    yourName: "Nama Anda",
    chooseDesign: "Pilih Desain",
    messageSize: "Ukuran Pesan",
    nameSize: "Ukuran Nama",
    preview: "Pratinjau",
    download: "Unduh Kartu",
    share: "Bagikan",
    shareEmail: "Bagikan via Email",
    emailSubject: "Ucapan Selamat Hari Raya",
    emailBody: "Assalamualaikum! Saya mengirimkan kartu ucapan Hari Raya yang cantik. Selamat Hari Raya!",
    generating: "Membuat...",
    generateAI: "Pesan AI",
    small: "Kecil",
    medium: "Sedang",
    large: "Besar",
    verifyTitle: "Verifikasi Cepat",
    verifyPrompt: "Selesaikan untuk mengirim:",
    verify: "Verifikasi & Kirim",
    wrongAnswer: "Jawaban salah, silakan coba lagi",
    recipientEmail: "Email Penerima",
    sendEmail: "Kirim Email",
    cancel: "Batal",
    eidMubarak: "Selamat Hari Raya",
    allCategories: "Semua",
    cardSettings: "Pengaturan Kartu",
    back: "Kembali",
    recipientName: "Nama Penerima",
    toLabel: "Kepada",
    fromLabel: "Dari",
    chooseLayout: "Tata Letak Kartu",
    portrait: "Potret",
    landscape: "Lanskap",
    square: "Persegi",
    chooseFont: "Gaya Font",
    playTakbeer: "Putar Takbir",
    pauseTakbeer: "Jeda",
    shareWhatsApp: "WhatsApp",
    replayAnimation: "Ulang",
    eidChecklist: "Daftar Hari Raya",
    checklistSubtitle: "Amalan sunnah untuk Hari Raya yang berkah",
    progress: "Kemajuan",
    copyToClipboard: "Salin Gambar",
    copiedToClipboard: "Disalin!",
    setReminder: "Ingatkan pada Hari Raya",
    reminderSet: "Pengingat ditetapkan!",
    reminderDesc: "Kami akan mengingatkan saat Anda berkunjung pada Hari Raya",
    countdown: "Hitung Mundur Hari Raya",
    days: "Hari",
    hours: "Jam",
    minutes: "Min",
    seconds: "Det",
    eidToday: "Hari ini Hari Raya!",
  },
};
