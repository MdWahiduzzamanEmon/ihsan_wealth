"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import {
  LogIn,
  LogOut,
  Menu,
  User,
  X,
  ChevronDown,
} from "lucide-react";
import { PRIMARY_NAV_FEATURES, MORE_NAV_FEATURES, ALL_NAV_FEATURES } from "@/lib/app-features";
import { getLangFromCountry, type TransLang } from "@/lib/islamic-content";

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

export function Header({ countryCode = "US" }: HeaderProps) {
  const lang = getLangFromCountry(countryCode) as TransLang;
  const ht = HEADER_TEXTS[lang];
  const { user, signOut, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close menus when navigating
  const closeMenus = () => {
    setMobileMenuOpen(false);
    setMoreOpen(false);
  };

  // Close "More" dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    if (moreOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [moreOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-700/40 bg-emerald-900/95 backdrop-blur-md relative">
      {/* Islamic geometric pattern overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="islamic" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 0L60 30L30 60L0 30Z" fill="none" stroke="white" strokeWidth="0.5" />
              <circle cx="30" cy="30" r="12" fill="none" stroke="white" strokeWidth="0.5" />
              <path d="M30 18L42 30L30 42L18 30Z" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <Image
              src="/favicon.svg"
              alt="IhsanWealth"
              width={32}
              height={32}
              className="rounded-lg group-hover:scale-105 transition-transform"
            />
            <span className="text-lg font-bold tracking-tight text-white">
              <span className="text-amber-400">Ihsan</span>Wealth
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {PRIMARY_NAV_FEATURES.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link key={href} href={href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-1.5 text-xs h-8 px-2.5 ${
                      isActive
                        ? "text-amber-300 bg-white/10"
                        : "text-emerald-100/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label[lang]}
                  </Button>
                </Link>
              );
            })}

            {/* More dropdown */}
            <div ref={moreRef} className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMoreOpen(!moreOpen)}
                className={`gap-1 text-xs h-8 px-2.5 ${
                  MORE_NAV_FEATURES.some((l) => l.href === pathname)
                    ? "text-amber-300 bg-white/10"
                    : "text-emerald-100/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {ht.more}
                <ChevronDown className={`h-3 w-3 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
              </Button>

              {moreOpen && (
                <div className="absolute right-0 top-full mt-1 w-44 rounded-lg border border-emerald-700/50 bg-emerald-900 shadow-xl py-1 z-50">
                  {MORE_NAV_FEATURES.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href;
                    return (
                      <Link key={href} href={href} onClick={closeMenus}>
                        <div
                          className={`flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                            isActive
                              ? "bg-white/10 text-amber-300"
                              : "text-emerald-100/80 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          {label[lang]}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1.5">
            {isAuthenticated ? (
              <div className="flex items-center gap-1.5">
                <Link href="/profile" onClick={closeMenus}>
                  <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-2 py-1 hover:bg-white/20 transition-colors cursor-pointer">
                    <User className="h-3 w-3 text-emerald-300" />
                    <span className="hidden sm:inline text-xs text-emerald-100 max-w-[80px] truncate">
                      {user?.user_metadata?.name || user?.email?.split("@")[0]}
                    </span>
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  className="text-emerald-200/70 hover:text-white hover:bg-white/10 h-8 px-2"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="text-emerald-100/80 hover:text-white hover:bg-white/10 gap-1.5 text-xs h-8">
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">{ht.signIn}</span>
                </Button>
              </Link>
            )}

            {/* Mobile hamburger */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-emerald-100 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-emerald-700/40 bg-emerald-900/98 backdrop-blur-md">
          <nav className="mx-auto max-w-6xl px-3 py-2 grid grid-cols-3 gap-1">
            {ALL_NAV_FEATURES.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link key={href} href={href} onClick={closeMenus}>
                  <div
                    className={`flex flex-col items-center gap-1 rounded-lg px-2 py-2.5 text-[11px] transition-colors ${
                      isActive
                        ? "bg-white/15 text-amber-300"
                        : "text-emerald-100/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label[lang]}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
