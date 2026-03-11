import { NextResponse } from "next/server";
import { TIMEZONE_TO_COUNTRY } from "@/lib/constants";

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
