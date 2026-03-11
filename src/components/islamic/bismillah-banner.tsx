"use client";

import { BISMILLAH, getLangFromCountry } from "@/lib/islamic-content";

interface BismillahBannerProps {
  countryCode?: string;
}

export function BismillahBanner({ countryCode = "US" }: BismillahBannerProps) {
  const lang = getLangFromCountry(countryCode);
  const translation = BISMILLAH.translations[lang] || BISMILLAH.translations.en;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 py-5">
      {/* Subtle geometric pattern */}
      <div className="absolute inset-0 opacity-[0.07]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="geo" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="18" fill="none" stroke="white" strokeWidth="0.3" />
              <circle cx="20" cy="20" r="8" fill="none" stroke="white" strokeWidth="0.3" />
              <path d="M20 2L38 20L20 38L2 20Z" fill="none" stroke="white" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#geo)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-5xl px-4 text-center">
        <p className="font-arabic text-3xl md:text-4xl leading-loose text-amber-300/90 tracking-wide">
          {BISMILLAH.arabic}
        </p>
        <p className="mt-1 text-xs text-emerald-300/70 italic tracking-wider">
          {translation}
        </p>
      </div>
    </div>
  );
}
