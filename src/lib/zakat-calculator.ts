import type { ZakatFormData, ZakatResult, AssetBreakdown } from "@/types/zakat";
import { NISAB_GOLD_GRAMS, NISAB_SILVER_GRAMS, ZAKAT_RATE, BREAKDOWN_COLORS } from "./constants";
import { toGrams, karatPurity } from "./weight-converter";

// Zakat al-Fitr amount per person (in sa' of staple food ≈ 2.5-3kg)
// Approximate USD value - should be adjusted per country/year
const FITR_AMOUNT_USD = 12;

// Agricultural Zakat rates
const USHR_NATURAL = 0.10; // 10% for rain-fed/natural irrigation
const USHR_IRRIGATED = 0.05; // 5% for artificially irrigated
const USHR_MIXED = 0.075; // 7.5% for mixed

export function calculateZakat(
  formData: ZakatFormData,
  goldPricePerGram: number,
  silverPricePerGram: number
): ZakatResult {
  // Convert gold holdings to currency
  const goldGrams = toGrams(formData.goldWeight, formData.goldUnit);
  const pureGoldGrams = goldGrams * karatPurity(formData.goldKarat);
  const goldValue = pureGoldGrams * goldPricePerGram;

  // Convert silver holdings to currency
  const silverGrams = toGrams(formData.silverWeight, formData.silverUnit);
  const silverValue = silverGrams * silverPricePerGram;

  // Cash & Savings
  const cashTotal = formData.cashOnHand + formData.bankSavings + formData.otherCashEquivalents;

  // Investments (crypto treated same as other investments per modern scholarly opinion)
  const investmentsTotal = formData.stocksValue + formData.mutualFundsValue
    + formData.otherInvestments + formData.cryptoValue
    + (formData.retirementAccessible ? formData.retirementFunds : 0);

  // Business (inventory + receivables + cash in business)
  const businessTotal = formData.businessInventory + formData.businessCashReceivable + formData.businessCashOnHand;

  // Property:
  // - Rental income accumulated (always zakatable)
  // - Property held for sale (zakatable at market value)
  // - Rental property VALUE is NOT zakatable (only income)
  const propertyTotal = formData.rentalIncome + formData.propertyForSale;

  // Loans Given (only recoverable ones count)
  // Hanafi: recoverable loans are zakatable
  // Shafi'i/Hanbali: all expected-to-be-returned loans are zakatable
  const loansTotal = formData.loansGivenRecoverable;

  // Total Assets
  const totalAssets = cashTotal + goldValue + silverValue + investmentsTotal
    + businessTotal + propertyTotal + loansTotal;

  // Total Deductions
  // Immediate needs (Hanafi madhab allows deducting basic needs)
  const totalDeductions = formData.debtsOwed + formData.dueExpenses + formData.immediateNeeds;

  // Net Zakatable Wealth
  const netZakatableWealth = Math.max(0, totalAssets - totalDeductions);

  // Nisab Thresholds
  const nisabThresholdGold = NISAB_GOLD_GRAMS * goldPricePerGram;
  const nisabThresholdSilver = NISAB_SILVER_GRAMS * silverPricePerGram;

  const activeNisab = formData.nisabBasis === "gold" ? nisabThresholdGold : nisabThresholdSilver;

  const isAboveNisab = netZakatableWealth >= activeNisab;
  const zakatAmount = isAboveNisab ? netZakatableWealth * ZAKAT_RATE : 0;

  // Agricultural Zakat (Ushr) - separate from wealth Zakat, no nisab for Hanafi
  // Has its own rates based on irrigation type
  let agriculturalZakat = 0;
  if (formData.agriculturalIncome > 0) {
    const rate = formData.irrigationType === "natural" ? USHR_NATURAL
      : formData.irrigationType === "irrigated" ? USHR_IRRIGATED
      : USHR_MIXED;
    agriculturalZakat = formData.agriculturalIncome * rate;
  }

  // Zakat al-Fitr
  const zakatAlFitr = formData.fitrIncluded ? formData.fitrMembers * FITR_AMOUNT_USD : 0;

  // Total Zakat Due
  const totalZakatDue = zakatAmount + agriculturalZakat + zakatAlFitr;

  // Build breakdown
  const rawBreakdown = [
    { category: "Cash & Savings", amount: cashTotal },
    { category: "Gold", amount: goldValue },
    { category: "Silver", amount: silverValue },
    { category: "Investments", amount: investmentsTotal },
    { category: "Business", amount: businessTotal },
    { category: "Property", amount: propertyTotal },
    { category: "Loans Receivable", amount: loansTotal },
    { category: "Deductions", amount: -totalDeductions },
  ];

  const breakdown: AssetBreakdown[] = rawBreakdown
    .filter((item) => item.amount !== 0)
    .map((item, index) => ({
      ...item,
      percentage: totalAssets > 0 ? (Math.abs(item.amount) / totalAssets) * 100 : 0,
      color: BREAKDOWN_COLORS[index % BREAKDOWN_COLORS.length],
    }));

  return {
    totalAssets,
    totalDeductions,
    netZakatableWealth,
    nisabThresholdGold,
    nisabThresholdSilver,
    activeNisab,
    isAboveNisab,
    zakatAmount,
    zakatAlFitr,
    agriculturalZakat,
    totalZakatDue,
    breakdown,
  };
}
