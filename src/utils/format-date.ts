import {
  formatLocalDate,
  formatLocalDateTime,
  formatLocalMonthDay,
  formatLocalTime,
  parseUtc,
  startOfLocalDay,
} from "@/utils/local-time";

// Display helpers built on local-time.ts: API timestamps are UTC and are shown in the viewer's local time.

const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

export function daysAgo(iso: string, now = Date.now()): number {
  return Math.round((startOfLocalDay(now).getTime() - startOfLocalDay(iso).getTime()) / DAY);
}

// "just now", "2h ago", "yesterday", "3 days ago", "Sep 18"
export function formatRelative(iso: string, now = Date.now()): string {
  const diff = now - parseUtc(iso).getTime();
  if (diff < MIN) return "just now";
  if (diff < HOUR) return `${Math.floor(diff / MIN)}m ago`;
  const d = daysAgo(iso, now);
  if (d === 0) return `${Math.floor(diff / HOUR)}h ago`;
  if (d === 1) return "yesterday";
  if (d < 7) return `${d} days ago`;
  return formatLocalMonthDay(iso);
}

// Compact for the conversation list: "2m", "1h", "2d".
export function formatShortAgo(iso: string, now = Date.now()): string {
  const diff = Math.max(0, now - parseUtc(iso).getTime());
  if (diff < MIN) return "now";
  if (diff < HOUR) return `${Math.floor(diff / MIN)}m`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)}h`;
  return `${Math.floor(diff / DAY)}d`;
}

export function formatDate(iso: string): string {
  return formatLocalDate(iso);
}

export function formatDateTime(iso: string): string {
  return formatLocalDateTime(iso);
}

// "Today, 9:41" for today, otherwise "Sep 24, 2026".
export function formatAdded(iso: string, now = Date.now()): string {
  if (Date.now() - parseUtc(iso).getTime() < 30_000) return "Just now";
  return daysAgo(iso, now) === 0 ? `Today, ${formatLocalTime(iso)}` : formatLocalDate(iso);
}

export function formatDuration(ms: number): string {
  const total = Math.round(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return m > 0 ? `${m}m ${String(s).padStart(2, "0")}s` : `${s}s`;
}

// Takes a calendar day ("2026-09-30", not a timestamp), so it is pinned to local noon to never shift to a neighbouring day.
export function formatChartDate(iso: string, withWeekday = false): string {
  return new Intl.DateTimeFormat("en-US", {
    ...(withWeekday ? { weekday: "short" } : {}),
    month: "short",
    day: "numeric",
  }).format(new Date(`${iso}T12:00:00`));
}

export type ConversationGroup = "Today" | "Previous 7 days" | "Older";

export function conversationGroup(
  iso: string,
  now = Date.now(),
): ConversationGroup {
  const d = daysAgo(iso, now);
  if (d === 0) return "Today";
  if (d < 7) return "Previous 7 days";
  return "Older";
}
