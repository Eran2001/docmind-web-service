import type { AdminUsageSummary, UsageSummary } from "@/types";

import { privateApi } from "@/lib/api/private.api";

export const usageService = {
  async me(days: number): Promise<UsageSummary> {
    const { data } = await privateApi.get<UsageSummary>("/usage/me", {
      params: { days },
    });
    return data;
  },
  async admin(days: number): Promise<AdminUsageSummary> {
    const { data } = await privateApi.get<AdminUsageSummary>("/admin/usage", {
      params: { days },
    });
    return data;
  },
};
