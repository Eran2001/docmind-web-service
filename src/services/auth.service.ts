import type {
  ChangePasswordInput,
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
} from "@/schemas";
import type { AuthSession, User } from "@/types";

import { privateApi } from "@/lib/api/private.api";
import { publicApi } from "@/lib/api/public.api";
import { clearSession, setAccessToken } from "@/lib/api/session";
import { clearUserData } from "@/lib/api/user-data";

// Register and login answer with `data: { accessToken, tokenType, expiresIn, user }`. The token is kept here (in a cookie the
// route guard can read) so every caller gets it stored; the user goes back to the caller for the query cache.
function startSession(session: AuthSession): User {
  setAccessToken(session.accessToken);
  return session.user;
}

export const authService = {
  /** Confirms the stored token with the API and returns the signed-in user. */
  async me(): Promise<User> {
    const { data } = await privateApi.get<{ user: User }>("/auth/me");
    return data.user;
  },
  async login(input: LoginInput): Promise<User> {
    const { data } = await publicApi.post<AuthSession>("/auth/login", input);
    return startSession(data);
  },
  /** "Try the demo": the API makes a private sandbox account (a copy of the sample collection) and signs it in. */
  async startDemo(): Promise<User> {
    const { data } = await publicApi.post<AuthSession>("/auth/demo");
    return startSession(data);
  },
  async register(input: RegisterInput): Promise<User> {
    const { data } = await publicApi.post<AuthSession>("/auth/register", input);
    return startSession(data);
  },
  /** Revokes this browser's refresh token on the API, then drops the token here. Signs out locally even if the API is unreachable. */
  async logout(): Promise<void> {
    try {
      await publicApi.post("/auth/logout");
    } finally {
      clearSession();
      clearUserData();
    }
  },
  async updateProfile(input: UpdateProfileInput): Promise<User> {
    const { data } = await privateApi.patch<{ user: User }>("/auth/me", input);
    return data.user;
  },
  /** A URL for <img src> that points at the picture (the API needs the Bearer token to serve it, so it is fetched, then wrapped). */
  async avatar(): Promise<string> {
    const { data } = await privateApi.get<Blob>("/auth/me/avatar", {
      responseType: "blob",
    });
    return URL.createObjectURL(data);
  },
  async uploadAvatar(file: File): Promise<void> {
    const form = new FormData();
    form.append("file", file);
    await privateApi.post("/auth/me/avatar", form);
  },
  async removeAvatar(): Promise<void> {
    await privateApi.delete("/auth/me/avatar");
  },
  async changePassword(
    input: Pick<ChangePasswordInput, "currentPassword" | "newPassword">,
  ): Promise<void> {
    await privateApi.post("/auth/change-password", input);
  },
  async deleteAccount(): Promise<void> {
    await privateApi.delete("/auth/me");
    clearSession();
    clearUserData();
  },
};
