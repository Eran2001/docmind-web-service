import type { AdminUsageSummary, UsageSummary } from "@/types";

import { privateApi } from "@/lib/api/private.api";

export const usageService = {
  async me(days: number): Promise<UsageSummary> {
    const { data } = await privateApi.get<UsageSummary>("/usage/me", {
      params: { days },
    });
    return data;
  },
  /** The CSV file itself (one row per model call; everyone's for admins), not the JSON envelope. */
  async exportMine(days: number, admin = false): Promise<string> {
    const { data } = await privateApi.get<string>(
      admin ? "/admin/usage/export" : "/usage/me/export",
      {
        params: { days },
        responseType: "text",
        // Success is a CSV (keep it as text); a failure is still the JSON error envelope.
        transformResponse: (body: string, headers) =>
          String(headers["content-type"] ?? "").includes("json")
            ? JSON.parse(body)
            : body,
      },
    );
    return data;
  },
  async admin(days: number): Promise<AdminUsageSummary> {
    const { data } = await privateApi.get<AdminUsageSummary>("/admin/usage", {
      params: { days },
    });
    return data;
  },
};
