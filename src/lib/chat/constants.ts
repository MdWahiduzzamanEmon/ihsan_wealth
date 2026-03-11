import type { ChatFeature } from "@/types/chat";
import type { TransLang } from "@/lib/islamic-content";

export const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
export const OPENROUTER_MODEL = "stepfun/step-3.5-flash:free";

export const FEATURE_CONFIG: Record<
  ChatFeature,
  { icon: string; labelKey: string; color: string }
> = {
  "islamic-qa": { icon: "BookOpen", labelKey: "islamicQA", color: "emerald" },
  "asset-help": { icon: "Calculator", labelKey: "assetHelp", color: "blue" },
  "dua-recommendation": { icon: "Heart", labelKey: "duaRecommend", color: "amber" },
  "distribution-planner": { icon: "PieChart", labelKey: "distribution", color: "violet" },
};

export const CHAT_TEXTS: Record<TransLang, {
  title: string;
  placeholder: string;
  islamicQA: string;
  assetHelp: string;
  duaRecommend: string;
  distribution: string;
  thinking: string;
  disclaimer: string;
  clearChat: string;
  suggestedPrompts: Record<ChatFeature, string[]>;
}> = {
  en: {
    title: "IhsanAI Assistant",
    placeholder: "Ask about Zakat, Duas, or Islamic finance...",
    islamicQA: "Islamic Q&A",
    assetHelp: "Asset Guide",
    duaRecommend: "Dua Finder",
    distribution: "Distribution",
    thinking: "Thinking...",
    disclaimer: "AI responses are for guidance only. Always consult a qualified scholar for rulings.",
    clearChat: "Clear Chat",
    suggestedPrompts: {
      "islamic-qa": [
        "Is Zakat due on gold jewelry worn daily?",
        "What is the difference between Zakat and Sadaqah?",
        "Can I pay Zakat in advance?",
      ],
      "asset-help": [
        "I have 50,000 in FDR and 10g gold",
        "I own a rental property worth 2M",
        "I have crypto and mutual funds",
      ],
      "dua-recommendation": [
        "Suggest a dua for morning",
        "Dua for protection from evil",
        "What to say before eating?",
      ],
      "distribution-planner": [
        "How should I distribute my Zakat?",
        "I want to help local poor and debtors",
        "Can I give Zakat to family members?",
      ],
    },
  },
  bn: {
    title: "ইহসান AI সহায়ক",
    placeholder: "যাকাত, দু'আ বা ইসলামী অর্থনীতি সম্পর্কে জিজ্ঞাসা করুন...",
    islamicQA: "ইসলামী প্রশ্নোত্তর",
    assetHelp: "সম্পদ গাইড",
    duaRecommend: "দু'আ খুঁজুন",
    distribution: "বণ্টন",
    thinking: "চিন্তা করছে...",
    disclaimer: "AI উত্তর শুধুমাত্র দিকনির্দেশনার জন্য। গুরুত্বপূর্ণ বিষয়ে একজন যোগ্য আলেমের পরামর্শ নিন।",
    clearChat: "চ্যাট মুছুন",
    suggestedPrompts: {
      "islamic-qa": ["দৈনিক পরিধানের স্বর্ণালঙ্কারে কি যাকাত ফরয?", "যাকাত ও সদকার পার্থক্য কী?", "অগ্রিম যাকাত দেওয়া যায়?"],
      "asset-help": ["আমার ৫০,০০০ টাকা FDR এ আছে এবং ১০ গ্রাম সোনা", "আমার একটি ভাড়ার সম্পত্তি আছে", "আমার ক্রিপ্টো ও মিউচুয়াল ফান্ড আছে"],
      "dua-recommendation": ["সকালের জন্য একটি দু'আ বলুন", "অনিষ্ট থেকে রক্ষার দু'আ", "খাওয়ার আগে কী বলতে হয়?"],
      "distribution-planner": ["আমি কিভাবে যাকাত বণ্টন করব?", "আমি স্থানীয় গরিব ও ঋণগ্রস্তদের সাহায্য করতে চাই", "পরিবারের সদস্যদের যাকাত দেওয়া যায়?"],
    },
  },
  ur: {
    title: "احسان AI معاون",
    placeholder: "زکوٰۃ، دعا یا اسلامی مالیات کے بارے میں پوچھیں...",
    islamicQA: "اسلامی سوال و جواب",
    assetHelp: "اثاثہ گائیڈ",
    duaRecommend: "دعا تلاش",
    distribution: "تقسیم",
    thinking: "سوچ رہا ہے...",
    disclaimer: "AI جوابات صرف رہنمائی کے لیے ہیں۔ اہم مسائل کے لیے مستند عالم سے رجوع کریں۔",
    clearChat: "چیٹ صاف کریں",
    suggestedPrompts: {
      "islamic-qa": ["روزانہ پہنے جانے والے سونے کے زیورات پر زکوٰۃ ہے؟", "زکوٰۃ اور صدقہ میں فرق؟", "کیا زکوٰۃ پیشگی دی جا سکتی ہے؟"],
      "asset-help": ["میرے پاس 50,000 FDR میں اور 10 گرام سونا ہے", "میری کرایے کی جائیداد ہے", "میرے پاس کرپٹو اور میوچول فنڈز ہیں"],
      "dua-recommendation": ["صبح کی دعا بتائیں", "برائی سے حفاظت کی دعا", "کھانے سے پہلے کیا پڑھیں؟"],
      "distribution-planner": ["زکوٰۃ کیسے تقسیم کروں؟", "مقامی غریبوں اور مقروضوں کی مدد کرنا چاہتا ہوں", "کیا خاندان کو زکوٰۃ دے سکتے ہیں؟"],
    },
  },
  ar: {
    title: "مساعد إحسان AI",
    placeholder: "اسأل عن الزكاة أو الأدعية أو المالية الإسلامية...",
    islamicQA: "أسئلة إسلامية",
    assetHelp: "دليل الأصول",
    duaRecommend: "اقتراح دعاء",
    distribution: "توزيع الزكاة",
    thinking: "يفكر...",
    disclaimer: "إجابات الذكاء الاصطناعي للإرشاد فقط. استشر عالماً مؤهلاً للأحكام.",
    clearChat: "مسح المحادثة",
    suggestedPrompts: {
      "islamic-qa": ["هل تجب الزكاة على الذهب الملبوس يومياً؟", "ما الفرق بين الزكاة والصدقة؟", "هل يجوز تعجيل الزكاة؟"],
      "asset-help": ["لدي 50,000 في وديعة و10 غرام ذهب", "أملك عقاراً مؤجراً", "لدي عملات رقمية وصناديق استثمار"],
      "dua-recommendation": ["اقترح دعاء للصباح", "دعاء الحماية من الشر", "ماذا يقال قبل الأكل؟"],
      "distribution-planner": ["كيف أوزع زكاتي؟", "أريد مساعدة الفقراء والمدينين", "هل يجوز إعطاء الزكاة للأقارب؟"],
    },
  },
  tr: {
    title: "IhsanAI Asistan",
    placeholder: "Zekat, dua veya Islami finans hakkinda sorun...",
    islamicQA: "Islami Soru-Cevap",
    assetHelp: "Varlik Rehberi",
    duaRecommend: "Dua Onerisi",
    distribution: "Dagitim",
    thinking: "Dusunuyor...",
    disclaimer: "Yapay zeka yanitlari yalnizca rehberlik icindir. Onemli konularda ehil bir alime danisin.",
    clearChat: "Sohbeti Temizle",
    suggestedPrompts: {
      "islamic-qa": ["Gunluk takilan altin mucevherlere zekat duser mi?", "Zekat ile sadaka arasindaki fark nedir?", "Zekat onceden odenebilir mi?"],
      "asset-help": ["50.000 vadeli mevduatim ve 10g altinim var", "Kiraya verdigim bir mulkum var", "Kripto param ve yatirim fonlarim var"],
      "dua-recommendation": ["Sabah icin bir dua onerin", "Kotulerden korunma duasi", "Yemekten once ne okunur?"],
      "distribution-planner": ["Zekatimi nasil dagitmaliyim?", "Yerel yoksullara ve borclu olanlara yardim etmek istiyorum", "Akrabalara zekat verilir mi?"],
    },
  },
  ms: {
    title: "Pembantu IhsanAI",
    placeholder: "Tanya tentang zakat, doa atau kewangan Islam...",
    islamicQA: "Soal Jawab Islam",
    assetHelp: "Panduan Aset",
    duaRecommend: "Cadangan Doa",
    distribution: "Pengagihan",
    thinking: "Sedang berfikir...",
    disclaimer: "Jawapan AI untuk panduan sahaja. Rujuk ulama yang berkelayakan untuk hukum.",
    clearChat: "Padam Sembang",
    suggestedPrompts: {
      "islamic-qa": ["Adakah zakat wajib atas perhiasan emas yang dipakai setiap hari?", "Apa beza zakat dan sedekah?", "Bolehkah bayar zakat awal?"],
      "asset-help": ["Saya ada 50,000 dalam deposit tetap dan 10g emas", "Saya ada hartanah sewaan", "Saya ada kripto dan dana amanah"],
      "dua-recommendation": ["Cadangkan doa untuk pagi", "Doa perlindungan daripada kejahatan", "Apa yang dibaca sebelum makan?"],
      "distribution-planner": ["Bagaimana saya harus agihkan zakat?", "Saya mahu bantu fakir miskin tempatan", "Bolehkah beri zakat kepada ahli keluarga?"],
    },
  },
  id: {
    title: "Asisten IhsanAI",
    placeholder: "Tanya tentang zakat, doa atau keuangan Islam...",
    islamicQA: "Tanya Jawab Islam",
    assetHelp: "Panduan Aset",
    duaRecommend: "Rekomendasi Doa",
    distribution: "Distribusi",
    thinking: "Sedang berpikir...",
    disclaimer: "Jawaban AI hanya untuk panduan. Konsultasikan dengan ulama yang berkompeten untuk hukum.",
    clearChat: "Hapus Obrolan",
    suggestedPrompts: {
      "islamic-qa": ["Apakah zakat wajib atas perhiasan emas yang dipakai sehari-hari?", "Apa bedanya zakat dan sedekah?", "Bolehkah bayar zakat lebih awal?"],
      "asset-help": ["Saya punya 50 juta di deposito dan 10g emas", "Saya punya properti sewaan", "Saya punya kripto dan reksa dana"],
      "dua-recommendation": ["Sarankan doa untuk pagi hari", "Doa perlindungan dari kejahatan", "Apa yang dibaca sebelum makan?"],
      "distribution-planner": ["Bagaimana cara mendistribusikan zakat saya?", "Saya ingin membantu fakir miskin lokal", "Bolehkah memberikan zakat kepada keluarga?"],
    },
  },
};
