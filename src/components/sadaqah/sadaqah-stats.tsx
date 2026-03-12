"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/ui/custom/animated-counter";
import { slideUp, staggerContainer, staggerItem } from "@/lib/animations";
import { TrendingUp, Calendar, Hash, PieChart as PieChartIcon } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { SADAQAH_CATEGORIES, type SadaqahRecord } from "./sadaqah-form";
import type { TransLang } from "@/lib/islamic-content";
import { SADAQAH_STATS_TEXTS } from "@/lib/sadaqah-texts";

interface SadaqahStatsProps {
  records: SadaqahRecord[];
  currencySymbol?: string;
  lang: TransLang;
}

export function SadaqahStats({ records, currencySymbol = "$", lang }: SadaqahStatsProps) {
  const st = SADAQAH_STATS_TEXTS[lang];
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const totalThisMonth = useMemo(() => {
    return records
      .filter((r) => {
        const d = new Date(r.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, r) => sum + r.amount, 0);
  }, [records, currentMonth, currentYear]);

  const totalThisYear = useMemo(() => {
    return records
      .filter((r) => new Date(r.date).getFullYear() === currentYear)
      .reduce((sum, r) => sum + r.amount, 0);
  }, [records, currentYear]);

  const donationCount = records.length;

  // Bar chart: last 6 months
  const monthlyData = useMemo(() => {
    const months: { month: string; total: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - i, 1);
      const label = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      const m = d.getMonth();
      const y = d.getFullYear();
      const total = records
        .filter((r) => {
          const rd = new Date(r.date);
          return rd.getMonth() === m && rd.getFullYear() === y;
        })
        .reduce((sum, r) => sum + r.amount, 0);
      months.push({ month: label, total });
    }
    return months;
  }, [records, currentMonth, currentYear]);

  // Pie chart: category breakdown
  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    for (const r of records) {
      map[r.category] = (map[r.category] || 0) + r.amount;
    }
    return Object.entries(map)
      .map(([name, value]) => {
        const cat = SADAQAH_CATEGORIES.find((c) => c.value === name);
        return { name, value, color: cat?.color || "#8b5cf6" };
      })
      .sort((a, b) => b.value - a.value);
  }, [records]);

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div variants={staggerItem}>
          <Card className="border-emerald-200/50 bg-gradient-to-br from-emerald-50/50 to-white">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{st.thisMonth}</p>
                  <AnimatedCounter
                    value={totalThisMonth}
                    prefix={currencySymbol}
                    decimals={2}
                    className="text-2xl font-bold text-emerald-800"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Card className="border-amber-200/50 bg-gradient-to-br from-amber-50/50 to-white">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{st.thisYear}</p>
                  <AnimatedCounter
                    value={totalThisYear}
                    prefix={currencySymbol}
                    decimals={2}
                    className="text-2xl font-bold text-amber-800"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Card className="border-purple-200/50 bg-gradient-to-br from-purple-50/50 to-white">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Hash className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{st.totalDonations}</p>
                  <AnimatedCounter
                    value={donationCount}
                    decimals={0}
                    className="text-2xl font-bold text-purple-800"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      {records.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Bar Chart */}
          <motion.div variants={slideUp}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-800 text-base">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  {st.monthlyTotals}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                      <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
                      <Tooltip
                        formatter={(value) => [`${currencySymbol}${Number(value).toFixed(2)}`, "Total"]}
                        contentStyle={{
                          borderRadius: "8px",
                          border: "1px solid #d1fae5",
                          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Bar
                        dataKey="total"
                        fill="#10b981"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={48}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Category Pie Chart */}
          <motion.div variants={slideUp}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-800 text-base">
                  <PieChartIcon className="h-4 w-4 text-emerald-600" />
                  {st.byCategory}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                        nameKey="name"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => `${currencySymbol}${Number(value).toFixed(2)}`}
                        contentStyle={{
                          borderRadius: "8px",
                          border: "1px solid #d1fae5",
                          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ fontSize: "12px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
