"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { getLangFromCountry } from "@/lib/islamic-content";
import { DEFAULT_FORM_DATA, type ZakatFormData } from "@/types/zakat";

const USAGE_CONTENT: Record<string, { title: string; lastUpdated: string; sections: { heading: string; body: string }[] }> = {
  en: {
    title: "Usage Rights",
    lastUpdated: "Last updated: March 2026",
    sections: [
      { heading: "Open Source", body: "IhsanWealth is an open-source project built for the Muslim Ummah. The source code is freely available on GitHub for learning, contribution, and community benefit." },
      { heading: "Permitted Use", body: "You are free to: use the calculator and all tools for personal zakat calculations, share the website with others, fork and modify the source code for non-commercial purposes, and contribute improvements back to the project." },
      { heading: "Islamic Content Disclaimer", body: "All Islamic content (Quran verses, Hadith references, duas, and rulings) is provided for educational and guidance purposes only. This tool is NOT a substitute for consulting a qualified Islamic scholar (Mufti). Zakat calculations are estimates based on established Fiqh — verify important rulings with a scholar." },
      { heading: "AI Assistant Disclaimer", body: "The AI assistant (IhsanAI) provides responses based on its training data. While we have configured it to only reference the Quran, authentic Hadith, and scholarly consensus, AI can make mistakes. Always verify important religious rulings independently." },
      { heading: "Financial Data", body: "Metal prices (gold and silver) are fetched from public APIs and may have slight delays or discrepancies compared to local market prices. Currency exchange rates are approximate. For large zakat payments, verify current prices with local dealers." },
      { heading: "Salat & Ramadan Tracker", body: "The salat tracker and Ramadan tracker are personal worship logging tools. They do not determine the validity of your prayers or fasting — only you and Allah know the quality of your ibadah. Streak counts, completion rates, and statistics are motivational aids, not religious judgements." },
      { heading: "Islamic Calendar Accuracy", body: "Hijri dates are calculated using the Umm al-Qura calendar with country-specific moon sighting adjustments. Actual Hijri dates may differ based on local moon sighting committees. Islamic occasion banners (Jummah, Ramadan, Eid, etc.) are based on calculated dates and may not match official local announcements. Always follow your local Islamic authority for confirmed dates." },
      { heading: "Prayer Times & Qibla", body: "Prayer times are calculated using mathematical formulas based on your GPS coordinates. Results may vary slightly from your local mosque schedule. Qibla direction uses the great circle method. For precise direction, verify with a physical compass or your local mosque." },
      { heading: "No Warranty", body: "This tool is provided 'as is' without warranty of any kind. The developers are not liable for any errors in calculations, incorrect rulings, or financial decisions made based on this tool." },
      { heading: "Attribution", body: "If you use or fork this project, please maintain attribution to the original project (IhsanWealth) and its developer. This is not a legal requirement but an Islamic courtesy (giving credit where due)." },
      { heading: "Contributions", body: "We welcome contributions from the community. Whether it is code improvements, translations, bug reports, or Islamic content corrections — all contributions help make this tool better for the Ummah." },
    ],
  },
  bn: {
    title: "ব্যবহারের অধিকার",
    lastUpdated: "সর্বশেষ আপডেট: মার্চ ২০২৬",
    sections: [
      { heading: "ওপেন সোর্স", body: "ইহসান ওয়েলথ মুসলিম উম্মাহর জন্য নির্মিত একটি ওপেন সোর্স প্রকল্প। সোর্স কোড শেখা, অবদান এবং কমিউনিটির সুবিধার জন্য GitHub-এ অবাধে পাওয়া যায়।" },
      { heading: "অনুমোদিত ব্যবহার", body: "আপনি অবাধে: ব্যক্তিগত যাকাত হিসাবের জন্য ক্যালকুলেটর ও সকল টুল ব্যবহার করতে পারেন, ওয়েবসাইট অন্যদের সাথে শেয়ার করতে পারেন, অ-বাণিজ্যিক উদ্দেশ্যে সোর্স কোড ফর্ক ও পরিবর্তন করতে পারেন।" },
      { heading: "ইসলামিক বিষয়বস্তু দাবিত্যাগ", body: "সকল ইসলামিক বিষয়বস্তু (কুরআনের আয়াত, হাদীস, দু'আ এবং ফতোয়া) শুধুমাত্র শিক্ষামূলক ও দিকনির্দেশনার উদ্দেশ্যে প্রদান করা হয়েছে। এটি যোগ্য ইসলামিক পণ্ডিতের (মুফতী) পরামর্শের বিকল্প নয়।" },
      { heading: "AI সহায়ক দাবিত্যাগ", body: "AI সহায়ক (ইহসান AI) তার প্রশিক্ষণ ডেটার ভিত্তিতে প্রতিক্রিয়া দেয়। আমরা এটিকে শুধুমাত্র কুরআন, প্রামাণিক হাদীস এবং পণ্ডিতদের ঐকমত্যের রেফারেন্স দেওয়ার জন্য কনফিগার করলেও AI ভুল করতে পারে।" },
      { heading: "আর্থিক তথ্য", body: "ধাতুর দাম (সোনা ও রূপা) পাবলিক API থেকে নেওয়া হয় এবং স্থানীয় বাজারের দামের তুলনায় সামান্য বিলম্ব বা অসঙ্গতি থাকতে পারে।" },
      { heading: "নামায ও রমজান ট্র্যাকার", body: "নামায ট্র্যাকার ও রমজান ট্র্যাকার ব্যক্তিগত ইবাদত লগিং টুল। এগুলো আপনার নামায বা রোযার বৈধতা নির্ধারণ করে না — আপনার ইবাদতের মান শুধুমাত্র আপনি ও আল্লাহ জানেন। স্ট্রিক সংখ্যা, সম্পন্নতার হার এবং পরিসংখ্যান অনুপ্রেরণামূলক সহায়ক, ধর্মীয় বিচার নয়।" },
      { heading: "ইসলামিক ক্যালেন্ডারের সঠিকতা", body: "হিজরি তারিখ উম্মুল কুরা ক্যালেন্ডার ব্যবহার করে দেশভিত্তিক চাঁদ দেখার সমন্বয়ের মাধ্যমে গণনা করা হয়। প্রকৃত হিজরি তারিখ স্থানীয় চাঁদ দেখা কমিটির ভিত্তিতে ভিন্ন হতে পারে। ইসলামিক উপলক্ষ ব্যানার (জুম্মা, রমজান, ঈদ ইত্যাদি) গণনাকৃত তারিখের উপর ভিত্তি করে এবং স্থানীয় আনুষ্ঠানিক ঘোষণার সাথে মিলে না যেতে পারে। নিশ্চিত তারিখের জন্য সর্বদা আপনার স্থানীয় ইসলামিক কর্তৃপক্ষ অনুসরণ করুন।" },
      { heading: "নামাযের সময় ও কিবলা", body: "নামাযের সময় আপনার GPS স্থানাঙ্কের উপর ভিত্তি করে গাণিতিক সূত্র ব্যবহার করে গণনা করা হয়। ফলাফল আপনার স্থানীয় মসজিদের সময়সূচী থেকে সামান্য ভিন্ন হতে পারে। কিবলার দিক গ্রেট সার্কেল পদ্ধতি ব্যবহার করে। সঠিক দিকের জন্য একটি ভৌত কম্পাস বা আপনার স্থানীয় মসজিদের সাথে যাচাই করুন।" },
      { heading: "কোনো ওয়ারেন্টি নেই", body: "এই টুলটি কোনো প্রকার ওয়ারেন্টি ছাড়াই 'যেমন আছে' ভিত্তিতে প্রদান করা হয়েছে। হিসাবের ত্রুটি, ভুল ফতোয়া বা এই টুলের ভিত্তিতে নেওয়া আর্থিক সিদ্ধান্তের জন্য ডেভেলপাররা দায়ী নন।" },
      { heading: "অবদান", body: "আমরা কমিউনিটির অবদান স্বাগত জানাই। কোড উন্নতি, অনুবাদ, বাগ রিপোর্ট বা ইসলামিক বিষয়বস্তু সংশোধন — সকল অবদান এই টুলটিকে উম্মাহর জন্য আরও ভালো করতে সাহায্য করে।" },
    ],
  },
  ur: {
    title: "استعمال کے حقوق",
    lastUpdated: "آخری تازہ کاری: مارچ ۲۰۲۶",
    sections: [
      { heading: "اوپن سورس", body: "احسان ویلتھ مسلم امہ کے لیے بنایا گیا ایک اوپن سورس پروجیکٹ ہے۔ سورس کوڈ سیکھنے، تعاون اور کمیونٹی کے فائدے کے لیے GitHub پر آزادانہ دستیاب ہے۔" },
      { heading: "اجازت شدہ استعمال", body: "آپ آزادانہ طور پر: ذاتی زکوٰۃ حسابات کے لیے کیلکولیٹر استعمال کر سکتے ہیں، ویب سائٹ دوسروں کے ساتھ شیئر کر سکتے ہیں اور غیر تجارتی مقاصد کے لیے سورس کوڈ فورک اور ترمیم کر سکتے ہیں۔" },
      { heading: "اسلامی مواد کی تردید", body: "تمام اسلامی مواد (قرآنی آیات، حدیث، دعائیں اور فتاویٰ) صرف تعلیمی اور رہنمائی کے مقاصد کے لیے فراہم کیا گیا ہے۔ یہ مستند عالم (مفتی) سے مشورے کا متبادل نہیں ہے۔" },
      { heading: "AI معاون کی تردید", body: "AI معاون اپنے تربیتی ڈیٹا کی بنیاد پر جوابات دیتا ہے۔ اگرچہ ہم نے اسے صرف قرآن، صحیح حدیث اور علماء کے اجماع کا حوالہ دینے کے لیے ترتیب دیا ہے، AI غلطیاں کر سکتا ہے۔" },
      { heading: "مالی ڈیٹا", body: "دھاتوں کی قیمتیں (سونا اور چاندی) عوامی APIs سے حاصل کی جاتی ہیں اور مقامی بازار کی قیمتوں سے قدرے مختلف ہو سکتی ہیں۔" },
      { heading: "نماز اور رمضان ٹریکر", body: "نماز ٹریکر اور رمضان ٹریکر ذاتی عبادت لاگنگ ٹولز ہیں۔ یہ آپ کی نمازوں یا روزوں کی صحت کا تعین نہیں کرتے — آپ کی عبادت کا معیار صرف آپ اور اللہ جانتے ہیں۔ سٹریک شمار، تکمیل کی شرح اور اعداد و شمار حوصلہ افزائی کے اوزار ہیں، مذہبی فیصلے نہیں۔" },
      { heading: "اسلامی کیلنڈر کی درستگی", body: "ہجری تاریخیں ام القریٰ کیلنڈر کا استعمال کرتے ہوئے ملکی چاند دیکھنے کی ایڈجسٹمنٹ کے ساتھ شمار کی جاتی ہیں۔ اصل ہجری تاریخیں مقامی رویت ہلال کمیٹی کی بنیاد پر مختلف ہو سکتی ہیں۔ اسلامی مواقع کے بینرز حسابی تاریخوں پر مبنی ہیں۔ تصدیق شدہ تاریخوں کے لیے اپنی مقامی اسلامی اتھارٹی کی پیروی کریں۔" },
      { heading: "نماز کے اوقات اور قبلہ", body: "نماز کے اوقات آپ کے GPS نقاط کی بنیاد پر ریاضیاتی فارمولوں سے شمار کیے جاتے ہیں۔ نتائج آپ کی مقامی مسجد کے شیڈول سے قدرے مختلف ہو سکتے ہیں۔ قبلے کی سمت گریٹ سرکل طریقے سے طے کی جاتی ہے۔ درست سمت کے لیے فزیکل کمپاس یا مقامی مسجد سے تصدیق کریں۔" },
      { heading: "کوئی وارنٹی نہیں", body: "یہ ٹول 'جیسا ہے' کی بنیاد پر بغیر کسی وارنٹی کے فراہم کیا گیا ہے۔ حسابات میں غلطیوں، غلط فتاویٰ یا اس ٹول کی بنیاد پر کیے گئے مالی فیصلوں کے لیے ڈویلپرز ذمہ دار نہیں ہیں۔" },
    ],
  },
  ar: {
    title: "حقوق الاستخدام",
    lastUpdated: "آخر تحديث: مارس ٢٠٢٦",
    sections: [
      { heading: "مفتوح المصدر", body: "إحسان ويلث مشروع مفتوح المصدر مبني للأمة الإسلامية. الكود المصدري متاح مجاناً على GitHub للتعلم والمساهمة وفائدة المجتمع." },
      { heading: "الاستخدام المسموح", body: "يمكنك بحرية: استخدام الحاسبة وجميع الأدوات لحسابات الزكاة الشخصية، مشاركة الموقع مع الآخرين، وتعديل الكود المصدري لأغراض غير تجارية." },
      { heading: "إخلاء مسؤولية المحتوى الإسلامي", body: "جميع المحتوى الإسلامي (آيات القرآن، الأحاديث، الأدعية والفتاوى) مقدم لأغراض تعليمية وإرشادية فقط. هذه الأداة ليست بديلاً عن استشارة عالم إسلامي مؤهل (مفتي)." },
      { heading: "إخلاء مسؤولية المساعد الذكي", body: "يقدم المساعد الذكي إجابات بناءً على بيانات تدريبه. رغم أننا ضبطناه للإشارة فقط إلى القرآن والحديث الصحيح وإجماع العلماء، إلا أن الذكاء الاصطناعي قد يخطئ." },
      { heading: "متتبع الصلاة ورمضان", body: "متتبع الصلاة ومتتبع رمضان أدوات شخصية لتسجيل العبادة. لا تحدد صحة صلاتك أو صيامك — أنت والله فقط تعلمان جودة عبادتك. أعداد السلسلة ومعدلات الإنجاز والإحصائيات وسائل تحفيزية وليست أحكاماً دينية." },
      { heading: "دقة التقويم الإسلامي", body: "يتم حساب التواريخ الهجرية باستخدام تقويم أم القرى مع تعديلات رؤية الهلال حسب البلد. قد تختلف التواريخ الهجرية الفعلية بناءً على لجان رؤية الهلال المحلية. لافتات المناسبات الإسلامية (الجمعة، رمضان، العيد، إلخ) مبنية على تواريخ محسوبة. اتبع دائماً سلطتك الإسلامية المحلية للتواريخ المؤكدة." },
      { heading: "أوقات الصلاة والقبلة", body: "تُحسب أوقات الصلاة باستخدام صيغ رياضية بناءً على إحداثيات GPS الخاصة بك. قد تختلف النتائج قليلاً عن جدول مسجدك المحلي. يتم تحديد اتجاه القبلة بطريقة الدائرة العظمى. للاتجاه الدقيق، تحقق بواسطة بوصلة أو مسجدك المحلي." },
      { heading: "لا ضمان", body: "هذه الأداة مقدمة 'كما هي' بدون أي ضمان. المطورون غير مسؤولين عن أي أخطاء في الحسابات أو الفتاوى أو القرارات المالية المبنية على هذه الأداة." },
    ],
  },
  tr: {
    title: "Kullanım Hakları",
    lastUpdated: "Son guncelleme: Mart 2026",
    sections: [
      { heading: "Acik Kaynak", body: "IhsanWealth, Musluman Ummet icin olusturulmus acik kaynak bir projedir. Kaynak kodu GitHub'da ogrenme, katkı ve topluluk yararına serbestce mevcuttur." },
      { heading: "Izin Verilen Kullanım", body: "Hesap makinesini ve tum araclari kisisel zekat hesaplamaları icin kullanabilir, web sitesini baskalarıyla paylasabilir ve kaynak kodunu ticari olmayan amaclarla degistirebilirsiniz." },
      { heading: "Namaz ve Ramazan Takipcisi", body: "Namaz takipcisi ve Ramazan takipcisi kisisel ibadet kayıt araclarıdır. Namazlarınızın veya orucunuzun gecerliligin belirlemez — ibadetnizin kalitesini sadece siz ve Allah bilir. Seri sayıları, tamamlanma oranları ve istatistikler motivasyon araclarıdır, dini hukumler degildir." },
      { heading: "Islam Takvimi Dogrulugu", body: "Hicri tarihler, ulkeye ozgu hilal gozlem ayarlamalarıyla Ummu'l-Kura takvimi kullanılarak hesaplanır. Gercek hicri tarihler yerel hilal gozlem komitelerine gore farklılık gosterebilir. Islam bayramı ve onemli gun afisleri hesaplanmıs tarihlere dayanır. Kesinlesmis tarihler icin her zaman yerel Islam otoritenizi takip edin." },
      { heading: "Namaz Vakitleri ve Kıble", body: "Namaz vakitleri GPS koordinatlarınıza dayalı matematiksel formullerle hesaplanır. Sonuclar yerel caminizin programından biraz farklı olabilir. Kıble yonu buyuk daire yontemiyle belirlenir. Kesin yon icin fiziksel pusula veya yerel caminizle dogrulayin." },
      { heading: "Sorumluluk Reddi", body: "Bu arac herhangi bir garanti olmaksızın 'oldugu gibi' sunulmaktadır. Hesaplama hataları veya bu araca dayalı mali kararlar icin gelistiriciler sorumlu degildir." },
    ],
  },
  ms: {
    title: "Hak Penggunaan",
    lastUpdated: "Kemaskini terakhir: Mac 2026",
    sections: [
      { heading: "Sumber Terbuka", body: "IhsanWealth adalah projek sumber terbuka untuk Ummah Muslim. Kod sumber tersedia secara percuma di GitHub untuk pembelajaran, sumbangan dan manfaat komuniti." },
      { heading: "Penggunaan Dibenarkan", body: "Anda bebas menggunakan kalkulator untuk pengiraan zakat peribadi, berkongsi laman web, dan mengubah kod sumber untuk tujuan bukan komersial." },
      { heading: "Penjejak Solat & Ramadan", body: "Penjejak solat dan penjejak Ramadan adalah alat pencatatan ibadah peribadi. Ia tidak menentukan kesahihan solat atau puasa anda — hanya anda dan Allah yang mengetahui kualiti ibadah anda. Kiraan siri, kadar penyelesaian dan statistik adalah alat motivasi, bukan penghakiman agama." },
      { heading: "Ketepatan Kalendar Islam", body: "Tarikh Hijri dikira menggunakan kalendar Umm al-Qura dengan pelarasan pencerapan anak bulan mengikut negara. Tarikh Hijri sebenar mungkin berbeza berdasarkan jawatankuasa pencerapan anak bulan tempatan. Sepanduk peristiwa Islam berdasarkan tarikh yang dikira. Sentiasa ikut pihak berkuasa Islam tempatan untuk tarikh yang disahkan." },
      { heading: "Waktu Solat & Kiblat", body: "Waktu solat dikira menggunakan formula matematik berdasarkan koordinat GPS anda. Keputusan mungkin sedikit berbeza daripada jadual masjid tempatan anda. Arah kiblat menggunakan kaedah bulatan besar. Untuk arah yang tepat, sahkan dengan kompas fizikal atau masjid tempatan anda." },
      { heading: "Penafian", body: "Alat ini disediakan 'seadanya' tanpa sebarang waranti. Pembangun tidak bertanggungjawab atas kesilapan pengiraan atau keputusan kewangan berdasarkan alat ini." },
    ],
  },
  id: {
    title: "Hak Penggunaan",
    lastUpdated: "Terakhir diperbarui: Maret 2026",
    sections: [
      { heading: "Sumber Terbuka", body: "IhsanWealth adalah proyek sumber terbuka untuk Ummah Muslim. Kode sumber tersedia secara gratis di GitHub untuk pembelajaran, kontribusi, dan manfaat komunitas." },
      { heading: "Penggunaan yang Diizinkan", body: "Anda bebas menggunakan kalkulator untuk perhitungan zakat pribadi, membagikan situs web, dan memodifikasi kode sumber untuk tujuan non-komersial." },
      { heading: "Pelacak Shalat & Ramadan", body: "Pelacak shalat dan pelacak Ramadan adalah alat pencatatan ibadah pribadi. Alat ini tidak menentukan keabsahan shalat atau puasa Anda — hanya Anda dan Allah yang mengetahui kualitas ibadah Anda. Hitungan streak, tingkat penyelesaian, dan statistik adalah alat motivasi, bukan penilaian agama." },
      { heading: "Akurasi Kalender Islam", body: "Tanggal Hijri dihitung menggunakan kalender Umm al-Qura dengan penyesuaian pengamatan hilal berdasarkan negara. Tanggal Hijri aktual mungkin berbeda berdasarkan komite pengamatan hilal lokal. Spanduk peristiwa Islam berdasarkan tanggal yang dihitung. Selalu ikuti otoritas Islam lokal Anda untuk tanggal yang dikonfirmasi." },
      { heading: "Waktu Shalat & Kiblat", body: "Waktu shalat dihitung menggunakan rumus matematika berdasarkan koordinat GPS Anda. Hasil mungkin sedikit berbeda dari jadwal masjid lokal Anda. Arah kiblat menggunakan metode lingkaran besar. Untuk arah yang tepat, verifikasi dengan kompas fisik atau masjid lokal Anda." },
      { heading: "Penyangkalan", body: "Alat ini disediakan 'apa adanya' tanpa jaminan apapun. Pengembang tidak bertanggung jawab atas kesalahan perhitungan atau keputusan keuangan berdasarkan alat ini." },
    ],
  },
};

export default function UsageRightsPage() {
  const [formData] = useLocalStorage<ZakatFormData>("zakat-calculator-data", DEFAULT_FORM_DATA);
  const countryCode = formData.country;
  const lang = getLangFromCountry(countryCode);
  const content = USAGE_CONTENT[lang] || USAGE_CONTENT.en;
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
