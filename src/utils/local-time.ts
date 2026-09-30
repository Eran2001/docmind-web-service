// The one place where UTC and local time meet.
//
// Everywhere except the screen, time is UTC: the database stores `timestamptz`, the API sends ISO 8601 strings that end in "Z"
// ("2026-09-30T15:36:01.743Z"), and requests to the API should carry UTC too (see toUtcIso). Only when a time is SHOWN to a
// person is it converted to their local time zone, and only through the helpers below. Never format an API timestamp by hand.

export type TimeInput = string | number | Date;

// "2026-09-30T15:36:01" has no zone marker and JavaScript would read it as LOCAL time; the API never sends that, but if one
// ever slips through it is treated as UTC, which is what every timestamp in this system is.
const HAS_ZONE = /(?:Z|[+-]\d{2}:?\d{2})$/i;
const DATE_TIME = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/;

/** Parses an API timestamp (UTC) into a Date. The result may be an Invalid Date; check with isValidTime. */
export function parseUtc(value: TimeInput): Date {
  if (value instanceof Date) return value;
  if (typeof value === "string" && DATE_TIME.test(value) && !HAS_ZONE.test(value)) {
    return new Date(`${value.replace(" ", "T")}Z`);
  }
  return new Date(value);
}

export function isValidTime(value: TimeInput): boolean {
  return !Number.isNaN(parseUtc(value).getTime());
}

const DATE = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
const MONTH_DAY = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
// h23: 24-hour clock where midnight is 00:00 (plain hour12:false prints 24:00 in some browsers).
const TIME_24 = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
const TIME_12 = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
const ZONE = new Intl.DateTimeFormat("en-US", { timeZoneName: "short" });

const FALLBACK = "—";
const safe = (value: TimeInput, format: (d: Date) => string) => (isValidTime(value) ? format(parseUtc(value)) : FALLBACK);

/** "Sep 30, 2026" in the viewer's time zone. */
export const formatLocalDate = (value: TimeInput) => safe(value, (d) => DATE.format(d));

/** "Sep 30" in the viewer's time zone. */
export const formatLocalMonthDay = (value: TimeInput) => safe(value, (d) => MONTH_DAY.format(d));

/** "21:06" (or "9:06 PM" with `{ hour12: true }`) in the viewer's time zone. */
export const formatLocalTime = (value: TimeInput, { hour12 = false }: { hour12?: boolean } = {}) =>
  safe(value, (d) => (hour12 ? TIME_12 : TIME_24).format(d));

/** "Sep 30, 2026 · 21:06" in the viewer's time zone. */
export const formatLocalDateTime = (value: TimeInput, opts: { hour12?: boolean } = {}) =>
  safe(value, (d) => `${DATE.format(d)} · ${formatLocalTime(d, opts)}`);

/** "Sep 30, 2026 · 21:06 GMT+5:30": when the reader needs to know which zone the time is in. */
export const formatLocalDateTimeWithZone = (value: TimeInput, opts: { hour12?: boolean } = {}) =>
  safe(value, (d) => `${formatLocalDateTime(d, opts)} ${zoneName(d)}`);

function zoneName(d: Date): string {
  return ZONE.formatToParts(d).find((p) => p.type === "timeZoneName")?.value ?? "";
}

/** The viewer's IANA time zone, e.g. "Asia/Colombo". */
export const getLocalTimeZone = (): string => Intl.DateTimeFormat().resolvedOptions().timeZone;

/** The viewer's current offset from UTC, e.g. "UTC+05:30". */
export function getUtcOffsetLabel(at: TimeInput = Date.now()): string {
  const minutes = -parseUtc(at).getTimezoneOffset();
  const sign = minutes < 0 ? "-" : "+";
  const abs = Math.abs(minutes);
  return `UTC${sign}${String(Math.floor(abs / 60)).padStart(2, "0")}:${String(abs % 60).padStart(2, "0")}`;
}

/** UTC ISO string ("...Z") for sending a moment to the API. */
export const toUtcIso = (value: TimeInput): string => parseUtc(value).toISOString();

/**
 * A date (and time) the user picked, which is in THEIR local zone, to the UTC ISO string the API expects.
 * `localDateTimeToUtcIso("2026-09-30", "21:06")` is "2026-09-30T15:36:00.000Z" for someone at UTC+5:30.
 */
export function localDateTimeToUtcIso(date: string, time = "00:00"): string {
  const [y, mo, d] = date.split("-").map(Number);
  const [h, mi] = time.split(":").map(Number);
  return new Date(y ?? NaN, (mo ?? 1) - 1, d ?? NaN, h ?? 0, mi ?? 0).toISOString();
}

/** Midnight at the start of the viewer's local day, as a Date. Used for "today / yesterday" comparisons. */
export function startOfLocalDay(value: TimeInput): Date {
  const d = parseUtc(value);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
