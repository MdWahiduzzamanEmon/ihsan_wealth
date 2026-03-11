"use client";

import Link from "next/link";
import {
  Calculator,
  BookOpen,
  Heart,
  CalendarDays,
  Clock,
  Compass,
  History,
  Bot,
  LogIn,
  UserPlus,
  Shield,
  FileText,
  Map,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { getLangFromCountry } from "@/lib/islamic-content";
import { FOOTER_LINKS_TEXTS } from "@/lib/islamic-content";
import { DEFAULT_FORM_DATA, type ZakatFormData } from "@/types/zakat";

const SITEMAP_TEXTS: Record<string, { title: string; description: string; mainPages: string; authPages: string; legalPages: string }> = {
  en: { title: "Sitemap", description: "All pages available on IhsanWealth", mainPages: "Main Pages", authPages: "Account", legalPages: "Legal & Info" },
  bn: { title: "সাইটম্যাপ", description: "ইহসান ওয়েলথ-এ সকল পৃষ্ঠা", mainPages: "প্রধান পৃষ্ঠাসমূহ", authPages: "অ্যাকাউন্ট", legalPages: "আইনি ও তথ্য" },
  ur: { title: "سائٹ میپ", description: "احسان ویلتھ کے تمام صفحات", mainPages: "اہم صفحات", authPages: "اکاؤنٹ", legalPages: "قانونی و معلومات" },
  ar: { title: "خريطة الموقع", description: "جميع صفحات إحسان ويلث", mainPages: "الصفحات الرئيسية", authPages: "الحساب", legalPages: "القانونية والمعلومات" },
  tr: { title: "Site Haritası", description: "IhsanWealth'teki tum sayfalar", mainPages: "Ana Sayfalar", authPages: "Hesap", legalPages: "Yasal ve Bilgi" },
  ms: { title: "Peta Laman", description: "Semua halaman di IhsanWealth", mainPages: "Halaman Utama", authPages: "Akaun", legalPages: "Undang-undang & Maklumat" },
  id: { title: "Peta Situs", description: "Semua halaman di IhsanWealth", mainPages: "Halaman Utama", authPages: "Akun", legalPages: "Hukum & Informasi" },
};

const MAIN_PAGES = [
  { href: "/", icon: Calculator, label: { en: "Zakat Calculator", bn: "যাকাত ক্যালকুলেটর", ur: "زکوٰۃ کیلکولیٹر", ar: "حاسبة الزكاة", tr: "Zekat Hesaplayici", ms: "Kalkulator Zakat", id: "Kalkulator Zakat" } },
  { href: "/guide", icon: BookOpen, label: { en: "Guide", bn: "গাইড", ur: "گائیڈ", ar: "الدليل", tr: "Rehber", ms: "Panduan", id: "Panduan" } },
  { href: "/assistant", icon: Bot, label: { en: "AI Assistant", bn: "AI সহায়ক", ur: "AI معاون", ar: "مساعد AI", tr: "AI Asistan", ms: "Pembantu AI", id: "Asisten AI" } },
  { href: "/duas", icon: Heart, label: { en: "Duas", bn: "দু'আ", ur: "دعائیں", ar: "الأدعية", tr: "Dualar", ms: "Doa", id: "Doa" } },
  { href: "/calendar", icon: CalendarDays, label: { en: "Islamic Calendar", bn: "ইসলামিক ক্যালেন্ডার", ur: "اسلامی کیلنڈر", ar: "التقويم الإسلامي", tr: "Islami Takvim", ms: "Kalendar Islam", id: "Kalender Islam" } },
  { href: "/prayer-times", icon: Clock, label: { en: "Prayer Times", bn: "নামাযের সময়", ur: "نماز کے اوقات", ar: "أوقات الصلاة", tr: "Namaz Vakitleri", ms: "Waktu Solat", id: "Waktu Sholat" } },
  { href: "/qibla", icon: Compass, label: { en: "Qibla Finder", bn: "কিবলা খুঁজুন", ur: "قبلہ فائنڈر", ar: "اتجاه القبلة", tr: "Kible Bulucu", ms: "Pencari Kiblat", id: "Pencari Kiblat" } },
  { href: "/sadaqah", icon: Heart, label: { en: "Sadaqah Tracker", bn: "সদকা ট্র্যাকার", ur: "صدقہ ٹریکر", ar: "متتبع الصدقة", tr: "Sadaka Takibi", ms: "Penjejak Sedekah", id: "Pelacak Sedekah" } },
  { href: "/history", icon: History, label: { en: "History", bn: "ইতিহাস", ur: "ہسٹری", ar: "السجل", tr: "Gecmis", ms: "Sejarah", id: "Riwayat" } },
];

const AUTH_PAGES = [
  { href: "/auth/login", icon: LogIn, label: { en: "Login", bn: "লগইন", ur: "لاگ ان", ar: "تسجيل الدخول", tr: "Giris", ms: "Log Masuk", id: "Masuk" } },
  { href: "/auth/register", icon: UserPlus, label: { en: "Register", bn: "রেজিস্টার", ur: "رجسٹر", ar: "التسجيل", tr: "Kayit", ms: "Daftar", id: "Daftar" } },
];

const LEGAL_PAGES = [
  { href: "/privacy", icon: Shield, label: "privacyPolicy" as const },
  { href: "/usage-rights", icon: FileText, label: "usageRights" as const },
  { href: "/site-map", icon: Map, label: "sitemap" as const },
];

export default function SitemapPage() {
  const [formData] = useLocalStorage<ZakatFormData>("zakat-calculator-data", DEFAULT_FORM_DATA);
  const countryCode = formData.country;
  const lang = getLangFromCountry(countryCode);
  const texts = SITEMAP_TEXTS[lang] || SITEMAP_TEXTS.en;
  const linkTexts = FOOTER_LINKS_TEXTS[lang];
  const isRTL = lang === "ar" || lang === "ur";

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-950 to-emerald-900">
      <Header countryCode={countryCode} />
      <main className="mx-auto max-w-3xl px-4 py-12" dir={isRTL ? "rtl" : "ltr"}>
        <h1 className="text-3xl font-bold text-white mb-2">{texts.title}</h1>
        <p className="text-emerald-300/70 mb-10">{texts.description}</p>

        {/* Main Pages */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-emerald-200 mb-4">{texts.mainPages}</h2>
          <div className="grid gap-2">
            {MAIN_PAGES.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-white/80 hover:bg-emerald-800/30 hover:text-white transition-colors"
              >
                <page.icon className="h-5 w-5 text-emerald-400" />
                <span>{page.label[lang] || page.label.en}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Auth Pages */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-emerald-200 mb-4">{texts.authPages}</h2>
          <div className="grid gap-2">
            {AUTH_PAGES.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-white/80 hover:bg-emerald-800/30 hover:text-white transition-colors"
              >
                <page.icon className="h-5 w-5 text-emerald-400" />
                <span>{page.label[lang] || page.label.en}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Legal Pages */}
        <section>
          <h2 className="text-lg font-semibold text-emerald-200 mb-4">{texts.legalPages}</h2>
          <div className="grid gap-2">
            {LEGAL_PAGES.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-white/80 hover:bg-emerald-800/30 hover:text-white transition-colors"
              >
                <page.icon className="h-5 w-5 text-emerald-400" />
                <span>{linkTexts[page.label]}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer countryCode={countryCode} />
    </div>
  );
}
