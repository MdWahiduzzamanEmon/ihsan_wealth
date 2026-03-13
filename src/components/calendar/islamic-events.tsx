"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Star, Moon, Sparkles, Sword, Calendar } from "lucide-react";
import type { TransLang } from "@/lib/islamic-content";
import {
  gregorianToHijri,
  getYearEvents,
  getHijriMonthName,
  hijriToGregorian,
} from "@/lib/hijri-utils";

const EVENT_TYPE_CONFIG: Record<
  string,
  { icon: typeof Star; color: string; bgColor: string; borderColor: string }
> = {
  celebration: {
    icon: Sparkles,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  observance: {
    icon: Moon,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
  holy_night: {
    icon: Star,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
  },
  historic: {
    icon: Sword,
    color: "text-stone-600",
    bgColor: "bg-stone-50",
    borderColor: "border-stone-200",
  },
};

const UI_TEXTS: Record<
  TransLang,
  {
    title: string;
    upcoming: string;
    earlier: string;
    celebration: string;
    observance: string;
    holy_night: string;
    historic: string;
  }
> = {
  en: {
    title: "Islamic Events",
    upcoming: "Upcoming Events",
    earlier: "Earlier This Year",
    celebration: "Celebration",
    observance: "Observance",
    holy_night: "Holy Night",
    historic: "Historic",
  },
  bn: {
    title: "ইসলামী ঘটনাবলী",
    upcoming: "আসন্ন ঘটনাসমূহ",
    earlier: "এই বছরের আগের ঘটনা",
    celebration: "উৎসব",
    observance: "পালনীয়",
    holy_night: "পবিত্র রাত",
    historic: "ঐতিহাসিক",
  },
  ur: {
    title: "اسلامی واقعات",
    upcoming: "آنے والے واقعات",
    earlier: "اس سال پہلے",
    celebration: "جشن",
    observance: "تعظیم",
    holy_night: "مقدس رات",
    historic: "تاریخی",
  },
  ar: {
    title: "المناسبات الإسلامية",
    upcoming: "المناسبات القادمة",
    earlier: "في وقت سابق هذا العام",
    celebration: "احتفال",
    observance: "مناسبة",
    holy_night: "ليلة مباركة",
    historic: "تاريخي",
  },
  tr: {
    title: "İslami Etkinlikler",
    upcoming: "Yaklaşan Etkinlikler",
    earlier: "Bu Yıl Daha Önce",
    celebration: "Kutlama",
    observance: "Anma",
    holy_night: "Mübarek Gece",
    historic: "Tarihi",
  },
  ms: {
    title: "Peristiwa Islam",
    upcoming: "Peristiwa Akan Datang",
    earlier: "Awal Tahun Ini",
    celebration: "Perayaan",
    observance: "Peringatan",
    holy_night: "Malam Mulia",
    historic: "Bersejarah",
  },
  id: {
    title: "Peristiwa Islam",
    upcoming: "Peristiwa Mendatang",
    earlier: "Awal Tahun Ini",
    celebration: "Perayaan",
    observance: "Peringatan",
    holy_night: "Malam Mulia",
    historic: "Bersejarah",
  },
};

interface IslamicEventsProps {
  adjustment?: number;
  lang?: TransLang;
}

export function IslamicEvents({ adjustment = 0, lang = "en" }: IslamicEventsProps) {
  const t = UI_TEXTS[lang];
  const todayHijri = useMemo(() => gregorianToHijri(new Date(), adjustment), [adjustment]);

  const yearEvents = useMemo(() => getYearEvents(todayHijri.year), [todayHijri.year]);

  // Filter to upcoming + current month events, then all remaining
  const sortedEvents = useMemo(() => {
    // Deduplicate by name + month + day
    const seen = new Set<string>();
    return yearEvents.filter((e) => {
      const key = `${e.month}-${e.day}-${e.events[0]?.name[lang]}`;
      if (seen.has(key)) return false;
      seen.add(key);
      // Only include first event per day for cleaner display
      return true;
    });
  }, [yearEvents, lang]);

  // Split into upcoming and past
  const { upcoming, past } = useMemo(() => {
    const upcomingList: typeof sortedEvents = [];
    const pastList: typeof sortedEvents = [];

    for (const event of sortedEvents) {
      if (
        event.month > todayHijri.month ||
        (event.month === todayHijri.month && event.day >= todayHijri.day)
      ) {
        upcomingList.push(event);
      } else {
        pastList.push(event);
      }
    }

    return { upcoming: upcomingList, past: pastList };
  }, [sortedEvents, todayHijri]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  };

  const getTypeBadge = (type: string) => {
    return t[type as keyof typeof t] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-5">
        <Calendar className="h-5 w-5 text-emerald-700" />
        <h2 className="text-lg font-semibold text-emerald-900">
          {t.title} — {todayHijri.year} AH
        </h2>
      </div>

      {/* Upcoming events */}
      {upcoming.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-emerald-600 mb-3 uppercase tracking-wider">
            {t.upcoming}
          </h3>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-2.5"
          >
            {upcoming.map((item, idx) => {
              const event = item.events[0];
              const config = EVENT_TYPE_CONFIG[event.type] || EVENT_TYPE_CONFIG.observance;
              const Icon = config.icon;
              const monthName = getHijriMonthName(item.month);
              const gDate = hijriToGregorian({
                year: todayHijri.year,
                month: item.month,
                day: item.day,
              });

              return (
                <motion.div
                  key={`upcoming-${idx}`}
                  variants={itemVariants}
                  className={`
                    rounded-xl border ${config.borderColor} ${config.bgColor}
                    p-3.5 transition-all hover:shadow-md
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`
                      flex h-10 w-10 shrink-0 items-center justify-center rounded-lg
                      bg-white/80 ${config.color} shadow-sm
                    `}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-sm text-gray-900">{event.name[lang]}</h4>
                        <span
                          className={`
                          inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium
                          bg-white/80 ${config.color} border ${config.borderColor}
                        `}
                        >
                          {getTypeBadge(event.type)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.day} {monthName.english} ({monthName.arabic}) —{" "}
                        {gDate.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                        {event.description[lang]}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      )}

      {/* Past events (collapsed) */}
      {past.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
            {t.earlier}
          </h3>
          <div className="space-y-1.5">
            {past.map((item, idx) => {
              const event = item.events[0];
              const monthName = getHijriMonthName(item.month);

              return (
                <div
                  key={`past-${idx}`}
                  className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/50 px-3 py-2 text-gray-400"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-gray-300 shrink-0" />
                  <span className="text-xs flex-1 truncate">{event.name[lang]}</span>
                  <span className="text-[10px] shrink-0">
                    {item.day} {monthName.english}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
