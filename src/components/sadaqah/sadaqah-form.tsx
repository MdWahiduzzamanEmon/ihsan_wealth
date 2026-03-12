"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { slideUp } from "@/lib/animations";
import {
  Heart, UtensilsCrossed, GraduationCap, Stethoscope,
  Baby, Landmark, AlertTriangle, HandHeart, CheckCircle2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { TransLang } from "@/lib/islamic-content";
import { getLocalDateStr } from "@/lib/date-utils";
import { SADAQAH_FORM_TEXTS, SADAQAH_CATEGORY_LABELS } from "@/lib/sadaqah-texts";

export interface SadaqahRecord {
  id: string;
  amount: number;
  currency: string;
  category: string;
  date: string;
  notes: string;
}

export const SADAQAH_CATEGORIES: { value: string; label: string; icon: LucideIcon; color: string }[] = [
  { value: "Food", label: "Food", icon: UtensilsCrossed, color: "#f59e0b" },
  { value: "Education", label: "Education", icon: GraduationCap, color: "#3b82f6" },
  { value: "Medical", label: "Medical", icon: Stethoscope, color: "#ef4444" },
  { value: "Orphans", label: "Orphans", icon: Baby, color: "#ec4899" },
  { value: "Masjid", label: "Masjid", icon: Landmark, color: "#10b981" },
  { value: "Emergency Relief", label: "Emergency Relief", icon: AlertTriangle, color: "#f97316" },
  { value: "General", label: "General", icon: HandHeart, color: "#8b5cf6" },
];

interface SadaqahFormProps {
  onAdd: (record: SadaqahRecord) => void;
  currencySymbol?: string;
  currencyCode?: string;
  lang: TransLang;
}

export function SadaqahForm({ onAdd, currencySymbol = "$", currencyCode = "USD", lang }: SadaqahFormProps) {
  const ft = SADAQAH_FORM_TEXTS[lang];
  const catLabels = SADAQAH_CATEGORY_LABELS[lang];
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("General");
  const [date, setDate] = useState(() => getLocalDateStr());
  const [notes, setNotes] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) return;

    const record: SadaqahRecord = {
      id: crypto.randomUUID(),
      amount: parsed,
      currency: currencyCode,
      category,
      date,
      notes: notes.trim(),
    };

    onAdd(record);
    setAmount("");
    setNotes("");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <motion.div variants={slideUp} initial="initial" animate="animate">
      <Card className="border-emerald-200/50 bg-gradient-to-br from-white to-emerald-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-800">
            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <Heart className="h-4 w-4 text-emerald-600" />
            </div>
            {ft.addSadaqah}
            <span className="font-arabic text-base text-emerald-600/50 font-normal">
              تسجيل صدقة
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Amount & Date Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-emerald-800">{ft.amount} ({currencySymbol})</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="h-10 text-lg font-semibold border-emerald-200 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/30"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-emerald-800">{ft.date}</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="h-10 border-emerald-200 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/30"
                />
              </div>
            </div>

            {/* Category Selector */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-emerald-800">{ft.category}</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SADAQAH_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.value;
                  return (
                    <button
                      type="button"
                      key={cat.value}
                      onClick={() => setCategory(cat.value)}
                      className={`flex items-center gap-2 rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm"
                          : "border-muted hover:border-emerald-300 text-muted-foreground hover:text-emerald-700"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" style={{ color: cat.color }} />
                      <span className="truncate">{catLabels[cat.value] || cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-emerald-800">{ft.notesOptional}</Label>
              <Input
                placeholder={ft.notesPlaceholder}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="border-emerald-200 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/30"
              />
            </div>

            {/* Submit */}
            <div className="relative">
              <AnimatePresence mode="wait">
                {showSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center justify-center gap-2 h-10 rounded-lg bg-emerald-100 text-emerald-700 font-medium"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {ft.successMessage}
                  </motion.div>
                ) : (
                  <motion.div
                    key="button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Button
                      type="submit"
                      className="w-full h-10 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold gap-2 shadow-md shadow-emerald-600/20"
                    >
                      <Heart className="h-4 w-4" />
                      {ft.recordSadaqah}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
