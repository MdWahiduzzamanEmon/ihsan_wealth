"use client";

import { motion } from "framer-motion";
import { SectionCard } from "@/components/ui/custom/section-card";
import { CurrencyInput } from "@/components/ui/custom/currency-input";
import { staggerContainer, staggerItem } from "@/lib/animations";
import type { ZakatFormData } from "@/types/zakat";
import type { TransLang } from "@/lib/islamic-content";
import { t, biDesc } from "@/lib/form-translations";
import { Wheat, Droplets } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface AgricultureStepProps {
  formData: ZakatFormData;
  onChange: (updates: Partial<ZakatFormData>) => void;
  currencySymbol: string;
  lang: TransLang;
}

export function AgricultureStep({ formData, onChange, currencySymbol, lang }: AgricultureStepProps) {
  const isLocal = lang !== "en";

  const IRRIGATION_OPTIONS = [
    { value: "natural" as const, label: "Rain-fed / Natural", labelLocal: isLocal ? t(lang, "rainFed") : undefined, rate: "10%", desc: "Watered by rain, rivers, or springs", descLocal: isLocal ? t(lang, "rainFed_desc") : undefined },
    { value: "irrigated" as const, label: "Artificially Irrigated", labelLocal: isLocal ? t(lang, "irrigated") : undefined, rate: "5%", desc: "Watered by wells, pumps, or canals", descLocal: isLocal ? t(lang, "irrigated_desc") : undefined },
    { value: "mixed" as const, label: "Mixed", labelLocal: isLocal ? t(lang, "mixedIrrigation") : undefined, rate: "7.5%", desc: "Combination of natural and artificial", descLocal: isLocal ? t(lang, "mixedIrrigation_desc") : undefined },
  ];

  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={staggerItem}>
        <SectionCard
          title="Agricultural Produce (Ushr)"
          titleAr={isLocal ? t(lang, "agriculture") : "العُشْر"}
          description={isLocal ? biDesc(lang, "agriculture_desc") : "Zakat on crops and agricultural produce. This is separate from wealth Zakat and has different rates based on irrigation method."}
          icon={Wheat}
          iconColor="text-lime-600"
        >
          <div className="space-y-6">
            <CurrencyInput
              label="Agricultural Produce Value"
              labelLocal={isLocal ? t(lang, "agriculturalValue") : undefined}
              value={formData.agriculturalIncome}
              onValueChange={(v) => onChange({ agriculturalIncome: v })}
              icon={Wheat}
              description="Total value of harvested crops at current market prices"
              descriptionLocal={isLocal ? biDesc(lang, "agriculturalValue_desc") : undefined}
              currencySymbol={currencySymbol}
            />

            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                Irrigation Method
                {isLocal && <span className="text-xs font-normal text-emerald-600/60">{t(lang, "irrigationMethod")}</span>}
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {IRRIGATION_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => onChange({ irrigationType: opt.value })}
                    className={cn(
                      "rounded-xl border-2 p-3 text-left transition-all",
                      formData.irrigationType === opt.value
                        ? "border-lime-500 bg-lime-50 shadow-sm"
                        : "border-muted hover:border-lime-300"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold">{opt.label}</span>
                      <span className={cn(
                        "text-xs font-bold px-2 py-0.5 rounded-full",
                        formData.irrigationType === opt.value
                          ? "bg-lime-600 text-white"
                          : "bg-muted text-muted-foreground"
                      )}>
                        {opt.rate}
                      </span>
                    </div>
                    {opt.labelLocal && <p className="text-xs text-emerald-600/60 mb-0.5">{opt.labelLocal}</p>}
                    <p className="text-xs text-muted-foreground">{opt.descLocal || opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {formData.agriculturalIncome > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg bg-lime-50 border border-lime-200 p-3"
              >
                <p className="text-sm text-lime-800">
                  {isLocal ? t(lang, "ushrOnCrops") : "Ushr on your crops"}: <strong className="text-lime-700">
                    {formData.irrigationType === "natural" ? "10%" : formData.irrigationType === "irrigated" ? "5%" : "7.5%"}
                  </strong>
                  {" = "}
                  <strong>{currencySymbol}{(formData.agriculturalIncome * (
                    formData.irrigationType === "natural" ? 0.10 : formData.irrigationType === "irrigated" ? 0.05 : 0.075
                  )).toLocaleString()}</strong>
                </p>
              </motion.div>
            )}
          </div>
        </SectionCard>
      </motion.div>

      <motion.div variants={staggerItem}>
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3">
          <p className="text-xs text-emerald-800">
            <strong>Quranic Basis:</strong> &quot;And give its due [Zakat] on the day of its harvest&quot; (Quran 6:141). The Prophet (PBUH) said: &quot;On that which is irrigated by rain, springs or underground water, one-tenth; and on that which is irrigated by irrigation, one-twentieth&quot; (Sahih al-Bukhari).
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
