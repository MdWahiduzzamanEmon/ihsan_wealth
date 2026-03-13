export const NISAB_GOLD_GRAMS = 87.48;
export const NISAB_SILVER_GRAMS = 612.36;
export const ZAKAT_RATE = 0.025;
export const GRAMS_PER_OUNCE = 31.1035;
export const GRAMS_PER_TOLA = 11.6638;

export const TIMEZONE_TO_COUNTRY: Record<string, string> = {
  "Asia/Dhaka": "BD",
  "Asia/Karachi": "PK",
  "Asia/Kolkata": "IN",
  "Asia/Calcutta": "IN",
  "Asia/Riyadh": "SA",
  "Asia/Dubai": "AE",
  "Asia/Kuwait": "KW",
  "Asia/Qatar": "QA",
  "Asia/Bahrain": "BH",
  "Asia/Muscat": "OM",
  "Asia/Amman": "JO",
  "Asia/Kuala_Lumpur": "MY",
  "Asia/Jakarta": "ID",
  "Europe/Istanbul": "TR",
  "Africa/Cairo": "EG",
  "Africa/Lagos": "NG",
  "Europe/London": "GB",
  "America/New_York": "US",
  "America/Chicago": "US",
  "America/Denver": "US",
  "America/Los_Angeles": "US",
  "America/Toronto": "CA",
  "America/Vancouver": "CA",
  "Australia/Sydney": "AU",
  "Australia/Melbourne": "AU",
  "Europe/Berlin": "EU",
  "Europe/Paris": "EU",
  "Europe/Amsterdam": "EU",
  "Europe/Rome": "EU",
  "Europe/Madrid": "EU",
};

export interface CountryInfo {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
  flag: string;
  locale: string;
}

export const COUNTRIES: CountryInfo[] = [
  { code: "US", name: "United States", currency: "USD", currencySymbol: "$", flag: "🇺🇸", locale: "en-US" },
  { code: "GB", name: "United Kingdom", currency: "GBP", currencySymbol: "£", flag: "🇬🇧", locale: "en-GB" },
  { code: "SA", name: "Saudi Arabia", currency: "SAR", currencySymbol: "﷼", flag: "🇸🇦", locale: "ar-SA" },
  { code: "AE", name: "UAE", currency: "AED", currencySymbol: "د.إ", flag: "🇦🇪", locale: "ar-AE" },
  { code: "PK", name: "Pakistan", currency: "PKR", currencySymbol: "₨", flag: "🇵🇰", locale: "en-PK" },
  { code: "BD", name: "Bangladesh", currency: "BDT", currencySymbol: "৳", flag: "🇧🇩", locale: "bn-BD" },
  { code: "IN", name: "India", currency: "INR", currencySymbol: "₹", flag: "🇮🇳", locale: "en-IN" },
  { code: "MY", name: "Malaysia", currency: "MYR", currencySymbol: "RM", flag: "🇲🇾", locale: "ms-MY" },
  { code: "ID", name: "Indonesia", currency: "IDR", currencySymbol: "Rp", flag: "🇮🇩", locale: "id-ID" },
  { code: "TR", name: "Turkey", currency: "TRY", currencySymbol: "₺", flag: "🇹🇷", locale: "tr-TR" },
  { code: "EG", name: "Egypt", currency: "EGP", currencySymbol: "£", flag: "🇪🇬", locale: "ar-EG" },
  { code: "NG", name: "Nigeria", currency: "NGN", currencySymbol: "₦", flag: "🇳🇬", locale: "en-NG" },
  { code: "QA", name: "Qatar", currency: "QAR", currencySymbol: "﷼", flag: "🇶🇦", locale: "ar-QA" },
  { code: "KW", name: "Kuwait", currency: "KWD", currencySymbol: "د.ك", flag: "🇰🇼", locale: "ar-KW" },
  { code: "BH", name: "Bahrain", currency: "BHD", currencySymbol: "BD", flag: "🇧🇭", locale: "ar-BH" },
  { code: "OM", name: "Oman", currency: "OMR", currencySymbol: "﷼", flag: "🇴🇲", locale: "ar-OM" },
  { code: "JO", name: "Jordan", currency: "JOD", currencySymbol: "JD", flag: "🇯🇴", locale: "ar-JO" },
  { code: "CA", name: "Canada", currency: "CAD", currencySymbol: "C$", flag: "🇨🇦", locale: "en-CA" },
  { code: "AU", name: "Australia", currency: "AUD", currencySymbol: "A$", flag: "🇦🇺", locale: "en-AU" },
  { code: "EU", name: "Europe (EUR)", currency: "EUR", currencySymbol: "€", flag: "🇪🇺", locale: "de-DE" },
];

export const STEP_LABELS = [
  "Country",
  "Cash",
  "Gold & Silver",
  "Investments",
  "Business",
  "Property",
  "Agriculture",
  "Loans & Debts",
  "Fitr & Settings",
  "Summary",
];

export const BREAKDOWN_COLORS = [
  "#16a34a", // green
  "#d4a017", // gold
  "#c0c0c0", // silver
  "#2563eb", // blue
  "#9333ea", // purple
  "#ea580c", // orange
  "#06b6d4", // cyan
  "#e11d48", // rose
];
