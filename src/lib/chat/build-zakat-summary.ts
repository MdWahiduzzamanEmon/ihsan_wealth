import type { ZakatFormData } from "@/types/zakat";

/** Builds a read-only text summary of the user's zakat form data for AI context */
export function buildZakatSummary(data: ZakatFormData): string {
  const parts: string[] = [];
  const c = data.currency;

  if (data.cashOnHand > 0) parts.push(`Cash on hand: ${data.cashOnHand} ${c}`);
  if (data.bankSavings > 0) parts.push(`Bank savings: ${data.bankSavings} ${c}`);
  if (data.otherCashEquivalents > 0) parts.push(`Other cash equivalents: ${data.otherCashEquivalents} ${c}`);
  if (data.goldWeight > 0) parts.push(`Gold: ${data.goldWeight}${data.goldUnit} (${data.goldKarat}k)`);
  if (data.silverWeight > 0) parts.push(`Silver: ${data.silverWeight}${data.silverUnit}`);
  if (data.stocksValue > 0) parts.push(`Stocks: ${data.stocksValue} ${c}`);
  if (data.mutualFundsValue > 0) parts.push(`Mutual funds: ${data.mutualFundsValue} ${c}`);
  if (data.cryptoValue > 0) parts.push(`Crypto: ${data.cryptoValue} ${c}`);
  if (data.otherInvestments > 0) parts.push(`Other investments: ${data.otherInvestments} ${c}`);
  if (data.retirementFunds > 0) parts.push(`Retirement funds: ${data.retirementFunds} ${c} (${data.retirementAccessible ? "accessible" : "not accessible"})`);
  if (data.businessInventory > 0) parts.push(`Business inventory: ${data.businessInventory} ${c}`);
  if (data.businessCashReceivable > 0) parts.push(`Business receivable: ${data.businessCashReceivable} ${c}`);
  if (data.businessCashOnHand > 0) parts.push(`Business cash: ${data.businessCashOnHand} ${c}`);
  if (data.rentalPropertyValue > 0) parts.push(`Rental property value: ${data.rentalPropertyValue} ${c}`);
  if (data.rentalIncome > 0) parts.push(`Rental income: ${data.rentalIncome} ${c}`);
  if (data.propertyForSale > 0) parts.push(`Property for sale: ${data.propertyForSale} ${c}`);
  if (data.agriculturalIncome > 0) parts.push(`Agricultural income: ${data.agriculturalIncome} ${c} (${data.irrigationType})`);
  if (data.loansGivenRecoverable > 0) parts.push(`Loans given (recoverable): ${data.loansGivenRecoverable} ${c}`);
  if (data.debtsOwed > 0) parts.push(`Debts owed: ${data.debtsOwed} ${c}`);
  if (data.dueExpenses > 0) parts.push(`Due expenses: ${data.dueExpenses} ${c}`);

  parts.push(`Country: ${data.country}, Currency: ${c}`);
  parts.push(`Nisab basis: ${data.nisabBasis}, Madhab: ${data.madhab}`);

  return parts.join("\n");
}
