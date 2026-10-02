import { create } from "zustand";

interface DemoState {
  /** Set when the API says a demo visitor used up their questions or upload; the dialog shows it. */
  limitMessage: string | null;
  showLimit: (message: string) => void;
  closeLimit: () => void;
}

export const useDemoStore = create<DemoState>((set) => ({
  limitMessage: null,
  showLimit: (limitMessage) => set({ limitMessage }),
  closeLimit: () => set({ limitMessage: null }),
}));
