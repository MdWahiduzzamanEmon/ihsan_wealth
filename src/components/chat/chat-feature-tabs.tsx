"use client";

import { BookOpen, Calculator, Heart, PieChart } from "lucide-react";
import type { ChatFeature } from "@/types/chat";
import type { TransLang } from "@/lib/islamic-content";
import { CHAT_TEXTS } from "@/lib/chat/constants";

const FEATURES: { id: ChatFeature; icon: typeof BookOpen }[] = [
  { id: "islamic-qa", icon: BookOpen },
  { id: "asset-help", icon: Calculator },
  { id: "dua-recommendation", icon: Heart },
  { id: "distribution-planner", icon: PieChart },
];

interface ChatFeatureTabsProps {
  active: ChatFeature;
  onChange: (f: ChatFeature) => void;
  lang: TransLang;
}

export function ChatFeatureTabs({ active, onChange, lang }: ChatFeatureTabsProps) {
  const t = CHAT_TEXTS[lang];

  const labels: Record<ChatFeature, string> = {
    "islamic-qa": t.islamicQA,
    "asset-help": t.assetHelp,
    "dua-recommendation": t.duaRecommend,
    "distribution-planner": t.distribution,
  };

  return (
    <div className="flex gap-1 overflow-x-auto px-1 py-1 no-scrollbar">
      {FEATURES.map(({ id, icon: Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              isActive
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Icon className="h-3 w-3" />
            {labels[id]}
          </button>
        );
      })}
    </div>
  );
}
