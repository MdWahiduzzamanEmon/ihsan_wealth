"use client";

import Link from "next/link";
import { LogIn, UserPlus, Shield, FileText, Map } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { getLangFromCountry } from "@/lib/islamic-content";
import { FOOTER_LINKS_TEXTS } from "@/lib/islamic-content";
import { DEFAULT_FORM_DATA, type ZakatFormData } from "@/types/zakat";
import { SITEMAP_FEATURES } from "@/lib/app-features";
import type { TransLang } from "@/lib/islamic-content";

const SITEMAP_TEXTS: Record<
  string,
  {
    title: string;
    description: string;
    mainPages: string;
    authPages: string;
    legalPages: string;
  }
> = {
  en: {
    title: "Sitemap",
    description: "All pages available on IhsanWealth",
    mainPages: "Main Pages",
    authPages: "Account",
    legalPages: "Legal & Info",
  },
  bn: {
    title: "সাইটম্যাপ",
    description: "ইহসান ওয়েলথ-এ সকল পৃষ্ঠা",
    mainPages: "প্রধান পৃষ্ঠাসমূহ",
    authPages: "অ্যাকাউন্ট",
    legalPages: "আইনি ও তথ্য",
  },
  ur: {
    title: "سائٹ میپ",
    description: "احسان ویلتھ کے تمام صفحات",
    mainPages: "اہم صفحات",
    authPages: "اکاؤنٹ",
    legalPages: "قانونی و معلومات",
  },
  ar: {
    title: "خريطة الموقع",
    description: "جميع صفحات إحسان ويلث",
    mainPages: "الصفحات الرئيسية",
    authPages: "الحساب",
    legalPages: "القانونية والمعلومات",
  },
  tr: {
    title: "Site Haritası",
    description: "IhsanWealth'teki tum sayfalar",
    mainPages: "Ana Sayfalar",
    authPages: "Hesap",
    legalPages: "Yasal ve Bilgi",
  },
  ms: {
    title: "Peta Laman",
    description: "Semua halaman di IhsanWealth",
    mainPages: "Halaman Utama",
    authPages: "Akaun",
    legalPages: "Undang-undang & Maklumat",
  },
  id: {
    title: "Peta Situs",
    description: "Semua halaman di IhsanWealth",
    mainPages: "Halaman Utama",
    authPages: "Akun",
    legalPages: "Hukum & Informasi",
  },
};

const AUTH_PAGES = [
  {
    href: "/auth/login",
    icon: LogIn,
    label: {
      en: "Login",
      bn: "লগইন",
      ur: "لاگ ان",
      ar: "تسجيل الدخول",
      tr: "Giris",
      ms: "Log Masuk",
      id: "Masuk",
    } as Record<TransLang, string>,
  },
  {
    href: "/auth/register",
    icon: UserPlus,
    label: {
      en: "Register",
      bn: "রেজিস্টার",
      ur: "رجسٹر",
      ar: "التسجيل",
      tr: "Kayit",
      ms: "Daftar",
      id: "Daftar",
    } as Record<TransLang, string>,
  },
];

const LEGAL_PAGES = [
  { href: "/privacy", icon: Shield, label: "privacyPolicy" as const },
  { href: "/usage-rights", icon: FileText, label: "usageRights" as const },
  { href: "/site-map", icon: Map, label: "sitemap" as const },
];

export default function SitemapPage() {
  const [formData] = useLocalStorage<ZakatFormData>(
    "zakat-calculator-data",
    DEFAULT_FORM_DATA,
  );
  const countryCode = formData.country;
  const lang = getLangFromCountry(countryCode);
  const texts = SITEMAP_TEXTS[lang] || SITEMAP_TEXTS.en;
  const linkTexts = FOOTER_LINKS_TEXTS[lang];
  const isRTL = lang === "ar" || lang === "ur";

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-950 to-emerald-900">
      <Header countryCode={countryCode} />
      <main
        className="mx-auto max-w-3xl px-4 py-12"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <h1 className="text-3xl font-bold text-white mb-2">{texts.title}</h1>
        <p className="text-emerald-300/70 mb-10">{texts.description}</p>

        {/* Main Pages - auto-generated from APP_FEATURES */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-emerald-200 mb-4">
            {texts.mainPages}
          </h2>
          <div className="grid gap-2">
            {SITEMAP_FEATURES.map((feature) => (
              <Link
                key={feature.href}
                href={feature.href}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-white/80 hover:bg-emerald-800/30 hover:text-white transition-colors"
              >
                <feature.icon className="h-5 w-5 text-emerald-400" />
                <span>{feature.label[lang]}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Auth Pages */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-emerald-200 mb-4">
            {texts.authPages}
          </h2>
          <div className="grid gap-2">
            {AUTH_PAGES.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-white/80 hover:bg-emerald-800/30 hover:text-white transition-colors"
              >
                <page.icon className="h-5 w-5 text-emerald-400" />
                <span>{page.label[lang]}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Legal Pages */}
        <section>
          <h2 className="text-lg font-semibold text-emerald-200 mb-4">
            {texts.legalPages}
          </h2>
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
