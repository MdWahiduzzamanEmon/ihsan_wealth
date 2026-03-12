"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Button } from "@/components/ui/button";
import {
  LogIn,
  LogOut,
  Menu,
  User,
  X,
  ChevronDown,
  HeartHandshake,
  Globe,
} from "lucide-react";
import { PRIMARY_NAV_FEATURES, MORE_NAV_FEATURES, ALL_NAV_FEATURES } from "@/lib/app-features";
import { getLangFromCountry, getLangLabel, type TransLang } from "@/lib/islamic-content";
import { COUNTRIES } from "@/lib/constants";
import { DEFAULT_FORM_DATA, type ZakatFormData } from "@/types/zakat";

const HEADER_TEXTS: Record<TransLang, { more: string; signIn: string }> = {
  en: { more: "More", signIn: "Sign In" },
  bn: { more: "আরও", signIn: "সাইন ইন" },
  ur: { more: "مزید", signIn: "سائن ان" },
  ar: { more: "المزيد", signIn: "تسجيل الدخول" },
  tr: { more: "Daha Fazla", signIn: "Giris Yap" },
  ms: { more: "Lagi", signIn: "Log Masuk" },
  id: { more: "Lainnya", signIn: "Masuk" },
};

interface HeaderProps {
  countryCode?: string;
}

export function Header({ countryCode: propCountryCode = "BD" }: HeaderProps) {
  const [formData, setFormData] = useLocalStorage<ZakatFormData>("zakat-calculator-data", DEFAULT_FORM_DATA);
  const countryCode = formData.country || propCountryCode;
  const lang = getLangFromCountry(countryCode) as TransLang;
  const ht = HEADER_TEXTS[lang];
  const { user, signOut, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const currentCountry = COUNTRIES.find((c) => c.code === countryCode);

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setMoreOpen(false);
    setLangOpen(false);
  };

  const handleCountryChange = (code: string) => {
    setFormData((prev) => ({ ...prev, country: code }));
    setLangOpen(false);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    if (moreOpen || langOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [moreOpen, langOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-700/30 bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 backdrop-blur-md relative shadow-lg shadow-emerald-950/20">
      {/* Islamic geometric pattern overlay */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none overflow-hidden">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hdr-pat" x="0" y="0" width="56" height="56" patternUnits="userSpaceOnUse">
              <path d="M28 0L56 28L28 56L0 28Z" fill="none" stroke="white" strokeWidth="0.4" />
              <circle cx="28" cy="28" r="11" fill="none" stroke="white" strokeWidth="0.3" />
              <path d="M28 17L39 28L28 39L17 28Z" fill="none" stroke="white" strokeWidth="0.3" />
              <circle cx="28" cy="28" r="4" fill="none" stroke="white" strokeWidth="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hdr-pat)" />
        </svg>
      </div>
      {/* Subtle gold accent line at top */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

      <div className="relative mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative">
              <Image
                src="/favicon.svg"
                alt="IhsanWealth"
                width={32}
                height={32}
                className="rounded-lg group-hover:scale-105 transition-transform"
              />
              <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-br from-amber-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white leading-tight">
                <span className="text-amber-400">Ihsan</span>Wealth
              </span>
              <span className="font-arabic text-[9px] text-emerald-300/40 leading-none hidden sm:block">إحسان الثروة</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center">
            <div className="flex items-center h-14">
              {PRIMARY_NAV_FEATURES.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link key={href} href={href} className="relative h-full flex items-center">
                    <span
                      className={`flex items-center gap-1 px-2.5 text-[11px] tracking-wide uppercase transition-colors ${
                        isActive
                          ? "text-amber-300"
                          : "text-emerald-200/60 hover:text-emerald-100"
                      }`}
                    >
                      <Icon className="h-3 w-3" />
                      {label[lang]}
                    </span>
                    {isActive && (
                      <span className="absolute bottom-0 inset-x-2 h-[2px] bg-amber-400 rounded-t-full" />
                    )}
                  </Link>
                );
              })}

              {/* More dropdown */}
              <div ref={moreRef} className="relative h-full flex items-center">
                <button
                  onClick={() => setMoreOpen(!moreOpen)}
                  className={`flex items-center gap-1 px-2.5 text-[11px] tracking-wide uppercase transition-colors cursor-pointer ${
                    MORE_NAV_FEATURES.some((l) => l.href === pathname)
                      ? "text-amber-300"
                      : "text-emerald-200/60 hover:text-emerald-100"
                  }`}
                >
                  {ht.more}
                  <ChevronDown className={`h-2.5 w-2.5 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
                </button>
                {MORE_NAV_FEATURES.some((l) => l.href === pathname) && (
                  <span className="absolute bottom-0 inset-x-2 h-[2px] bg-amber-400 rounded-t-full" />
                )}

                {moreOpen && (
                  <div className="absolute right-0 top-full mt-0 w-44 rounded-b-lg border border-t-0 border-emerald-700/40 bg-emerald-950/95 shadow-xl py-1 z-50 backdrop-blur-lg">
                    {MORE_NAV_FEATURES.map(({ href, label, icon: Icon }) => {
                      const isActive = pathname === href;
                      return (
                        <Link key={href} href={href} onClick={closeMenus}>
                          <div
                            className={`flex items-center gap-2 px-3 py-1.5 text-[11px] tracking-wide uppercase transition-colors ${
                              isActive
                                ? "text-amber-300 bg-amber-400/8"
                                : "text-emerald-200/60 hover:text-emerald-100 hover:bg-white/5"
                            }`}
                          >
                            <Icon className="h-3 w-3 shrink-0" />
                            {label[lang]}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1.5">
            {/* Country / Language selector */}
            <div ref={langRef} className="relative">
              <button
                onClick={() => { setLangOpen(!langOpen); setMoreOpen(false); }}
                className="flex items-center gap-1 rounded-full bg-white/8 hover:bg-white/14 px-2 py-1 text-[11px] text-emerald-200/70 hover:text-emerald-100 transition-colors cursor-pointer"
              >
                <span className="text-xs leading-none">{currentCountry?.flag || "🌐"}</span>
                <span className="hidden sm:inline">{getLangLabel(lang)}</span>
                <Globe className="h-2.5 w-2.5 sm:hidden" />
                <ChevronDown className={`h-2 w-2 transition-transform ${langOpen ? "rotate-180" : ""}`} />
              </button>

              {langOpen && (
                <div className="absolute right-0 top-full mt-1 w-52 rounded-lg border border-emerald-700/40 bg-emerald-950/95 shadow-xl py-1 z-50 max-h-64 overflow-y-auto backdrop-blur-lg">
                  {COUNTRIES.map((country) => {
                    const cLang = getLangFromCountry(country.code);
                    const isSelected = country.code === countryCode;
                    return (
                      <button
                        key={country.code}
                        onClick={() => handleCountryChange(country.code)}
                        className={`w-full flex items-center gap-2 px-3 py-1.5 text-[11px] transition-colors ${
                          isSelected
                            ? "text-amber-300 bg-amber-400/8"
                            : "text-emerald-200/60 hover:text-emerald-100 hover:bg-white/5"
                        }`}
                      >
                        <span className="text-sm leading-none">{country.flag}</span>
                        <span className="flex-1 text-left truncate">{country.name}</span>
                        <span className={`text-[9px] shrink-0 ${isSelected ? "text-amber-400/60" : "text-emerald-400/40"}`}>{getLangLabel(cLang)}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sadaqah Jariyah button - BD only */}
            {countryCode === "BD" && (
              <button
                onClick={() => {
                  closeMenus();
                  document.getElementById("support-sadaqah")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center gap-1 rounded-full bg-amber-400/10 hover:bg-amber-400/20 px-2 py-1 text-[11px] text-amber-300/80 hover:text-amber-300 transition-colors"
              >
                <HeartHandshake className="h-3 w-3" />
                <span className="hidden sm:inline">সদকা</span>
              </button>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-1">
                <Link href="/profile" onClick={closeMenus}>
                  <div className="flex items-center gap-1.5 rounded-full bg-white/8 hover:bg-white/14 px-2 py-1 transition-colors cursor-pointer">
                    <div className="h-4 w-4 rounded-full bg-emerald-500/60 flex items-center justify-center">
                      <User className="h-2.5 w-2.5 text-white" />
                    </div>
                    <span className="hidden sm:inline text-[11px] text-emerald-200/70 max-w-[70px] truncate">
                      {user?.user_metadata?.name || user?.email?.split("@")[0]}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={signOut}
                  className="flex items-center justify-center h-7 w-7 rounded-full text-emerald-300/40 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <Link href="/auth/login">
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/10 hover:bg-amber-400/20 px-2.5 py-1 text-[11px] text-amber-300/80 hover:text-amber-300 transition-colors">
                  <LogIn className="h-3 w-3" />
                  <span className="hidden sm:inline">{ht.signIn}</span>
                </span>
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex items-center justify-center h-7 w-7 rounded-full text-emerald-200/60 hover:text-white hover:bg-white/10 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-emerald-700/30 bg-emerald-950/95 backdrop-blur-lg">
          {/* Mobile country selector */}
          <div className="mx-auto max-w-6xl px-4 pt-2 pb-1">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {COUNTRIES.map((country) => {
                const isSelected = country.code === countryCode;
                return (
                  <button
                    key={country.code}
                    onClick={() => handleCountryChange(country.code)}
                    className={`shrink-0 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] transition-colors ${
                      isSelected
                        ? "bg-amber-400/10 text-amber-300"
                        : "text-emerald-200/40 hover:text-emerald-200/70"
                    }`}
                  >
                    <span className="text-[11px]">{country.flag}</span>
                    <span>{getLangLabel(getLangFromCountry(country.code))}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px mx-4 bg-emerald-700/20" />

          <nav className="mx-auto max-w-6xl px-4 py-2 grid grid-cols-4 gap-px">
            {ALL_NAV_FEATURES.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link key={href} href={href} onClick={closeMenus}>
                  <div
                    className={`flex flex-col items-center gap-1 py-2.5 text-[10px] transition-colors ${
                      isActive
                        ? "text-amber-300"
                        : "text-emerald-200/50 hover:text-emerald-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="leading-tight text-center">{label[lang]}</span>
                  </div>
                </Link>
              );
            })}
            {/* Sadaqah Jariyah - BD only in mobile menu */}
            {countryCode === "BD" && (
              <button
                onClick={() => {
                  closeMenus();
                  setTimeout(() => {
                    document.getElementById("support-sadaqah")?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
                className="flex flex-col items-center gap-1 py-2.5 text-[10px] text-amber-300/70 hover:text-amber-300 transition-colors"
              >
                <HeartHandshake className="h-4 w-4" />
                <span className="leading-tight">সদকা</span>
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
