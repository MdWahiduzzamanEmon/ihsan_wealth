"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { getLangFromCountry } from "@/lib/islamic-content";
import { DEFAULT_FORM_DATA, type ZakatFormData } from "@/types/zakat";

const PRIVACY_CONTENT: Record<string, { title: string; lastUpdated: string; sections: { heading: string; body: string }[] }> = {
  en: {
    title: "Privacy Policy",
    lastUpdated: "Last updated: March 2026",
    sections: [
      { heading: "Introduction", body: "IhsanWealth is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information when you use our Zakat calculator and Islamic finance tools." },
      { heading: "Data We Collect", body: "We collect only the data you voluntarily provide: email address for authentication, zakat calculation records, sadaqah donation logs, zakat payment records, prayer tracking records, Ramadan tracker data, and tasbih session data. We also collect your approximate location (via timezone/IP) solely to determine your local currency and prayer times." },
      { heading: "How We Use Your Data", body: "Your data is used exclusively to: provide personalized zakat calculations, display your history and payment tracking, show local prayer times and Qibla direction, and power the AI assistant's personalized responses (read-only access to your records)." },
      { heading: "Data Storage", body: "All user data is stored securely in Supabase with Row Level Security (RLS) enabled. This means your data can only be accessed by you when authenticated. No other user or administrator can view your financial records." },
      { heading: "AI Assistant", body: "Our AI assistant (IhsanAI) can read your saved records to provide personalized guidance. It never writes to or modifies your data. Conversations with the AI are not stored on our servers. The AI uses OpenRouter's API for processing." },
      { heading: "Third-Party Services", body: "We use the following third-party services: Supabase (authentication and database), OpenRouter (AI chat processing), gold-api.com and Swissquote (metal price data), public currency exchange APIs, and Aladhan API (prayer times). We do not sell or share your personal data with any third party." },
      { heading: "Cookies & Local Storage", body: "We use browser local storage to remember your preferences (selected country, language, theme). We do not use tracking cookies or analytics." },
      { heading: "Salat (Prayer) Tracker Data", body: "We store prayer tracking records including fard, sunnah, and nafl prayers with their status, jamaah attendance, and timing information. We also store qaza (missed prayer) logs and streak data to help you monitor your prayer consistency. This data is protected by Row Level Security and is only accessible by you." },
      { heading: "Ramadan Tracker Data", body: "During Ramadan, we store daily tracking data including fasting status, taraweeh completion, Quran pages read, sadaqah given, and other Ramadan-specific worship activities. This data helps you track your Ramadan progress and is protected by Row Level Security." },
      { heading: "Tasbih Sessions", body: "Digital dhikr counter sessions including the type of dhikr, count, and completion time are stored for logged-in users. This data is protected by Row Level Security and is only accessible by you." },
      { heading: "Islamic Calendar & Occasions", body: "We use your country setting to apply moon-sighting adjustments for accurate Hijri date calculation. No additional data is collected for this feature." },
      { heading: "Prayer Times & Location", body: "We use browser geolocation (with your permission) to calculate prayer times and Qibla direction. Location data is not stored on our servers — it is used only in real-time for calculation purposes." },
      { heading: "Your Rights", body: "You have the right to: access all your stored data, delete your account and all associated data, export your zakat and sadaqah records. To exercise these rights, contact us through GitHub." },
      { heading: "Contact", body: "For privacy concerns, please open an issue at our GitHub repository or contact the developer directly through the links in the footer." },
    ],
  },
  bn: {
    title: "প্রাইভেসী পলিসি",
    lastUpdated: "সর্বশেষ আপডেট: মার্চ ২০২৬",
    sections: [
      { heading: "ভূমিকা", body: "ইহসান ওয়েলথ আপনার গোপনীয়তা রক্ষায় প্রতিশ্রুতিবদ্ধ। এই পলিসি ব্যাখ্যা করে কিভাবে আমরা আপনার তথ্য সংগ্রহ, ব্যবহার এবং সুরক্ষিত রাখি।" },
      { heading: "আমরা যে তথ্য সংগ্রহ করি", body: "আমরা শুধুমাত্র আপনার স্বেচ্ছায় প্রদত্ত তথ্য সংগ্রহ করি: প্রমাণীকরণের জন্য ইমেইল ঠিকানা, যাকাত হিসাবের রেকর্ড, সদকা দানের লগ, যাকাত পরিশোধের রেকর্ড, নামায ট্র্যাকিং রেকর্ড, রমজান ট্র্যাকার ডেটা এবং তাসবীহ সেশন ডেটা। আমরা স্থানীয় মুদ্রা ও নামাযের সময় নির্ধারণের জন্য আপনার আনুমানিক অবস্থানও সংগ্রহ করি।" },
      { heading: "আমরা কিভাবে আপনার তথ্য ব্যবহার করি", body: "আপনার তথ্য শুধুমাত্র ব্যক্তিগতকৃত যাকাত হিসাব, ইতিহাস ও পেমেন্ট ট্র্যাকিং, স্থানীয় নামাযের সময় ও কিবলার দিক নির্ণয় এবং AI সহায়কের ব্যক্তিগতকৃত প্রতিক্রিয়ার জন্য ব্যবহৃত হয়।" },
      { heading: "তথ্য সংরক্ষণ", body: "সকল ব্যবহারকারীর তথ্য Row Level Security (RLS) সক্রিয় Supabase-এ নিরাপদে সংরক্ষিত। এর মানে হল আপনার তথ্য শুধুমাত্র আপনি প্রমাণীকৃত অবস্থায় অ্যাক্সেস করতে পারবেন।" },
      { heading: "AI সহায়ক", body: "আমাদের AI সহায়ক (ইহসান AI) আপনার সংরক্ষিত রেকর্ড পড়তে পারে। এটি কখনো আপনার তথ্য পরিবর্তন করে না। AI-এর সাথে কথোপকথন আমাদের সার্ভারে সংরক্ষিত হয় না।" },
      { heading: "তৃতীয় পক্ষের সেবা", body: "আমরা Supabase (প্রমাণীকরণ ও ডেটাবেস), OpenRouter (AI চ্যাট), gold-api.com (ধাতুর দাম), মুদ্রা বিনিময় API এবং Aladhan API (নামাযের সময়) ব্যবহার করি। আমরা আপনার ব্যক্তিগত তথ্য কোনো তৃতীয় পক্ষের কাছে বিক্রি বা শেয়ার করি না।" },
      { heading: "সালাত (নামায) ট্র্যাকার ডেটা", body: "আমরা নামায ট্র্যাকিং রেকর্ড সংরক্ষণ করি যার মধ্যে ফরজ, সুন্নত এবং নফল নামায তাদের স্ট্যাটাস, জামাআত উপস্থিতি এবং সময়ের তথ্য অন্তর্ভুক্ত। আমরা কাযা (ছুটে যাওয়া নামায) লগ এবং স্ট্রিক ডেটাও সংরক্ষণ করি। এই ডেটা Row Level Security দ্বারা সুরক্ষিত।" },
      { heading: "রমজান ট্র্যাকার ডেটা", body: "রমজানে আমরা দৈনিক ট্র্যাকিং ডেটা সংরক্ষণ করি যার মধ্যে রোযার স্ট্যাটাস, তারাবীহ সম্পন্ন করা, কুরআন পৃষ্ঠা পড়া, সদকা প্রদান এবং অন্যান্য রমজান-নির্দিষ্ট ইবাদত কার্যক্রম অন্তর্ভুক্ত। এই ডেটা Row Level Security দ্বারা সুরক্ষিত।" },
      { heading: "তাসবীহ সেশন", body: "ডিজিটাল যিকির কাউন্টার সেশন যার মধ্যে যিকিরের ধরন, গণনা এবং সম্পন্ন হওয়ার সময় অন্তর্ভুক্ত, লগইন করা ব্যবহারকারীদের জন্য সংরক্ষিত হয়। এই ডেটা Row Level Security দ্বারা সুরক্ষিত।" },
      { heading: "ইসলামিক ক্যালেন্ডার ও উপলক্ষ", body: "সঠিক হিজরি তারিখ গণনার জন্য আমরা আপনার দেশের সেটিং ব্যবহার করে চাঁদ দেখার সমন্বয় প্রয়োগ করি। এই বৈশিষ্ট্যের জন্য কোনো অতিরিক্ত তথ্য সংগ্রহ করা হয় না।" },
      { heading: "নামাযের সময় ও অবস্থান", body: "নামাযের সময় এবং কিবলার দিক গণনা করতে আমরা ব্রাউজার জিওলোকেশন ব্যবহার করি (আপনার অনুমতিতে)। অবস্থানের ডেটা আমাদের সার্ভারে সংরক্ষিত হয় না — এটি শুধুমাত্র রিয়েল-টাইম গণনার জন্য ব্যবহৃত হয়।" },
      { heading: "আপনার অধিকার", body: "আপনার অধিকার রয়েছে: আপনার সকল সংরক্ষিত তথ্য দেখা, আপনার অ্যাকাউন্ট ও সংশ্লিষ্ট সকল তথ্য মুছে ফেলা, আপনার যাকাত ও সদকা রেকর্ড রপ্তানি করা।" },
      { heading: "যোগাযোগ", body: "গোপনীয়তা সংক্রান্ত উদ্বেগের জন্য আমাদের GitHub রিপোজিটরিতে একটি ইস্যু খুলুন অথবা ফুটারের লিংকের মাধ্যমে সরাসরি ডেভেলপারের সাথে যোগাযোগ করুন।" },
    ],
  },
  ur: {
    title: "رازداری کی پالیسی",
    lastUpdated: "آخری تازہ کاری: مارچ ۲۰۲۶",
    sections: [
      { heading: "تعارف", body: "احسان ویلتھ آپ کی رازداری کے تحفظ کے لیے پرعزم ہے۔ یہ پالیسی بتاتی ہے کہ ہم آپ کی معلومات کیسے جمع، استعمال اور محفوظ رکھتے ہیں۔" },
      { heading: "ہم کون سا ڈیٹا جمع کرتے ہیں", body: "ہم صرف وہ ڈیٹا جمع کرتے ہیں جو آپ رضاکارانہ طور پر فراہم کرتے ہیں: ای میل پتہ، زکوٰۃ کے حسابات، صدقہ کے ریکارڈ، زکوٰۃ کی ادائیگیوں کے ریکارڈ، نماز ٹریکنگ ریکارڈ، رمضان ٹریکر ڈیٹا اور تسبیح سیشن ڈیٹا۔" },
      { heading: "ہم آپ کا ڈیٹا کیسے استعمال کرتے ہیں", body: "آپ کا ڈیٹا صرف ذاتی زکوٰۃ حسابات، تاریخ اور ادائیگی ٹریکنگ، مقامی نماز کے اوقات اور AI معاون کے ذاتی جوابات کے لیے استعمال ہوتا ہے۔" },
      { heading: "ڈیٹا ذخیرہ", body: "تمام صارف ڈیٹا Row Level Security (RLS) کے ساتھ Supabase میں محفوظ طریقے سے ذخیرہ کیا جاتا ہے۔ آپ کا ڈیٹا صرف آپ تک رسائی میں ہے۔" },
      { heading: "AI معاون", body: "ہمارا AI معاون آپ کے محفوظ ریکارڈ پڑھ سکتا ہے لیکن کبھی آپ کا ڈیٹا تبدیل نہیں کرتا۔ AI کے ساتھ گفتگو ہمارے سرورز پر محفوظ نہیں ہوتی۔" },
      { heading: "نماز ٹریکر ڈیٹا", body: "ہم نماز ٹریکنگ ریکارڈ ذخیرہ کرتے ہیں جن میں فرض، سنت اور نفل نمازیں ان کی حیثیت، جماعت کی حاضری اور وقت کی معلومات شامل ہیں۔ ہم قضا (چھوٹی ہوئی نمازوں) کے لاگ اور سٹریک ڈیٹا بھی ذخیرہ کرتے ہیں۔ یہ ڈیٹا Row Level Security سے محفوظ ہے۔" },
      { heading: "رمضان ٹریکر ڈیٹا", body: "رمضان میں ہم روزانہ ٹریکنگ ڈیٹا ذخیرہ کرتے ہیں جس میں روزے کی حیثیت، تراویح کی تکمیل، قرآن کے صفحات پڑھنا، صدقہ دینا اور رمضان کی دیگر مخصوص عبادات شامل ہیں۔ یہ ڈیٹا Row Level Security سے محفوظ ہے۔" },
      { heading: "تسبیح سیشن", body: "ڈیجیٹل ذکر کاؤنٹر سیشن جن میں ذکر کی قسم، گنتی اور تکمیل کا وقت شامل ہے، لاگ ان صارفین کے لیے ذخیرہ کیے جاتے ہیں۔ یہ ڈیٹا Row Level Security سے محفوظ ہے۔" },
      { heading: "اسلامی کیلنڈر اور مواقع", body: "درست ہجری تاریخ کے حساب کے لیے ہم آپ کے ملک کی ترتیب استعمال کر کے چاند دیکھنے کی ایڈجسٹمنٹ لاگو کرتے ہیں۔ اس خصوصیت کے لیے کوئی اضافی ڈیٹا جمع نہیں کیا جاتا۔" },
      { heading: "نماز کے اوقات اور مقام", body: "ہم نماز کے اوقات اور قبلہ کی سمت کا حساب لگانے کے لیے براؤزر جیو لوکیشن استعمال کرتے ہیں (آپ کی اجازت سے)۔ مقام کا ڈیٹا ہمارے سرورز پر ذخیرہ نہیں کیا جاتا — یہ صرف ریئل ٹائم حساب کے لیے استعمال ہوتا ہے۔" },
      { heading: "آپ کے حقوق", body: "آپ کو اپنا تمام ذخیرہ شدہ ڈیٹا دیکھنے، اپنا اکاؤنٹ اور تمام متعلقہ ڈیٹا حذف کرنے اور اپنے ریکارڈ برآمد کرنے کا حق ہے۔" },
      { heading: "رابطہ", body: "رازداری کے خدشات کے لیے ہمارے GitHub ریپوزٹری پر ایک ایشو کھولیں یا فوٹر میں دیے گئے لنکس کے ذریعے ڈیولپر سے رابطہ کریں۔" },
    ],
  },
  ar: {
    title: "سياسة الخصوصية",
    lastUpdated: "آخر تحديث: مارس ٢٠٢٦",
    sections: [
      { heading: "المقدمة", body: "إحسان ويلث ملتزم بحماية خصوصيتك. توضح هذه السياسة كيف نجمع معلوماتك ونستخدمها ونحافظ عليها." },
      { heading: "البيانات التي نجمعها", body: "نجمع فقط البيانات التي تقدمها طوعاً: عنوان البريد الإلكتروني، سجلات حساب الزكاة، سجلات الصدقة، سجلات دفع الزكاة، سجلات تتبع الصلاة، بيانات متتبع رمضان، وبيانات جلسات التسبيح." },
      { heading: "كيف نستخدم بياناتك", body: "تُستخدم بياناتك حصرياً لتقديم حسابات زكاة مخصصة وعرض السجل والتتبع وأوقات الصلاة المحلية واستجابات المساعد الذكي." },
      { heading: "تخزين البيانات", body: "يتم تخزين جميع بيانات المستخدم بشكل آمن في Supabase مع تفعيل أمان مستوى الصف (RLS). لا يمكن لأي شخص آخر الوصول إلى سجلاتك المالية." },
      { heading: "المساعد الذكي", body: "يمكن لمساعدنا الذكي قراءة سجلاتك المحفوظة لتقديم إرشادات مخصصة. لا يقوم أبداً بتعديل بياناتك. لا يتم تخزين المحادثات على خوادمنا." },
      { heading: "بيانات متتبع الصلاة", body: "نقوم بتخزين سجلات تتبع الصلاة بما في ذلك صلوات الفرض والسنة والنفل مع حالتها وحضور الجماعة ومعلومات التوقيت. كما نخزن سجلات القضاء وبيانات المتابعة المستمرة. هذه البيانات محمية بأمان مستوى الصف." },
      { heading: "بيانات متتبع رمضان", body: "خلال رمضان نخزن بيانات التتبع اليومية بما في ذلك حالة الصيام وإتمام التراويح وصفحات القرآن المقروءة والصدقة المقدمة وأنشطة العبادة الرمضانية الأخرى. هذه البيانات محمية بأمان مستوى الصف." },
      { heading: "جلسات التسبيح", body: "يتم تخزين جلسات العداد الرقمي للذكر بما في ذلك نوع الذكر والعدد ووقت الإتمام للمستخدمين المسجلين. هذه البيانات محمية بأمان مستوى الصف." },
      { heading: "التقويم الإسلامي والمناسبات", body: "نستخدم إعداد بلدك لتطبيق تعديلات رؤية الهلال لحساب التاريخ الهجري بدقة. لا يتم جمع أي بيانات إضافية لهذه الميزة." },
      { heading: "أوقات الصلاة والموقع", body: "نستخدم تحديد الموقع الجغرافي للمتصفح (بإذنك) لحساب أوقات الصلاة واتجاه القبلة. لا يتم تخزين بيانات الموقع على خوادمنا — تُستخدم فقط في الوقت الفعلي لأغراض الحساب." },
      { heading: "حقوقك", body: "لديك الحق في: الوصول إلى جميع بياناتك المخزنة، حذف حسابك وجميع البيانات المرتبطة، وتصدير سجلاتك." },
      { heading: "التواصل", body: "لمخاوف الخصوصية، يرجى فتح مشكلة في مستودع GitHub الخاص بنا أو التواصل مع المطور مباشرة." },
    ],
  },
  tr: {
    title: "Gizlilik Politikasi",
    lastUpdated: "Son guncelleme: Mart 2026",
    sections: [
      { heading: "Giris", body: "IhsanWealth gizliliginizi korumaya kararlıdir. Bu politika bilgilerinizi nasıl topladıgımızı, kullandıgımızı ve korudugumuzuaçıklar." },
      { heading: "Toplanan Veriler", body: "Yalnızca gonullu olarak saglanan verileri toplarız: e-posta adresi, zekat hesaplama kayıtları, sadaka kayıtları, zekat odeme kayıtları, namaz takip kayıtları, Ramazan takip verileri ve tesbih oturum verileri." },
      { heading: "Veri Kullanımı", body: "Verileriniz yalnızca kisisellestirilmis zekat hesaplamaları, gecmis ve odeme takibi, yerel namaz vakitleri ve AI asistanın kisisellestirilmis yanıtları icin kullanılır." },
      { heading: "Namaz Takip Verileri", body: "Farz, sunnet ve nafile namazların durumu, cemaat katılımı ve zamanlama bilgileri dahil namaz takip kayıtlarını saklarız. Ayrıca kaza (kılınmamıs namaz) kayıtlarını ve seri verilerini de saklarız. Bu veriler Satır Duzeyi Guvenligi ile korunmaktadır." },
      { heading: "Ramazan Takip Verileri", body: "Ramazan'da oruc durumu, teravih tamamlama, okunan Kur'an sayfaları, verilen sadaka ve diger Ramazan'a ozel ibadet faaliyetleri dahil gunluk takip verilerini saklarız. Bu veriler Satır Duzeyi Guvenligi ile korunmaktadır." },
      { heading: "Tesbih Oturumları", body: "Zikir turu, sayısı ve tamamlanma suresi dahil dijital zikir sayacı oturumları giris yapmıs kullanıcılar icin saklanır. Bu veriler Satır Duzeyi Guvenligi ile korunmaktadır." },
      { heading: "Islam Takvimi ve Onemli Gunler", body: "Dogru Hicri tarih hesaplaması icin ulke ayarınızı kullanarak hilal gozlem ayarlamalarını uygularız. Bu ozellik icin ek veri toplanmaz." },
      { heading: "Namaz Vakitleri ve Konum", body: "Namaz vakitlerini ve kıble yonunu hesaplamak icin tarayıcı konum bilgisini kullanırız (izninizle). Konum verileri sunucularımızda saklanmaz — yalnızca gercek zamanlı hesaplama icin kullanılır." },
      { heading: "Haklarınız", body: "Tum depolanan verilerinize erisme, hesabınızı ve ilgili tum verileri silme ve kayıtlarınızı dısa aktarma hakkına sahipsiniz." },
    ],
  },
  ms: {
    title: "Dasar Privasi",
    lastUpdated: "Kemaskini terakhir: Mac 2026",
    sections: [
      { heading: "Pengenalan", body: "IhsanWealth komited untuk melindungi privasi anda. Dasar ini menerangkan bagaimana kami mengumpul, menggunakan dan melindungi maklumat anda." },
      { heading: "Data Yang Dikumpul", body: "Kami hanya mengumpul data yang anda berikan secara sukarela: alamat e-mel, rekod pengiraan zakat, log sedekah, rekod pembayaran zakat, rekod penjejakan solat, data penjejak Ramadan dan data sesi tasbih." },
      { heading: "Penggunaan Data", body: "Data anda digunakan untuk pengiraan zakat peribadi, sejarah dan penjejakan pembayaran, waktu solat tempatan dan respons pembantu AI." },
      { heading: "Data Penjejak Solat", body: "Kami menyimpan rekod penjejakan solat termasuk solat fardhu, sunat dan nafl dengan status, kehadiran jamaah dan maklumat masa. Kami juga menyimpan log qaza (solat tertinggal) dan data streak. Data ini dilindungi oleh Row Level Security." },
      { heading: "Data Penjejak Ramadan", body: "Semasa Ramadan, kami menyimpan data penjejakan harian termasuk status puasa, penyempurnaan tarawih, halaman al-Quran dibaca, sedekah diberikan dan aktiviti ibadat Ramadan yang lain. Data ini dilindungi oleh Row Level Security." },
      { heading: "Sesi Tasbih", body: "Sesi pembilang zikir digital termasuk jenis zikir, kiraan dan masa penyempurnaan disimpan untuk pengguna yang log masuk. Data ini dilindungi oleh Row Level Security." },
      { heading: "Kalendar Islam dan Peristiwa", body: "Kami menggunakan tetapan negara anda untuk menerapkan pelarasan cerapan bulan bagi pengiraan tarikh Hijri yang tepat. Tiada data tambahan dikumpul untuk ciri ini." },
      { heading: "Waktu Solat dan Lokasi", body: "Kami menggunakan geolokasi pelayar (dengan kebenaran anda) untuk mengira waktu solat dan arah kiblat. Data lokasi tidak disimpan di pelayan kami — ia digunakan hanya secara masa nyata untuk tujuan pengiraan." },
      { heading: "Hak Anda", body: "Anda berhak untuk: mengakses semua data tersimpan, memadam akaun dan semua data berkaitan, dan mengeksport rekod anda." },
    ],
  },
  id: {
    title: "Kebijakan Privasi",
    lastUpdated: "Terakhir diperbarui: Maret 2026",
    sections: [
      { heading: "Pendahuluan", body: "IhsanWealth berkomitmen untuk melindungi privasi Anda. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda." },
      { heading: "Data yang Dikumpulkan", body: "Kami hanya mengumpulkan data yang Anda berikan secara sukarela: alamat email, catatan perhitungan zakat, log sedekah, catatan pembayaran zakat, catatan pelacakan sholat, data pelacak Ramadan, dan data sesi tasbih." },
      { heading: "Penggunaan Data", body: "Data Anda digunakan untuk perhitungan zakat pribadi, riwayat dan pelacakan pembayaran, waktu sholat lokal, dan respons asisten AI yang dipersonalisasi." },
      { heading: "Data Pelacak Sholat", body: "Kami menyimpan catatan pelacakan sholat termasuk sholat fardhu, sunnah, dan nafl dengan statusnya, kehadiran jamaah, dan informasi waktu. Kami juga menyimpan log qaza (sholat yang terlewat) dan data streak. Data ini dilindungi oleh Row Level Security." },
      { heading: "Data Pelacak Ramadan", body: "Selama Ramadan, kami menyimpan data pelacakan harian termasuk status puasa, penyelesaian tarawih, halaman Al-Quran yang dibaca, sedekah yang diberikan, dan aktivitas ibadah Ramadan lainnya. Data ini dilindungi oleh Row Level Security." },
      { heading: "Sesi Tasbih", body: "Sesi penghitung dzikir digital termasuk jenis dzikir, jumlah, dan waktu penyelesaian disimpan untuk pengguna yang masuk. Data ini dilindungi oleh Row Level Security." },
      { heading: "Kalender Islam dan Peristiwa", body: "Kami menggunakan pengaturan negara Anda untuk menerapkan penyesuaian pengamatan bulan untuk perhitungan tanggal Hijriah yang akurat. Tidak ada data tambahan yang dikumpulkan untuk fitur ini." },
      { heading: "Waktu Sholat dan Lokasi", body: "Kami menggunakan geolokasi browser (dengan izin Anda) untuk menghitung waktu sholat dan arah kiblat. Data lokasi tidak disimpan di server kami — hanya digunakan secara real-time untuk tujuan perhitungan." },
      { heading: "Hak Anda", body: "Anda berhak untuk: mengakses semua data tersimpan, menghapus akun dan semua data terkait, serta mengekspor catatan Anda." },
    ],
  },
};

export default function PrivacyPage() {
  const [formData] = useLocalStorage<ZakatFormData>("zakat-calculator-data", DEFAULT_FORM_DATA);
  const countryCode = formData.country;
  const lang = getLangFromCountry(countryCode);
  const content = PRIVACY_CONTENT[lang] || PRIVACY_CONTENT.en;
  const isRTL = lang === "ar" || lang === "ur";

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-950 to-emerald-900">
      <Header countryCode={countryCode} />
      <main className="mx-auto max-w-3xl px-4 py-12" dir={isRTL ? "rtl" : "ltr"}>
        <h1 className="text-3xl font-bold text-white mb-2">{content.title}</h1>
        <p className="text-emerald-400/60 text-sm mb-10">{content.lastUpdated}</p>

        <div className="space-y-8">
          {content.sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-lg font-semibold text-emerald-200 mb-2">{section.heading}</h2>
              <p className="text-white/70 leading-relaxed">{section.body}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer countryCode={countryCode} />
    </div>
  );
}
