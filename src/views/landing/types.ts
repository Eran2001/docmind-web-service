export interface DemoProps {
  /** "Try the demo": starts a private sandbox account and opens the app. */
  onDemo: () => void;
  demoPending: boolean;
}

export interface FaqProps {
  /** Index of the open FAQ item, or -1 when all are closed. */
  open: number;
  toggleFaq: (index: number) => void;
}
