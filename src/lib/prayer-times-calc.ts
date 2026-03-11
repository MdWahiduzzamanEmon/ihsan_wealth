/**
 * Prayer Times Calculation Engine
 *
 * Based on the algorithm by Hamid Zarrabi-Zadeh (PrayerTimes.org)
 * which is the most widely used open-source prayer time calculation.
 */

export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  tahajjud: string;
}

export interface CalculationMethod {
  name: string;
  fajrAngle: number;
  ishaAngle: number;
  /** If set, Isha = Maghrib + ishaMinutes instead of using ishaAngle */
  ishaMinutes?: number;
}

export const CALCULATION_METHODS: Record<string, CalculationMethod> = {
  MWL: { name: "Muslim World League", fajrAngle: 18, ishaAngle: 17 },
  ISNA: { name: "Islamic Society of North America", fajrAngle: 15, ishaAngle: 15 },
  EGYPT: { name: "Egyptian General Authority", fajrAngle: 19.5, ishaAngle: 17.5 },
  MAKKAH: { name: "Umm al-Qura, Makkah", fajrAngle: 18.5, ishaAngle: 0, ishaMinutes: 90 },
  KARACHI: { name: "University of Islamic Sciences, Karachi", fajrAngle: 18, ishaAngle: 18 },
};

// ── helpers ──────────────────────────────────────────────────────────

const DEG = Math.PI / 180;
const toRad = (d: number) => d * DEG;
const toDeg = (r: number) => r / DEG;

function dsin(d: number) { return Math.sin(toRad(d)); }
function dcos(d: number) { return Math.cos(toRad(d)); }
function dtan(d: number) { return Math.tan(toRad(d)); }
function darcsin(x: number) { return toDeg(Math.asin(x)); }
function darccos(x: number) { return toDeg(Math.acos(Math.max(-1, Math.min(1, x)))); }
function darctan2(y: number, x: number) { return toDeg(Math.atan2(y, x)); }
function darccot(x: number) { return toDeg(Math.atan(1 / x)); }

/** Normalize a value to [0, 360) */
function fix360(a: number): number {
  a = a - 360 * Math.floor(a / 360);
  return a < 0 ? a + 360 : a;
}

/** Normalize a value to [0, 24) */
function fixHour(h: number): number {
  h = h - 24 * Math.floor(h / 24);
  return h < 0 ? h + 24 : h;
}

// ── solar position ──────────────────────────────────────────────────

function julianDate(year: number, month: number, day: number): number {
  if (month <= 2) { year -= 1; month += 12; }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

interface SolarPosition {
  declination: number;   // degrees
  equationOfTime: number; // hours (NOT minutes)
}

/**
 * Compute the sun's declination and equation of time for a given Julian Date.
 * Algorithm from PrayerTimes.org by Hamid Zarrabi-Zadeh.
 */
function sunPosition(jd: number): SolarPosition {
  const D = jd - 2451545.0; // days since J2000.0

  const g = fix360(357.529 + 0.98560028 * D); // mean anomaly (degrees)
  const q = fix360(280.459 + 0.98564736 * D); // mean longitude (degrees)
  const L = fix360(q + 1.915 * dsin(g) + 0.020 * dsin(2 * g)); // ecliptic longitude

  const e = 23.439 - 0.00000036 * D; // obliquity of the ecliptic

  const declination = darcsin(dsin(e) * dsin(L));

  // Right ascension (in degrees, then convert to hours)
  let RA = darctan2(dcos(e) * dsin(L), dcos(L));
  RA = fix360(RA) / 15; // convert to hours [0, 24)

  // Equation of time in hours
  const eqt = q / 15 - RA;
  // Normalize to [-12, 12] range
  let eqtNorm = eqt - 24 * Math.floor(eqt / 24);
  if (eqtNorm > 12) eqtNorm -= 24;

  return { declination, equationOfTime: eqtNorm };
}

// ── core time computation ───────────────────────────────────────────

/**
 * Time offset (in hours) for a depression angle below the horizon.
 * Used for Fajr, Sunrise, Maghrib, Isha.
 * T(angle) = 1/15 * arccos( (-sin(angle) - sin(lat)*sin(dec)) / (cos(lat)*cos(dec)) )
 */
function timeForAngle(
  angle: number,
  latitude: number,
  declination: number,
): number {
  const numerator = -dsin(angle) - dsin(latitude) * dsin(declination);
  const denominator = dcos(latitude) * dcos(declination);
  return (1 / 15) * darccos(numerator / denominator);
}

/**
 * Time offset (in hours) for a sun altitude angle above the horizon.
 * Used for Asr calculation where the angle is an elevation, not depression.
 * cos(H) = (sin(altitude) - sin(lat)*sin(dec)) / (cos(lat)*cos(dec))
 */
function timeForAltitude(
  altitude: number,
  latitude: number,
  declination: number,
): number {
  const numerator = dsin(altitude) - dsin(latitude) * dsin(declination);
  const denominator = dcos(latitude) * dcos(declination);
  return (1 / 15) * darccos(numerator / denominator);
}

/**
 * Calculates all prayer times for the given date and location.
 */
export function calculatePrayerTimes(
  date: Date,
  latitude: number,
  longitude: number,
  methodKey: string,
  asrJuristic: "standard" | "hanafi" = "standard",
  format: "12h" | "24h" = "12h",
): PrayerTimes {
  const method = CALCULATION_METHODS[methodKey] || CALCULATION_METHODS.MWL;

  // timezone offset in hours (positive for east of UTC)
  const tzOffset = -date.getTimezoneOffset() / 60;

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const jd = julianDate(year, month, day);
  const { declination, equationOfTime } = sunPosition(jd);

  // Dhuhr (solar noon in local time)
  // midday = 12 - EqT (where EqT is in hours)
  // Then adjust for longitude vs timezone central meridian:
  // dhuhr = midday + (tzOffset * 15 - longitude) / 15
  //       = 12 - EqT + tzOffset - longitude/15
  const dhuhr = 12 + tzOffset - longitude / 15 - equationOfTime;

  // Sunrise / Sunset (angle = 0.833 degrees for atmospheric refraction + sun radius)
  const sunOffset = timeForAngle(0.833, latitude, declination);
  const sunrise = dhuhr - sunOffset;
  const maghrib = dhuhr + sunOffset;

  // Fajr
  const fajr = dhuhr - timeForAngle(method.fajrAngle, latitude, declination);

  // Asr
  // Shadow ratio: standard (Shafi/Maliki/Hanbali) = 1, Hanafi = 2
  // Asr angle is a sun ALTITUDE (elevation), not depression
  const shadowFactor = asrJuristic === "hanafi" ? 2 : 1;
  const asrAltitude = darccot(shadowFactor + dtan(Math.abs(latitude - declination)));
  const asr = dhuhr + timeForAltitude(asrAltitude, latitude, declination);

  // Isha
  let isha: number;
  if (method.ishaMinutes) {
    isha = maghrib + method.ishaMinutes / 60;
  } else {
    isha = dhuhr + timeForAngle(method.ishaAngle, latitude, declination);
  }

  // Tahajjud = last third of the night
  // Night = Maghrib to Fajr (next day, approximated as same-day Fajr + 24)
  const nightDuration = (fajr + 24) - maghrib;
  const tahajjud = maghrib + (nightDuration * 2 / 3);

  const fmt = (hours: number) => formatTime(fixHour(hours), format);

  return {
    fajr: fmt(fajr),
    sunrise: fmt(sunrise),
    dhuhr: fmt(dhuhr),
    asr: fmt(asr),
    maghrib: fmt(maghrib),
    isha: fmt(isha),
    tahajjud: fmt(tahajjud),
  };
}

// ── formatting ──────────────────────────────────────────────────────

function formatTime(floatHours: number, format: "12h" | "24h"): string {
  const totalMinutes = Math.round(floatHours * 60);
  let h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;

  if (format === "24h") {
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  }

  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m.toString().padStart(2, "0")} ${ampm}`;
}

/**
 * Parse a formatted time string back to total minutes since midnight.
 */
export function parseTimeToMinutes(time: string): number {
  const isPM = time.includes("PM");
  const isAM = time.includes("AM");
  const cleaned = time.replace(/\s*(AM|PM)\s*/i, "");
  const [hStr, mStr] = cleaned.split(":");
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);

  if (isPM && h !== 12) h += 12;
  if (isAM && h === 12) h = 0;

  return h * 60 + m;
}

// ── Hijri date approximation ────────────────────────────────────────

export function approximateHijriDate(date: Date): string {
  // Simple arithmetic approximation of Hijri date.
  // Not a substitute for a proper Hijri calendar, but close enough for display.
  const jd = julianDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const epoch = 1948439.5; // Julian date of 1 Muharram 1 AH (approx)
  const daysSinceEpoch = jd - epoch;
  const lunarCycle = 29.5305882; // average synodic month
  const totalMonths = Math.floor(daysSinceEpoch / lunarCycle);
  const hijriYear = Math.floor((totalMonths * 30 + 10) / 360) + 1;
  const monthInYear = (totalMonths % 12);
  const dayInMonth = Math.floor(daysSinceEpoch - totalMonths * lunarCycle) + 1;

  const hijriMonths = [
    "Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani",
    "Jumada al-Ula", "Jumada al-Thani", "Rajab", "Sha'ban",
    "Ramadan", "Shawwal", "Dhul Qi'dah", "Dhul Hijjah",
  ];

  const monthIndex = ((monthInYear % 12) + 12) % 12;
  const adjustedDay = ((dayInMonth - 1) % 30) + 1;

  return `${adjustedDay} ${hijriMonths[monthIndex]} ${hijriYear} AH`;
}
