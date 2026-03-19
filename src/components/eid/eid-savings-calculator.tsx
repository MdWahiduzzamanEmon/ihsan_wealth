"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Download, Loader2, LogIn } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { EID_PAGE_TEXTS } from "@/lib/eid-content";
import type { TransLang } from "@/lib/islamic-content";

interface EidSavingsCalculatorProps {
  lang: TransLang;
}

interface EidiEntry {
  id: string;
  name: string;
  amount: number;
  dbId?: string;
}

const FUN_MESSAGES: Record<TransLang, string[]> = {
  en: ["Start collecting!", "Not bad, keep going!", "You're doing great!", "Rich kid alert!", "MashaAllah, Eidi champion!"],
  bn: ["সংগ্রহ শুরু করুন!", "মন্দ না, চালিয়ে যান!", "দারুণ করছেন!", "ধনী বাচ্চা এলার্ট!", "মাশাআল্লাহ, ঈদী চ্যাম্পিয়ন!"],
  ur: ["جمع کرنا شروع کریں!", "بُرا نہیں، جاری رکھیں!", "بہت اچھا!", "امیر بچے الرٹ!", "ماشاءاللہ، عیدی چیمپیئن!"],
  ar: ["ابدأ بالجمع!", "ليس سيئاً، استمر!", "أنت رائع!", "تنبيه: غني!", "ماشاء الله، بطل العيدية!"],
  tr: ["Toplamaya başla!", "Fena değil, devam!", "Harika gidiyorsun!", "Zengin çocuk alarmı!", "Maşallah, harçlık şampiyonu!"],
  ms: ["Mula kumpul!", "Tak buruk, teruskan!", "Bagus sangat!", "Amaran anak kaya!", "MasyaAllah, juara duit raya!"],
  id: ["Mulai kumpulkan!", "Lumayan, lanjutkan!", "Luar biasa!", "Peringatan anak kaya!", "MasyaAllah, juara THR!"],
};

const LOGIN_TEXT: Record<TransLang, { title: string; desc: string; login: string; register: string }> = {
  en: { title: "Track Your Eidi", desc: "Sign in to save and track your Eid gifts across years", login: "Sign In", register: "Create Account" },
  bn: { title: "আপনার ঈদী ট্র্যাক করুন", desc: "বছরের পর বছর ঈদী সংরক্ষণ ও ট্র্যাক করতে সাইন ইন করুন", login: "সাইন ইন", register: "অ্যাকাউন্ট তৈরি" },
  ur: { title: "اپنی عیدی ٹریک کریں", desc: "سالانہ عیدی محفوظ اور ٹریک کرنے کے لیے سائن ان کریں", login: "سائن ان", register: "اکاؤنٹ بنائیں" },
  ar: { title: "تتبع عيديتك", desc: "سجل الدخول لحفظ وتتبع هدايا العيد عبر السنوات", login: "تسجيل الدخول", register: "إنشاء حساب" },
  tr: { title: "Harçlığınızı Takip Edin", desc: "Yıllar boyunca bayram hediyelerinizi kaydetmek için giriş yapın", login: "Giriş Yap", register: "Hesap Oluştur" },
  ms: { title: "Jejak Duit Raya Anda", desc: "Log masuk untuk menyimpan dan menjejak hadiah Raya merentas tahun", login: "Log Masuk", register: "Cipta Akaun" },
  id: { title: "Lacak THR Anda", desc: "Masuk untuk menyimpan dan melacak hadiah Lebaran lintas tahun", login: "Masuk", register: "Buat Akun" },
};

function getFunMessage(total: number, lang: TransLang): string {
  const msgs = FUN_MESSAGES[lang];
  if (total <= 0) return msgs[0];
  if (total < 500) return msgs[1];
  if (total < 2000) return msgs[2];
  if (total < 5000) return msgs[3];
  return msgs[4];
}

function getFunEmoji(total: number): string {
  if (total <= 0) return "🤲";
  if (total < 500) return "😊";
  if (total < 2000) return "🤩";
  if (total < 5000) return "💰";
  return "🏆";
}

export function EidSavingsCalculator({ lang }: EidSavingsCalculatorProps) {
  const t = EID_PAGE_TEXTS[lang];
  const isRTL = lang === "ar" || lang === "ur";
  const lt = LOGIN_TEXT[lang];
  const { user, isAuthenticated, loading: authLoading, supabase } = useAuth();
  const [entries, setEntries] = useState<EidiEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const year = new Date().getFullYear();

  // Fetch existing records
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    (async () => {
      setIsLoading(true);
      await supabase.auth.getSession();
      const { data } = await supabase
        .from("eidi_records")
        .select("*")
        .eq("year", year)
        .order("created_at", { ascending: true });
      if (data && data.length > 0) {
        setEntries(data.map((r: { id: string; giver_name: string; amount: number }) => ({
          id: r.id,
          dbId: r.id,
          name: r.giver_name,
          amount: r.amount,
        })));
      } else {
        setEntries([{ id: "new-1", name: "", amount: 0 }]);
      }
      setIsLoading(false);
    })();
  }, [isAuthenticated, user, supabase, year]);

  const total = entries.reduce((sum, e) => sum + (e.amount || 0), 0);

  const addEntry = () => {
    setEntries((prev) => [...prev, { id: `new-${Date.now()}`, name: "", amount: 0 }]);
  };

  const removeEntry = useCallback(async (entry: EidiEntry) => {
    if (entries.length <= 1) return;
    // Remove from DB if it has a dbId
    if (entry.dbId) {
      await supabase.auth.getSession();
      await supabase.from("eidi_records").delete().eq("id", entry.dbId);
    }
    setEntries((prev) => prev.filter((e) => e.id !== entry.id));
  }, [entries.length, supabase]);

  const updateEntry = (id: string, field: "name" | "amount", value: string | number) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: field === "amount" ? Number(value) || 0 : value } : e))
    );
  };

  // Save/sync entry to DB on blur
  const saveEntry = useCallback(async (entry: EidiEntry) => {
    if (!user || !entry.name.trim()) return;
    await supabase.auth.getSession();

    if (entry.dbId) {
      await supabase.from("eidi_records").update({
        giver_name: entry.name,
        amount: entry.amount,
      }).eq("id", entry.dbId);
    } else {
      const { data } = await supabase.from("eidi_records").insert({
        user_id: user.id,
        year,
        giver_name: entry.name,
        amount: entry.amount,
      }).select("id").single();
      if (data) {
        setEntries((prev) => prev.map((e) => e.id === entry.id ? { ...e, dbId: data.id } : e));
      }
    }
  }, [user, supabase, year]);

  const handleDownload = useCallback(async () => {
    if (!resultRef.current) return;
    setDownloading(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(resultRef.current, { pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `my-eidi-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch { /* ignore */ } finally {
      setDownloading(false);
    }
  }, []);

  // Auth loading
  if (authLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  // Login gate
  if (!isAuthenticated) {
    return (
      <div className="text-center py-12" dir={isRTL ? "rtl" : "ltr"}>
        <div className="mx-auto max-w-sm bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <div className="h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <LogIn className="h-6 w-6 text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">{lt.title}</h3>
          <p className="text-sm text-gray-500 mb-6">{lt.desc}</p>
          <div className="flex gap-3">
            <Link href="/auth/login" className="flex-1">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">{lt.login}</Button>
            </Link>
            <Link href="/auth/register" className="flex-1">
              <Button variant="outline" className="w-full rounded-xl border-emerald-300 text-emerald-700">{lt.register}</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">{t.eidiCalculator}</h2>
        <p className="text-sm text-gray-500 mt-1">{t.eidiCalculatorSubtitle}</p>
      </div>

      {/* Entries */}
      <div className="space-y-3 mb-4">
        <AnimatePresence>
          {entries.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-2"
            >
              <span className="text-xs text-gray-400 w-5 shrink-0">{i + 1}</span>
              <input
                type="text"
                value={entry.name}
                onChange={(e) => updateEntry(entry.id, "name", e.target.value)}
                onBlur={() => saveEntry(entry)}
                placeholder={t.relativeName}
                dir={isRTL ? "rtl" : "ltr"}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-400 focus:ring-1 focus:ring-emerald-200 focus:outline-none"
              />
              <input
                type="number"
                value={entry.amount || ""}
                onChange={(e) => updateEntry(entry.id, "amount", e.target.value)}
                onBlur={() => saveEntry(entry)}
                placeholder={t.amount}
                className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-sm text-center focus:border-emerald-400 focus:ring-1 focus:ring-emerald-200 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => removeEntry(entry)}
                disabled={entries.length <= 1}
                className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 disabled:opacity-30 transition-all"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Button
        onClick={addEntry}
        variant="outline"
        className="w-full rounded-xl gap-2 border-dashed border-emerald-300 text-emerald-600 hover:bg-emerald-50 mb-6"
      >
        <Plus className="h-4 w-4" />
        {t.addRelative}
      </Button>

      {/* Result Card */}
      <div ref={resultRef} className="bg-gradient-to-br from-emerald-800 to-teal-900 rounded-2xl p-6 text-center">
        <p className="text-emerald-300/60 text-xs font-medium mb-1">{t.totalEidi}</p>
        <motion.p
          key={total}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-4xl sm:text-5xl font-bold text-white font-mono mb-2"
        >
          {total.toLocaleString()}
        </motion.p>
        <p className="text-3xl mb-1">{getFunEmoji(total)}</p>
        <p className="text-emerald-200 text-sm font-medium">{getFunMessage(total, lang)}</p>
        <p className="text-emerald-400/30 text-[8px] mt-3">ihsanwealth.onrender.com/eid</p>
      </div>

      {total > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center gap-3 mt-4">
          <Button onClick={handleDownload} disabled={downloading} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 rounded-xl">
            {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {t.shareResult}
          </Button>
        </motion.div>
      )}
    </div>
  );
}
