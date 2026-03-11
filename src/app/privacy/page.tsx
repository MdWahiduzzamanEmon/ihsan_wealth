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
      { heading: "Data We Collect", body: "We collect only the data you voluntarily provide: email address for authentication, zakat calculation records, sadaqah donation logs, and zakat payment records. We also collect your approximate location (via timezone/IP) solely to determine your local currency and prayer times." },
      { heading: "How We Use Your Data", body: "Your data is used exclusively to: provide personalized zakat calculations, display your history and payment tracking, show local prayer times and Qibla direction, and power the AI assistant's personalized responses (read-only access to your records)." },
      { heading: "Data Storage", body: "All user data is stored securely in Supabase with Row Level Security (RLS) enabled. This means your data can only be accessed by you when authenticated. No other user or administrator can view your financial records." },
      { heading: "AI Assistant", body: "Our AI assistant (IhsanAI) can read your saved records to provide personalized guidance. It never writes to or modifies your data. Conversations with the AI are not stored on our servers. The AI uses OpenRouter's API for processing." },
      { heading: "Third-Party Services", body: "We use the following third-party services: Supabase (authentication and database), OpenRouter (AI chat processing), gold-api.com and Swissquote (metal price data), public currency exchange APIs, and Aladhan API (prayer times). We do not sell or share your personal data with any third party." },
      { heading: "Cookies & Local Storage", body: "We use browser local storage to remember your preferences (selected country, language, theme). We do not use tracking cookies or analytics." },
      { heading: "Your Rights", body: "You have the right to: access all your stored data, delete your account and all associated data, export your zakat and sadaqah records. To exercise these rights, contact us through GitHub." },
      { heading: "Contact", body: "For privacy concerns, please open an issue at our GitHub repository or contact the developer directly through the links in the footer." },
    ],
  },
  bn: {
    title: "প্রাইভেসী পলিসি",
    lastUpdated: "সর্বশেষ আপডেট: মার্চ ২০২৬",
    sections: [
      { heading: "ভূমিকা", body: "ইহসান ওয়েলথ আপনার গোপনীয়তা রক্ষায় প্রতিশ্রুতিবদ্ধ। এই পলিসি ব্যাখ্যা করে কিভাবে আমরা আপনার তথ্য সংগ্রহ, ব্যবহার এবং সুরক্ষিত রাখি।" },
      { heading: "আমরা যে তথ্য সংগ্রহ করি", body: "আমরা শুধুমাত্র আপনার স্বেচ্ছায় প্রদত্ত তথ্য সংগ্রহ করি: প্রমাণীকরণের জন্য ইমেইল ঠিকানা, যাকাত হিসাবের রেকর্ড, সদকা দানের লগ এবং যাকাত পরিশোধের রেকর্ড। আমরা স্থানীয় মুদ্রা ও নামাযের সময় নির্ধারণের জন্য আপনার আনুমানিক অবস্থানও সংগ্রহ করি।" },
      { heading: "আমরা কিভাবে আপনার তথ্য ব্যবহার করি", body: "আপনার তথ্য শুধুমাত্র ব্যক্তিগতকৃত যাকাত হিসাব, ইতিহাস ও পেমেন্ট ট্র্যাকিং, স্থানীয় নামাযের সময় ও কিবলার দিক নির্ণয় এবং AI সহায়কের ব্যক্তিগতকৃত প্রতিক্রিয়ার জন্য ব্যবহৃত হয়।" },
      { heading: "তথ্য সংরক্ষণ", body: "সকল ব্যবহারকারীর তথ্য Row Level Security (RLS) সক্রিয় Supabase-এ নিরাপদে সংরক্ষিত। এর মানে হল আপনার তথ্য শুধুমাত্র আপনি প্রমাণীকৃত অবস্থায় অ্যাক্সেস করতে পারবেন।" },
      { heading: "AI সহায়ক", body: "আমাদের AI সহায়ক (ইহসান AI) আপনার সংরক্ষিত রেকর্ড পড়তে পারে। এটি কখনো আপনার তথ্য পরিবর্তন করে না। AI-এর সাথে কথোপকথন আমাদের সার্ভারে সংরক্ষিত হয় না।" },
      { heading: "তৃতীয় পক্ষের সেবা", body: "আমরা Supabase (প্রমাণীকরণ ও ডেটাবেস), OpenRouter (AI চ্যাট), gold-api.com (ধাতুর দাম), মুদ্রা বিনিময় API এবং Aladhan API (নামাযের সময়) ব্যবহার করি। আমরা আপনার ব্যক্তিগত তথ্য কোনো তৃতীয় পক্ষের কাছে বিক্রি বা শেয়ার করি না।" },
      { heading: "আপনার অধিকার", body: "আপনার অধিকার রয়েছে: আপনার সকল সংরক্ষিত তথ্য দেখা, আপনার অ্যাকাউন্ট ও সংশ্লিষ্ট সকল তথ্য মুছে ফেলা, আপনার যাকাত ও সদকা রেকর্ড রপ্তানি করা।" },
      { heading: "যোগাযোগ", body: "গোপনীয়তা সংক্রান্ত উদ্বেগের জন্য আমাদের GitHub রিপোজিটরিতে একটি ইস্যু খুলুন অথবা ফুটারের লিংকের মাধ্যমে সরাসরি ডেভেলপারের সাথে যোগাযোগ করুন।" },
    ],
  },
  ur: {
    title: "رازداری کی پالیسی",
    lastUpdated: "آخری تازہ کاری: مارچ ۲۰۲۶",
    sections: [
      { heading: "تعارف", body: "احسان ویلتھ آپ کی رازداری کے تحفظ کے لیے پرعزم ہے۔ یہ پالیسی بتاتی ہے کہ ہم آپ کی معلومات کیسے جمع، استعمال اور محفوظ رکھتے ہیں۔" },
      { heading: "ہم کون سا ڈیٹا جمع کرتے ہیں", body: "ہم صرف وہ ڈیٹا جمع کرتے ہیں جو آپ رضاکارانہ طور پر فراہم کرتے ہیں: ای میل پتہ، زکوٰۃ کے حسابات، صدقہ کے ریکارڈ اور زکوٰۃ کی ادائیگیوں کے ریکارڈ۔" },
      { heading: "ہم آپ کا ڈیٹا کیسے استعمال کرتے ہیں", body: "آپ کا ڈیٹا صرف ذاتی زکوٰۃ حسابات، تاریخ اور ادائیگی ٹریکنگ، مقامی نماز کے اوقات اور AI معاون کے ذاتی جوابات کے لیے استعمال ہوتا ہے۔" },
      { heading: "ڈیٹا ذخیرہ", body: "تمام صارف ڈیٹا Row Level Security (RLS) کے ساتھ Supabase میں محفوظ طریقے سے ذخیرہ کیا جاتا ہے۔ آپ کا ڈیٹا صرف آپ تک رسائی میں ہے۔" },
      { heading: "AI معاون", body: "ہمارا AI معاون آپ کے محفوظ ریکارڈ پڑھ سکتا ہے لیکن کبھی آپ کا ڈیٹا تبدیل نہیں کرتا۔ AI کے ساتھ گفتگو ہمارے سرورز پر محفوظ نہیں ہوتی۔" },
      { heading: "آپ کے حقوق", body: "آپ کو اپنا تمام ذخیرہ شدہ ڈیٹا دیکھنے، اپنا اکاؤنٹ اور تمام متعلقہ ڈیٹا حذف کرنے اور اپنے ریکارڈ برآمد کرنے کا حق ہے۔" },
      { heading: "رابطہ", body: "رازداری کے خدشات کے لیے ہمارے GitHub ریپوزٹری پر ایک ایشو کھولیں یا فوٹر میں دیے گئے لنکس کے ذریعے ڈیولپر سے رابطہ کریں۔" },
    ],
  },
  ar: {
    title: "سياسة الخصوصية",
    lastUpdated: "آخر تحديث: مارس ٢٠٢٦",
    sections: [
      { heading: "المقدمة", body: "إحسان ويلث ملتزم بحماية خصوصيتك. توضح هذه السياسة كيف نجمع معلوماتك ونستخدمها ونحافظ عليها." },
      { heading: "البيانات التي نجمعها", body: "نجمع فقط البيانات التي تقدمها طوعاً: عنوان البريد الإلكتروني، سجلات حساب الزكاة، سجلات الصدقة، وسجلات دفع الزكاة." },
      { heading: "كيف نستخدم بياناتك", body: "تُستخدم بياناتك حصرياً لتقديم حسابات زكاة مخصصة وعرض السجل والتتبع وأوقات الصلاة المحلية واستجابات المساعد الذكي." },
      { heading: "تخزين البيانات", body: "يتم تخزين جميع بيانات المستخدم بشكل آمن في Supabase مع تفعيل أمان مستوى الصف (RLS). لا يمكن لأي شخص آخر الوصول إلى سجلاتك المالية." },
      { heading: "المساعد الذكي", body: "يمكن لمساعدنا الذكي قراءة سجلاتك المحفوظة لتقديم إرشادات مخصصة. لا يقوم أبداً بتعديل بياناتك. لا يتم تخزين المحادثات على خوادمنا." },
      { heading: "حقوقك", body: "لديك الحق في: الوصول إلى جميع بياناتك المخزنة، حذف حسابك وجميع البيانات المرتبطة، وتصدير سجلاتك." },
      { heading: "التواصل", body: "لمخاوف الخصوصية، يرجى فتح مشكلة في مستودع GitHub الخاص بنا أو التواصل مع المطور مباشرة." },
    ],
  },
  tr: {
    title: "Gizlilik Politikasi",
    lastUpdated: "Son guncelleme: Mart 2026",
    sections: [
      { heading: "Giris", body: "IhsanWealth gizliliginizi korumaya kararlıdir. Bu politika bilgilerinizi nasıl topladıgımızı, kullandıgımızı ve korudugumuzuaçıklar." },
      { heading: "Toplanan Veriler", body: "Yalnızca gonullu olarak saglanan verileri toplarız: e-posta adresi, zekat hesaplama kayıtları, sadaka kayıtları ve zekat odeme kayıtları." },
      { heading: "Veri Kullanımı", body: "Verileriniz yalnızca kisisellestirilmis zekat hesaplamaları, gecmis ve odeme takibi, yerel namaz vakitleri ve AI asistanın kisisellestirilmis yanıtları icin kullanılır." },
      { heading: "Haklarınız", body: "Tum depolanan verilerinize erisme, hesabınızı ve ilgili tum verileri silme ve kayıtlarınızı dısa aktarma hakkına sahipsiniz." },
    ],
  },
  ms: {
    title: "Dasar Privasi",
    lastUpdated: "Kemaskini terakhir: Mac 2026",
    sections: [
      { heading: "Pengenalan", body: "IhsanWealth komited untuk melindungi privasi anda. Dasar ini menerangkan bagaimana kami mengumpul, menggunakan dan melindungi maklumat anda." },
      { heading: "Data Yang Dikumpul", body: "Kami hanya mengumpul data yang anda berikan secara sukarela: alamat e-mel, rekod pengiraan zakat, log sedekah dan rekod pembayaran zakat." },
      { heading: "Penggunaan Data", body: "Data anda digunakan untuk pengiraan zakat peribadi, sejarah dan penjejakan pembayaran, waktu solat tempatan dan respons pembantu AI." },
      { heading: "Hak Anda", body: "Anda berhak untuk: mengakses semua data tersimpan, memadam akaun dan semua data berkaitan, dan mengeksport rekod anda." },
    ],
  },
  id: {
    title: "Kebijakan Privasi",
    lastUpdated: "Terakhir diperbarui: Maret 2026",
    sections: [
      { heading: "Pendahuluan", body: "IhsanWealth berkomitmen untuk melindungi privasi Anda. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda." },
      { heading: "Data yang Dikumpulkan", body: "Kami hanya mengumpulkan data yang Anda berikan secara sukarela: alamat email, catatan perhitungan zakat, log sedekah, dan catatan pembayaran zakat." },
      { heading: "Penggunaan Data", body: "Data Anda digunakan untuk perhitungan zakat pribadi, riwayat dan pelacakan pembayaran, waktu sholat lokal, dan respons asisten AI yang dipersonalisasi." },
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
