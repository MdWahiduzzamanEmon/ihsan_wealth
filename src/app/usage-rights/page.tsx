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
      { heading: "لا ضمان", body: "هذه الأداة مقدمة 'كما هي' بدون أي ضمان. المطورون غير مسؤولين عن أي أخطاء في الحسابات أو الفتاوى أو القرارات المالية المبنية على هذه الأداة." },
    ],
  },
  tr: {
    title: "Kullanım Hakları",
    lastUpdated: "Son guncelleme: Mart 2026",
    sections: [
      { heading: "Acik Kaynak", body: "IhsanWealth, Musluman Ummet icin olusturulmus acik kaynak bir projedir. Kaynak kodu GitHub'da ogrenme, katkı ve topluluk yararına serbestce mevcuttur." },
      { heading: "Izin Verilen Kullanım", body: "Hesap makinesini ve tum araclari kisisel zekat hesaplamaları icin kullanabilir, web sitesini baskalarıyla paylasabilir ve kaynak kodunu ticari olmayan amaclarla degistirebilirsiniz." },
      { heading: "Sorumluluk Reddi", body: "Bu arac herhangi bir garanti olmaksızın 'oldugu gibi' sunulmaktadır. Hesaplama hataları veya bu araca dayalı mali kararlar icin gelistiriciler sorumlu degildir." },
    ],
  },
  ms: {
    title: "Hak Penggunaan",
    lastUpdated: "Kemaskini terakhir: Mac 2026",
    sections: [
      { heading: "Sumber Terbuka", body: "IhsanWealth adalah projek sumber terbuka untuk Ummah Muslim. Kod sumber tersedia secara percuma di GitHub untuk pembelajaran, sumbangan dan manfaat komuniti." },
      { heading: "Penggunaan Dibenarkan", body: "Anda bebas menggunakan kalkulator untuk pengiraan zakat peribadi, berkongsi laman web, dan mengubah kod sumber untuk tujuan bukan komersial." },
      { heading: "Penafian", body: "Alat ini disediakan 'seadanya' tanpa sebarang waranti. Pembangun tidak bertanggungjawab atas kesilapan pengiraan atau keputusan kewangan berdasarkan alat ini." },
    ],
  },
  id: {
    title: "Hak Penggunaan",
    lastUpdated: "Terakhir diperbarui: Maret 2026",
    sections: [
      { heading: "Sumber Terbuka", body: "IhsanWealth adalah proyek sumber terbuka untuk Ummah Muslim. Kode sumber tersedia secara gratis di GitHub untuk pembelajaran, kontribusi, dan manfaat komunitas." },
      { heading: "Penggunaan yang Diizinkan", body: "Anda bebas menggunakan kalkulator untuk perhitungan zakat pribadi, membagikan situs web, dan memodifikasi kode sumber untuk tujuan non-komersial." },
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
