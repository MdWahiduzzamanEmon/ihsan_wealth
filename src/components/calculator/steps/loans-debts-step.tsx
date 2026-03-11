"use client";

import { motion } from "framer-motion";
import { SectionCard } from "@/components/ui/custom/section-card";
import { CurrencyInput } from "@/components/ui/custom/currency-input";
import { staggerContainer, staggerItem } from "@/lib/animations";
import type { ZakatFormData } from "@/types/zakat";
import type { TransLang } from "@/lib/islamic-content";
import { t, biDesc } from "@/lib/form-translations";
import { HandCoins, CreditCard, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface LoansDebtsStepProps {
  formData: ZakatFormData;
  onChange: (updates: Partial<ZakatFormData>) => void;
  currencySymbol: string;
  lang: TransLang;
}

export function LoansDebtsStep({ formData, onChange, currencySymbol, lang }: LoansDebtsStepProps) {
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
          title="Loans Given (Money Owed to You)"
          titleAr={isLocal ? t(lang, "loansGiven") : "القروض الممنوحة"}
          description={isLocal ? biDesc(lang, "loansGiven_desc") : "Money you have lent to others is still considered your wealth for Zakat purposes"}
          icon={ArrowUpRight}
          iconColor="text-blue-600"
        >
          <div className="space-y-6">
            <CurrencyInput
              label="Recoverable Loans"
              labelLocal={isLocal ? t(lang, "recoverableLoans") : undefined}
              value={formData.loansGivenRecoverable}
              onValueChange={(v) => onChange({ loansGivenRecoverable: v })}
              icon={HandCoins}
              description="Loans you expect to be repaid (included in Zakat calculation)"
              descriptionLocal={isLocal ? biDesc(lang, "recoverableLoans_desc") : undefined}
              currencySymbol={currencySymbol}
            />
            <CurrencyInput
              label="Doubtful Loans"
              labelLocal={isLocal ? t(lang, "doubtfulLoans") : undefined}
              value={formData.loansGivenDoubtful}
              onValueChange={(v) => onChange({ loansGivenDoubtful: v })}
              icon={HandCoins}
              description="Loans unlikely to be repaid (NOT included in calculation)"
              descriptionLocal={isLocal ? biDesc(lang, "doubtfulLoans_desc") : undefined}
              currencySymbol={currencySymbol}
            />
          </div>
        </SectionCard>
      </motion.div>

      <motion.div variants={staggerItem}>
        <SectionCard
          title="Debts & Liabilities (What You Owe)"
          titleAr={isLocal ? t(lang, "debtsLiabilities") : "الديون والالتزامات"}
          description={isLocal ? biDesc(lang, "debtsLiabilities_desc") : "Debts are deducted from your total wealth before Zakat calculation"}
          icon={ArrowDownRight}
          iconColor="text-red-600"
        >
          <div className="space-y-6">
            <CurrencyInput
              label="Total Debts Owed"
              labelLocal={isLocal ? t(lang, "totalDebts") : undefined}
              value={formData.debtsOwed}
              onValueChange={(v) => onChange({ debtsOwed: v })}
              icon={CreditCard}
              description="Personal loans, credit card debt, mortgages (immediate due portion), etc."
              descriptionLocal={isLocal ? biDesc(lang, "totalDebts_desc") : undefined}
              currencySymbol={currencySymbol}
            />
            <CurrencyInput
              label="Due Expenses"
              labelLocal={isLocal ? t(lang, "dueExpenses") : undefined}
              value={formData.dueExpenses}
              onValueChange={(v) => onChange({ dueExpenses: v })}
              icon={CreditCard}
              description="Bills, rent, taxes, or other obligations due at the time of Zakat calculation"
              descriptionLocal={isLocal ? biDesc(lang, "dueExpenses_desc") : undefined}
              currencySymbol={currencySymbol}
            />
          </div>
        </SectionCard>
      </motion.div>
    </motion.div>
  );
}
