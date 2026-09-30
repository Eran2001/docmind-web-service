"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "light", label: "Light theme", Icon: Sun },
  { value: "dark", label: "Dark theme", Icon: Moon },
] as const;

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { resolvedTheme, setTheme } = useTheme();
  // false on the server / first render, true after hydration, so the active state matches SSR.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (compact) {
    const dark = mounted && resolvedTheme === "dark";
    const Icon = dark ? Sun : Moon;
    return (
      <button
        onClick={() => setTheme(dark ? "light" : "dark")}
        aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
        className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <Icon className="size-4" />
      </button>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="flex gap-0.5 rounded-full bg-secondary p-0.5"
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const on = mounted && resolvedTheme === value;
        return (
          <button
            key={value}
            role="radio"
            aria-checked={on}
            aria-label={label}
            onClick={() => setTheme(value)}
            className={cn(
              "grid h-6 w-7 place-items-center rounded-full transition-colors",
              on
                ? "bg-background text-foreground shadow-[0_1px_2px_rgba(0,0,0,.08)]"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-3.5" />
          </button>
        );
      })}
    </div>
  );
}
