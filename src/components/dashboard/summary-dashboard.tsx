"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AnimatedCounter } from "@/components/ui/custom/animated-counter";
import { staggerContainer, staggerItem, scaleIn } from "@/lib/animations";
import type { ZakatFormData, ZakatResult } from "@/types/zakat";
import type { MetalPrices } from "@/hooks/use-metal-prices";
import { formatCurrency } from "@/lib/format";
import { UI_TEXTS, getLangFromCountry } from "@/lib/islamic-content";
import { useZakatRecords } from "@/hooks/use-zakat-records";
import { useAuth } from "@/components/providers/auth-provider";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, RadialBarChart, RadialBar,
} from "recharts";
import {
  CheckCircle, XCircle, Printer, RotateCcw, Save, Loader2,
  Wheat, Heart, TrendingUp, LogIn
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SummaryDashboardProps {
  result: ZakatResult;
  currency: string;
  nisabBasis: "gold" | "silver";
  countryCode: string;
  onReset: () => void;
  formData?: ZakatFormData;
  prices?: MetalPrices | null;
}

const ZAKAT_RECIPIENTS = [
  { name: "Al-Fuqara (The Poor)", arabic: "الفقراء", color: "#10b981" },
  { name: "Al-Masakin (The Needy)", arabic: "المساكين", color: "#3b82f6" },
  { name: "Amil (Zakat Collectors)", arabic: "العاملين عليها", color: "#8b5cf6" },
  { name: "Muallaf (New Muslims)", arabic: "المؤلفة قلوبهم", color: "#f59e0b" },
  { name: "Riqab (Freeing Captives)", arabic: "في الرقاب", color: "#ef4444" },
  { name: "Al-Gharimin (Debtors)", arabic: "الغارمين", color: "#06b6d4" },
  { name: "Fi Sabilillah (In Allah's Cause)", arabic: "في سبيل الله", color: "#ec4899" },
  { name: "Ibn as-Sabil (Travelers)", arabic: "ابن السبيل", color: "#84cc16" },
];

export function SummaryDashboard({ result, currency, nisabBasis, countryCode, onReset, formData, prices }: SummaryDashboardProps) {
  const positiveBreakdown = result.breakdown.filter((b) => b.amount > 0);
  const lang = getLangFromCountry(countryCode);
  const texts = UI_TEXTS[lang];
  const { isAuthenticated } = useAuth();
  const { saveRecord, loading: saving, error: saveError } = useZakatRecords();
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!formData || !prices) return;
    const record = await saveRecord(formData, result, prices);
    if (record) setSaved(true);
  };

  // Bar chart data for asset breakdown
  const barData = positiveBreakdown.map((b) => ({
    name: b.category.length > 12 ? b.category.slice(0, 12) + "..." : b.category,
    amount: b.amount,
    fill: b.color,
  }));

  // Radial chart for nisab comparison
  const nisabPercent = Math.min(100, (result.netZakatableWealth / Math.max(result.activeNisab, 1)) * 100);
  const radialData = [
    { name: "Wealth", value: nisabPercent, fill: result.isAboveNisab ? "#10b981" : "#94a3b8" },
  ];

  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* Hero Zakat Result */}
      <motion.div variants={scaleIn}>
        <Card className={result.isAboveNisab
          ? "border-2 border-emerald-500 bg-gradient-to-br from-emerald-50 to-emerald-100/50 overflow-hidden"
          : "border-2 border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100/50 overflow-hidden"
        }>
          <CardContent className="pt-8 pb-8 text-center relative">
            {result.isAboveNisab && (
              <div className="absolute inset-0 opacity-5">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="resultPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M20 0L40 20L20 40L0 20Z" fill="none" stroke="#10b981" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#resultPattern)" />
                </svg>
              </div>
            )}

            {result.isAboveNisab ? (
              <div className="relative">
                <p className="font-arabic text-xl text-emerald-600/60 mb-2">الزكاة واجبة عليك</p>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-700">{texts.zakatObligatory}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{texts.yourZakatAmount}</p>
                <div className="text-5xl font-bold text-emerald-700 tracking-tight">
                  <AnimatedCounter value={result.zakatAmount} prefix={getCurrencyPrefix(currency)} decimals={2} />
                </div>

                {/* Additional Zakat types */}
                {(result.agriculturalZakat > 0 || result.zakatAlFitr > 0) && (
                  <motion.div
                    className="mt-4 flex flex-wrap gap-3 justify-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    {result.agriculturalZakat > 0 && (
                      <div className="inline-flex items-center gap-1.5 bg-lime-100 text-lime-700 px-3 py-1.5 rounded-full text-sm">
                        <Wheat className="h-3.5 w-3.5" />
                        Ushr: {formatCurrency(result.agriculturalZakat, currency)}
                      </div>
                    )}
                    {result.zakatAlFitr > 0 && (
                      <div className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-700 px-3 py-1.5 rounded-full text-sm">
                        <Heart className="h-3.5 w-3.5" />
                        Fitr: {formatCurrency(result.zakatAlFitr, currency)}
                      </div>
                    )}
                  </motion.div>
                )}

                {result.totalZakatDue !== result.zakatAmount && (
                  <motion.div
                    className="mt-3 text-lg font-bold text-emerald-800 bg-emerald-100 inline-block px-4 py-1.5 rounded-full"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    Total Due: {formatCurrency(result.totalZakatDue, currency)}
                  </motion.div>
                )}

                <p className="mt-4 font-arabic text-base text-amber-600/70" dir="rtl">
                  تَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُمْ
                </p>
                <p className="mt-1 text-sm text-muted-foreground italic">{texts.mayAllahAccept}</p>
              </div>
            ) : (
              <>
                <p className="font-arabic text-xl text-gray-400 mb-2">الحمد لله</p>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-1.5">
                  <XCircle className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">{texts.belowNisab}</span>
                </div>
                <p className="text-lg text-gray-600 mb-2">{texts.notObligatory}</p>
                <p className="text-sm text-muted-foreground">{texts.sadaqahNote}</p>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Visual Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Nisab Gauge */}
        <motion.div variants={staggerItem}>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-center">Nisab Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={radialData} startAngle={180} endAngle={0}>
                  <RadialBar background dataKey="value" cornerRadius={10} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="text-center -mt-8">
                <p className="text-2xl font-bold" style={{ color: result.isAboveNisab ? "#10b981" : "#94a3b8" }}>
                  {nisabPercent.toFixed(0)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  of {nisabBasis} nisab ({formatCurrency(result.activeNisab, currency)})
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pie Chart */}
        {positiveBreakdown.length > 0 && (
          <motion.div variants={staggerItem}>
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-center">Wealth Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={positiveBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="amount"
                      nameKey="category"
                    >
                      {positiveBreakdown.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value), currency)} />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Bar Chart */}
        {barData.length > 0 && (
          <motion.div variants={staggerItem}>
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-center flex items-center justify-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Asset Values
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={barData} layout="vertical" margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={80} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value), currency)} />
                    <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                      {barData.map((entry, index) => (
                        <Cell key={index} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Detailed Summary Table */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detailed Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.breakdown.map((item, i) => (
                <motion.div
                  key={item.category}
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm">{item.category}</span>
                    {item.percentage > 0 && (
                      <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        {item.percentage.toFixed(1)}%
                      </span>
                    )}
                  </div>
                  <span className={`text-sm font-medium ${item.amount < 0 ? "text-red-600" : ""}`}>
                    {item.amount < 0 ? "- " : ""}{formatCurrency(Math.abs(item.amount), currency)}
                  </span>
                </motion.div>
              ))}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total Assets</span>
                <span>{formatCurrency(result.totalAssets, currency)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Total Deductions</span>
                <span>- {formatCurrency(result.totalDeductions, currency)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Net Zakatable Wealth</span>
                <span>{formatCurrency(result.netZakatableWealth, currency)}</span>
              </div>
              {result.isAboveNisab && (
                <motion.div
                  className="flex justify-between font-bold text-lg text-emerald-700 bg-emerald-50 rounded-lg p-3 -mx-1"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <span>Zakat on Wealth (2.5%)</span>
                  <span>{formatCurrency(result.zakatAmount, currency)}</span>
                </motion.div>
              )}
              {result.agriculturalZakat > 0 && (
                <div className="flex justify-between font-medium text-lime-700 bg-lime-50 rounded-lg p-2 -mx-1">
                  <span>Agricultural Zakat (Ushr)</span>
                  <span>{formatCurrency(result.agriculturalZakat, currency)}</span>
                </div>
              )}
              {result.zakatAlFitr > 0 && (
                <div className="flex justify-between font-medium text-rose-700 bg-rose-50 rounded-lg p-2 -mx-1">
                  <span>Zakat al-Fitr</span>
                  <span>{formatCurrency(result.zakatAlFitr, currency)}</span>
                </div>
              )}
              {result.totalZakatDue > 0 && result.totalZakatDue !== result.zakatAmount && (
                <>
                  <Separator />
                  <div className="flex justify-between font-bold text-xl text-emerald-800 bg-emerald-100 rounded-lg p-3 -mx-1">
                    <span>Total Zakat Due</span>
                    <span>{formatCurrency(result.totalZakatDue, currency)}</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Zakat Recipients (Quran 9:60) */}
      {result.isAboveNisab && (
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                8 Categories of Zakat Recipients
                <span className="font-arabic text-sm text-emerald-600/50">مصارف الزكاة</span>
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Surah At-Tawbah 9:60 &mdash; &quot;Zakah expenditures are only for the poor and for the needy and for those employed for it and for bringing hearts together and for freeing captives and for those in debt and for the cause of Allah and for the traveler...&quot;
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ZAKAT_RECIPIENTS.map((r, i) => (
                  <motion.div
                    key={r.name}
                    className="rounded-lg border p-2.5 text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                  >
                    <div className="h-2 rounded-full mb-2" style={{ backgroundColor: r.color, opacity: 0.6 }} />
                    <p className="font-arabic text-xs text-muted-foreground">{r.arabic}</p>
                    <p className="text-xs font-medium mt-0.5 leading-tight">{r.name}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div variants={staggerItem} className="flex gap-3 justify-center flex-wrap">
        {formData && prices && isAuthenticated && (
          <Button
            onClick={handleSave}
            disabled={saving || saved}
            className={saved
              ? "gap-2 bg-emerald-600 hover:bg-emerald-700"
              : "gap-2 bg-blue-600 hover:bg-blue-700"
            }
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <CheckCircle className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saved ? "Saved to History" : saving ? "Saving..." : "Save to History"}
          </Button>
        )}
        {formData && prices && !isAuthenticated && (
          <Link href="/auth/login">
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <LogIn className="h-4 w-4" /> Sign in to Save
            </Button>
          </Link>
        )}
        {saveError && <p className="w-full text-center text-xs text-red-500">{saveError}</p>}
        <Button variant="outline" onClick={() => window.print()} className="gap-2">
          <Printer className="h-4 w-4" /> Print
        </Button>
        <Button variant="outline" onClick={onReset} className="gap-2">
          <RotateCcw className="h-4 w-4" /> Recalculate
        </Button>
      </motion.div>
    </motion.div>
  );
}

function getCurrencyPrefix(currency: string): string {
  const map: Record<string, string> = {
    USD: "$", BDT: "৳", PKR: "Rs", INR: "₹", GBP: "£",
    EUR: "€", SAR: "﷼", AED: "د.إ", MYR: "RM", IDR: "Rp",
    TRY: "₺", EGP: "£", NGN: "₦", CAD: "C$", AUD: "A$",
  };
  return map[currency] || "";
}
