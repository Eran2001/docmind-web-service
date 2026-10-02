import { useMutation, useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/configs/query-keys";
import { usageService } from "@/services/usage.service";

export function useUsage(days: number) {
  return useQuery({
    queryKey: queryKeys.usage.me(days),
    queryFn: () => usageService.me(days),
    placeholderData: (prev) => prev,
  });
}

export function useAdminUsage(days: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.usage.admin(days),
    queryFn: () => usageService.admin(days),
    placeholderData: (prev) => prev,
    enabled,
  });
}

export function useExportUsage() {
  return useMutation({
    mutationFn: ({ days, admin }: { days: number; admin: boolean }) =>
      usageService.exportMine(days, admin),
  });
}
