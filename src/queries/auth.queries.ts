import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ChangePasswordInput, LoginInput, RegisterInput, UpdateProfileInput } from "@/schemas";
import type { User } from "@/types";

import { queryKeys } from "@/configs/query-keys";
import { hasStoredSession } from "@/lib/api/session";
import { authService } from "@/services/auth.service";

export function useMe() {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: authService.me,
    // No stored session (signed out, or the account was just deleted) means there is nothing to ask the API about.
    enabled: hasStoredSession(),
    retry: false,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: LoginInput) => authService.login(input),
    onSuccess: (user: User) => qc.setQueryData(queryKeys.auth.me, user),
  });
}

export function useRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: RegisterInput) => authService.register(input),
    onSuccess: (user: User) => qc.setQueryData(queryKeys.auth.me, user),
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authService.logout,
    onSettled: () => qc.clear(),
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateProfileInput) => authService.updateProfile(input),
    onSuccess: (user: User) => qc.setQueryData(queryKeys.auth.me, user),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (input: Pick<ChangePasswordInput, "currentPassword" | "newPassword">) =>
      authService.changePassword(input),
  });
}

export function useDeleteAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authService.deleteAccount,
    onSuccess: () => qc.clear(),
  });
}
