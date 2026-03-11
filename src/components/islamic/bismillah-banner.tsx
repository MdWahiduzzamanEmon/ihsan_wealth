"use client";

import { BISMILLAH, getLangFromCountry } from "@/lib/islamic-content";
import { AnimatedPattern } from "@/components/ui/animated-pattern";

interface BismillahBannerProps {
  countryCode?: string;
}

export function BismillahBanner({ countryCode = "US" }: BismillahBannerProps) {
  const lang = getLangFromCountry(countryCode);
  const translation = BISMILLAH.translations[lang] || BISMILLAH.translations.en;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 py-5">
      {/* Animated geometric pattern */}
      <AnimatedPattern opacity={0.07} color="amber" density="dense" />

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
