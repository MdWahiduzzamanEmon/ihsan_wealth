"use client";

import { motion } from "framer-motion";
import { SectionCard } from "@/components/ui/custom/section-card";
import { CurrencyInput } from "@/components/ui/custom/currency-input";
import { staggerContainer, staggerItem } from "@/lib/animations";
import type { ZakatFormData } from "@/types/zakat";
import type { TransLang } from "@/lib/islamic-content";
import { t, biDesc } from "@/lib/form-translations";
import { Store, Receipt, Wallet } from "lucide-react";

interface BusinessStepProps {
  formData: ZakatFormData;
  onChange: (updates: Partial<ZakatFormData>) => void;
  currencySymbol: string;
  lang: TransLang;
}

export function BusinessStep({ formData, onChange, currencySymbol, lang }: BusinessStepProps) {
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
          title="Business Assets"
          titleAr={isLocal ? t(lang, "businessAssets") : "أصول تجارية"}
          description={isLocal ? biDesc(lang, "businessAssets_desc") : "If you own a business, enter the value of your inventory, receivables, and cash. Do not include fixed assets (machinery, property used for business)."}
          icon={Store}
        >
          <div className="space-y-6">
            <CurrencyInput
              label="Business Inventory / Merchandise"
              labelLocal={isLocal ? t(lang, "businessInventory") : undefined}
              value={formData.businessInventory}
              onValueChange={(v) => onChange({ businessInventory: v })}
              icon={Store}
              description="Current market value of goods held for sale"
              descriptionLocal={isLocal ? biDesc(lang, "businessInventory_desc") : undefined}
              currencySymbol={currencySymbol}
            />
            <CurrencyInput
              label="Business Cash Receivable"
              labelLocal={isLocal ? t(lang, "businessReceivable") : undefined}
              value={formData.businessCashReceivable}
              onValueChange={(v) => onChange({ businessCashReceivable: v })}
              icon={Receipt}
              description="Money owed to your business by customers/clients"
              descriptionLocal={isLocal ? biDesc(lang, "businessReceivable_desc") : undefined}
              currencySymbol={currencySymbol}
            />
            <CurrencyInput
              label="Business Cash on Hand"
              labelLocal={isLocal ? t(lang, "businessCash") : undefined}
              value={formData.businessCashOnHand}
              onValueChange={(v) => onChange({ businessCashOnHand: v })}
              icon={Wallet}
              description="Cash in business accounts, registers, or petty cash"
              descriptionLocal={isLocal ? biDesc(lang, "businessCash_desc") : undefined}
              currencySymbol={currencySymbol}
            />
          </div>
        </SectionCard>
      </motion.div>

      <motion.div variants={staggerItem}>
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3">
          <p className="text-xs text-emerald-800">
            <strong>{isLocal ? t(lang, "islamicRuling") : "Islamic Ruling"}:</strong>{" "}
            {isLocal ? biDesc(lang, "businessRuling") : "Only trade goods (inventory held for resale) and liquid business assets are zakatable. Fixed assets like machinery, equipment, vehicles used for business, and office property are NOT subject to Zakat."}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
