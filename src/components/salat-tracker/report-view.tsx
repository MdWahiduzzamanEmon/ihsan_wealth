"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { fadeIn } from "@/lib/animations";
import { getLocalDateStr } from "@/lib/date-utils";
import { FARD_PRAYERS, type SalatRecord, type SalatStats } from "@/hooks/use-salat-tracker";
import type { SalatTrackerTexts } from "@/lib/salat-tracker-texts";

interface ReportViewProps {
  records: SalatRecord[];
  stats: SalatStats;
  t: SalatTrackerTexts;
  getRecordsForRange: (start: string, end: string) => SalatRecord[];
}

type Period = "weekly" | "monthly" | "yearly";
const COLORS = {
  prayed: "#10b981",
  late: "#f59e0b",
  missed: "#ef4444",
  empty: "#e5e7eb",
};

export function ReportView({ records, stats, t, getRecordsForRange }: ReportViewProps) {
  const [period, setPeriod] = useState<Period>("weekly");

  // Date ranges
  const { startDate, endDate, days } = useMemo(() => {
    const now = new Date();
    const end = getLocalDateStr(now);
    let start: string;
    let days: number;

    if (period === "weekly") {
      const d = new Date(now);
      d.setDate(d.getDate() - 6);
      start = getLocalDateStr(d);
      days = 7;
    } else if (period === "monthly") {
      const d = new Date(now);
      d.setDate(d.getDate() - 29);
      start = getLocalDateStr(d);
      days = 30;
    } else {
      const d = new Date(now);
      d.setFullYear(d.getFullYear() - 1);
      start = getLocalDateStr(d);
      days = 365;
    }
    return { startDate: start, endDate: end, days };
  }, [period]);

  const periodRecords = useMemo(
    () => getRecordsForRange(startDate, endDate),
    [getRecordsForRange, startDate, endDate]
  );

  // Bar chart data — daily prayer counts for last 7/30 days
  const barData = useMemo(() => {
    if (period === "yearly") {
      // Monthly aggregation
      const months: Record<string, { prayed: number; late: number; missed: number }> = {};
      for (const r of periodRecords) {
        if (r.prayer_type !== "fard") continue;
        const month = r.date.slice(0, 7);
        if (!months[month]) months[month] = { prayed: 0, late: 0, missed: 0 };
        if (r.status === "prayed") months[month].prayed++;
        else if (r.status === "late") months[month].late++;
        else if (r.status === "missed") months[month].missed++;
      }
      return Object.entries(months)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, data]) => ({
          name: month.slice(5),
          ...data,
        }));
    }

    // Daily aggregation
    const daysToShow = period === "weekly" ? 7 : 14;
    const result = [];
    for (let i = daysToShow - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = getLocalDateStr(d);
      const dayRecords = periodRecords.filter(
        (r) => r.date === dateStr && r.prayer_type === "fard"
      );
      result.push({
        name: d.toLocaleDateString("en", { weekday: "short" }).slice(0, 2),
        prayed: dayRecords.filter((r) => r.status === "prayed").length,
        late: dayRecords.filter((r) => r.status === "late").length,
        missed: dayRecords.filter((r) => r.status === "missed").length,
      });
    }
    return result;
  }, [periodRecords, period]);

  // Pie chart data
  const pieData = useMemo(() => {
    const fardRecords = periodRecords.filter((r) => r.prayer_type === "fard");
    const prayed = fardRecords.filter((r) => r.status === "prayed").length;
    const late = fardRecords.filter((r) => r.status === "late").length;
    const missed = fardRecords.filter((r) => r.status === "missed").length;
    return [
      { name: t.prayed, value: prayed, color: COLORS.prayed },
      { name: t.late, value: late, color: COLORS.late },
      { name: t.missed, value: missed, color: COLORS.missed },
    ].filter((d) => d.value > 0);
  }, [periodRecords, t]);

  // Per-prayer breakdown
  const prayerBreakdown = useMemo(() => {
    return FARD_PRAYERS.map((prayer) => {
      const prayerRecords = periodRecords.filter(
        (r) => r.prayer_name === prayer && r.prayer_type === "fard"
      );
      const total = prayerRecords.length;
      const prayed = prayerRecords.filter(
        (r) => r.status === "prayed" || r.status === "late"
      ).length;
      return {
        name: prayer,
        rate: total > 0 ? Math.round((prayed / total) * 100) : 0,
        total,
        prayed,
      };
    });
  }, [periodRecords]);

  // Heatmap for weekly view
  const heatmapData = useMemo(() => {
    if (period !== "weekly") return [];
    const result: { day: string; prayer: string; status: string }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = getLocalDateStr(d);
      const dayName = d.toLocaleDateString("en", { weekday: "short" }).slice(0, 2);
      for (const prayer of FARD_PRAYERS) {
        const record = periodRecords.find(
          (r) => r.date === dateStr && r.prayer_name === prayer
        );
        result.push({
          day: dayName,
          prayer,
          status: record?.status || "empty",
        });
      }
    }
    return result;
  }, [periodRecords, period]);

  return (
    <motion.div
      className="space-y-4"
      variants={fadeIn}
      initial="initial"
      animate="animate"
    >
      {/* Period tabs */}
      <div className="flex rounded-xl bg-gray-100 p-1">
        {(["weekly", "monthly", "yearly"] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`flex-1 rounded-lg py-2 text-xs font-medium transition-all ${
              period === p
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t[p]}
          </button>
        ))}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-2">
        <StatCard label={t.completionRate} value={`${stats.completionRate}%`} />
        <StatCard label={t.onTimeRate} value={`${stats.onTimeRate}%`} />
        <StatCard label={t.jamaahRate} value={`${stats.jamaahRate}%`} />
      </div>

      {/* Charts grid: 2-col on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weekly heatmap */}
        {period === "weekly" && heatmapData.length > 0 && (
          <div className="rounded-xl border border-emerald-100 bg-white p-4">
            <h3 className="text-xs font-semibold text-gray-700 mb-3">{t.thisWeek}</h3>
            <div className="grid grid-cols-8 gap-1.5 text-[10px]">
              {/* Header row */}
              <div />
              {Array.from(new Set(heatmapData.map((h) => h.day))).map((day) => (
                <div key={day} className="text-center text-gray-400 font-medium">
                  {day}
                </div>
              ))}
              {/* Prayer rows */}
              {FARD_PRAYERS.map((prayer) => (
                <>
                  <div key={`label-${prayer}`} className="text-right text-gray-500 pr-1 capitalize">
                    {prayer.slice(0, 3)}
                  </div>
                  {Array.from(new Set(heatmapData.map((h) => h.day))).map((day) => {
                    const cell = heatmapData.find(
                      (h) => h.day === day && h.prayer === prayer
                    );
                    return (
                      <div
                        key={`${prayer}-${day}`}
                        className={`h-6 rounded ${
                          cell?.status === "prayed"
                            ? "bg-emerald-400"
                            : cell?.status === "late"
                            ? "bg-amber-400"
                            : cell?.status === "missed"
                            ? "bg-red-400"
                            : "bg-gray-100"
                        }`}
                      />
                    );
                  })}
                </>
              ))}
            </div>
          </div>
        )}

        {/* Pie chart + breakdown */}
        {pieData.length > 0 && (
          <div className="rounded-xl border border-emerald-100 bg-white p-4">
            <h3 className="text-xs font-semibold text-gray-700 mb-3">
              Status Breakdown
            </h3>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={120} height={120}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5">
                {pieData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2 text-xs">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-gray-600">{entry.name}</span>
                    <span className="font-medium text-gray-800">{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bar chart — full width */}
      <div className="rounded-xl border border-emerald-100 bg-white p-4">
        <h3 className="text-xs font-semibold text-gray-700 mb-3">
          {period === "yearly" ? t.monthly : t.thisWeek}
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="prayed" stackId="a" fill={COLORS.prayed} radius={[0, 0, 0, 0]} />
            <Bar dataKey="late" stackId="a" fill={COLORS.late} />
            <Bar dataKey="missed" stackId="a" fill={COLORS.missed} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Per-prayer breakdown */}
      <div className="rounded-xl border border-emerald-100 bg-white p-4">
        <h3 className="text-xs font-semibold text-gray-700 mb-3">
          Per-Prayer Breakdown
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {prayerBreakdown.map((p) => (
            <div key={p.name} className="rounded-lg border border-gray-100 bg-gray-50/50 p-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-gray-700 capitalize">{p.name}</span>
                <span className="text-sm font-bold text-emerald-700">{p.rate}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all"
                  style={{ width: `${p.rate}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">{p.prayed}/{p.total} {t.prayed}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-emerald-100 bg-white p-3 text-center">
      <p className="text-lg font-bold text-emerald-700">{value}</p>
      <p className="text-[10px] text-gray-400">{label}</p>
    </div>
  );
}
