"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { useZakatRecords, type ZakatRecord, type ZakatPayment } from "@/hooks/use-zakat-records";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { staggerContainer, staggerItem, fadeIn } from "@/lib/animations";
import { formatCurrency } from "@/lib/format";
import {
  Calendar, Trash2, CheckCircle, XCircle, ArrowLeft,
  BarChart3, Loader2, LogIn, Plus, DollarSign, Printer, FileDown
} from "lucide-react";
import { ZakatCertificate, recordToCertificateData, exportCertificateAsImage } from "@/components/dashboard/zakat-certificate";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from "recharts";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { DEFAULT_FORM_DATA, type ZakatFormData } from "@/types/zakat";

export default function HistoryPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [formData] = useLocalStorage<ZakatFormData>("zakat-calculator-data", DEFAULT_FORM_DATA);
  const { fetchRecords, deleteRecord, markPaid, addPayment, fetchPayments, loading, error } = useZakatRecords();
  const [records, setRecords] = useState<ZakatRecord[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [compareYears, setCompareYears] = useState<[number, number] | null>(null);
  const [payments, setPayments] = useState<Record<string, ZakatPayment[]>>({});
  const [showPaymentForm, setShowPaymentForm] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState({ amount: "", recipient: "", category: "poor", notes: "" });
  const [printRecordId, setPrintRecordId] = useState<string | null>(null);
  const [exporting, setExporting] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadRecords();
    }
  }, [isAuthenticated]);

  const loadRecords = async () => {
    const data = await fetchRecords(selectedYear ? { year: selectedYear } : undefined);
    setRecords(data);
  };

  const years = [...new Set(records.map((r) => r.year))].sort((a, b) => b - a);
  const filteredRecords = selectedYear
    ? records.filter((r) => r.year === selectedYear)
    : records;

  const handleDelete = async (id: string) => {
    if (await deleteRecord(id)) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleMarkPaid = async (id: string) => {
    if (await markPaid(id)) {
      setRecords((prev) => prev.map((r) => r.id === id ? { ...r, is_paid: true, paid_at: new Date().toISOString() } : r));
    }
  };

  const handleAddPayment = async (recordId: string) => {
    const result = await addPayment({
      record_id: recordId,
      amount: parseFloat(paymentData.amount) || 0,
      recipient: paymentData.recipient,
      category: paymentData.category,
      notes: paymentData.notes || undefined,
    });
    if (result) {
      setPayments((prev) => ({
        ...prev,
        [recordId]: [result, ...(prev[recordId] || [])],
      }));
      setShowPaymentForm(null);
      setPaymentData({ amount: "", recipient: "", category: "poor", notes: "" });
    }
  };

  const loadPayments = async (recordId: string) => {
    const data = await fetchPayments(recordId);
    setPayments((prev) => ({ ...prev, [recordId]: data }));
  };

  const handlePrintRecord = (recordId: string) => {
    setPrintRecordId(recordId);
    setTimeout(() => {
      window.print();
    }, 400);
  };

  const handleDownloadRecord = async (record: ZakatRecord) => {
    setPrintRecordId(record.id);
    setExporting(record.id);
    // Wait for render
    await new Promise((r) => setTimeout(r, 500));
    const certId = `history-cert-${record.id}`;
    await exportCertificateAsImage(certId, `Zakat-Report-${record.year}.png`);
    setExporting(null);
  };

  const printRecord = printRecordId ? filteredRecords.find((r) => r.id === printRecordId) : null;

  // Comparison chart data
  const comparisonData = compareYears
    ? (() => {
        const [y1, y2] = compareYears;
        const r1 = records.find((r) => r.year === y1);
        const r2 = records.find((r) => r.year === y2);
        if (!r1 || !r2) return [];
        const categories = new Set([
          ...r1.breakdown.map((b) => b.category),
          ...r2.breakdown.map((b) => b.category),
        ]);
        return Array.from(categories).map((cat) => ({
          category: cat,
          [y1]: r1.breakdown.find((b) => b.category === cat)?.amount || 0,
          [y2]: r2.breakdown.find((b) => b.category === cat)?.amount || 0,
        }));
      })()
    : [];

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50/30 via-white to-amber-50/20">
        <Header countryCode={formData.country} />
        <main className="flex-1 flex items-center justify-center px-4">
          <motion.div className="text-center space-y-4" variants={fadeIn} initial="initial" animate="animate">
            <div className="h-20 w-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center">
              <LogIn className="h-10 w-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-emerald-800">Sign In Required</h2>
            <p className="text-muted-foreground max-w-md">
              Please sign in to view your Zakat calculation history and track payments across years.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/auth/login">
                <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2">
                  <LogIn className="h-4 w-4" /> Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="outline" className="gap-2">Create Account</Button>
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
        <div className="mx-auto max-w-5xl px-4 py-8">
          {/* Title */}
          <motion.div className="mb-8" variants={fadeIn} initial="initial" animate="animate">
            <div className="flex items-center gap-3 mb-2">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-1">
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-emerald-800 flex items-center gap-3">
              <Calendar className="h-8 w-8" />
              Zakat History
              <span className="font-arabic text-xl text-emerald-600/50">سجل الزكاة</span>
            </h1>
            <p className="text-muted-foreground mt-1">Track and compare your Zakat calculations across years</p>
          </motion.div>

          {/* Year Filter Pills */}
          {years.length > 0 && (
            <motion.div className="mb-6 flex flex-wrap gap-2" variants={fadeIn} initial="initial" animate="animate">
              <button
                onClick={() => setSelectedYear(null)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  !selectedYear ? "bg-emerald-600 text-white" : "bg-muted hover:bg-emerald-100"
                }`}
              >
                All Years
              </button>
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => setSelectedYear(selectedYear === y ? null : y)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedYear === y ? "bg-emerald-600 text-white" : "bg-muted hover:bg-emerald-100"
                  }`}
                >
                  {y}
                </button>
              ))}
            </motion.div>
          )}

          {/* Comparison Selector */}
          {years.length >= 2 && (
            <motion.div className="mb-6" variants={fadeIn} initial="initial" animate="animate">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-emerald-600" />
                    Compare Years
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center gap-3">
                    {years.slice(0, 6).map((y) => (
                      <button
                        key={y}
                        onClick={() => {
                          if (!compareYears) {
                            setCompareYears([y, years.find((yr) => yr !== y) || y]);
                          } else if (compareYears[0] === y) {
                            setCompareYears(null);
                          } else if (compareYears[1] === y) {
                            setCompareYears(null);
                          } else {
                            setCompareYears([compareYears[0], y]);
                          }
                        }}
                        className={`px-3 py-1 rounded-lg text-sm font-medium border-2 transition-all ${
                          compareYears?.includes(y)
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-muted hover:border-blue-300"
                        }`}
                      >
                        {y}
                      </button>
                    ))}
                    {compareYears && (
                      <button
                        onClick={() => setCompareYears(null)}
                        className="text-xs text-muted-foreground hover:text-red-500"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Comparison Chart */}
                  {compareYears && comparisonData.length > 0 && (
                    <div className="mt-4">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={comparisonData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 11 }} />
                          <Tooltip
                            formatter={(value) => {
                              const r = records.find((r) => r.year === compareYears[0]);
                              return formatCurrency(Number(value), r?.currency || "USD");
                            }}
                          />
                          <Legend />
                          <Bar dataKey={compareYears[0]} fill="#10b981" radius={[4, 4, 0, 0]} />
                          <Bar dataKey={compareYears[1]} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Records */}
          {loading && records.length === 0 ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
          ) : filteredRecords.length === 0 ? (
            <motion.div className="text-center py-16 space-y-3" variants={fadeIn} initial="initial" animate="animate">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground/40" />
              <h3 className="text-lg font-medium text-muted-foreground">No Records Yet</h3>
              <p className="text-sm text-muted-foreground/70">
                Calculate your Zakat and save it to start building your history.
              </p>
              <Link href="/">
                <Button className="bg-emerald-600 hover:bg-emerald-700 mt-2">Go to Calculator</Button>
              </Link>
            </motion.div>
          ) : (
            <motion.div className="space-y-4" variants={staggerContainer} initial="initial" animate="animate">
              {filteredRecords.map((record) => (
                <motion.div key={record.id} variants={staggerItem}>
                  <Card className={record.is_paid ? "border-emerald-200 bg-emerald-50/30" : ""}>
                    <CardContent className="pt-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-lg font-bold px-3">
                              {record.year}
                            </Badge>
                            <Badge className={record.is_above_nisab ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}>
                              {record.is_above_nisab ? "Above Nisab" : "Below Nisab"}
                            </Badge>
                            {record.is_paid && (
                              <Badge className="bg-green-100 text-green-700 gap-1">
                                <CheckCircle className="h-3 w-3" /> Paid
                              </Badge>
                            )}
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                            <div>
                              <p className="text-muted-foreground">Total Assets</p>
                              <p className="font-semibold">{formatCurrency(record.total_assets, record.currency)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Deductions</p>
                              <p className="font-semibold text-red-600">-{formatCurrency(record.total_deductions, record.currency)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Net Wealth</p>
                              <p className="font-semibold">{formatCurrency(record.net_zakatable_wealth, record.currency)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Zakat Due</p>
                              <p className="font-bold text-emerald-700 text-lg">
                                {formatCurrency(record.zakat_amount, record.currency)}
                              </p>
                            </div>
                          </div>

                          {/* Section Breakdown */}
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {record.breakdown
                              .filter((b) => b.amount > 0)
                              .map((b) => (
                                <span
                                  key={b.category}
                                  className="inline-flex items-center gap-1 text-xs bg-muted rounded-full px-2 py-0.5"
                                >
                                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: b.color }} />
                                  {b.category}: {formatCurrency(b.amount, record.currency)}
                                </span>
                              ))}
                          </div>

                          <p className="text-xs text-muted-foreground mt-2">
                            Calculated {new Date(record.calculated_at).toLocaleDateString()} &middot;
                            {record.nisab_basis} nisab &middot; {record.country}/{record.currency}
                            {record.prices_were_live ? " (live prices)" : " (estimated)"}
                          </p>
                        </div>

                        <div className="flex sm:flex-col gap-2">
                          {!record.is_paid && record.is_above_nisab && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkPaid(record.id)}
                              className="gap-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                            >
                              <CheckCircle className="h-3.5 w-3.5" /> Mark Paid
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePrintRecord(record.id)}
                            className="gap-1"
                          >
                            <Printer className="h-3.5 w-3.5" /> Print
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadRecord(record)}
                            disabled={exporting === record.id}
                            className="gap-1"
                          >
                            {exporting === record.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileDown className="h-3.5 w-3.5" />}
                            {exporting === record.id ? "..." : "Download"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              if (showPaymentForm === record.id) {
                                setShowPaymentForm(null);
                              } else {
                                setShowPaymentForm(record.id);
                                loadPayments(record.id);
                              }
                            }}
                            className="gap-1"
                          >
                            <DollarSign className="h-3.5 w-3.5" /> Payments
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(record.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 gap-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>

                      {/* Payment Tracker */}
                      {showPaymentForm === record.id && (
                        <div className="mt-4 pt-4 border-t space-y-3">
                          <h4 className="text-sm font-semibold flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-emerald-600" />
                            Payment Tracker
                          </h4>

                          {/* Existing payments */}
                          {payments[record.id]?.length > 0 && (
                            <div className="space-y-2">
                              {payments[record.id].map((p) => (
                                <div key={p.id} className="flex items-center justify-between text-sm bg-muted/50 rounded-lg p-2">
                                  <div>
                                    <span className="font-medium">{formatCurrency(p.amount, record.currency)}</span>
                                    <span className="text-muted-foreground ml-2">to {p.recipient}</span>
                                    <Badge variant="outline" className="ml-2 text-xs">{p.category}</Badge>
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(p.paid_at).toLocaleDateString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Add payment form */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            <div>
                              <Label className="text-xs">Amount</Label>
                              <Input
                                type="number"
                                placeholder="0.00"
                                value={paymentData.amount}
                                onChange={(e) => setPaymentData((p) => ({ ...p, amount: e.target.value }))}
                                className="h-8 text-sm"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Recipient</Label>
                              <Input
                                placeholder="Who received?"
                                value={paymentData.recipient}
                                onChange={(e) => setPaymentData((p) => ({ ...p, recipient: e.target.value }))}
                                className="h-8 text-sm"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Category</Label>
                              <select
                                value={paymentData.category}
                                onChange={(e) => setPaymentData((p) => ({ ...p, category: e.target.value }))}
                                className="h-8 w-full rounded-md border text-sm px-2"
                              >
                                <option value="poor">Poor (Faqir)</option>
                                <option value="needy">Needy (Miskin)</option>
                                <option value="collector">Collector (Amil)</option>
                                <option value="convert">New Muslim</option>
                                <option value="debt">Debt Relief</option>
                                <option value="fisabilillah">Fi Sabilillah</option>
                                <option value="traveler">Traveler (Ibn Sabil)</option>
                                <option value="other">Other</option>
                              </select>
                            </div>
                            <div className="flex items-end">
                              <Button
                                size="sm"
                                onClick={() => handleAddPayment(record.id)}
                                disabled={!paymentData.amount || !paymentData.recipient}
                                className="bg-emerald-600 hover:bg-emerald-700 gap-1 h-8 w-full"
                              >
                                <Plus className="h-3.5 w-3.5" /> Add
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {error && (
            <p className="text-sm text-red-500 text-center mt-4">{error}</p>
          )}
        </div>
      </main>

      {/* Hidden certificate for printing/exporting */}
      {printRecord && (
        <div className="print-certificate-wrapper">
          <ZakatCertificate
            elementId={`history-cert-${printRecord.id}`}
            result={recordToCertificateData(printRecord)}
            currency={printRecord.currency}
            nisabBasis={printRecord.nisab_basis}
            countryCode={printRecord.country}
            calculatedDate={printRecord.calculated_at}
            year={printRecord.year}
          />
        </div>
      )}

      <Footer countryCode={formData.country} />
    </div>
  );
}
