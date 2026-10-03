"use client";

import "@/views/landing/landing.css";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { routes } from "@/configs/routes";
import { getErrorMessage } from "@/lib/api/errors";
import { useStartDemo } from "@/queries/auth.queries";
import { Architecture } from "@/views/landing/sections/Architecture";
import { Citations } from "@/views/landing/sections/Citations";
import { Evals } from "@/views/landing/sections/Evals";
import { FaqCta } from "@/views/landing/sections/FaqCta";
import { FileTypes } from "@/views/landing/sections/FileTypes";
import { FinalCta } from "@/views/landing/sections/FinalCta";
import { Footer } from "@/views/landing/sections/Footer";
import { Header } from "@/views/landing/sections/Header";
import { Hero } from "@/views/landing/sections/Hero";
import { Hybrid } from "@/views/landing/sections/Hybrid";
import { Privacy } from "@/views/landing/sections/Privacy";
import { ProductWindow } from "@/views/landing/sections/ProductWindow";
import { Problem } from "@/views/landing/sections/Problem";
import { useLandingScroll } from "@/views/landing/useLandingScroll";

const subscribeNothing = () => () => {};
/** False while rendering on the server and during hydration, true afterwards (so the theme label can't mismatch). */
const useMounted = () =>
  useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false,
  );

/** Starts a private demo sandbox (the API copies the sample collection into a fresh account) and opens the app. */
function useTryDemo() {
  const router = useRouter();
  const start = useStartDemo();
  const run = () =>
    start.mutate(undefined, {
      onSuccess: () => router.push(routes.collections),
      onError: (err) =>
        toast.error("Couldn't start the demo", {
          description: getErrorMessage(err),
        }),
    });
  return { start: run, pending: start.isPending };
}

export function LandingView() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(0);
  const demo = useTryDemo();
  const mounted = useMounted();
  const { resolvedTheme, setTheme } = useTheme();
  useLandingScroll(rootRef);

  // Anchor links ("How it works", "FAQ") scroll smoothly while this page is open.
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const html = document.documentElement;
    const before = html.style.scrollBehavior;
    html.style.scrollBehavior = "smooth";
    return () => {
      html.style.scrollBehavior = before;
    };
  }, []);

  const dark = mounted && resolvedTheme === "dark";

  return (
    <div
      ref={rootRef}
      data-dm-root=""
      style={{
        background: "var(--bg)",
        color: "var(--fg)",
        minHeight: "100vh",
      }}
    >
      <Header
        themeLabel={dark ? "Switch to light theme" : "Switch to dark theme"}
        toggleTheme={() => setTheme(dark ? "light" : "dark")}
      />
      <main>
        <Hero onDemo={demo.start} demoPending={demo.pending} />
        <ProductWindow />
        <Problem />
        <Hybrid />
        <Architecture />
        <Citations />
        <Evals />
        <FileTypes />
        <Privacy />
        <FaqCta
          open={open}
          toggleFaq={(i) => setOpen((current) => (current === i ? -1 : i))}
        />
        <FinalCta onDemo={demo.start} demoPending={demo.pending} />
      </main>
      <Footer />
    </div>
  );
}
