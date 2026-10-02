import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ChangePasswordInput,
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
} from "@/schemas";
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

/** The demo status of the signed-in user (questions and uploads left), or null for a normal account. */
export function useDemo() {
  const { data: user } = useMe();
  return user?.demo ?? null;
}

export function useStartDemo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authService.startDemo,
    onSuccess: (user: User) => qc.setQueryData(queryKeys.auth.me, user),
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

/** The signed-in user's picture, or null when they have none. */
export function useAvatar() {
  const { data: user } = useMe();
  return useQuery({
    queryKey: queryKeys.auth.avatar,
    queryFn: authService.avatar,
    enabled: !!user?.hasAvatar,
    retry: false,
  });
}

function useAvatarChange<TVariables>(
  mutationFn: (v: TVariables) => Promise<void>,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () =>
      Promise.all([
        qc.invalidateQueries({ queryKey: queryKeys.auth.me }),
        qc.invalidateQueries({ queryKey: queryKeys.auth.avatar }),
      ]),
  });
}

export function useUploadAvatar() {
  return useAvatarChange((file: File) => authService.uploadAvatar(file));
}

export function useRemoveAvatar() {
  return useAvatarChange(() => authService.removeAvatar());
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (
      input: Pick<ChangePasswordInput, "currentPassword" | "newPassword">,
    ) => authService.changePassword(input),
  });
}

export function useDeleteAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authService.deleteAccount,
    onSuccess: () => qc.clear(),
  });
}
