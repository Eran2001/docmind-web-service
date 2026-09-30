import type {
  AdminTopUser,
  AdminUsageSummary,
  UsageByKind,
  UsageSummary,
  UsageTotals,
} from "@docmind/shared";

const BASE_30D_COST = 148.62;
const TOKENS_PER_USD = 38.4e6 / BASE_30D_COST;
const REQUESTS_PER_USD = 12906 / BASE_30D_COST;
const ADMIN_FACTOR = 16.2724;

function isoDay(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// 180 days of deterministic cost, scaled so the most recent 30 days sum to $148.62.
function series(): { date: string; v: number }[] {
  const N = 180;
  const out: { date: Date; v: number }[] = [];
  const today = new Date();
  for (let i = 0; i < N; i++) {
    const d = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - (N - 1 - i),
    );
    const weekend = d.getDay() === 0 || d.getDay() === 6;
    let v =
      3.1 +
      i * 0.011 +
      0.9 * Math.sin(i * 0.63) +
      0.5 * Math.cos(i * 1.7) -
      (weekend ? 1.9 : 0);
    if (i === N - 14) v += 3.6;
    if (i === N - 29) v += 2.2;
    out.push({ date: d, v: Math.max(0.6, v) });
  }
  const last30 = out.slice(-30).reduce((a, p) => a + p.v, 0);
  return out.map((p) => ({
    date: isoDay(p.date),
    v: (p.v * BASE_30D_COST) / last30,
  }));
}

function totalsFor(cost: number, latencyMs: number): UsageTotals {
  return {
    costUsd: cost,
    tokens: Math.round(cost * TOKENS_PER_USD),
    requests: Math.round(cost * REQUESTS_PER_USD),
    avgLatencyMs: latencyMs,
  };
}

const KINDS: [UsageByKind["kind"], number, number, number][] = [
  ["answer", 0.662, 0.54, 0.41],
  ["embed", 0.143, 0.31, 0.38],
  ["judge", 0.133, 0.11, 0.05],
  ["rewrite", 0.062, 0.04, 0.16],
];

export function buildUsage(days: number, admin: boolean): UsageSummary {
  const k = admin ? ADMIN_FACTOR : 1;
  const all = series();
  const current = all.slice(-days).map((p) => ({ date: p.date, v: p.v * k }));
  const prev = all.slice(-days * 2, -days).map((p) => p.v * k);
  const total = current.reduce((a, p) => a + p.v, 0);
  const prevTotal = prev.reduce((a, v) => a + v, 0);
  const totals = totalsFor(total, admin ? 2300 : 2100);
  const previous =
    prev.length === days ? totalsFor(prevTotal, admin ? 2500 : 2300) : null;

  return {
    days,
    totals,
    previous,
    daily: current.map((p) => ({
      date: p.date,
      costUsd: p.v,
      requests: Math.round(p.v * REQUESTS_PER_USD),
    })),
    byKind: KINDS.map(([kind, share, tokShare, reqShare]) => ({
      kind,
      costUsd: total * share,
      tokens: Math.round(totals.tokens * tokShare),
      requests: Math.round(totals.requests * reqShare),
    })),
  };
}

const TOP_USERS: [string, string, number, number, number][] = [
  ["Priya Raman", "priya.raman", 18402, 61.2, 241.8],
  ["Daniel Okafor", "daniel.okafor", 15930, 52.8, 208.44],
  ["Maya Chen", "maya.chen", 12906, 38.4, 148.62],
  ["Lukas Weber", "lukas.weber", 11214, 34.1, 132.05],
  ["Sofia Alvarez", "sofia.alvarez", 9870, 29.6, 117.3],
  ["James Whitfield", "james.whitfield", 8452, 25.0, 98.71],
  ["Aiko Tanaka", "aiko.tanaka", 7733, 22.9, 90.12],
  ["Omar Haddad", "omar.haddad", 6905, 19.8, 78.4],
  ["Chloe Martin", "chloe.martin", 5618, 16.2, 64.08],
  ["Ben Carter", "ben.carter", 4991, 14.3, 56.25],
];

export function buildAdminUsage(days: number): AdminUsageSummary {
  const base = buildUsage(days, true);
  const f = base.totals.costUsd / (BASE_30D_COST * ADMIN_FACTOR);
  const topUsers: AdminTopUser[] = TOP_USERS.map(
    ([name, handle, req, tokM, cost], i) => ({
      id: `user-${i + 1}`,
      name,
      email: `${handle}@acme.com`,
      requests: Math.round(req * f),
      tokens: Math.round(tokM * 1e6 * f),
      costUsd: cost * f,
    }),
  );
  return { ...base, topUsers };
}
