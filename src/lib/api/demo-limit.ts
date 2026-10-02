import { useDemoStore } from "@/stores/demo.store";

/** The API answers 403 DemoLimitReached when a demo visitor has no questions or uploads left: open the "create an account" dialog. */
export function reportDemoLimit(err: {
  code?: string;
  message?: string;
}): void {
  if (err.code === "DemoLimitReached")
    useDemoStore
      .getState()
      .showLimit(err.message ?? "You've reached the demo limit.");
}
