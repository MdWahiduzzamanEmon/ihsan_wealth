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
import type { ZakatFormData, NisabBasis } from "@/types/zakat";
import type { MetalPrices } from "@/hooks/use-metal-prices";
import type { TransLang } from "@/lib/islamic-content";
import { t, biDesc } from "@/lib/form-translations";
import { formatCurrency } from "@/lib/format";
import { NISAB_GOLD_GRAMS, NISAB_SILVER_GRAMS } from "@/lib/constants";
import { MapPin, Globe, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CountryStepProps {
  formData: ZakatFormData;
  onChange: (updates: Partial<ZakatFormData>) => void;
  prices: MetalPrices | null;
  pricesLoading: boolean;
  detectedCountry?: string | null;
  lang: TransLang;
}

export function CountryStep({ formData, onChange, prices, pricesLoading, detectedCountry, lang }: CountryStepProps) {
  const [countryOpen, setCountryOpen] = useState(false);
  const isLocal = lang !== "en";
  const detectedInfo = detectedCountry ? COUNTRIES.find((c) => c.code === detectedCountry) : null;
  const selectedCountry = COUNTRIES.find((c) => c.code === formData.country);
  const nisabGold = prices ? NISAB_GOLD_GRAMS * prices.goldPricePerGram : 0;
  const nisabSilver = prices ? NISAB_SILVER_GRAMS * prices.silverPricePerGram : 0;

  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* Auto-detected banner */}
      {detectedInfo && (
        <motion.div
          variants={staggerItem}
          className="flex items-center gap-3 rounded-xl border-2 border-emerald-200 bg-emerald-50/80 p-4"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
            <MapPin className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-emerald-800">
              <span className="font-arabic text-emerald-600 ml-1">تم الكشف</span> &mdash; Location Detected
            </p>
            <p className="text-xs text-emerald-600">
              We detected you are in <strong>{detectedInfo.flag} {detectedInfo.name}</strong>. Currency set to <strong>{detectedInfo.currency}</strong>.
            </p>
          </div>
          {formData.country === detectedCountry && (
            <Badge className="bg-emerald-600 text-white">Auto-selected</Badge>
          )}
        </motion.div>
      )}

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
            className="w-full flex items-center justify-between rounded-lg border-2 border-emerald-200 bg-emerald-50/50 p-3 hover:bg-emerald-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              {selectedCountry && (
                <>
                  <span className="text-2xl">{selectedCountry.flag}</span>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-emerald-800">{selectedCountry.name}</p>
                    <p className="text-xs text-emerald-600">{selectedCountry.currency} ({selectedCountry.currencySymbol})</p>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{countryOpen ? "Collapse" : "Change country"}</span>
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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                  {COUNTRIES.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => {
                        onChange({ country: country.code, currency: country.currency });
                        setCountryOpen(false);
                      }}
                      className={cn(
                        "relative flex items-center gap-2 rounded-lg border-2 p-3 text-left transition-all hover:border-emerald-300 hover:bg-emerald-50/50",
                        formData.country === country.code
                          ? "border-emerald-600 bg-emerald-50 shadow-sm"
                          : "border-muted",
                        detectedCountry === country.code && formData.country !== country.code
                          && "ring-2 ring-emerald-200 ring-offset-1"
                      )}
                    >
                      {detectedCountry === country.code && (
                        <div className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-emerald-500 flex items-center justify-center">
                          <MapPin className="h-2.5 w-2.5 text-white" />
                        </div>
                      )}
                      <span className="text-xl">{country.flag}</span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{country.name}</p>
                        <p className="text-xs text-muted-foreground">{country.currency}</p>
                      </div>
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
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-amber-700/70">{isLocal ? t(lang, "perGram") : "Per Gram"}</span>
                    <span className="font-bold text-amber-900 text-base">{selectedCountry?.currencySymbol}{prices.goldPricePerGram.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-amber-700/70">{isLocal ? t(lang, "perTola") : "Per Tola"}</span>
                    <span className="font-semibold text-amber-900">{selectedCountry?.currencySymbol}{prices.goldPricePerTola.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-amber-700/70">{isLocal ? t(lang, "perTroyOz") : "Per Troy Oz"}</span>
                    <span className="font-semibold text-amber-900">{selectedCountry?.currencySymbol}{prices.goldPricePerOunce.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
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
                <p className="text-lg font-bold text-amber-900">
                  {formatCurrency(nisabGold, formData.currency)}
                </p>
              ) : (
                <p className="text-sm text-red-400">{isLocal ? t(lang, "priceUnavailable") : "Price unavailable"}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {(isLocal ? t(lang, "basedOnGold") : "Based on {amount}g of pure gold").replace("{amount}", String(NISAB_GOLD_GRAMS))}
              </p>
            </button>
          </div>
        </SectionCard>
      </motion.div>
    </motion.div>
  );
}
