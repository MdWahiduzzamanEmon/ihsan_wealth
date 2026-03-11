"use client";

import { Github } from "lucide-react";
import { FOOTER_DUA, UI_TEXTS, FOOTER_LINKS_TEXTS, getLangFromCountry } from "@/lib/islamic-content";
import Link from "next/link";


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

export function Footer({ countryCode = "US" }: FooterProps) {
  const lang = getLangFromCountry(countryCode);
  const texts = UI_TEXTS[lang];
  const linkTexts = FOOTER_LINKS_TEXTS[lang];
  const duaTranslation = FOOTER_DUA.translations[lang] || FOOTER_DUA.translations.en;

  return (
    <footer className="border-t bg-gradient-to-b from-emerald-950 to-emerald-950 px-4 py-10 text-white/80">
      <div className="mx-auto max-w-5xl">
        {/* Closing Dua */}
        <div className="text-center mb-8">
          <p className="font-arabic text-xl text-amber-300/70 mb-2" dir="rtl">
            {FOOTER_DUA.arabic}
          </p>
          <p className="text-xs text-emerald-300/50 italic max-w-xl mx-auto">
            &ldquo;{duaTranslation}&rdquo;
          </p>
          <p className="text-xs text-emerald-400/40 mt-1">- {FOOTER_DUA.source}</p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-700/50 to-transparent" />
          <span className="font-arabic text-amber-400/40 text-sm">&#9770;</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-700/50 to-transparent" />
        </div>

        {/* Disclaimer */}
        <div className="text-center text-sm text-emerald-200/70">
          <p className="mb-2 font-medium text-emerald-100/80">
            <span className="font-arabic ml-2">تنبيه</span> - {texts.disclaimer}
          </p>
          <p className="max-w-2xl mx-auto text-emerald-200/60">
            {texts.disclaimerText}
          </p>
          <p className="mt-4 text-xs text-emerald-300/50">
            <span className="font-arabic">جزاكم الله خيرا</span> &mdash; {texts.jazakallah}
          </p>
        </div>

        {/* Footer Links */}
        <div className="flex items-center justify-center gap-4 mt-6 text-xs">
          <Link href="/site-map" className="text-emerald-300/60 hover:text-emerald-200 transition-colors duration-200">
            {linkTexts.sitemap}
          </Link>
          <span className="text-emerald-700/50">|</span>
          <Link href="/privacy" className="text-emerald-300/60 hover:text-emerald-200 transition-colors duration-200">
            {linkTexts.privacyPolicy}
          </Link>
          <span className="text-emerald-700/50">|</span>
          <Link href="/usage-rights" className="text-emerald-300/60 hover:text-emerald-200 transition-colors duration-200">
            {linkTexts.usageRights}
          </Link>
        </div>

        {/* Developer Credit Divider */}
        <div className="flex items-center gap-3 mt-8 mb-5">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-700/40 to-transparent" />
        </div>

        {/* Developer Credit */}
        <div className="text-center">
          <p className="text-xs text-emerald-300/60">
            Built with ❤️ by{" "}
            <a
              href="https://github.com/MdWahiduzzamanEmon"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-200/70 hover:text-emerald-100 transition-colors duration-200"
            >
              Md Wahiduzzaman Emon
            </a>
          </p>

          <div className="mt-2 flex items-center justify-center gap-3">
            <a
              href="https://www.linkedin.com/in/md-wahiduzzaman-emon-51b559173/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400/50 hover:text-emerald-200 transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <LinkedInIcon className="h-4 w-4" />
            </a>
            <a
              href="https://www.facebook.com/wahedemon09/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400/50 hover:text-emerald-200 transition-colors duration-200"
              aria-label="Facebook"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a
              href="https://github.com/MdWahiduzzamanEmon"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400/50 hover:text-emerald-200 transition-colors duration-200"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}
