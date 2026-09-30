import { MOCK_DB_STORAGE_KEY } from "@/configs/constants";
import { useChatStore } from "@/stores/chat.store";
import { useCitationStore } from "@/stores/citation.store";

/**
 * Forgets everything that belongs to the signed-in user, so the next person on this browser starts clean:
 * the mock database in localStorage (it holds the mock user's collections and chats) and the in-memory chat/citation state.
 * (The TanStack Query cache is cleared by the caller, and the token cookie by clearSession.)
 * Theme and sidebar preferences are not user data and are left alone.
 */
export function clearUserData(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(MOCK_DB_STORAGE_KEY);
    window.localStorage.removeItem("docmind.mock.v2"); // the previous format (entities were keyed by `id`)
  } catch {
    // storage blocked: nothing was stored
  }
  useChatStore.getState().reset();
  useCitationStore.getState().reset();
  // The mock also keeps a copy in memory; drop it too (loaded lazily so the mock never lands in the main bundle).
  void import("@/lib/mock/db").then((m) => m.resetDb());
}
