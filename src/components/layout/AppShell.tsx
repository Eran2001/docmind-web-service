"use client";

import { useEffect } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { DEMO_BANNER_HEIGHT, DemoBanner } from "@/components/layout/DemoBanner";
import { DemoLimitDialog } from "@/components/layout/DemoLimitDialog";
import { Sidebar } from "@/components/layout/Sidebar";
import { useDemo } from "@/queries/auth.queries";
import { useIsDesktop } from "@/hooks/useMediaQuery";
import { setSidebarCollapsed } from "@/lib/sidebar";
import { useUiStore } from "@/stores/ui.store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const navOpen = useUiStore((s) => s.navOpen);
  const setNavOpen = useUiStore((s) => s.setNavOpen);
  const isDesktop = useIsDesktop();
  const demo = useDemo();

  // Growing into desktop width: the overlay sidebar auto-closes (the docked one takes over).
  useEffect(() => {
    if (isDesktop) setNavOpen(false);
  }, [isDesktop, setNavOpen]);

  return (
    <div
      style={
        {
          "--banner-h": demo ? DEMO_BANNER_HEIGHT : "0px",
        } as React.CSSProperties
      }
    >
      <DemoBanner />
      <div className="flex min-h-[calc(100vh-var(--banner-h))]">
        {/* Both layouts are rendered; CSS (html[data-sidebar]) picks one, so a remembered collapse shows on first paint. */}
        <aside className="sticky top-[var(--banner-h)] hidden h-[calc(100vh-var(--banner-h))] w-60 flex-none overflow-hidden border-r transition-[width] duration-200 lg:block sidebar-collapsed:w-14">
          <div className="h-full sidebar-collapsed:hidden">
            <Sidebar onClose={() => setSidebarCollapsed(true)} />
          </div>
          <div className="hidden h-full sidebar-collapsed:block">
            <Sidebar collapsed onExpand={() => setSidebarCollapsed(false)} />
          </div>
        </aside>

        <Sheet open={navOpen} onOpenChange={setNavOpen}>
          <SheetContent
            side="left"
            showCloseButton={false}
            className="w-60 gap-0 p-0 sm:max-w-60 lg:hidden"
          >
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <SheetDescription className="sr-only">
              Main navigation menu
            </SheetDescription>
            <Sidebar
              onNavigate={() => setNavOpen(false)}
              onClose={() => setNavOpen(false)}
            />
          </SheetContent>
        </Sheet>

        <main className="flex min-w-0 flex-1 flex-col">{children}</main>
        <DemoLimitDialog />
      </div>
    </div>
  );
}
