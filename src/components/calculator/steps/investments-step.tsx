"use client";

import { motion } from "framer-motion";
import { SectionCard } from "@/components/ui/custom/section-card";
import { CurrencyInput } from "@/components/ui/custom/currency-input";
import { staggerContainer, staggerItem } from "@/lib/animations";
import type { ZakatFormData } from "@/types/zakat";
import type { TransLang } from "@/lib/islamic-content";
import { t, biDesc } from "@/lib/form-translations";
import { TrendingUp, BarChart3, PiggyBank, Bitcoin, Landmark } from "lucide-react";
import { Label } from "@/components/ui/label";

interface InvestmentsStepProps {
  formData: ZakatFormData;
  onChange: (updates: Partial<ZakatFormData>) => void;
  currencySymbol: string;
  lang: TransLang;
}

export function InvestmentsStep({ formData, onChange, currencySymbol, lang }: InvestmentsStepProps) {
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
          title="Investments"
          titleAr={isLocal ? t(lang, "investments") : "الاستثمارات"}
          description={isLocal ? biDesc(lang, "investments_desc") : "Enter the current market value of your investments. Include stocks, mutual funds, ETFs, bonds, and any other investment vehicles."}
          icon={TrendingUp}
        >
          <div className="space-y-6">
            <CurrencyInput
              label="Stocks & Shares"
              labelLocal={isLocal ? t(lang, "stocksShares") : undefined}
              value={formData.stocksValue}
              onValueChange={(v) => onChange({ stocksValue: v })}
              icon={BarChart3}
              description="Current market value of all stock holdings"
              descriptionLocal={isLocal ? biDesc(lang, "stocksShares_desc") : undefined}
              currencySymbol={currencySymbol}
            />
            <CurrencyInput
              label="Mutual Funds & ETFs"
              labelLocal={isLocal ? t(lang, "mutualFundsETFs") : undefined}
              value={formData.mutualFundsValue}
              onValueChange={(v) => onChange({ mutualFundsValue: v })}
              icon={PiggyBank}
              currencySymbol={currencySymbol}
            />
            <CurrencyInput
              label="Cryptocurrency"
              labelLocal={isLocal ? t(lang, "cryptocurrency") : undefined}
              value={formData.cryptoValue}
              onValueChange={(v) => onChange({ cryptoValue: v })}
              icon={Bitcoin}
              description="Bitcoin, Ethereum, and other crypto assets (scholars treat as zakatable trade goods)"
              descriptionLocal={isLocal ? biDesc(lang, "cryptocurrency_desc") : undefined}
              currencySymbol={currencySymbol}
            />
            <CurrencyInput
              label="Other Investments"
              labelLocal={isLocal ? t(lang, "otherInvestments") : undefined}
              value={formData.otherInvestments}
              onValueChange={(v) => onChange({ otherInvestments: v })}
              icon={TrendingUp}
              description="Bonds, sukuk, commodities, etc."
              descriptionLocal={isLocal ? biDesc(lang, "otherInvestments_desc") : undefined}
              currencySymbol={currencySymbol}
            />
          </div>
        </SectionCard>
      </motion.div>

      <motion.div variants={staggerItem}>
        <SectionCard
          title="Retirement & Pension Funds"
          titleAr={isLocal ? t(lang, "retirementPension") : "صناديق التقاعد"}
          description={isLocal ? biDesc(lang, "retirementPension_desc") : "Retirement accounts may be zakatable depending on accessibility"}
          icon={Landmark}
        >
          <div className="space-y-4">
            <CurrencyInput
              label="Retirement Fund Balance"
              labelLocal={isLocal ? t(lang, "retirementBalance") : undefined}
              value={formData.retirementFunds}
              onValueChange={(v) => onChange({ retirementFunds: v })}
              icon={Landmark}
              description="401(k), IRA, pension, provident fund total balance"
              descriptionLocal={isLocal ? biDesc(lang, "retirementBalance_desc") : undefined}
              currencySymbol={currencySymbol}
            />
            <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
              <input
                type="checkbox"
                id="retirementAccessible"
                checked={formData.retirementAccessible}
                onChange={(e) => onChange({ retirementAccessible: e.target.checked })}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <Label htmlFor="retirementAccessible" className="text-sm text-amber-800 cursor-pointer">
                <strong>{isLocal ? t(lang, "canWithdraw") : "I can withdraw from this fund"}</strong>
                <br />
                <span className="text-xs text-amber-600">
                  {isLocal ? biDesc(lang, "canWithdraw_desc") : "If you can access these funds (with or without penalty), they are zakatable. If locked until retirement age, most scholars say Zakat is deferred."}
                </span>
              </Label>
            </div>
          </div>
        </SectionCard>
      </motion.div>
    </motion.div>
  );
}
