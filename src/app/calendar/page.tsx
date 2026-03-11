"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Moon } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HijriCalendar } from "@/components/calendar/hijri-calendar";
import { IslamicEvents } from "@/components/calendar/islamic-events";
import { DateConverter } from "@/components/calendar/date-converter";
import { gregorianToHijri, getHijriMonthName, getHijriDayName } from "@/lib/hijri-utils";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { DEFAULT_FORM_DATA, type ZakatFormData } from "@/types/zakat";

export default function CalendarPage() {
  const todayHijri = useMemo(() => gregorianToHijri(new Date()), []);
  const monthName = getHijriMonthName(todayHijri.month);
  const dayName = getHijriDayName(new Date().getDay());
  const [formData] = useLocalStorage<ZakatFormData>("zakat-calculator-data", DEFAULT_FORM_DATA);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50/30 via-white to-amber-50/20">
      <Header countryCode={formData.country} />
      <main className="flex-1">
        {/* Hero section with current Hijri date */}
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 py-12 md:py-16">
          {/* Islamic geometric pattern overlay */}
          <div className="absolute inset-0 opacity-[0.06]">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id="calendar-pattern"
                  x="0"
                  y="0"
                  width="80"
                  height="80"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M40 0L80 40L40 80L0 40Z"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                  <circle cx="40" cy="40" r="20" fill="none" stroke="white" strokeWidth="0.5" />
                  <circle cx="40" cy="40" r="10" fill="none" stroke="white" strokeWidth="0.3" />
                  <path
                    d="M40 20L60 40L40 60L20 40Z"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.3"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#calendar-pattern)" />
            </svg>
          </div>

          {/* Decorative crescent */}
          <div className="absolute top-4 right-8 md:right-16 opacity-10">
            <Moon className="h-32 w-32 md:h-48 md:w-48 text-amber-300 -rotate-45" />
          </div>

          <div className="relative mx-auto max-w-5xl px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Arabic day name */}
              <p className="font-arabic text-lg text-amber-300/60 mb-2">{dayName.arabic}</p>

              {/* Hijri date prominent display */}
              <div className="mb-4">
                <motion.p
                  className="font-arabic text-5xl md:text-7xl text-amber-300/90 leading-relaxed"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {monthName.arabic}
                </motion.p>
                <p className="text-4xl md:text-5xl font-bold text-white mt-2">
                  <span className="text-amber-400">{todayHijri.day}</span>{" "}
                  <span className="text-white/80 text-2xl md:text-3xl font-normal">
                    {monthName.english}
                  </span>{" "}
                  <span className="text-amber-400">{todayHijri.year}</span>
                  <span className="text-emerald-300/60 text-lg ml-2">AH</span>
                </p>
              </div>

              {/* Gregorian equivalent */}
              <p className="text-emerald-300/60 text-sm">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>

              {/* Subtitle */}
              <p className="text-emerald-300/50 text-xs mt-4 tracking-wider uppercase">
                Islamic (Hijri) Calendar
              </p>
            </motion.div>
          </div>
        </section>

        {/* Decorative separator */}
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex items-center gap-4 my-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent" />
            <div className="font-arabic text-emerald-300/50 text-lg">&#10022;</div>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent" />
          </div>
        </div>

        {/* Main content */}
        <section className="mx-auto max-w-5xl px-4 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar grid - takes 2 columns on large screens */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="rounded-2xl border border-emerald-200/60 bg-white/80 backdrop-blur-sm p-4 sm:p-6 shadow-lg shadow-emerald-900/5">
                <HijriCalendar />
              </div>
            </motion.div>

            {/* Sidebar: Converter + Events */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* Date Converter */}
              <div className="rounded-2xl border border-emerald-200/60 bg-white/80 backdrop-blur-sm p-4 sm:p-5 shadow-lg shadow-emerald-900/5">
                <DateConverter />
              </div>

              {/* Islamic Events */}
              <div className="rounded-2xl border border-emerald-200/60 bg-white/80 backdrop-blur-sm p-4 sm:p-5 shadow-lg shadow-emerald-900/5">
                <IslamicEvents />
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer countryCode={formData.country} />
    </div>
  );
}
