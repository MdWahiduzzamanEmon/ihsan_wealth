"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { useZakatRecords, type ZakatRecord } from "@/hooks/use-zakat-records";
import { useSadaqahRecords } from "@/hooks/use-sadaqah-records";
import { useTasbihHistory } from "@/hooks/use-tasbih-history";
import { useFavoriteHadiths } from "@/hooks/use-favorite-hadiths";
import { useFavoriteDuas } from "@/hooks/use-favorite-duas";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useSalatTracker } from "@/hooks/use-salat-tracker";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/ui/custom/animated-counter";
import { staggerContainer, staggerItem, fadeIn, slideUp } from "@/lib/animations";
import { formatCurrency } from "@/lib/format";
import { COUNTRIES } from "@/lib/constants";
import { getLangFromCountry } from "@/lib/islamic-content";
import { PROFILE_PAGE_TEXTS } from "@/lib/profile-texts";
import { DEFAULT_FORM_DATA, type ZakatFormData } from "@/types/zakat";
import {
  ArrowLeft, Loader2, LogIn, UserCircle, Calculator,
  Heart, Hash, BookHeart, TrendingUp, CheckCircle, Clock,
  Star, BookOpen, ClipboardCheck, Flame,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

const DHIKR_COLORS: Record<string, string> = {
  "SubhanAllah": "#10b981",
  "Alhamdulillah": "#f59e0b",
  "AllahuAkbar": "#3b82f6",
  "La ilaha illallah": "#8b5cf6",
  "Astaghfirullah": "#ef4444",
  "SubhanAllahi wa bihamdihi": "#06b6d4",
  "La hawla wala quwwata illa billah": "#ec4899",
  "custom": "#6366f1",
};

function getDhikrColor(type: string): string {
  return DHIKR_COLORS[type] || "#64748b";
}

export default function ProfilePage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [formData] = useLocalStorage<ZakatFormData>("zakat-calculator-data", DEFAULT_FORM_DATA);
  const country = COUNTRIES.find((c) => c.code === formData.country) || COUNTRIES[0];
  const currencySymbol = country.currencySymbol;
  const lang = getLangFromCountry(formData.country);
  const t = PROFILE_PAGE_TEXTS[lang];

  // Data hooks
  const { fetchRecords } = useZakatRecords();
  const { records: sadaqahRecords, isLoading: sadaqahLoading } = useSadaqahRecords();
  const { sessions: tasbihSessions, todayTotal: tasbihToday, isLoading: tasbihLoading } = useTasbihHistory();
  const { favorites: hadithFavorites } = useFavoriteHadiths();
  const { favorites: duaFavorites } = useFavoriteDuas();
  const salatTracker = useSalatTracker(formData.country);

  const [zakatRecords, setZakatRecords] = useState<ZakatRecord[]>([]);
  const [zakatLoading, setZakatLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setZakatLoading(true);
      fetchRecords().then((data) => {
        setZakatRecords(data);
        setZakatLoading(false);
      });
    }
  }, [isAuthenticated, fetchRecords]);

  const isLoading = zakatLoading || sadaqahLoading || tasbihLoading;

  // Computed stats
  const totalZakat = useMemo(
    () => zakatRecords.reduce((sum, r) => sum + r.zakat_amount, 0),
    [zakatRecords]
  );
  const totalSadaqah = useMemo(
    () => sadaqahRecords.reduce((sum, r) => sum + r.amount, 0),
    [sadaqahRecords]
  );
  const totalTasbih = useMemo(
    () => tasbihSessions.reduce((sum, s) => sum + s.completed_count, 0),
    [tasbihSessions]
  );
  const totalFavorites = hadithFavorites.length + duaFavorites.length;

  // Zakat yearly chart data
  const zakatYearlyData = useMemo(() => {
    return zakatRecords
      .sort((a, b) => a.year - b.year)
      .map((r) => ({
        year: r.year.toString(),
        amount: r.zakat_amount,
        paid: r.is_paid,
      }));
  }, [zakatRecords]);

  // Sadaqah monthly data (last 6 months)
  const sadaqahMonthlyData = useMemo(() => {
    const now = new Date();
    const months: { month: string; total: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      const m = d.getMonth();
      const y = d.getFullYear();
      const total = sadaqahRecords
        .filter((r) => {
          const rd = new Date(r.date);
          return rd.getMonth() === m && rd.getFullYear() === y;
        })
        .reduce((sum, r) => sum + r.amount, 0);
      months.push({ month: label, total });
    }
    return months;
  }, [sadaqahRecords]);

  // Tasbih type breakdown
  const tasbihBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    for (const s of tasbihSessions) {
      const key = s.dhikr_type;
      map[key] = (map[key] || 0) + s.completed_count;
    }
    return Object.entries(map)
      .map(([name, value]) => ({ name, value, color: getDhikrColor(name) }))
      .sort((a, b) => b.value - a.value);
  }, [tasbihSessions]);

  // Member since
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "";

  const displayName = user?.user_metadata?.name || user?.email?.split("@")[0] || "";

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50/30 via-white to-amber-50/20">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50/30 via-white to-amber-50/20">
        <Header countryCode={formData.country} />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <motion.div className="text-center space-y-5 max-w-md" variants={fadeIn} initial="initial" animate="animate">
            <div className="h-20 w-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center">
              <LogIn className="h-10 w-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-emerald-800">{t.signInTitle}</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">{t.signInDesc}</p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Link href="/auth/login">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 h-11 px-6">
                  <LogIn className="h-4 w-4" /> {t.signIn}
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 h-11 px-6">
                  {t.createAccount}
                </Button>
              </Link>
            </div>
          </motion.div>
        </main>
        <Footer countryCode={formData.country} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50/30 via-white to-amber-50/20">
      <Header countryCode={formData.country} />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 py-10 md:py-14">
          <div className="absolute inset-0 opacity-[0.06]">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="profile-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                  <path d="M40 0L80 40L40 80L0 40Z" fill="none" stroke="white" strokeWidth="0.5" />
                  <circle cx="40" cy="40" r="20" fill="none" stroke="white" strokeWidth="0.5" />
                  <circle cx="40" cy="40" r="10" fill="none" stroke="white" strokeWidth="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#profile-pattern)" />
            </svg>
          </div>

          <div className="relative mx-auto max-w-5xl px-4">
            <motion.div
              className="flex flex-col sm:flex-row items-center gap-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Avatar */}
              <div className="relative">
                <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-900/30">
                  <UserCircle className="h-12 w-12 md:h-14 md:w-14 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-emerald-500 border-2 border-emerald-900 flex items-center justify-center">
                  <CheckCircle className="h-3.5 w-3.5 text-white" />
                </div>
              </div>

              {/* User Info */}
              <div className="text-center sm:text-left">
                <h1 className="text-2xl md:text-3xl font-bold text-white">{displayName}</h1>
                <p className="text-emerald-200/80 text-sm mt-1">{user?.email}</p>
                {memberSince && (
                  <p className="text-emerald-300/70 text-xs mt-1.5 flex items-center gap-1.5 justify-center sm:justify-start">
                    <Clock className="h-3 w-3" /> {t.memberSince} {memberSince}
                  </p>
                )}
              </div>

              {/* Arabic title */}
              <div className="sm:ml-auto text-center">
                <p className="font-arabic text-2xl md:text-3xl text-amber-300/60">رحلتك الروحانية</p>
                <p className="text-emerald-200/60 text-xs mt-1 tracking-wider uppercase">{t.subtitle}</p>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-4 py-8">
          {/* Back button */}
          <motion.div className="mb-6" variants={fadeIn} initial="initial" animate="animate">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" /> {t.back}
              </Button>
            </Link>
          </motion.div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              <p className="text-sm text-gray-500">{t.loading}</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Quick Stats Cards */}
              <motion.div variants={staggerContainer} initial="initial" animate="animate">
                <h2 className="text-lg font-bold text-emerald-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  {t.quickStats}
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <motion.div variants={staggerItem}>
                    <Card className="border-emerald-200/50 bg-gradient-to-br from-emerald-50/80 to-white hover:shadow-md transition-shadow">
                      <CardContent className="pt-5 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 rounded-xl bg-emerald-100 flex items-center justify-center">
                            <Calculator className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] text-muted-foreground font-medium truncate">{t.zakatCalculated}</p>
                            <AnimatedCounter
                              value={totalZakat}
                              prefix={currencySymbol}
                              decimals={0}
                              className="text-xl font-bold text-emerald-800"
                            />
                          </div>
                        </div>
                        <div className="mt-2 text-[10px] text-muted-foreground">
                          {zakatRecords.length} {t.year}{zakatRecords.length !== 1 ? "s" : ""}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div variants={staggerItem}>
                    <Card className="border-rose-200/50 bg-gradient-to-br from-rose-50/80 to-white hover:shadow-md transition-shadow">
                      <CardContent className="pt-5 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 rounded-xl bg-rose-100 flex items-center justify-center">
                            <Heart className="h-5 w-5 text-rose-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] text-muted-foreground font-medium truncate">{t.sadaqahGiven}</p>
                            <AnimatedCounter
                              value={totalSadaqah}
                              prefix={currencySymbol}
                              decimals={0}
                              className="text-xl font-bold text-rose-800"
                            />
                          </div>
                        </div>
                        <div className="mt-2 text-[10px] text-muted-foreground">
                          {sadaqahRecords.length} {t.donations}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div variants={staggerItem}>
                    <Card className="border-violet-200/50 bg-gradient-to-br from-violet-50/80 to-white hover:shadow-md transition-shadow">
                      <CardContent className="pt-5 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 rounded-xl bg-violet-100 flex items-center justify-center">
                            <Hash className="h-5 w-5 text-violet-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] text-muted-foreground font-medium truncate">{t.tasbihCount}</p>
                            <AnimatedCounter
                              value={totalTasbih}
                              decimals={0}
                              className="text-xl font-bold text-violet-800"
                            />
                          </div>
                        </div>
                        <div className="mt-2 text-[10px] text-muted-foreground">
                          {tasbihSessions.length} {t.totalSessions.toLowerCase()}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div variants={staggerItem}>
                    <Card className="border-amber-200/50 bg-gradient-to-br from-amber-50/80 to-white hover:shadow-md transition-shadow">
                      <CardContent className="pt-5 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 rounded-xl bg-amber-100 flex items-center justify-center">
                            <Star className="h-5 w-5 text-amber-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] text-muted-foreground font-medium truncate">{t.favoritesSaved}</p>
                            <AnimatedCounter
                              value={totalFavorites}
                              decimals={0}
                              className="text-xl font-bold text-amber-800"
                            />
                          </div>
                        </div>
                        <div className="mt-2 text-[10px] text-muted-foreground">
                          {hadithFavorites.length} {t.hadith}, {duaFavorites.length} {t.duas}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </motion.div>

              {/* Zakat Overview */}
              <motion.div variants={slideUp} initial="initial" animate="animate">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2 text-emerald-800">
                        <Calculator className="h-4 w-4 text-emerald-600" />
                        {t.zakatOverview}
                      </CardTitle>
                      <Link href="/history">
                        <Button variant="ghost" size="sm" className="text-xs text-emerald-600 hover:text-emerald-700">
                          {t.viewAll} →
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {zakatRecords.length === 0 ? (
                      <div className="text-center py-8">
                        <Calculator className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                        <p className="text-sm text-muted-foreground">{t.noZakatYet}</p>
                        <Link href="/">
                          <Button size="sm" className="mt-3 bg-emerald-600 hover:bg-emerald-700">
                            <Calculator className="h-3.5 w-3.5 mr-1.5" /> {t.goToCalculator}
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Yearly bar chart */}
                        <div className="h-56">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={zakatYearlyData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                              <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
                              <Tooltip
                                formatter={(value) => [`${currencySymbol}${Number(value).toLocaleString()}`, "Zakat"]}
                                contentStyle={{
                                  borderRadius: "8px",
                                  border: "1px solid #d1fae5",
                                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                                }}
                              />
                              <Bar dataKey="amount" radius={[6, 6, 0, 0]} maxBarSize={48}>
                                {zakatYearlyData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={entry.paid ? "#10b981" : "#f59e0b"}
                                  />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        {/* Legend */}
                        <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> {t.paid}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> {t.unpaid}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Sadaqah + Tasbih Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sadaqah Summary */}
                <motion.div variants={slideUp} initial="initial" animate="animate">
                  <Card className="h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2 text-emerald-800">
                          <Heart className="h-4 w-4 text-rose-500" />
                          {t.sadaqahSummary}
                        </CardTitle>
                        <Link href="/sadaqah">
                          <Button variant="ghost" size="sm" className="text-xs text-emerald-600 hover:text-emerald-700">
                            {t.viewAll} →
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {sadaqahRecords.length === 0 ? (
                        <div className="text-center py-8">
                          <Heart className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                          <p className="text-sm text-muted-foreground">{t.noSadaqahYet}</p>
                          <Link href="/sadaqah">
                            <Button size="sm" className="mt-3 bg-rose-600 hover:bg-rose-700">
                              <Heart className="h-3.5 w-3.5 mr-1.5" /> {t.startTracking}
                            </Button>
                          </Link>
                        </div>
                      ) : (
                        <div className="h-52">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sadaqahMonthlyData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#9ca3af" />
                              <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" />
                              <Tooltip
                                formatter={(value) => [`${currencySymbol}${Number(value).toFixed(2)}`, "Sadaqah"]}
                                contentStyle={{
                                  borderRadius: "8px",
                                  border: "1px solid #ffe4e6",
                                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                                }}
                              />
                              <Bar dataKey="total" fill="#f43f5e" radius={[6, 6, 0, 0]} maxBarSize={40} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Tasbih Summary */}
                <motion.div variants={slideUp} initial="initial" animate="animate">
                  <Card className="h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2 text-emerald-800">
                          <Hash className="h-4 w-4 text-violet-500" />
                          {t.tasbihSummary}
                        </CardTitle>
                        <Link href="/tasbih">
                          <Button variant="ghost" size="sm" className="text-xs text-emerald-600 hover:text-emerald-700">
                            {t.viewAll} →
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {tasbihSessions.length === 0 ? (
                        <div className="text-center py-8">
                          <Hash className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                          <p className="text-sm text-muted-foreground">{t.noTasbihYet}</p>
                          <Link href="/tasbih">
                            <Button size="sm" className="mt-3 bg-violet-600 hover:bg-violet-700">
                              <Hash className="h-3.5 w-3.5 mr-1.5" /> {t.startDhikr}
                            </Button>
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Today's dhikr highlight */}
                          <div className="flex items-center gap-3 bg-violet-50 rounded-xl p-3">
                            <div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center">
                              <Hash className="h-5 w-5 text-violet-600" />
                            </div>
                            <div>
                              <p className="text-xs text-violet-600 font-medium">{t.todaysDhikr}</p>
                              <p className="text-2xl font-bold text-violet-800">{tasbihToday.toLocaleString()}</p>
                            </div>
                          </div>

                          {/* Dhikr type pie chart */}
                          {tasbihBreakdown.length > 0 && (
                            <div className="h-40">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={tasbihBreakdown}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={35}
                                    outerRadius={60}
                                    paddingAngle={3}
                                    dataKey="value"
                                    nameKey="name"
                                  >
                                    {tasbihBreakdown.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                  </Pie>
                                  <Tooltip
                                    formatter={(value) => `${Number(value).toLocaleString()} ${t.counts}`}
                                    contentStyle={{
                                      borderRadius: "8px",
                                      border: "1px solid #ede9fe",
                                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                                      fontSize: "12px",
                                    }}
                                  />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                          )}

                          {/* Top dhikr list */}
                          <div className="space-y-1.5">
                            {tasbihBreakdown.slice(0, 4).map((item) => (
                              <div key={item.name} className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2">
                                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                  <span className="text-muted-foreground truncate max-w-[150px]">{item.name}</span>
                                </span>
                                <span className="font-medium text-gray-700">{item.value.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Favorites Summary */}
              <motion.div variants={slideUp} initial="initial" animate="animate">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2 text-emerald-800">
                      <Star className="h-4 w-4 text-amber-500" />
                      {t.favoritesSaved}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Link href="/hadith" className="group">
                        <div className="flex items-center gap-4 p-4 rounded-xl border border-cyan-200/50 bg-gradient-to-br from-cyan-50/50 to-white hover:shadow-md transition-all">
                          <div className="h-12 w-12 rounded-xl bg-cyan-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                            <BookHeart className="h-6 w-6 text-cyan-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{hadithFavorites.length} {t.hadith}</p>
                            <p className="text-xs text-muted-foreground">{t.viewAll} →</p>
                          </div>
                        </div>
                      </Link>
                      <Link href="/duas" className="group">
                        <div className="flex items-center gap-4 p-4 rounded-xl border border-purple-200/50 bg-gradient-to-br from-purple-50/50 to-white hover:shadow-md transition-all">
                          <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                            <BookOpen className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{duaFavorites.length} {t.duas}</p>
                            <p className="text-xs text-muted-foreground">{t.viewAll} →</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Salat Tracker Summary */}
              <motion.div variants={slideUp} initial="initial" animate="animate">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2 text-emerald-800">
                        <ClipboardCheck className="h-4 w-4 text-green-600" />
                        {t.salatTracker || "Salat Tracker"}
                      </CardTitle>
                      <Link href="/salat-tracker">
                        <Button variant="ghost" size="sm" className="text-xs text-emerald-600 hover:text-emerald-700">
                          {t.viewAll} →
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {salatTracker.records.length === 0 ? (
                      <div className="text-center py-8">
                        <ClipboardCheck className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                        <p className="text-sm text-muted-foreground">{t.noSalatYet || "No prayer tracking data yet"}</p>
                        <Link href="/salat-tracker">
                          <Button size="sm" className="mt-3 bg-green-600 hover:bg-green-700">
                            <ClipboardCheck className="h-3.5 w-3.5 mr-1.5" /> {t.startTracking}
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="flex flex-col items-center rounded-xl bg-green-50 p-3">
                          <div className="flex items-center gap-1 mb-1">
                            <Flame className="h-4 w-4 text-orange-500" />
                            <span className="text-lg font-bold text-orange-600">{salatTracker.stats.currentStreak}</span>
                          </div>
                          <span className="text-[10px] text-gray-500">{t.currentStreak || "Current Streak"}</span>
                        </div>
                        <div className="flex flex-col items-center rounded-xl bg-emerald-50 p-3">
                          <span className="text-lg font-bold text-emerald-700">{salatTracker.stats.completionRate}%</span>
                          <span className="text-[10px] text-gray-500">{t.completionRate || "Completion"}</span>
                        </div>
                        <div className="flex flex-col items-center rounded-xl bg-blue-50 p-3">
                          <span className="text-lg font-bold text-blue-700">{salatTracker.stats.onTimeRate}%</span>
                          <span className="text-[10px] text-gray-500">{t.onTimeRate || "On-Time"}</span>
                        </div>
                        <div className="flex flex-col items-center rounded-xl bg-purple-50 p-3">
                          <span className="text-lg font-bold text-purple-700">{salatTracker.stats.jamaahRate}%</span>
                          <span className="text-[10px] text-gray-500">{t.jamaahRate || "Jamaah"}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Motivational footer */}
              <motion.div className="text-center py-6" variants={fadeIn} initial="initial" animate="animate">
                <p className="font-arabic text-lg text-amber-600/50 mb-1">
                  إِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ
                </p>
                <p className="text-sm text-muted-foreground">
                  &ldquo;Indeed, Allah does not waste the reward of those who do good.&rdquo; &mdash; Quran 9:120
                </p>
              </motion.div>
            </div>
          )}
        </div>
      </main>
      <Footer countryCode={formData.country} />
    </div>
  );
}
