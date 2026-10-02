import { create } from "zustand";

interface UiState {
  /** Below lg: the sidebar overlay is open. (The docked sidebar's collapsed state lives in lib/sidebar.ts.) */
  navOpen: boolean;
  setNavOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  navOpen: false,
  setNavOpen: (navOpen) => set({ navOpen }),
}));
