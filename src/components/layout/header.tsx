"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { UI_TEXTS, getLangFromCountry } from "@/lib/islamic-content";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Calculator,
  CalendarDays,
  Clock,
  Compass,
  Heart,
  HelpCircle,
  History,
  LogIn,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Calculator", icon: Calculator },
  { href: "/prayer-times", label: "Prayer Times", icon: Clock },
  { href: "/qibla", label: "Qibla", icon: Compass },
  { href: "/duas", label: "Duas", icon: BookOpen },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/sadaqah", label: "Sadaqah", icon: Heart },
  { href: "/history", label: "History", icon: History },
  { href: "/guide", label: "Guide", icon: HelpCircle },
];

interface HeaderProps {
  countryCode?: string;
}

export function Header({ countryCode = "US" }: HeaderProps) {
  const lang = getLangFromCountry(countryCode);
  const texts = UI_TEXTS[lang];
  const { user, signOut, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="relative overflow-hidden border-b bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900">
      {/* Islamic geometric pattern overlay */}
      <div className="absolute inset-0 opacity-10">
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

      <div className="relative mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <Image
              src="/favicon.svg"
              alt="IhsanWealth"
              width={40}
              height={40}
              className="rounded-xl shadow-lg shadow-emerald-900/50 group-hover:scale-105 transition-transform"
            />
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white group-hover:text-white/90 transition-colors">
                <span className="text-amber-400">Ihsan</span>Wealth
              </h1>
              <p className="text-[10px] text-emerald-300/70 hidden sm:block">
                Your Complete Islamic Finance Companion
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link key={href} href={href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-1.5 text-xs ${
                      isActive
                        ? "text-amber-300 bg-white/10"
                        : "text-emerald-100 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Right side: Auth + Mobile menu */}
          <div className="flex items-center gap-2">
            {/* Auth */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
                  <User className="h-3.5 w-3.5 text-emerald-200" />
                  <span className="text-xs text-emerald-100 max-w-[100px] truncate">
                    {user?.user_metadata?.name || user?.email?.split("@")[0]}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  className="text-emerald-200 hover:text-white hover:bg-white/10 gap-1.5"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline text-xs">Sign Out</span>
                </Button>
              </div>
            ) : (
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="text-emerald-100 hover:text-white hover:bg-white/10 gap-1.5 text-xs">
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
              </Link>
            )}

            {/* Mobile hamburger */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-emerald-100 hover:text-white hover:bg-white/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="relative lg:hidden border-t border-emerald-700/50 bg-emerald-900/95 backdrop-blur-sm">
          <nav className="mx-auto max-w-6xl px-4 py-3 grid grid-cols-2 gap-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)}>
                  <div
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      isActive
                        ? "bg-white/15 text-amber-300"
                        : "text-emerald-100 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
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
