import type { ChangePasswordInput, LoginInput, RegisterInput, UpdateProfileInput } from "@/schemas";
import type { User } from "@/types";

import { api } from "@/lib/axios";

export const authService = {
  async me(): Promise<User> {
    const { data } = await api.get<{ user: User }>("/auth/me", {
      skipAuthRefresh: false,
    });
    return data.user;
  },
  async login(input: LoginInput): Promise<User> {
    const { data } = await api.post<{ user: User }>("/auth/login", input, {
      skipAuthRefresh: true,
    });
    return data.user;
  },
  async register(input: RegisterInput): Promise<User> {
    const { data } = await api.post<{ user: User }>("/auth/register", input, {
      skipAuthRefresh: true,
    });
    return data.user;
  },
  async logout(): Promise<void> {
    await api.post("/auth/logout", null, { skipAuthRefresh: true });
  },
  async updateProfile(input: UpdateProfileInput): Promise<User> {
    const { data } = await api.patch<{ user: User }>("/auth/me", input);
    return data.user;
  },
  async changePassword(
    input: Pick<ChangePasswordInput, "currentPassword" | "newPassword">,
  ): Promise<void> {
    await api.post("/auth/change-password", input);
  },
  async deleteAccount(): Promise<void> {
    await api.delete("/auth/me");
  },
};
