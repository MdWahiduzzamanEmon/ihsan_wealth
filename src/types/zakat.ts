export type WeightUnit = "gram" | "tola" | "ounce";
export type GoldKarat = 24 | 22 | 21 | 18;
export type NisabBasis = "silver" | "gold";

export interface ZakatFormData {
  country: string;
  currency: string;

  // Cash & Savings
  cashOnHand: number;
  bankSavings: number;
  otherCashEquivalents: number;

  // Gold & Silver
  goldWeight: number;
  goldUnit: WeightUnit;
  goldKarat: GoldKarat;
  silverWeight: number;
  silverUnit: WeightUnit;

  // Investments
  stocksValue: number;
  mutualFundsValue: number;
  otherInvestments: number;
  cryptoValue: number;
  retirementFunds: number;
  retirementAccessible: boolean;

  // Business
  businessInventory: number;
  businessCashReceivable: number;
  businessCashOnHand: number;

  // Property
  rentalPropertyValue: number;
  rentalIncome: number;
  propertyForSale: number;

  // Agriculture (Zakat on crops - Ushr)
  agriculturalIncome: number;
  irrigationType: "natural" | "irrigated" | "mixed";

  // Loans Given
  loansGivenRecoverable: number;
  loansGivenDoubtful: number;

  // Debts & Deductions
  debtsOwed: number;
  dueExpenses: number;
  immediateNeeds: number;

  // Salary (unused in calc but tracked)
  monthlySalary: number;

  // Zakat al-Fitr
  fitrMembers: number;
  fitrIncluded: boolean;

  // Settings
  nisabBasis: NisabBasis;
  madhab: "hanafi" | "shafii" | "maliki" | "hanbali";
}

export interface ZakatResult {
  totalAssets: number;
  totalDeductions: number;
  netZakatableWealth: number;
  nisabThresholdGold: number;
  nisabThresholdSilver: number;
  activeNisab: number;
  isAboveNisab: boolean;
  zakatAmount: number;
  zakatAlFitr: number;
  agriculturalZakat: number;
  totalZakatDue: number;
  breakdown: AssetBreakdown[];
}

export interface AssetBreakdown {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export const DEFAULT_FORM_DATA: ZakatFormData = {
  country: "BD",
  currency: "BDT",
  cashOnHand: 0,
  bankSavings: 0,
  otherCashEquivalents: 0,
  goldWeight: 0,
  goldUnit: "gram",
  goldKarat: 22,
  silverWeight: 0,
  silverUnit: "gram",
  stocksValue: 0,
  mutualFundsValue: 0,
  otherInvestments: 0,
  cryptoValue: 0,
  retirementFunds: 0,
  retirementAccessible: false,
  businessInventory: 0,
  businessCashReceivable: 0,
  businessCashOnHand: 0,
  rentalPropertyValue: 0,
  rentalIncome: 0,
  propertyForSale: 0,
  agriculturalIncome: 0,
  irrigationType: "natural",
  loansGivenRecoverable: 0,
  loansGivenDoubtful: 0,
  debtsOwed: 0,
  dueExpenses: 0,
  immediateNeeds: 0,
  monthlySalary: 0,
  fitrMembers: 1,
  fitrIncluded: false,
  nisabBasis: "silver",
  madhab: "hanafi",
};
