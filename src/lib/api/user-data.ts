import { useChatStore } from "@/stores/chat.store";
import { useCitationStore } from "@/stores/citation.store";

// Keys the old in-browser mock database used. It no longer exists; this only clears what an earlier version left behind.
const LEGACY_MOCK_KEYS = ["docmind.mock.v2", "docmind.mock.v3"];

/**
 * Forgets everything that belongs to the signed-in user, so the next person on this browser starts clean:
 * the in-memory chat/citation state (and any leftovers of the old mock database in localStorage).
 * (The TanStack Query cache is cleared by the caller, and the token cookie by clearSession.)
 * Theme and sidebar preferences are not user data and are left alone.
 */
export function clearUserData(): void {
  if (typeof window === "undefined") return;
  try {
    for (const key of LEGACY_MOCK_KEYS) window.localStorage.removeItem(key);
  } catch {
    // storage blocked: nothing was stored
  }
  useChatStore.getState().reset();
  useCitationStore.getState().reset();
}
