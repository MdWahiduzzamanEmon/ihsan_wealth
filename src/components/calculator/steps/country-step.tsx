"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COUNTRIES } from "@/lib/constants";
import { SectionCard } from "@/components/ui/custom/section-card";
import { LiveBadge } from "@/components/ui/custom/live-badge";
import { PriceSkeleton } from "@/components/ui/custom/loading-skeleton";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { ZakatFormData, NisabBasis, GoldKarat } from "@/types/zakat";
import type { MetalPrices } from "@/hooks/use-metal-prices";
import type { TransLang } from "@/lib/islamic-content";
import { t, biDesc } from "@/lib/form-translations";
import { formatCurrency } from "@/lib/format";
import { NISAB_GOLD_GRAMS, NISAB_SILVER_GRAMS } from "@/lib/constants";
import { MapPin, Globe, ChevronDown } from "lucide-react";

interface CountryStepProps {
  formData: ZakatFormData;
  onChange: (updates: Partial<ZakatFormData>) => void;
  prices: MetalPrices | null;
  pricesLoading: boolean;
  detectedCountry?: string | null;
  lang: TransLang;
}

const GOLD_KARATS: { value: GoldKarat; label: string; purity: number }[] = [
  { value: 22, label: "22K", purity: 22 / 24 },
  { value: 21, label: "21K", purity: 21 / 24 },
  { value: 18, label: "18K", purity: 18 / 24 },
  { value: 24, label: "24K", purity: 1 },
];

export function CountryStep({ formData, onChange, prices, pricesLoading, detectedCountry, lang }: CountryStepProps) {
  const [countryOpen, setCountryOpen] = useState(false);
  const [displayKarat, setDisplayKarat] = useState<GoldKarat>(22);
  const isLocal = lang !== "en";
  const detectedInfo = detectedCountry ? COUNTRIES.find((c) => c.code === detectedCountry) : null;
  const selectedCountry = COUNTRIES.find((c) => c.code === formData.country);
  const nisabGold = prices ? NISAB_GOLD_GRAMS * prices.goldPricePerGram : 0;
  const nisabSilver = prices ? NISAB_SILVER_GRAMS * prices.silverPricePerGram : 0;
  const nisabGoldInKarat = displayKarat < 24 ? (NISAB_GOLD_GRAMS / (displayKarat / 24)).toFixed(2) : null;

  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* Auto-detected inline hint (shown inside the country selector below) */}

      {/* Country Selection - Collapsible */}
      <motion.div variants={staggerItem}>
        <SectionCard
          title={isLocal ? "Select Your Country" : "Select Your Country"}
          titleAr={isLocal ? t(lang, "selectCountry") : "اختر بلدك"}
          description={isLocal ? biDesc(lang, "selectCountry_desc") : "This determines your currency and localizes gold/silver prices"}
          icon={Globe}
        >
          {/* Current selection + toggle */}
          <button
            onClick={() => setCountryOpen(!countryOpen)}
            className="w-full flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50/50 px-3 py-2.5 hover:bg-emerald-50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              {selectedCountry && (
                <>
                  <span className="text-xl">{selectedCountry.flag}</span>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-emerald-800">{selectedCountry.name}</p>
                    <p className="text-xs text-emerald-600">{selectedCountry.currency} ({selectedCountry.currencySymbol})</p>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              {detectedInfo && formData.country === detectedCountry && (
                <span className="flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                  <MapPin className="h-2.5 w-2.5" />
                  <span className="hidden sm:inline">{t(lang, "autoSelected")}</span>
                </span>
              )}
              <ChevronDown className={cn(
                "h-4 w-4 text-emerald-600 transition-transform duration-200",
                countryOpen && "rotate-180"
              )} />
            </div>
          </button>

          <AnimatePresence>
            {countryOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1.5 mt-3">
                  {COUNTRIES.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => {
                        onChange({ country: country.code, currency: country.currency });
                        setCountryOpen(false);
                      }}
                      className={cn(
                        "relative flex flex-col items-center gap-0.5 rounded-md px-1 py-2 text-center transition-all",
                        formData.country === country.code
                          ? "bg-emerald-100 font-semibold"
                          : "hover:bg-gray-50",
                        detectedCountry === country.code && formData.country !== country.code
                          && "bg-emerald-50/60"
                      )}
                    >
                      {detectedCountry === country.code && formData.country !== country.code && (
                        <div className="absolute top-0.5 right-0.5">
                          <MapPin className="h-2.5 w-2.5 text-emerald-500" />
                        </div>
                      )}
                      <span className="text-xl leading-none">{country.flag}</span>
                      <p className="truncate text-[10px] w-full leading-tight mt-0.5">{country.name}</p>
                      <p className="text-[9px] text-muted-foreground leading-none">{country.currency}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </SectionCard>
      </motion.div>

      {/* Live Metal Prices */}
      <motion.div variants={staggerItem}>
        <SectionCard
          title="Live Metal Prices"
          titleAr="أسعار المعادن"
          badge={
            <LiveBadge
              isLive={!!prices?.live}
              loading={pricesLoading && !prices}
              timestamp={prices?.timestamp}
            />
          }
        >
          {pricesLoading && !prices ? (
            <div className="grid grid-cols-2 gap-6">
              <PriceSkeleton />
              <PriceSkeleton />
            </div>
          ) : prices ? (
            <>
            {/* Currency indicator */}
            <div className="mb-3 flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {selectedCountry?.flag} {formData.currency} ({selectedCountry?.currencySymbol})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Gold Prices */}
              <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100/30 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-4 w-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-600" />
                  <span className="font-semibold text-amber-800">Gold</span>
                  <span className="font-arabic text-xs text-amber-500">{isLocal ? t(lang, "gold") : "الذهب"}</span>
                </div>
                {/* Karat selector tabs */}
                <div className="flex gap-1 mb-3">
                  {GOLD_KARATS.map((k) => (
                    <button
                      key={k.value}
                      onClick={() => {
                        setDisplayKarat(k.value);
                        onChange({ goldKarat: k.value });
                      }}
                      className={cn(
                        "flex-1 rounded-md px-2 py-1 text-xs font-semibold transition-all",
                        displayKarat === k.value
                          ? "bg-amber-500 text-white shadow-sm"
                          : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                      )}
                    >
                      {k.label}
                    </button>
                  ))}
                </div>
                {(() => {
                  const karat = GOLD_KARATS.find((k) => k.value === displayKarat)!;
                  const pricePerGram = prices.goldPricePerGram * karat.purity;
                  const pricePerTola = prices.goldPricePerTola * karat.purity;
                  const pricePerOunce = prices.goldPricePerOunce * karat.purity;
                  const fmt = (v: number) => selectedCountry?.currencySymbol + v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                  return (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-amber-700/70">{isLocal ? t(lang, "perGram") : "Per Gram"}</span>
                        <span className="font-bold text-amber-900 text-base">{fmt(pricePerGram)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-amber-700/70">{isLocal ? t(lang, "perTola") : "Per Tola"}</span>
                        <span className="font-semibold text-amber-900">{fmt(pricePerTola)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-amber-700/70">{isLocal ? t(lang, "perTroyOz") : "Per Troy Oz"}</span>
                        <span className="font-semibold text-amber-900">{fmt(pricePerOunce)}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Silver Prices */}
              <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100/30 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-4 w-4 rounded-full bg-gradient-to-br from-gray-300 to-gray-500" />
                  <span className="font-semibold text-gray-700">Silver</span>
                  <span className="font-arabic text-xs text-gray-400">{isLocal ? t(lang, "silver") : "الفضة"}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">{isLocal ? t(lang, "perGram") : "Per Gram"}</span>
                    <span className="font-bold text-gray-900 text-base">{selectedCountry?.currencySymbol}{prices.silverPricePerGram.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">{isLocal ? t(lang, "perTola") : "Per Tola"}</span>
                    <span className="font-semibold text-gray-900">{selectedCountry?.currencySymbol}{prices.silverPricePerTola.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">{isLocal ? t(lang, "perTroyOz") : "Per Troy Oz"}</span>
                    <span className="font-semibold text-gray-900">{selectedCountry?.currencySymbol}{prices.silverPricePerOunce.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            </div>
            </>
          ) : (
            <p className="text-sm text-red-500">{isLocal ? t(lang, "unableToLoadPrices") : "Unable to load prices. Please check your internet connection."}</p>
          )}
          <p className="mt-3 text-xs text-muted-foreground/60">
            Prices update every 10 minutes &middot; Showing in <strong>{formData.currency}</strong>
          </p>
        </SectionCard>
      </motion.div>

      {/* Nisab Display */}
      <motion.div variants={staggerItem}>
        <SectionCard
          title="Current Nisab Threshold"
          titleAr={isLocal ? t(lang, "currentNisab") : "نصاب الزكاة"}
          description={isLocal ? biDesc(lang, "currentNisab_desc") : "Nisab is the minimum wealth threshold for Zakat to be obligatory"}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => onChange({ nisabBasis: "gold" as NisabBasis })}
              className={cn(
                "rounded-xl border-2 p-4 text-left transition-all",
                formData.nisabBasis === "gold"
                  ? "border-amber-400 bg-amber-50 shadow-sm"
                  : "border-muted hover:border-amber-300"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="h-3 w-3 rounded-full bg-amber-500" />
                <Label className="font-semibold text-amber-700">
                  Gold Nisab <span className="font-arabic text-xs text-amber-400">{isLocal ? t(lang, "goldNisab") : "نصاب الذهب"}</span>
                </Label>
                {formData.nisabBasis === "gold" && (
                  <span className="ml-auto text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {isLocal ? t(lang, "selected") : "Selected"}
                  </span>
                )}
              </div>
              {pricesLoading && !prices ? (
                <div className="h-6 w-28 rounded bg-amber-200 animate-pulse" />
              ) : prices ? (
                <>
                  <p className="text-lg font-bold text-amber-900">
                    {formatCurrency(nisabGold, formData.currency)}
                  </p>
                  {nisabGoldInKarat ? (
                    <p className="text-xs text-muted-foreground mt-1">
                      {NISAB_GOLD_GRAMS}g pure gold ≈ <span className="font-semibold text-amber-700">{nisabGoldInKarat}g of {displayKarat}K</span>
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-1">
                      Based on {NISAB_GOLD_GRAMS}g of 24K pure gold
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-red-400">{isLocal ? t(lang, "priceUnavailable") : "Price unavailable"}</p>
              )}
            </button>

            <button
              onClick={() => onChange({ nisabBasis: "silver" as NisabBasis })}
              className={cn(
                "rounded-xl border-2 p-4 text-left transition-all",
                formData.nisabBasis === "silver"
                  ? "border-gray-400 bg-gray-50 shadow-sm"
                  : "border-muted hover:border-gray-300"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="h-3 w-3 rounded-full bg-gray-400" />
                <Label className="font-semibold text-gray-700">
                  Silver Nisab <span className="font-arabic text-xs text-gray-400">{isLocal ? t(lang, "silverNisab") : "نصاب الفضة"}</span>
                </Label>
                {formData.nisabBasis === "silver" && (
                  <span className="ml-auto text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {isLocal ? t(lang, "selected") : "Selected"}
                  </span>
                )}
              </div>
              {pricesLoading && !prices ? (
                <div className="h-6 w-28 rounded bg-gray-200 animate-pulse" />
              ) : prices ? (
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(nisabSilver, formData.currency)}
                </p>
              ) : (
                <p className="text-sm text-red-400">{isLocal ? t(lang, "priceUnavailable") : "Price unavailable"}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {(isLocal ? t(lang, "basedOnSilver") : "Based on {amount}g of silver (recommended by majority scholars)").replace("{amount}", String(NISAB_SILVER_GRAMS))}
              </p>
            </button>
          </div>
        </SectionCard>
      </motion.div>
    </motion.div>
  );
}
