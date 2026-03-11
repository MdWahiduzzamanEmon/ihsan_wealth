"use client";

import { motion } from "framer-motion";
import { SectionCard } from "@/components/ui/custom/section-card";
import { CurrencyInput } from "@/components/ui/custom/currency-input";
import { staggerContainer, staggerItem } from "@/lib/animations";
import type { ZakatFormData } from "@/types/zakat";
import type { TransLang } from "@/lib/islamic-content";
import { t, biDesc } from "@/lib/form-translations";
import { Home, DollarSign, Tag } from "lucide-react";

interface PropertyStepProps {
  formData: ZakatFormData;
  onChange: (updates: Partial<ZakatFormData>) => void;
  currencySymbol: string;
  lang: TransLang;
}

export function PropertyStep({ formData, onChange, currencySymbol, lang }: PropertyStepProps) {
  const isLocal = lang !== "en";

  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={staggerItem}>
        <SectionCard
          title="Property & Real Estate"
          titleAr={isLocal ? t(lang, "propertyRealEstate") : "العقارات"}
          description={isLocal ? biDesc(lang, "propertyRealEstate_desc") : "Your personal residence is NOT subject to Zakat. Only include properties held for investment or sale."}
          icon={Home}
        >
          <div className="space-y-6">
            <CurrencyInput
              label="Rental Property (Accumulated Income)"
              labelLocal={isLocal ? t(lang, "rentalIncome") : undefined}
              value={formData.rentalIncome}
              onValueChange={(v) => onChange({ rentalIncome: v })}
              icon={DollarSign}
              description="Rental income saved/accumulated (not yet spent). Only the income is zakatable, not the property value."
              descriptionLocal={isLocal ? biDesc(lang, "rentalIncome_desc") : undefined}
              currencySymbol={currencySymbol}
            />
            <CurrencyInput
              label="Property Held for Sale"
              labelLocal={isLocal ? t(lang, "propertyForSale") : undefined}
              value={formData.propertyForSale}
              onValueChange={(v) => onChange({ propertyForSale: v })}
              icon={Tag}
              description="Market value of properties bought with the intention to sell (trade goods - fully zakatable)"
              descriptionLocal={isLocal ? biDesc(lang, "propertyForSale_desc") : undefined}
              currencySymbol={currencySymbol}
            />
          </div>
        </SectionCard>
      </motion.div>

      <motion.div variants={staggerItem}>
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3">
          <p className="text-xs text-emerald-800">
            <strong>{isLocal ? t(lang, "islamicRuling") : "Islamic Ruling"}:</strong>{" "}
            {isLocal ? biDesc(lang, "propertyRuling") : "According to the majority of scholars, Zakat is not due on the value of rental properties themselves - only on the accumulated rental income. However, properties bought with the intention to sell (trade goods) are fully zakatable at current market value. Your personal home is never zakatable."}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
