"use client";

import { BookOpen, Calculator, Heart, PieChart, AlertCircle } from "lucide-react";
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

const SIDEBAR_TEXTS: Record<TransLang, {
  capabilities: string;
  capabilitiesList: string[];
  limitations: string;
  limitationsList: string[];
}> = {
  en: {
    capabilities: "Capabilities",
    capabilitiesList: [
      "Answer Islamic rulings with references",
      "Calculate Zakat on various asset types",
      "Recommend authentic duas with Arabic text",
      "Guide Zakat distribution among recipients",
      "Explain fiqh differences between madhabs",
    ],
    limitations: "Limitations",
    limitationsList: [
      "Cannot issue fatwas or official rulings",
      "May occasionally provide inaccurate info",
      "Not a replacement for qualified scholars",
    ],
  },
  bn: {
    capabilities: "সক্ষমতা",
    capabilitiesList: [
      "রেফারেন্সসহ ইসলামী বিধান জানান",
      "বিভিন্ন সম্পদে যাকাত হিসাব করুন",
      "আরবী সহ প্রামাণিক দু'আ সুপারিশ",
      "প্রাপকদের মধ্যে যাকাত বণ্টন গাইড",
      "মাযহাবভেদে ফিকহের পার্থক্য ব্যাখ্যা",
    ],
    limitations: "সীমাবদ্ধতা",
    limitationsList: [
      "ফতোয়া বা আনুষ্ঠানিক রায় দিতে পারে না",
      "মাঝে মাঝে ভুল তথ্য দিতে পারে",
      "যোগ্য আলেমের বিকল্প নয়",
    ],
  },
  ur: {
    capabilities: "صلاحیتیں",
    capabilitiesList: [
      "حوالوں کے ساتھ اسلامی احکام بتائیں",
      "مختلف اثاثوں پر زکوٰۃ حساب کریں",
      "عربی متن کے ساتھ مستند دعائیں تجویز",
      "مستحقین میں زکوٰۃ تقسیم کی رہنمائی",
      "مذاہب کے فقہی اختلافات کی وضاحت",
    ],
    limitations: "حدود",
    limitationsList: [
      "فتوے یا سرکاری فیصلے جاری نہیں کر سکتا",
      "کبھی کبھار غلط معلومات دے سکتا ہے",
      "مستند علماء کا متبادل نہیں",
    ],
  },
  ar: {
    capabilities: "القدرات",
    capabilitiesList: [
      "الإجابة على الأحكام الشرعية بالمراجع",
      "حساب الزكاة على أنواع مختلفة من الأصول",
      "اقتراح أدعية مأثورة بالنص العربي",
      "إرشاد توزيع الزكاة بين المستحقين",
      "شرح الفروق الفقهية بين المذاهب",
    ],
    limitations: "القيود",
    limitationsList: [
      "لا يصدر فتاوى أو أحكاماً رسمية",
      "قد يقدم معلومات غير دقيقة أحياناً",
      "ليس بديلاً عن العلماء المؤهلين",
    ],
  },
  tr: {
    capabilities: "Yetenekler",
    capabilitiesList: [
      "Kaynaklarla Islami hukumleri cevaplayin",
      "Cesitli varlik turlerinde zekati hesaplayin",
      "Arapca metinle sahih dualar onerin",
      "Alicilar arasinda zekat dagitimini yonlendirin",
      "Mezhepler arasi fikih farklarini aciklayin",
    ],
    limitations: "Sinirlamalar",
    limitationsList: [
      "Fetva veya resmi hukum veremez",
      "Bazen yanlis bilgi verebilir",
      "Ehil alimlerin yerini tutmaz",
    ],
  },
  ms: {
    capabilities: "Keupayaan",
    capabilitiesList: [
      "Jawab hukum Islam dengan rujukan",
      "Kira zakat ke atas pelbagai jenis aset",
      "Cadangkan doa sahih dengan teks Arab",
      "Panduan pengagihan zakat kepada penerima",
      "Jelaskan perbezaan fiqh antara mazhab",
    ],
    limitations: "Had",
    limitationsList: [
      "Tidak boleh mengeluarkan fatwa rasmi",
      "Mungkin memberi maklumat tidak tepat kadang-kala",
      "Bukan pengganti ulama yang berkelayakan",
    ],
  },
  id: {
    capabilities: "Kemampuan",
    capabilitiesList: [
      "Jawab hukum Islam dengan referensi",
      "Hitung zakat berbagai jenis aset",
      "Rekomendasikan doa autentik dengan teks Arab",
      "Panduan distribusi zakat kepada penerima",
      "Jelaskan perbedaan fikih antar mazhab",
    ],
    limitations: "Keterbatasan",
    limitationsList: [
      "Tidak bisa mengeluarkan fatwa resmi",
      "Mungkin memberikan info tidak akurat kadang-kadang",
      "Bukan pengganti ulama yang berkompeten",
    ],
  },
};

interface ChatSidebarProps {
  lang: TransLang;
  activeFeature: ChatFeature;
  onFeatureChange: (f: ChatFeature) => void;
}

export function ChatSidebar({ lang, activeFeature, onFeatureChange }: ChatSidebarProps) {
  const t = CHAT_TEXTS[lang];
  const st = SIDEBAR_TEXTS[lang];
  const isRtl = lang === "ar" || lang === "ur";

  return (
    <div
      className="hidden lg:flex flex-col w-72 border-r border-gray-200 bg-gray-50/50 overflow-y-auto"
      dir={isRtl ? "rtl" : undefined}
    >
      {/* Branding */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center p-1.5">
            <IhsanLogo size={28} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">{t.title}</h2>
            <p className="text-[10px] text-gray-400">Powered by IhsanWealth</p>
          </div>
        </div>
        <p className="font-arabic text-xs text-amber-600/60 mt-1">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
      </div>

      {/* Feature buttons */}
      <div className="px-3 py-4 space-y-1 border-b border-gray-100">
        {(Object.keys(FEATURE_ICONS) as ChatFeature[]).map((f) => {
          const Icon = FEATURE_ICONS[f];
          const isActive = f === activeFeature;
          const label = t[FEATURE_CONFIG[f].labelKey as keyof typeof t] as string;
          return (
            <button
              key={f}
              onClick={() => onFeatureChange(f)}
              className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-medium transition-all ${
                isActive
                  ? "bg-emerald-100 text-emerald-800 shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{label}</span>
            </button>
          );
        })}
      </div>

      {/* Capabilities */}
      <div className="px-4 py-4 border-b border-gray-100">
        <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
          {st.capabilities}
        </h4>
        <ul className="space-y-1.5">
          {st.capabilitiesList.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-[11px] text-gray-600 leading-snug">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Limitations */}
      <div className="px-4 py-4">
        <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {st.limitations}
        </h4>
        <ul className="space-y-1.5">
          {st.limitationsList.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-[11px] text-amber-700/70 leading-snug">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-400" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
