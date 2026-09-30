const MONTH_DAY = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});
const FULL_DATE = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});
const TIME = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: false,
});

const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

export function daysAgo(iso: string, now = Date.now()): number {
  return Math.round(
    (startOfDay(new Date(now)) - startOfDay(new Date(iso))) / DAY,
  );
}

// "just now", "2h ago", "yesterday", "3 days ago", "Sep 18"
export function formatRelative(iso: string, now = Date.now()): string {
  const diff = now - new Date(iso).getTime();
  if (diff < MIN) return "just now";
  if (diff < HOUR) return `${Math.floor(diff / MIN)}m ago`;
  const d = daysAgo(iso, now);
  if (d === 0) return `${Math.floor(diff / HOUR)}h ago`;
  if (d === 1) return "yesterday";
  if (d < 7) return `${d} days ago`;
  return MONTH_DAY.format(new Date(iso));
}

// Compact for the conversation list: "2m", "1h", "2d".
export function formatShortAgo(iso: string, now = Date.now()): string {
  const diff = Math.max(0, now - new Date(iso).getTime());
  if (diff < MIN) return "now";
  if (diff < HOUR) return `${Math.floor(diff / MIN)}m`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)}h`;
  return `${Math.floor(diff / DAY)}d`;
}

export function formatDate(iso: string): string {
  return FULL_DATE.format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return `${FULL_DATE.format(new Date(iso))} · ${TIME.format(new Date(iso))}`;
}

// "Today, 9:41" for today, otherwise "Sep 24, 2026".
export function formatAdded(iso: string, now = Date.now()): string {
  if (Date.now() - new Date(iso).getTime() < 30_000) return "Just now";
  return daysAgo(iso, now) === 0
    ? `Today, ${TIME.format(new Date(iso))}`
    : FULL_DATE.format(new Date(iso));
}

export function formatDuration(ms: number): string {
  const total = Math.round(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return m > 0 ? `${m}m ${String(s).padStart(2, "0")}s` : `${s}s`;
}

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
