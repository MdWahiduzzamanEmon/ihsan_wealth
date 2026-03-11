"use client";

import { motion } from "framer-motion";
import { SectionCard } from "@/components/ui/custom/section-card";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ZakatFormData, WeightUnit, GoldKarat } from "@/types/zakat";
import type { MetalPrices } from "@/hooks/use-metal-prices";
import type { TransLang } from "@/lib/islamic-content";
import { t, biDesc } from "@/lib/form-translations";
import { toGrams, karatPurity } from "@/lib/weight-converter";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

interface GoldSilverStepProps {
  formData: ZakatFormData;
  onChange: (updates: Partial<ZakatFormData>) => void;
  prices: MetalPrices | null;
  lang: TransLang;
}

export function GoldSilverStep({ formData, onChange, prices, lang }: GoldSilverStepProps) {
  const isLocal = lang !== "en";
  const goldGrams = toGrams(formData.goldWeight, formData.goldUnit);
  const pureGoldGrams = goldGrams * karatPurity(formData.goldKarat);
  const goldValue = prices ? pureGoldGrams * prices.goldPricePerGram : 0;

  const silverGrams = toGrams(formData.silverWeight, formData.silverUnit);
  const silverValue = prices ? silverGrams * prices.silverPricePerGram : 0;

  const WEIGHT_UNITS: { value: WeightUnit; label: string; labelLocal?: string }[] = [
    { value: "gram", label: "Grams", labelLocal: isLocal ? t(lang, "grams") : undefined },
    { value: "tola", label: "Tola", labelLocal: isLocal ? t(lang, "tola") : undefined },
    { value: "ounce", label: "Troy Oz", labelLocal: isLocal ? t(lang, "troyOz") : undefined },
  ];

  const KARATS: { value: GoldKarat; label: string; desc: string; descLocal?: string }[] = [
    { value: 24, label: "24K", desc: "Pure", descLocal: isLocal ? t(lang, "pure") : undefined },
    { value: 22, label: "22K", desc: "Jewelry", descLocal: isLocal ? t(lang, "jewelry") : undefined },
    { value: 21, label: "21K", desc: "Common", descLocal: isLocal ? t(lang, "common") : undefined },
    { value: 18, label: "18K", desc: "Mixed", descLocal: isLocal ? t(lang, "mixed") : undefined },
  ];

  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* Gold */}
      <motion.div variants={staggerItem}>
        <SectionCard
          title="Gold Holdings"
          titleAr={isLocal ? t(lang, "goldHoldings") : "الذهب"}
          description={isLocal ? biDesc(lang, "goldHoldings_desc") : "Include all gold jewelry, coins, bars you own. Personal jewelry worn regularly is also zakatable according to majority scholars."}
          iconBg="bg-gradient-to-br from-amber-400 to-amber-600"
          iconColor="text-white"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Weight
                  {isLocal && <span className="text-xs font-normal text-emerald-600/60 ml-1">{t(lang, "weight")}</span>}
                </Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.goldWeight || ""}
                  onChange={(e) => onChange({ goldWeight: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Unit
                  {isLocal && <span className="text-xs font-normal text-emerald-600/60 ml-1">{t(lang, "unit")}</span>}
                </Label>
                <div className="flex gap-2">
                  {WEIGHT_UNITS.map((unit) => (
                    <button
                      key={unit.value}
                      onClick={() => onChange({ goldUnit: unit.value })}
                      className={cn(
                        "flex-1 rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all",
                        formData.goldUnit === unit.value
                          ? "border-amber-500 bg-amber-50 text-amber-700"
                          : "border-muted hover:border-amber-300"
                      )}
                    >
                      {unit.label}
                      {unit.labelLocal && <span className="block text-[10px] font-normal text-amber-600/60">{unit.labelLocal}</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Karat (Purity)
                {isLocal && <span className="text-xs font-normal text-emerald-600/60 ml-1">{t(lang, "karatPurity")}</span>}
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {KARATS.map((k) => (
                  <button
                    key={k.value}
                    onClick={() => onChange({ goldKarat: k.value })}
                    className={cn(
                      "rounded-lg border-2 px-3 py-2 text-center transition-all",
                      formData.goldKarat === k.value
                        ? "border-amber-500 bg-amber-50"
                        : "border-muted hover:border-amber-300"
                    )}
                  >
                    <p className="text-sm font-bold">{k.label}</p>
                    <p className="text-xs text-muted-foreground">{k.desc}</p>
                    {k.descLocal && <p className="text-[10px] text-emerald-600/60">{k.descLocal}</p>}
                  </button>
                ))}
              </div>
            </div>

            {formData.goldWeight > 0 && prices && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="rounded-lg bg-amber-50 border border-amber-200 p-3"
              >
                <p className="text-sm text-amber-800">
                  <span className="font-medium">{pureGoldGrams.toFixed(2)}g</span> {isLocal ? t(lang, "pureGold") : "pure gold"}
                  {" = "}
                  <span className="font-bold">{formatCurrency(goldValue, formData.currency)}</span>
                  <span className="text-xs text-amber-600/60 ml-2">(live: {formatCurrency(prices.goldPricePerGram, formData.currency)}/g)</span>
                </p>
              </motion.div>
            )}
            {formData.goldWeight > 0 && !prices && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                <p className="text-sm text-red-600">{isLocal ? t(lang, "waitingForPrices") : "Waiting for live prices to calculate value..."}</p>
              </div>
            )}
          </div>
        </SectionCard>
      </motion.div>

      {/* Silver */}
      <motion.div variants={staggerItem}>
        <SectionCard
          title="Silver Holdings"
          titleAr={isLocal ? t(lang, "silverHoldings") : "الفضة"}
          description={isLocal ? biDesc(lang, "silverHoldings_desc") : "Include all silver jewelry, coins, bars, and utensils"}
          iconBg="bg-gradient-to-br from-gray-300 to-gray-500"
          iconColor="text-white"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Weight
                  {isLocal && <span className="text-xs font-normal text-emerald-600/60 ml-1">{t(lang, "weight")}</span>}
                </Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.silverWeight || ""}
                  onChange={(e) => onChange({ silverWeight: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Unit
                  {isLocal && <span className="text-xs font-normal text-emerald-600/60 ml-1">{t(lang, "unit")}</span>}
                </Label>
                <div className="flex gap-2">
                  {WEIGHT_UNITS.map((unit) => (
                    <button
                      key={unit.value}
                      onClick={() => onChange({ silverUnit: unit.value })}
                      className={cn(
                        "flex-1 rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all",
                        formData.silverUnit === unit.value
                          ? "border-gray-500 bg-gray-50 text-gray-700"
                          : "border-muted hover:border-gray-300"
                      )}
                    >
                      {unit.label}
                      {unit.labelLocal && <span className="block text-[10px] font-normal text-gray-500/60">{unit.labelLocal}</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {formData.silverWeight > 0 && prices && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="rounded-lg bg-gray-50 border border-gray-200 p-3"
              >
                <p className="text-sm text-gray-800">
                  <span className="font-medium">{silverGrams.toFixed(2)}g</span> {isLocal ? t(lang, "silver") : "silver"}
                  {" = "}
                  <span className="font-bold">{formatCurrency(silverValue, formData.currency)}</span>
                  <span className="text-xs text-gray-500 ml-2">(live: {formatCurrency(prices.silverPricePerGram, formData.currency)}/g)</span>
                </p>
              </motion.div>
            )}
            {formData.silverWeight > 0 && !prices && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                <p className="text-sm text-red-600">{isLocal ? t(lang, "waitingForPrices") : "Waiting for live prices to calculate value..."}</p>
              </div>
            )}
          </div>
        </SectionCard>
      </motion.div>
    </motion.div>
  );
}
