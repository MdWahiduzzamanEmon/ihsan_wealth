"use client";

import { Search } from "lucide-react";
import type { TransLang } from "@/lib/islamic-content";
import { HOW_TO_PRAY_TEXTS } from "@/lib/how-to-pray-texts";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  lang: TransLang;
  isRtl: boolean;
}

export function SearchBar({ value, onChange, lang, isRtl }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={HOW_TO_PRAY_TEXTS.searchPlaceholder[lang]}
        className="w-full rounded-xl border border-emerald-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        dir={isRtl ? "rtl" : "ltr"}
      />
    </div>
  );
}
