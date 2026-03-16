"use client";

import Image from "next/image";
import Link from "next/link";
import { Github } from "lucide-react";
import {
  FOOTER_DUA,
  UI_TEXTS,
  FOOTER_LINKS_TEXTS,
  FOOTER_EXTRA_TEXTS,
  getLangFromCountry,
} from "@/lib/islamic-content";
import { useVisitorCount } from "@/hooks/use-visitor-count";
import { GRID_FEATURES } from "@/lib/app-features";
import { SupportBanner } from "@/components/layout/support-banner";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

interface FooterProps {
  countryCode?: string;
}

export function Footer({ countryCode = "BD" }: FooterProps) {
  const lang = getLangFromCountry(countryCode);
  const texts = UI_TEXTS[lang];
  const linkTexts = FOOTER_LINKS_TEXTS[lang];
  const duaTranslation =
    FOOTER_DUA.translations[lang] || FOOTER_DUA.translations.en;
  const extra = FOOTER_EXTRA_TEXTS[lang];
  const visitorCount = useVisitorCount();

  return (
    <footer className="relative border-t border-emerald-800/50 bg-gradient-to-b from-emerald-950 via-emerald-950 to-[#0a1f1a] px-4 pt-12 pb-8 text-white/80 overflow-hidden">
      {/* Subtle pattern background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="footer-pattern"
              x="0"
              y="0"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M30 0L60 30L30 60L0 30Z"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
              <circle
                cx="30"
                cy="30"
                r="12"
                fill="none"
                stroke="white"
                strokeWidth="0.3"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-pattern)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-5xl">
        {/* Closing Dua */}
        <div className="text-center mb-10">
          <p
            className="font-arabic text-2xl text-amber-300/60 mb-3 leading-relaxed"
            dir="rtl"
          >
            {FOOTER_DUA.arabic}
          </p>
          <p className="text-sm text-emerald-200/60 italic max-w-xl mx-auto leading-relaxed">
            &ldquo;{duaTranslation}&rdquo;
          </p>
          <p className="text-xs text-emerald-400/50 mt-1.5">
            — {FOOTER_DUA.source}
          </p>
        </div>

        {/* Ornamental divider */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-700/40 to-transparent" />
          <div className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-amber-400/30" />
            <span className="font-arabic text-amber-400/30 text-sm">
              &#10022;
            </span>
            <div className="h-1 w-1 rounded-full bg-amber-400/30" />
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-700/40 to-transparent" />
        </div>

        {/* Main footer content grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Brand column */}
          <div className="text-center md:text-left">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-3">
              <Image
                src="/favicon.svg"
                alt="IhsanWealth"
                width={28}
                height={28}
                className="rounded-lg"
              />
              <span className="text-lg font-bold tracking-tight text-white">
                <span className="text-amber-400">Ihsan</span>Wealth
              </span>
            </Link>
            <p className="text-xs text-emerald-300/60 leading-relaxed max-w-xs mx-auto md:mx-0">
              {extra.brandDesc}
            </p>
          </div>

          {/* Quick links column */}
          <div className="text-center md:text-left">
            <h3 className="text-xs font-semibold text-emerald-200/70 uppercase tracking-wider mb-3">
              {extra.features}
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {GRID_FEATURES.slice(0, 8).map((f) => (
                <Link
                  key={f.id}
                  href={f.href}
                  className="text-xs text-emerald-300/60 hover:text-emerald-200 transition-colors truncate"
                >
                  {f.label[lang]}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal column */}
          <div className="text-center md:text-left">
            <h3 className="text-xs font-semibold text-emerald-200/70 uppercase tracking-wider mb-3">
              {extra.legal}
            </h3>
            <div className="flex flex-col gap-1.5">
              <Link
                href="/site-map"
                className="text-xs text-emerald-300/60 hover:text-emerald-200 transition-colors"
              >
                {linkTexts.sitemap}
              </Link>
              <Link
                href="/privacy"
                className="text-xs text-emerald-300/60 hover:text-emerald-200 transition-colors"
              >
                {linkTexts.privacyPolicy}
              </Link>
              <Link
                href="/usage-rights"
                className="text-xs text-emerald-300/60 hover:text-emerald-200 transition-colors"
              >
                {linkTexts.usageRights}
              </Link>
            </div>
          </div>
        </div>

        {/* Sadaqah Jariyah support - BD only */}
        {countryCode === "BD" && <SupportBanner />}

        {/* Disclaimer */}
        <div className="rounded-xl bg-white/[0.03] border border-emerald-700/20 px-5 py-4 mb-8">
          <p className="text-xs text-emerald-200/70 leading-relaxed text-center">
            <span className="font-arabic text-amber-300/60 mr-1.5">تنبيه</span>
            <span className="font-medium text-emerald-200/80">
              {texts.disclaimer}:
            </span>{" "}
            {texts.disclaimerText}
          </p>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center gap-4 pt-6 border-t border-emerald-800/30">
          {/* Developer credit with social links */}
          <div className="flex items-center gap-3">
            <p className="text-[11px] text-emerald-400/60">
              &copy; {new Date().getFullYear()} IhsanWealth. Built with care by{" "}
              <a
                href="https://github.com/MdWahiduzzamanEmon"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-300/60 hover:text-emerald-200 transition-colors"
              >
                Md Wahiduzzaman Emon
              </a>
            </p>
            <div className="flex items-center gap-1.5">
              <a
                href="https://www.linkedin.com/in/md-wahiduzzaman-emon-51b559173/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-6 w-6 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedInIcon className="h-3 w-3 text-emerald-400/60" />
              </a>
              <a
                href="https://www.facebook.com/wahedemon09/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-6 w-6 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon className="h-3 w-3 text-emerald-400/60" />
              </a>
              <a
                href="https://github.com/MdWahiduzzamanEmon"
                target="_blank"
                rel="noopener noreferrer"
                className="h-6 w-6 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-3 w-3 text-emerald-400/60" />
              </a>
            </div>
          </div>

          {/* Visitor count chip & jazakallah */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {visitorCount !== null && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-800/40 border border-emerald-700/30 px-3 py-1 text-[11px] text-emerald-300/70">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80 animate-pulse" />
                {visitorCount.toLocaleString()} {extra.visitors}
              </span>
            )}
            <p className="text-[11px] text-emerald-400/50">
              <span className="font-arabic">جزاكم الله خيرا</span> —{" "}
              {texts.jazakallah}
            </p>
          </div>

          {/* Product Hunt badge */}
          <Link
            href="https://www.producthunt.com/products/ihsanwealth/reviews/new?utm_source=badge-product_review&utm_medium=badge&utm_source=badge-ihsanwealth"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="https://api.producthunt.com/widgets/embed-image/v1/product_review.svg?product_id=1182437&theme=neutral"
              alt="IhsanWealth - IslamicTech, Muslim, Zakat | Product Hunt"
              width={200}
              height={54}
              // style={{ width: "150px", }}
            />
          </Link>
        </div>
      </div>
    </footer>
  );
}
