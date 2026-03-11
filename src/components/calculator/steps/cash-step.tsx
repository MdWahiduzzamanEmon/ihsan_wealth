"use client";

import { SectionCard } from "@/components/ui/custom/section-card";
import { CurrencyInput } from "@/components/ui/custom/currency-input";
import type { ZakatFormData } from "@/types/zakat";
import type { TransLang } from "@/lib/islamic-content";
import { t, biDesc } from "@/lib/form-translations";
import { Banknote, Landmark, Wallet } from "lucide-react";

interface CashStepProps {
  formData: ZakatFormData;
  onChange: (updates: Partial<ZakatFormData>) => void;
  currencySymbol: string;
  lang: TransLang;
}

export function CashStep({ formData, onChange, currencySymbol, lang }: CashStepProps) {
  const local = lang !== "en" ? t(lang, "cashBankSavings") : undefined;
  const localDesc = lang !== "en" ? biDesc(lang, "cashBankSavings_desc") : undefined;

  return (
    <SectionCard
      title="Cash & Bank Savings"
      titleAr={local || "النقد والمدخرات"}
      description={localDesc || "Enter all your cash and liquid money including bank accounts, wallets, and any other cash equivalents"}
      icon={Banknote}
    >
      <div className="space-y-6">
        <CurrencyInput
          label="Cash on Hand"
          labelLocal={lang !== "en" ? t(lang, "cashOnHand") : undefined}
          value={formData.cashOnHand}
          onValueChange={(v) => onChange({ cashOnHand: v })}
          icon={Wallet}
          description="Physical cash at home or in your wallet"
          descriptionLocal={lang !== "en" ? biDesc(lang, "cashOnHand_desc") : undefined}
          currencySymbol={currencySymbol}
        />
        <CurrencyInput
          label="Bank Savings"
          labelLocal={lang !== "en" ? t(lang, "bankSavings") : undefined}
          value={formData.bankSavings}
          onValueChange={(v) => onChange({ bankSavings: v })}
          icon={Landmark}
          description="Total balance across all bank accounts (savings, checking, fixed deposits)"
          descriptionLocal={lang !== "en" ? biDesc(lang, "bankSavings_desc") : undefined}
          currencySymbol={currencySymbol}
        />
        <CurrencyInput
          label="Other Cash Equivalents"
          labelLocal={lang !== "en" ? t(lang, "otherCashEquivalents") : undefined}
          value={formData.otherCashEquivalents}
          onValueChange={(v) => onChange({ otherCashEquivalents: v })}
          icon={Banknote}
          description="Digital wallets, prepaid cards, gift cards, etc."
          descriptionLocal={lang !== "en" ? biDesc(lang, "otherCashEquivalents_desc") : undefined}
          currencySymbol={currencySymbol}
        />
      </div>
    </SectionCard>
  );
}
