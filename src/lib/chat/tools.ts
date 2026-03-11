import { tool } from "@langchain/core/tools";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";

const GRAMS_PER_OUNCE = 31.1035;
const GOLD_NISAB_GRAMS = 87.48;
const SILVER_NISAB_GRAMS = 612.36;

/**
 * Tool to fetch live gold/silver prices — available to all users (no auth needed).
 */
export function createMetalPriceTool(baseUrl: string) {
  return tool(
    async ({ currency }) => {
      try {
        const res = await fetch(`${baseUrl}/api/metals?currency=${currency}`, {
          signal: AbortSignal.timeout(10000),
        });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();

        const goldNisab = data.goldPricePerGram * GOLD_NISAB_GRAMS;
        const silverNisab = data.silverPricePerGram * SILVER_NISAB_GRAMS;

        return [
          `Live Metal Prices (${data.currency}):`,
          `  Gold: ${data.goldPricePerGram.toFixed(2)} per gram | ${data.goldPricePerOunce.toFixed(2)} per troy ounce`,
          `  Silver: ${data.silverPricePerGram.toFixed(2)} per gram | ${data.silverPricePerOunce.toFixed(2)} per troy ounce`,
          ``,
          `Nisab Thresholds (${data.currency}):`,
          `  Gold Nisab (${GOLD_NISAB_GRAMS}g): ${goldNisab.toFixed(2)}`,
          `  Silver Nisab (${SILVER_NISAB_GRAMS}g): ${silverNisab.toFixed(2)}`,
          ``,
          `Source: ${data.live ? "Live market data" : "Estimated (offline fallback)"}`,
          `Updated: ${data.timestamp}`,
        ].join("\n");
      } catch {
        return `Unable to fetch live prices. Approximate nisab: Gold (87.48g) ≈ $7,400 USD, Silver (612.36g) ≈ $550 USD. Check the calculator for accurate local prices.`;
      }
    },
    {
      name: "get_live_metal_prices",
      description: "Fetch current live gold and silver prices per gram and per ounce, and calculate the current Nisab thresholds. Use when the user asks about today's gold/silver price, current nisab value, or how much nisab is in their currency.",
      schema: z.object({
        currency: z.string().default("USD").describe("Currency code (e.g., USD, BDT, PKR, SAR, GBP). Default: USD."),
      }),
    },
  );
}

/**
 * Creates LangChain tools that can query the user's Supabase data.
 * All tools are scoped to the authenticated user's ID.
 */
export function createSupabaseTools(supabase: SupabaseClient, userId: string) {
  const getZakatRecords = tool(
    async ({ year }) => {
      let query = supabase
        .from("zakat_records")
        .select("id, year, calculated_at, currency, country, nisab_basis, total_assets, total_deductions, net_zakatable_wealth, nisab_threshold, is_above_nisab, zakat_amount, breakdown, is_paid, paid_at, notes")
        .eq("user_id", userId)
        .order("year", { ascending: false })
        .limit(10);

      if (year) {
        query = query.eq("year", year);
      }

      const { data, error } = await query;
      if (error) return `Error fetching records: ${error.message}`;
      if (!data?.length) return "No zakat records found.";

      return data.map((r) => {
        const parts = [
          `Year: ${r.year} | Date: ${new Date(r.calculated_at).toLocaleDateString()}`,
          `Total Assets: ${r.total_assets} ${r.currency} | Deductions: ${r.total_deductions} ${r.currency}`,
          `Net Wealth: ${r.net_zakatable_wealth} ${r.currency} | Nisab: ${r.nisab_threshold} ${r.currency} (${r.nisab_basis})`,
          `Above Nisab: ${r.is_above_nisab ? "Yes" : "No"} | Zakat Due: ${r.zakat_amount} ${r.currency}`,
          `Paid: ${r.is_paid ? `Yes (${r.paid_at ? new Date(r.paid_at).toLocaleDateString() : "date unknown"})` : "Not yet"}`,
        ];
        if (r.breakdown?.length) {
          parts.push("Breakdown: " + r.breakdown.map((b: { category: string; amount: number }) => `${b.category}: ${b.amount}`).join(", "));
        }
        if (r.notes) parts.push(`Notes: ${r.notes}`);
        return parts.join("\n");
      }).join("\n---\n");
    },
    {
      name: "get_zakat_records",
      description: "Fetch the user's zakat calculation history from the database. Can filter by year. Returns details like total assets, deductions, net wealth, zakat amount, paid status, and asset breakdown.",
      schema: z.object({
        year: z.number().optional().describe("Filter by specific year (e.g., 2025). Omit to get all records."),
      }),
    },
  );

  const getZakatPayments = tool(
    async ({ year }) => {
      // First get record IDs for the year
      let recordQuery = supabase
        .from("zakat_records")
        .select("id, year, zakat_amount, currency")
        .eq("user_id", userId);

      if (year) {
        recordQuery = recordQuery.eq("year", year);
      }

      const { data: records } = await recordQuery;
      if (!records?.length) return "No zakat records found.";

      const recordIds = records.map((r) => r.id);
      const { data: payments, error } = await supabase
        .from("zakat_payments")
        .select("id, record_id, amount, recipient, category, paid_at, notes")
        .in("record_id", recordIds)
        .order("paid_at", { ascending: false });

      if (error) return `Error fetching payments: ${error.message}`;
      if (!payments?.length) return `No payments recorded yet. Total zakat due: ${records.map((r) => `${r.zakat_amount} ${r.currency} (${r.year})`).join(", ")}`;

      const result: string[] = [];
      for (const rec of records) {
        const recPayments = payments.filter((p) => p.record_id === rec.id);
        const totalPaid = recPayments.reduce((sum, p) => sum + Number(p.amount), 0);
        const remaining = Number(rec.zakat_amount) - totalPaid;

        result.push(`Year ${rec.year}: Zakat Due = ${rec.zakat_amount} ${rec.currency}, Paid = ${totalPaid} ${rec.currency}, Remaining = ${remaining} ${rec.currency}`);
        for (const p of recPayments) {
          result.push(`  - ${p.amount} ${rec.currency} to ${p.recipient} (${p.category}) on ${new Date(p.paid_at).toLocaleDateString()}${p.notes ? ` [${p.notes}]` : ""}`);
        }
      }

      return result.join("\n");
    },
    {
      name: "get_zakat_payments",
      description: "Fetch the user's zakat payment history — who they paid, how much, what category. Shows paid vs remaining amounts. Use this when the user asks about their payment progress or distribution.",
      schema: z.object({
        year: z.number().optional().describe("Filter payments by zakat year. Omit to get all."),
      }),
    },
  );

  const getSadaqahRecords = tool(
    async ({ limit }) => {
      const { data, error } = await supabase
        .from("sadaqah_records")
        .select("id, amount, currency, category, date, notes")
        .eq("user_id", userId)
        .order("date", { ascending: false })
        .limit(limit || 20);

      if (error) return `Error fetching sadaqah records: ${error.message}`;
      if (!data?.length) return "No sadaqah records found.";

      const totalByCategory: Record<string, number> = {};
      let grandTotal = 0;
      const currency = data[0].currency || "USD";

      const lines = data.map((r) => {
        totalByCategory[r.category] = (totalByCategory[r.category] || 0) + Number(r.amount);
        grandTotal += Number(r.amount);
        return `${r.date}: ${r.amount} ${r.currency} — ${r.category}${r.notes ? ` (${r.notes})` : ""}`;
      });

      const summary = Object.entries(totalByCategory)
        .map(([cat, total]) => `${cat}: ${total} ${currency}`)
        .join(", ");

      return `Total Sadaqah: ${grandTotal} ${currency}\nBy Category: ${summary}\n\nRecent Records:\n${lines.join("\n")}`;
    },
    {
      name: "get_sadaqah_records",
      description: "Fetch the user's sadaqah (voluntary charity) records. Shows amounts, categories, dates, and totals. Use when the user asks about their charity history.",
      schema: z.object({
        limit: z.number().optional().describe("Number of records to return (default 20, max 50)"),
      }),
    },
  );

  const getUserSummary = tool(
    async () => {
      // Fetch latest zakat record
      const { data: zakatRecords } = await supabase
        .from("zakat_records")
        .select("year, zakat_amount, currency, is_above_nisab, is_paid, net_zakatable_wealth, total_assets")
        .eq("user_id", userId)
        .order("year", { ascending: false })
        .limit(3);

      // Fetch sadaqah total
      const { data: sadaqah } = await supabase
        .from("sadaqah_records")
        .select("amount")
        .eq("user_id", userId);

      const sadaqahTotal = sadaqah?.reduce((sum, r) => sum + Number(r.amount), 0) || 0;

      const parts: string[] = [];

      if (zakatRecords?.length) {
        parts.push("Zakat History:");
        for (const r of zakatRecords) {
          parts.push(`  ${r.year}: Assets = ${r.total_assets} ${r.currency}, Net Wealth = ${r.net_zakatable_wealth} ${r.currency}, Zakat = ${r.zakat_amount} ${r.currency}, Paid: ${r.is_paid ? "Yes" : "No"}`);
        }
      } else {
        parts.push("No zakat calculations saved yet.");
      }

      parts.push(`\nTotal Sadaqah Given: ${sadaqahTotal} (${sadaqah?.length || 0} donations)`);

      return parts.join("\n");
    },
    {
      name: "get_user_summary",
      description: "Get a quick overview of the user's financial ibadah — recent zakat calculations and total sadaqah. Use this when the user asks for a general summary or overview.",
      schema: z.object({}),
    },
  );

  return [getZakatRecords, getZakatPayments, getSadaqahRecords, getUserSummary];
}
