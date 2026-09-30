import { create } from "zustand";

export interface SelectedCitation {
  messageId: string;
  marker: number;
}

interface CitationState {
  selected: SelectedCitation | null;
  panelOpen: boolean | null; // null = follow the layout default until the user toggles
  select: (messageId: string, marker: number) => void;
  togglePanel: (currentlyOpen: boolean) => void;
  closePanel: () => void;
  reset: () => void;
}

export const useCitationStore = create<CitationState>((set) => ({
  selected: null,
  panelOpen: null,
  select: (messageId, marker) =>
    set({ selected: { messageId, marker }, panelOpen: true }),
  togglePanel: (currentlyOpen) => set({ panelOpen: !currentlyOpen }),
  closePanel: () => set({ panelOpen: false }),
  reset: () => set({ selected: null }),
}));
