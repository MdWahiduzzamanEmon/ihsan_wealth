/**
 * Returns a local date string in YYYY-MM-DD format using the browser's timezone.
 * Unlike `new Date().toISOString().split("T")[0]`, this avoids UTC offset issues
 * where users in UTC+ timezones (e.g. BD = UTC+6) get the previous day before 6 AM UTC.
 */
export function getLocalDateStr(date: Date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
