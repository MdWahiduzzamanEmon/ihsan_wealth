import { COUNTRIES } from "./constants";

export function formatCurrency(amount: number, currencyCode: string): string {
  const country = COUNTRIES.find((c) => c.currency === currencyCode);
  const locale = country?.locale || "en-US";

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currencyCode} ${amount.toFixed(2)}`;
  }
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
}
