import { NextResponse } from "next/server";

// Map timezone to country code
const TIMEZONE_TO_COUNTRY: Record<string, string> = {
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

export async function GET() {
  // Try free IP geolocation APIs
  try {
    const res = await fetch("http://ip-api.com/json/?fields=countryCode,timezone", {
      next: { revalidate: 86400 },
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        countryCode: data.countryCode || "US",
        timezone: data.timezone || "",
      });
    }
  } catch {
    // fallback
  }

  return NextResponse.json({ countryCode: "US", timezone: "" });
}

// Client-side timezone detection fallback
export function detectCountryFromTimezone(timezone: string): string | null {
  return TIMEZONE_TO_COUNTRY[timezone] || null;
}
