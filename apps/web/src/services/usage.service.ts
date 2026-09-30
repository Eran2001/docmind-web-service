import type { AdminUsageSummary, UsageSummary } from "@docmind/shared";

import { api } from "@/lib/axios";

export const usageService = {
  async me(days: number): Promise<UsageSummary> {
    const { data } = await api.get<UsageSummary>("/usage/me", {
      params: { days },
    });
    return data;
  },
  async admin(days: number): Promise<AdminUsageSummary> {
    const { data } = await api.get<AdminUsageSummary>("/admin/usage", {
      params: { days },
    });
    return data;
  },
};
