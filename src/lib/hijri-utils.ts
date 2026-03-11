// ─── Hijri (Islamic) Calendar Utilities ───
// Based on the Kuwaiti/Umm al-Qura algorithm approximation
// using the Islamic epoch (July 16, 622 CE Julian / July 19, 622 CE Gregorian)

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

// ─── Conversion Algorithms ───
// Uses the well-known astronomical approximation based on lunar month cycles

// Julian Day Number from Gregorian date
function gregorianToJDN(year: number, month: number, day: number): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

// Gregorian date from Julian Day Number
function jdnToGregorian(jdn: number): { year: number; month: number; day: number } {
  const z = Math.floor(jdn + 0.5);
  const a = Math.floor((z - 1867216.25) / 36524.25);
  const A = z + 1 + a - Math.floor(a / 4);
  const B = A + 1524;
  const C = Math.floor((B - 122.1) / 365.25);
  const D = Math.floor(365.25 * C);
  const E = Math.floor((B - D) / 30.6001);

  const day = B - D - Math.floor(30.6001 * E);
  const month = E < 14 ? E - 1 : E - 13;
  const year = month > 2 ? C - 4716 : C - 4715;

  return { year, month, day };
}

// Hijri from Julian Day Number (Kuwaiti algorithm)
function jdnToHijri(jdn: number): HijriDate {
  const jd = Math.floor(jdn) + 0.5;
  const epoch = 1948439.5; // Julian day of Hijri epoch (July 16, 622 CE Julian)
  const y = 30;
  const shift1 = 8.01 / 60.0;

  let z = jd - epoch;
  const cyc = Math.floor(z / 10631.0);
  z = z - 10631 * cyc;
  const j = Math.floor((z - shift1) / 325.0 / 11.0) + 1;
  z = z - Math.floor(325.0 * j / 11.0 - shift1);
  const m = Math.min(12, Math.ceil((z - 29) / 29.5) + 1);
  const adjustedM = Math.max(1, m);
  const d = Math.ceil(z - 29.5001 * (adjustedM - 1) - 0.99);

  const year = y * cyc + j;
  return { year, month: adjustedM, day: Math.max(1, d) };
}

// Julian Day Number from Hijri date
function hijriToJDN(year: number, month: number, day: number): number {
  return (
    Math.floor((11 * year + 3) / 30) +
    354 * year +
    30 * month -
    Math.floor((month - 1) / 2) +
    day +
    1948440 -
    385
  );
}

export function gregorianToHijri(date: Date): HijriDate {
  const jdn = gregorianToJDN(date.getFullYear(), date.getMonth() + 1, date.getDate());
  return jdnToHijri(jdn);
}

export function hijriToGregorian(hijri: HijriDate): Date {
  const jdn = hijriToJDN(hijri.year, hijri.month, hijri.day);
  const g = jdnToGregorian(jdn);
  return new Date(g.year, g.month - 1, g.day);
}

export function getDaysInHijriMonth(year: number, month: number): number {
  // Calculate by finding the JDN of the first of next month minus first of this month
  const jdn1 = hijriToJDN(year, month, 1);
  let jdn2: number;
  if (month === 12) {
    jdn2 = hijriToJDN(year + 1, 1, 1);
  } else {
    jdn2 = hijriToJDN(year, month + 1, 1);
  }
  return jdn2 - jdn1;
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
