import { tool } from "@langchain/core/tools";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getLocalDateStr } from "@/lib/date-utils";

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

      // Salat stats
      const today = getLocalDateStr();
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 6);
      const { data: salatRecords } = await supabase
        .from("salat_records")
        .select("date, prayer_name, prayer_type, status, in_jamaah, on_time")
        .eq("user_id", userId)
        .gte("date", getLocalDateStr(weekAgo))
        .order("date", { ascending: false })
        .limit(100);

      if (salatRecords?.length) {
        const fard = salatRecords.filter((r) => r.prayer_type === "fard");
        const prayed = fard.filter((r) => r.status === "prayed" || r.status === "late").length;
        const todayFard = fard.filter((r) => r.date === today && (r.status === "prayed" || r.status === "late")).length;
        parts.push(`\nSalat This Week: ${prayed} fard prayers completed`);
        parts.push(`Today: ${todayFard}/5 fard completed`);
      } else {
        parts.push("\nNo salat tracking data yet.");
      }

      return parts.join("\n");
    },
    {
      name: "get_user_summary",
      description: "Get a quick overview of the user's ibadah — recent zakat calculations, total sadaqah, and salat (prayer) tracking stats. Use this when the user asks for a general summary or overview.",
      schema: z.object({}),
    },
  );

  const getTasbihSessions = tool(
    async ({ limit, date }) => {
      let query = supabase
        .from("tasbih_sessions")
        .select("id, dhikr_type, custom_text, target_count, completed_count, completed_at, date")
        .eq("user_id", userId)
        .order("completed_at", { ascending: false })
        .limit(limit || 20);

      if (date) {
        query = query.eq("date", date);
      }

      const { data, error } = await query;
      if (error) return `Error fetching tasbih sessions: ${error.message}`;
      if (!data?.length) return "No tasbih sessions found. The user hasn't used the Tasbih Counter yet.";

      const totalByType: Record<string, number> = {};
      let grandTotal = 0;

      const lines = data.map((s) => {
        totalByType[s.dhikr_type] = (totalByType[s.dhikr_type] || 0) + s.completed_count;
        grandTotal += s.completed_count;
        const status = s.completed_count >= s.target_count ? "✓ Completed" : `${s.completed_count}/${s.target_count}`;
        return `${s.date}: ${s.dhikr_type} — ${status} (${s.completed_count} counts)`;
      });

      const summary = Object.entries(totalByType)
        .map(([type, total]) => `${type}: ${total}`)
        .join(", ");

      return `Total Dhikr: ${grandTotal}\nBy Type: ${summary}\n\nRecent Sessions:\n${lines.join("\n")}`;
    },
    {
      name: "get_tasbih_sessions",
      description: "Fetch the user's tasbih (dhikr counting) session history. Shows which dhikr they counted, targets, completion status, and totals. Use when the user asks about their dhikr history or tasbih stats.",
      schema: z.object({
        limit: z.number().optional().describe("Number of sessions to return (default 20, max 50)"),
        date: z.string().optional().describe("Filter by specific date in YYYY-MM-DD format"),
      }),
    },
  );

  const getSalatRecords = tool(
    async ({ period, date }) => {
      const today = getLocalDateStr();
      let startDate = today;

      if (period === "week") {
        const d = new Date();
        d.setDate(d.getDate() - 6);
        startDate = getLocalDateStr(d);
      } else if (period === "month") {
        const d = new Date();
        d.setDate(d.getDate() - 29);
        startDate = getLocalDateStr(d);
      } else if (period === "year") {
        const d = new Date();
        d.setFullYear(d.getFullYear() - 1);
        startDate = getLocalDateStr(d);
      }

      if (date) {
        startDate = date;
      }

      const { data, error } = await supabase
        .from("salat_records")
        .select("date, prayer_name, prayer_type, status, in_jamaah, on_time")
        .eq("user_id", userId)
        .gte("date", startDate)
        .lte("date", date || today)
        .order("date", { ascending: false })
        .limit(200);

      if (error) return `Error fetching salat records: ${error.message}`;
      if (!data?.length) return "No salat records found. The user hasn't started tracking prayers yet.";

      // Compute stats
      const fardRecords = data.filter((r) => r.prayer_type === "fard");
      const prayed = fardRecords.filter((r) => r.status === "prayed" || r.status === "late").length;
      const missed = fardRecords.filter((r) => r.status === "missed").length;
      const onTime = fardRecords.filter((r) => r.on_time && r.status !== "missed").length;
      const jamaah = fardRecords.filter((r) => r.in_jamaah && r.status !== "missed").length;
      const uniqueDays = new Set(data.map((r) => r.date)).size;

      // Today's status
      const todayRecords = data.filter((r) => r.date === today && r.prayer_type === "fard");
      const todayPrayed = todayRecords.filter((r) => r.status === "prayed" || r.status === "late");

      // Most missed prayer
      const missedByPrayer: Record<string, number> = {};
      for (const r of fardRecords.filter((r) => r.status === "missed")) {
        missedByPrayer[r.prayer_name] = (missedByPrayer[r.prayer_name] || 0) + 1;
      }
      const mostMissed = Object.entries(missedByPrayer).sort((a, b) => b[1] - a[1])[0];

      const parts = [
        `Prayer Tracking Summary (${period || "today"}):`,
        `  Days tracked: ${uniqueDays}`,
        `  Fard prayed: ${prayed} | Missed: ${missed}`,
        `  On-time rate: ${prayed > 0 ? Math.round((onTime / prayed) * 100) : 0}%`,
        `  Jamaah rate: ${prayed > 0 ? Math.round((jamaah / prayed) * 100) : 0}%`,
        `  Completion rate: ${uniqueDays > 0 ? Math.round((prayed / (uniqueDays * 5)) * 100) : 0}%`,
      ];

      if (todayPrayed.length > 0) {
        parts.push(`\nToday: ${todayPrayed.length}/5 fard completed (${todayPrayed.map((r) => r.prayer_name).join(", ")})`);
      }

      if (mostMissed) {
        parts.push(`\nMost missed prayer: ${mostMissed[0]} (${mostMissed[1]} times)`);
      }

      // Qaza debt
      const allMissed = fardRecords.filter((r) => r.status === "missed").length;
      const allQaza = fardRecords.filter((r) => r.status === "qaza").length;
      const qazaRemaining = Math.max(0, allMissed - allQaza);
      if (qazaRemaining > 0) {
        parts.push(`\nQaza remaining: ${qazaRemaining} prayers`);
      }

      return parts.join("\n");
    },
    {
      name: "get_salat_records",
      description:
        "Fetch the user's salat (prayer) tracking data. Shows which prayers were completed, missed, or late. Returns streak info, completion rates, jamaah stats, and qaza (makeup prayer) debt. Use when the user asks about their prayer history, streak, missed prayers, or salat progress.",
      schema: z.object({
        period: z.enum(["today", "week", "month", "year"]).optional().describe("Time period (default: today)"),
        date: z.string().optional().describe("Specific date in YYYY-MM-DD format"),
      }),
    },
  );

  const getRamadanProgress = tool(
    async ({ hijri_year }) => {
      let query = supabase
        .from("ramadan_tracker")
        .select("*")
        .eq("user_id", userId)
        .order("day_number", { ascending: true });

      if (hijri_year) {
        query = query.eq("hijri_year", hijri_year);
      } else {
        query = query.limit(30);
      }

      const { data, error } = await query;
      if (error) return `Error fetching Ramadan data: ${error.message}`;
      if (!data?.length) return "No Ramadan tracking data found.";

      const totalFasted = data.filter((r) => r.fasted).length;
      const totalTaraweeh = data.filter((r) => r.taraweeh).length;
      const quranPages = data.reduce((sum, r) => sum + (r.quran_pages || 0), 0);
      const sadaqahDays = data.filter((r) => r.sadaqah_given).length;
      const itikaafDays = data.filter((r) => r.itikaf).length;
      const laylatalQadrDays = data.filter((r) => r.laylatul_qadr_worship).length;
      const year = data[0].hijri_year;

      return [
        `Ramadan Progress (${year} AH):`,
        `  Days tracked: ${data.length}`,
        `  Days fasted: ${totalFasted}/${data.length}`,
        `  Taraweeh prayed: ${totalTaraweeh}/${data.length}`,
        `  Quran pages read: ${quranPages} (${Math.round((quranPages / 604) * 100)}% of full Quran)`,
        `  Sadaqah given: ${sadaqahDays} days`,
        `  I'tikaf: ${itikaafDays} days`,
        `  Laylatul Qadr worship: ${laylatalQadrDays} nights`,
      ].join("\n");
    },
    {
      name: "get_ramadan_progress",
      description:
        "Fetch the user's Ramadan tracking progress. Shows fasting days, taraweeh attendance, Quran reading progress, sadaqah, i'tikaf, and Laylatul Qadr worship. Use when the user asks about their Ramadan progress, fasting, or taraweeh.",
      schema: z.object({
        hijri_year: z.number().optional().describe("Hijri year (e.g., 1447). Omit for most recent."),
      }),
    },
  );

  return [getZakatRecords, getZakatPayments, getSadaqahRecords, getTasbihSessions, getSalatRecords, getRamadanProgress, getUserSummary];
}
