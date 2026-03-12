"use client";

import { BookOpen, Calculator, Heart, PieChart } from "lucide-react";
import { IhsanLogo } from "./ihsan-logo";
import { CHAT_TEXTS, FEATURE_CONFIG } from "@/lib/chat/constants";
import type { TransLang } from "@/lib/islamic-content";
import type { ChatFeature } from "@/types/chat";

const FEATURE_ICONS: Record<ChatFeature, typeof BookOpen> = {
  "islamic-qa": BookOpen,
  "asset-help": Calculator,
  "dua-recommendation": Heart,
  "distribution-planner": PieChart,
};

const GREETING: Record<TransLang, string> = {
  en: "How can I help you today?",
  bn: "আজ কিভাবে সাহায্য করতে পারি?",
  ur: "آج میں آپ کی کیسے مدد کر سکتا ہوں؟",
  ar: "كيف يمكنني مساعدتك اليوم؟",
  tr: "Bugun size nasil yardimci olabilirim?",
  ms: "Bagaimana saya boleh membantu anda hari ini?",
  id: "Bagaimana saya bisa membantu Anda hari ini?",
};

const FEATURE_DESCRIPTIONS: Record<TransLang, Record<ChatFeature, string>> = {
  en: {
    "islamic-qa": "Ask questions about Islamic rulings, fiqh, and Zakat obligations",
    "asset-help": "Get help calculating Zakat on your specific assets and wealth",
    "dua-recommendation": "Find authentic duas for any occasion or need",
    "distribution-planner": "Plan how to distribute your Zakat among eligible recipients",
  },
  bn: {
    "islamic-qa": "ইসলামী বিধান, ফিকহ ও যাকাত সম্পর্কে প্রশ্ন করুন",
    "asset-help": "আপনার নির্দিষ্ট সম্পদে যাকাত হিসাবে সাহায্য পান",
    "dua-recommendation": "যেকোনো উপলক্ষে প্রামাণিক দু'আ খুঁজুন",
    "distribution-planner": "যোগ্য প্রাপকদের মধ্যে যাকাত বণ্টন পরিকল্পনা করুন",
  },
  ur: {
    "islamic-qa": "اسلامی احکام، فقہ اور زکوٰۃ کے بارے میں سوالات پوچھیں",
    "asset-help": "اپنے مخصوص اثاثوں پر زکوٰۃ حساب میں مدد حاصل کریں",
    "dua-recommendation": "کسی بھی موقع کے لیے مستند دعائیں تلاش کریں",
    "distribution-planner": "مستحقین میں زکوٰۃ تقسیم کی منصوبہ بندی کریں",
  },
  ar: {
    "islamic-qa": "اسأل عن الأحكام الشرعية والفقه والتزامات الزكاة",
    "asset-help": "احصل على مساعدة في حساب الزكاة على أصولك وثروتك",
    "dua-recommendation": "اعثر على أدعية مأثورة لأي مناسبة أو حاجة",
    "distribution-planner": "خطط لتوزيع زكاتك بين المستحقين",
  },
  tr: {
    "islamic-qa": "Islami hukumler, fikih ve zekat yukumlulukleri hakkinda sorular sorun",
    "asset-help": "Belirli varliklariniz uzerindeki zekati hesaplamak icin yardim alin",
    "dua-recommendation": "Her vesile icin sahih dualar bulun",
    "distribution-planner": "Zekatinizi uygun alicilara nasil dagitacaginizi planlayin",
  },
  ms: {
    "islamic-qa": "Tanya soalan tentang hukum Islam, fiqh dan kewajipan zakat",
    "asset-help": "Dapatkan bantuan mengira zakat ke atas aset dan harta anda",
    "dua-recommendation": "Cari doa yang sahih untuk sebarang kesempatan",
    "distribution-planner": "Rancang bagaimana mengagihkan zakat anda kepada yang layak",
  },
  id: {
    "islamic-qa": "Tanyakan tentang hukum Islam, fikih, dan kewajiban zakat",
    "asset-help": "Dapatkan bantuan menghitung zakat atas aset dan harta Anda",
    "dua-recommendation": "Temukan doa-doa autentik untuk setiap kesempatan",
    "distribution-planner": "Rencanakan cara mendistribusikan zakat kepada yang berhak",
  },
};

interface ChatEmptyStateProps {
  lang: TransLang;
  feature: ChatFeature;
  onSend: (text: string) => void;
  onFeatureChange: (f: ChatFeature) => void;
}

export function ChatEmptyState({ lang, feature, onSend, onFeatureChange }: ChatEmptyStateProps) {
  const t = CHAT_TEXTS[lang];
  const prompts = t.suggestedPrompts[feature];
  const isRtl = lang === "ar" || lang === "ur";

  return (
    <div className="flex flex-col items-center justify-center h-full py-6 px-2" dir={isRtl ? "rtl" : undefined}>
      {/* Logo & greeting */}
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center p-2.5 mb-4 shadow-sm">
        <IhsanLogo size={44} />
      </div>
      <p className="font-arabic text-amber-600/70 text-sm mb-1">بِسْمِ اللَّهِ</p>
      <h3 className="text-base font-semibold text-gray-800 mb-1">{t.title}</h3>
      <p className="text-xs text-gray-500 mb-5">{GREETING[lang]}</p>

      {/* Feature cards — 2x2 */}
      <div className="grid grid-cols-2 gap-2 w-full max-w-sm mb-5">
        {(Object.keys(FEATURE_ICONS) as ChatFeature[]).map((f) => {
          const Icon = FEATURE_ICONS[f];
          const isActive = f === feature;
          const label = t[FEATURE_CONFIG[f].labelKey as keyof typeof t] as string;
          return (
            <button
              key={f}
              onClick={() => onFeatureChange(f)}
              className={`flex flex-col items-start gap-1.5 rounded-xl border p-3 text-left transition-all ${
                isActive
                  ? "border-emerald-300 bg-emerald-50/80 shadow-sm"
                  : "border-gray-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/30"
              }`}
            >
              <div className={`flex items-center gap-1.5 ${isActive ? "text-emerald-700" : "text-gray-600"}`}>
                <Icon className="h-3.5 w-3.5" />
                <span className="text-xs font-semibold">{label}</span>
              </div>
              <p className="text-[10px] text-gray-400 leading-snug line-clamp-2">
                {FEATURE_DESCRIPTIONS[lang][f]}
              </p>
            </button>
          );
        })}
      </div>

      {/* Suggested prompts for active feature */}
      <div className="w-full max-w-sm space-y-1.5">
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider px-1">
          {isRtl ? "جرّب هذه الأسئلة" : lang === "bn" ? "এই প্রশ্নগুলো চেষ্টা করুন" : "Try asking"}
        </p>
        {prompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => onSend(prompt)}
            className="w-full text-left rounded-lg border border-gray-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/30 px-3 py-2 text-xs text-gray-600 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
