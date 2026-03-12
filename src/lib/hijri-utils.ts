// ─── Hijri (Islamic) Calendar Utilities ───
// Uses Intl.DateTimeFormat with the Islamic Umm al-Qura calendar for accuracy

export interface HijriDate {
  year: number;
  month: number;
  day: number;
}

// ─── Month & Day Names ───

const HIJRI_MONTHS: { arabic: string; english: string }[] = [
  { arabic: "مُحَرَّم", english: "Muharram" },
  { arabic: "صَفَر", english: "Safar" },
  { arabic: "رَبِيع الأَوَّل", english: "Rabi al-Awwal" },
  { arabic: "رَبِيع الثَّانِي", english: "Rabi al-Thani" },
  { arabic: "جُمَادَى الأُولَى", english: "Jumada al-Ula" },
  { arabic: "جُمَادَى الثَّانِيَة", english: "Jumada al-Thani" },
  { arabic: "رَجَب", english: "Rajab" },
  { arabic: "شَعْبَان", english: "Sha'ban" },
  { arabic: "رَمَضَان", english: "Ramadan" },
  { arabic: "شَوَّال", english: "Shawwal" },
  { arabic: "ذُو القَعْدَة", english: "Dhul Qa'dah" },
  { arabic: "ذُو الحِجَّة", english: "Dhul Hijjah" },
];

const HIJRI_DAYS: { arabic: string; english: string }[] = [
  { arabic: "الأحد", english: "Sunday" },
  { arabic: "الإثنين", english: "Monday" },
  { arabic: "الثلاثاء", english: "Tuesday" },
  { arabic: "الأربعاء", english: "Wednesday" },
  { arabic: "الخميس", english: "Thursday" },
  { arabic: "الجمعة", english: "Friday" },
  { arabic: "السبت", english: "Saturday" },
];

export function getHijriMonthName(month: number): { arabic: string; english: string } {
  if (month < 1 || month > 12) return { arabic: "", english: "" };
  return HIJRI_MONTHS[month - 1];
}

export function getHijriDayName(dayOfWeek: number): { arabic: string; english: string } {
  // dayOfWeek: 0 = Sunday, 6 = Saturday (matching JS Date.getDay())
  if (dayOfWeek < 0 || dayOfWeek > 6) return { arabic: "", english: "" };
  return HIJRI_DAYS[dayOfWeek];
}

// ─── Intl-based Conversion ───

const hijriFormatter = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
  day: "numeric",
  month: "numeric",
  year: "numeric",
});

function parseHijriParts(date: Date): HijriDate {
  const parts = hijriFormatter.formatToParts(date);
  const day = parseInt(parts.find((p) => p.type === "day")?.value || "1");
  const month = parseInt(parts.find((p) => p.type === "month")?.value || "1");
  const year = parseInt(parts.find((p) => p.type === "year")?.value || "1");
  return { year, month, day };
}

export function gregorianToHijri(date: Date): HijriDate {
  return parseHijriParts(date);
}

export function hijriToGregorian(hijri: HijriDate): Date {
  // Binary search: find the Gregorian date whose Hijri representation matches
  // Start with an approximate Gregorian date
  const approxDays = Math.round((hijri.year - 1) * 354.36667 + (hijri.month - 1) * 29.53 + hijri.day);
  const epoch = new Date(622, 6, 19); // Hijri epoch approx
  const approxDate = new Date(epoch.getTime() + approxDays * 86400000);

  // Search in a window around the approximate date
  // First, get close by checking the year/month
  const candidate = new Date(approxDate);

  // Coarse adjustment: check if we're in the right year
  let h = parseHijriParts(candidate);
  const yearDiff = hijri.year - h.year;
  if (Math.abs(yearDiff) > 1) {
    candidate.setDate(candidate.getDate() + yearDiff * 354);
    h = parseHijriParts(candidate);
  }

  // Fine adjustment: binary search within ±200 days
  let lo = new Date(candidate.getTime() - 200 * 86400000);
  let hi = new Date(candidate.getTime() + 200 * 86400000);

  for (let i = 0; i < 20; i++) {
    const mid = new Date((lo.getTime() + hi.getTime()) / 2);
    mid.setHours(12, 0, 0, 0); // Normalize to noon
    h = parseHijriParts(mid);

    const cmp = compareHijri(h, hijri);
    if (cmp === 0) return mid;
    if (cmp < 0) {
      lo = new Date(mid.getTime() + 86400000);
    } else {
      hi = new Date(mid.getTime() - 86400000);
    }
  }

  // Linear scan fallback near lo
  for (let d = -5; d <= 5; d++) {
    const test = new Date(lo.getTime() + d * 86400000);
    test.setHours(12, 0, 0, 0);
    h = parseHijriParts(test);
    if (h.year === hijri.year && h.month === hijri.month && h.day === hijri.day) {
      return test;
    }
  }

  return lo; // Best approximation
}

function compareHijri(a: HijriDate, b: HijriDate): number {
  if (a.year !== b.year) return a.year - b.year;
  if (a.month !== b.month) return a.month - b.month;
  return a.day - b.day;
}

export function getDaysInHijriMonth(year: number, month: number): number {
  // Find the Gregorian date of the 1st of this Hijri month
  const first = hijriToGregorian({ year, month, day: 1 });

  // Find the Gregorian date of the 1st of the next Hijri month
  let nextMonth = month + 1;
  let nextYear = year;
  if (nextMonth > 12) {
    nextMonth = 1;
    nextYear = year + 1;
  }
  const nextFirst = hijriToGregorian({ year: nextYear, month: nextMonth, day: 1 });

  return Math.round((nextFirst.getTime() - first.getTime()) / 86400000);
}

// ─── Islamic Events ───

interface IslamicEvent {
  name: string;
  description: string;
  type: "celebration" | "observance" | "holy_night" | "historic";
}

const ISLAMIC_EVENTS: Record<string, IslamicEvent[]> = {
  "1-1": [
    {
      name: "Islamic New Year",
      description: "The first day of Muharram marks the beginning of the new Islamic year.",
      type: "celebration",
    },
  ],
  "10-1": [
    {
      name: "Day of Ashura",
      description: "A significant day of fasting. The Prophet (PBUH) fasted on this day and encouraged others to fast on the 9th and 10th of Muharram.",
      type: "observance",
    },
  ],
  "12-3": [
    {
      name: "Mawlid an-Nabi",
      description: "Commemorates the birthday of Prophet Muhammad (PBUH). Celebrated with gatherings, prayers, and recitations of his life.",
      type: "celebration",
    },
  ],
  "27-7": [
    {
      name: "Isra and Mi'raj",
      description: "The Night Journey and Ascension of Prophet Muhammad (PBUH) from Makkah to Jerusalem and then to the heavens.",
      type: "holy_night",
    },
  ],
  "15-8": [
    {
      name: "Shab-e-Barat",
      description: "The Night of Fortune and Forgiveness. A night of prayer and seeking Allah's mercy and forgiveness.",
      type: "holy_night",
    },
  ],
  "1-9": [
    {
      name: "Start of Ramadan",
      description: "The blessed month of fasting begins. Muslims fast from dawn to sunset, increase worship, and seek spiritual growth.",
      type: "celebration",
    },
  ],
  "17-9": [
    {
      name: "Battle of Badr",
      description: "Commemorates the decisive Battle of Badr (2 AH), the first major military victory of Islam.",
      type: "historic",
    },
  ],
  "21-9": [
    {
      name: "Laylatul Qadr (possible)",
      description: "The Night of Power — better than a thousand months. Seek it in the odd nights of the last ten days of Ramadan.",
      type: "holy_night",
    },
  ],
  "23-9": [
    {
      name: "Laylatul Qadr (possible)",
      description: "The Night of Power — better than a thousand months. Seek it in the odd nights of the last ten days of Ramadan.",
      type: "holy_night",
    },
  ],
  "25-9": [
    {
      name: "Laylatul Qadr (possible)",
      description: "The Night of Power — better than a thousand months. Seek it in the odd nights of the last ten days of Ramadan.",
      type: "holy_night",
    },
  ],
  "27-9": [
    {
      name: "Laylatul Qadr (most likely)",
      description: "The Night of Power — better than a thousand months. The 27th is considered the most likely night by many scholars.",
      type: "holy_night",
    },
  ],
  "29-9": [
    {
      name: "Laylatul Qadr (possible)",
      description: "The Night of Power — better than a thousand months. Seek it in the odd nights of the last ten days of Ramadan.",
      type: "holy_night",
    },
  ],
  "1-10": [
    {
      name: "Eid al-Fitr",
      description: "The Festival of Breaking the Fast. A joyous celebration marking the end of Ramadan with special prayers, charity, and festivities.",
      type: "celebration",
    },
  ],
  "9-12": [
    {
      name: "Day of Arafah",
      description: "The most important day of Hajj. Fasting on this day expiates sins of the previous and coming year for non-pilgrims.",
      type: "observance",
    },
  ],
  "10-12": [
    {
      name: "Eid al-Adha",
      description: "The Festival of Sacrifice. Commemorates Prophet Ibrahim's (AS) willingness to sacrifice his son. Includes Qurbani and celebrations.",
      type: "celebration",
    },
  ],
  "11-12": [
    {
      name: "Days of Tashreeq",
      description: "Days of eating, drinking, and remembrance of Allah. Fasting is prohibited on these days.",
      type: "observance",
    },
  ],
  "12-12": [
    {
      name: "Days of Tashreeq",
      description: "Days of eating, drinking, and remembrance of Allah. Fasting is prohibited on these days.",
      type: "observance",
    },
  ],
  "13-12": [
    {
      name: "Days of Tashreeq",
      description: "Days of eating, drinking, and remembrance of Allah. Fasting is prohibited on these days.",
      type: "observance",
    },
  ],
};

export function getIslamicEvents(hijriDay: number, hijriMonth: number): IslamicEvent[] {
  const key = `${hijriDay}-${hijriMonth}`;
  return ISLAMIC_EVENTS[key] || [];
}

export function getIslamicEventNames(hijriDay: number, hijriMonth: number): string[] {
  return getIslamicEvents(hijriDay, hijriMonth).map((e) => e.name);
}

// Get all events for a given Hijri month
export function getMonthEvents(
  hijriYear: number,
  hijriMonth: number
): { day: number; events: IslamicEvent[] }[] {
  const days = getDaysInHijriMonth(hijriYear, hijriMonth);
  const result: { day: number; events: IslamicEvent[] }[] = [];
  for (let d = 1; d <= days; d++) {
    const events = getIslamicEvents(d, hijriMonth);
    if (events.length > 0) {
      result.push({ day: d, events });
    }
  }
  return result;
}

// Get all events for an entire Hijri year
export function getYearEvents(
  hijriYear: number
): { month: number; day: number; events: IslamicEvent[] }[] {
  const result: { month: number; day: number; events: IslamicEvent[] }[] = [];
  for (let m = 1; m <= 12; m++) {
    const monthEvents = getMonthEvents(hijriYear, m);
    for (const me of monthEvents) {
      result.push({ month: m, day: me.day, events: me.events });
    }
  }
  return result;
}
