"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TransLang } from "@/lib/islamic-content";

const HIJRI_CAL_TEXTS: Record<TransLang, { noEvents: string; today: string }> = {
  en: { noEvents: "No special events on this day.", today: "Today" },
  bn: { noEvents: "এই দিনে কোনো বিশেষ ঘটনা নেই।", today: "আজ" },
  ur: { noEvents: "اس دن کوئی خاص واقعہ نہیں۔", today: "آج" },
  ar: { noEvents: "لا توجد أحداث خاصة في هذا اليوم.", today: "اليوم" },
  tr: { noEvents: "Bu gunde ozel bir etkinlik yok.", today: "Bugun" },
  ms: { noEvents: "Tiada peristiwa khas pada hari ini.", today: "Hari Ini" },
  id: { noEvents: "Tidak ada peristiwa khusus pada hari ini.", today: "Hari Ini" },
};

import {
  gregorianToHijri,
  hijriToGregorian,
  getDaysInHijriMonth,
  getHijriMonthName,
  getHijriDayName,
  getIslamicEvents,
  type HijriDate,
} from "@/lib/hijri-utils";

interface CalendarDay {
  hijriDay: number;
  gregorianDate: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: { name: string; description: string; type: string }[];
}

interface HijriCalendarProps {
  onDateSelect?: (hijri: HijriDate, gregorian: Date) => void;
  adjustment?: number;
  lang?: TransLang;
}

export function HijriCalendar({ onDateSelect, adjustment = 0, lang = "en" }: HijriCalendarProps) {
  const ct = HIJRI_CAL_TEXTS[lang];
  const todayHijri = useMemo(() => gregorianToHijri(new Date(), adjustment), [adjustment]);
  // monthOffset from today's hijri month (0 = current month, +1 = next, -1 = prev)
  const [monthOffset, setMonthOffset] = useState(0);
  const [direction, setDirection] = useState(0);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Derive absolute month/year from today + offset
  const { currentMonth, currentYear } = useMemo(() => {
    let m = todayHijri.month + monthOffset;
    let y = todayHijri.year;
    while (m > 12) { m -= 12; y += 1; }
    while (m < 1) { m += 12; y -= 1; }
    return { currentMonth: m, currentYear: y };
  }, [todayHijri.month, todayHijri.year, monthOffset]);

  const monthName = getHijriMonthName(currentMonth);
  const daysInMonth = getDaysInHijriMonth(currentYear, currentMonth);

  // Build the calendar grid
  const calendarDays = useMemo((): CalendarDay[] => {
    const days: CalendarDay[] = [];

    // Find what day of the week the 1st falls on
    const firstOfMonth = hijriToGregorian({ year: currentYear, month: currentMonth, day: 1 });
    const startDayOfWeek = firstOfMonth.getDay(); // 0=Sun, 6=Sat

    // Fill in previous month days
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    const daysInPrevMonth = getDaysInHijriMonth(prevYear, prevMonth);

    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const hijriDay = daysInPrevMonth - i;
      const gDate = hijriToGregorian({ year: prevYear, month: prevMonth, day: hijriDay });
      days.push({
        hijriDay,
        gregorianDate: gDate,
        isCurrentMonth: false,
        isToday: false,
        events: getIslamicEvents(hijriDay, prevMonth),
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const gDate = hijriToGregorian({ year: currentYear, month: currentMonth, day: d });
      const isToday =
        currentYear === todayHijri.year &&
        currentMonth === todayHijri.month &&
        d === todayHijri.day;
      days.push({
        hijriDay: d,
        gregorianDate: gDate,
        isCurrentMonth: true,
        isToday,
        events: getIslamicEvents(d, currentMonth),
      });
    }

    // Fill remaining cells to complete the grid (up to 42 cells = 6 rows)
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const gDate = hijriToGregorian({ year: nextYear, month: nextMonth, day: d });
      days.push({
        hijriDay: d,
        gregorianDate: gDate,
        isCurrentMonth: false,
        isToday: false,
        events: getIslamicEvents(d, nextMonth),
      });
    }

    return days;
  }, [currentYear, currentMonth, daysInMonth, todayHijri]);

  const goToPrevMonth = useCallback(() => {
    setDirection(-1);
    setSelectedDay(null);
    setMonthOffset((o) => o - 1);
  }, []);

  const goToNextMonth = useCallback(() => {
    setDirection(1);
    setSelectedDay(null);
    setMonthOffset((o) => o + 1);
  }, []);

  const goToToday = useCallback(() => {
    setDirection(0);
    setMonthOffset(0);
    setSelectedDay(null);
  }, []);

  const handleDayClick = useCallback(
    (day: CalendarDay) => {
      if (!day.isCurrentMonth) return;
      setSelectedDay(day.hijriDay);
      onDateSelect?.(
        { year: currentYear, month: currentMonth, day: day.hijriDay },
        day.gregorianDate
      );
    },
    [currentYear, currentMonth, onDateSelect]
  );

  const weekDays = [0, 1, 2, 3, 4, 5, 6]; // Sun-Sat

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <div className="w-full">
      {/* Month/Year Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPrevMonth}
          className="text-emerald-700 hover:bg-emerald-100 hover:text-emerald-900 h-10 w-10 rounded-full"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="text-center">
          <motion.div
            key={`${currentYear}-${currentMonth}`}
            initial={{ opacity: 0, y: direction * 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="font-arabic text-2xl md:text-3xl text-emerald-900 leading-relaxed">
              {monthName.arabic}
            </h2>
            <p className="text-sm text-emerald-700 font-medium">
              {monthName.english} {currentYear} AH
            </p>
          </motion.div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={goToNextMonth}
          className="text-emerald-700 hover:bg-emerald-100 hover:text-emerald-900 h-10 w-10 rounded-full"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Today button */}
      <div className="flex justify-center mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={goToToday}
          className="text-xs text-emerald-700 border-emerald-200 hover:bg-emerald-50"
        >
          {ct.today}
        </Button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-px mb-1">
        {weekDays.map((d) => {
          const dayName = getHijriDayName(d);
          return (
            <div
              key={d}
              className="text-center py-2 text-xs font-medium text-emerald-600"
            >
              <span className="hidden sm:inline">{dayName.english.slice(0, 3)}</span>
              <span className="sm:hidden">{dayName.english.slice(0, 2)}</span>
            </div>
          );
        })}
      </div>

      {/* Calendar grid with animation */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={`${currentYear}-${currentMonth}`}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="grid grid-cols-7 gap-px bg-emerald-100/50 rounded-xl overflow-hidden border border-emerald-200/60"
        >
          {calendarDays.map((day, idx) => {
            const hasEvent = day.events.length > 0 && day.isCurrentMonth;
            const isSelected = day.isCurrentMonth && day.hijriDay === selectedDay;

            return (
              <motion.button
                key={idx}
                onClick={() => handleDayClick(day)}
                disabled={!day.isCurrentMonth}
                className={`
                  relative min-h-[60px] sm:min-h-[72px] p-1 sm:p-1.5 text-left transition-all
                  ${day.isCurrentMonth ? "bg-white hover:bg-emerald-50/80 cursor-pointer" : "bg-gray-50/50 cursor-default"}
                  ${day.isToday ? "ring-2 ring-inset ring-emerald-500 bg-emerald-50" : ""}
                  ${isSelected ? "bg-emerald-100 ring-2 ring-inset ring-amber-400" : ""}
                `}
                whileHover={day.isCurrentMonth ? { scale: 1.02, zIndex: 10 } : undefined}
                whileTap={day.isCurrentMonth ? { scale: 0.98 } : undefined}
              >
                {/* Hijri day number */}
                <span
                  className={`
                    text-sm sm:text-base font-semibold block
                    ${day.isCurrentMonth ? (day.isToday ? "text-emerald-700" : "text-emerald-900") : "text-gray-300"}
                  `}
                >
                  {day.hijriDay}
                </span>

                {/* Gregorian date (small) */}
                <span
                  className={`
                    text-[10px] block leading-none mt-0.5
                    ${day.isCurrentMonth ? "text-gray-400" : "text-gray-200"}
                  `}
                >
                  {day.gregorianDate.getDate()}/{day.gregorianDate.getMonth() + 1}
                </span>

                {/* Event indicator */}
                {hasEvent && (
                  <div className="absolute bottom-1 right-1 flex gap-0.5">
                    <Star className="h-3 w-3 text-amber-500 fill-amber-400" />
                  </div>
                )}

                {/* Today indicator dot */}
                {day.isToday && day.isCurrentMonth && (
                  <div className="absolute top-1 right-1">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Selected day events */}
      <AnimatePresence>
        {selectedDay !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 overflow-hidden"
          >
            {(() => {
              const events = getIslamicEvents(selectedDay, currentMonth);
              const gDate = hijriToGregorian({
                year: currentYear,
                month: currentMonth,
                day: selectedDay,
              });
              return (
                <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-amber-50/30 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-emerald-900">
                      {selectedDay} {monthName.english} {currentYear} AH
                    </h3>
                    <span className="text-xs text-gray-500">
                      {gDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  {events.length > 0 ? (
                    <div className="space-y-2">
                      {events.map((event, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 rounded-lg bg-white/60 p-2.5 border border-amber-200/50"
                        >
                          <Star className="h-4 w-4 text-amber-500 fill-amber-400 mt-0.5 shrink-0" />
                          <div>
                            <p className="font-medium text-sm text-emerald-900">{event.name}</p>
                            <p className="text-xs text-gray-600 mt-0.5">{event.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">{ct.noEvents}</p>
                  )}
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
