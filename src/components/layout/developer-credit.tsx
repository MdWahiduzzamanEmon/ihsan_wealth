"use client";

import { Github } from "lucide-react";

interface DeveloperCreditProps {
  lang?: "en" | "bn" | "ar" | "ur" | "tr" | "ms" | "id";
}

const GREETINGS: Record<string, string> = {
  en: "Built with love for the Muslim Ummah",
  bn: "মুসলিম উম্মাহর জন্য ভালোবাসায় তৈরি",
  ar: "بُني بحب للأمة الإسلامية",
  ur: "مسلم امت کے لیے محبت سے بنایا گیا",
  tr: "Müslüman Ümmeti için sevgiyle yapıldı",
  ms: "Dibina dengan kasih untuk Ummah Muslim",
  id: "Dibangun dengan cinta untuk Umat Muslim",
};

const SOCIAL_LINKS = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/md-wahiduzzaman-emon-51b559173/",
    icon: "linkedin" as const,
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/wahedemon09/",
    icon: "facebook" as const,
  },
  {
    name: "GitHub",
    url: "https://github.com/MdWahiduzzamanEmon",
    icon: "github" as const,
  },
];

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

function SocialIcon({
  type,
  className,
}: {
  type: "linkedin" | "facebook" | "github";
  className?: string;
}) {
  switch (type) {
    case "linkedin":
      return <LinkedInIcon className={className} />;
    case "facebook":
      return <FacebookIcon className={className} />;
    case "github":
      return <Github className={className} />;
  }
}

export function DeveloperCredit({ lang = "en" }: DeveloperCreditProps) {
  const greeting = GREETINGS[lang] || GREETINGS.en;
  const isRtl = lang === "ar" || lang === "ur";

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-2xl border border-emerald-800/40 bg-emerald-950/60 backdrop-blur-sm p-6 text-center">
        {/* Avatar / Initials */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 shadow-lg shadow-emerald-900/40">
          <span className="text-xl font-bold text-white tracking-wide">
            ME
          </span>
        </div>

        {/* Name */}
        <h3 className="text-lg font-semibold text-emerald-100">
          Md Wahiduzzaman Emon
        </h3>

        {/* Brief */}
        <p className="mt-1 text-sm text-emerald-300/60">
          Full-Stack Developer | Building tools for the Muslim Ummah
        </p>

        {/* Localized greeting */}
        <p
          className="mt-3 text-sm text-amber-300/60 italic"
          dir={isRtl ? "rtl" : "ltr"}
        >
          &ldquo;{greeting}&rdquo;
        </p>

        {/* Social pill buttons */}
        <div className="mt-5 flex items-center justify-center gap-2 flex-wrap">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-700/40 bg-emerald-900/40 px-3 py-1.5 text-xs text-emerald-300/70 transition-all duration-200 hover:border-emerald-500/60 hover:bg-emerald-800/50 hover:text-emerald-200"
            >
              <SocialIcon type={link.icon} className="h-3.5 w-3.5" />
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
