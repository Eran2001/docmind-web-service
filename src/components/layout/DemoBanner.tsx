"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { routes } from "@/configs/routes";
import { useDemo, useLogout } from "@/queries/auth.queries";

const plural = (n: number, one: string, many: string) =>
  `${n} ${n === 1 ? one : many}`;

/** Ends the demo session (its data belongs to the sandbox) and opens sign-up or sign-in. */
export function useLeaveDemo() {
  const router = useRouter();
  const logout = useLogout();
  return (to: "register" | "login") =>
    logout.mutate(undefined, {
      onSettled: () =>
        router.replace(to === "register" ? routes.register : routes.login),
    });
}

/** Height of the banner. The shell publishes it as `--banner-h` so sticky headers and full-height layouts can sit below it. */
export const DEMO_BANNER_HEIGHT = "2.75rem";

/** A thin strip across the very top of the app (above the sidebar too) for demo visitors: what is left, and the way out. */
export function DemoBanner() {
  const demo = useDemo();
  const leave = useLeaveDemo();
  if (!demo) return null;
  return (
    <div
      role="status"
      style={{ height: DEMO_BANNER_HEIGHT }}
      className="sticky top-0 z-50 flex items-center justify-center gap-x-3 overflow-hidden border-b bg-secondary px-3 text-[13px] whitespace-nowrap sm:gap-x-4"
    >
      <span className="font-medium">
        <span className="hidden sm:inline">You&apos;re trying the demo</span>
        <span className="sm:hidden">Demo</span>
      </span>
      <span className="text-muted-foreground">
        {plural(demo.questionsLeft, "question", "questions")} and{" "}
        {plural(demo.uploadsLeft, "upload", "uploads")} left
      </span>
      <Button
        size="sm"
        onClick={() => leave("register")}
        className="h-7 flex-none px-3 text-[13px]"
      >
        Create free account
      </Button>
    </div>
  );
}
