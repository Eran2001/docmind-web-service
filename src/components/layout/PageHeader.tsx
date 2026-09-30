"use client";

import { PanelLeft } from "lucide-react";

import { Breadcrumbs, type Crumb } from "@/components/layout/Breadcrumbs";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/ui.store";

interface PageHeaderProps {
  crumbs: Crumb[];
  actions?: React.ReactNode;
  sticky?: boolean;
  className?: string;
}

export function PageHeader({
  crumbs,
  actions,
  sticky = true,
  className,
}: PageHeaderProps) {
  const setNavOpen = useUiStore((s) => s.setNavOpen);
  return (
    <header
      className={cn(
        "z-10 flex h-14 flex-none items-center gap-3 border-b bg-background px-[clamp(16px,3vw,24px)]",
        sticky && "sticky top-0",
        className,
      )}
    >
      {/* Below lg only: opens the overlay sidebar. At lg+ the sidebar collapses to an icon rail instead. */}
      <button
        onClick={() => setNavOpen(true)}
        aria-label="Open sidebar"
        className="-ml-1.5 inline-grid size-8 flex-none place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground lg:hidden"
      >
        <PanelLeft className="size-4" />
      </button>
      <Breadcrumbs items={crumbs} className="min-w-0 flex-1" />
      {actions}
    </header>
  );
}

export function PageContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("w-full p-4", className)}>{children}</div>;
}

export function PageTitle({
  title,
  description,
}: {
  title: string;
  description?: React.ReactNode;
}) {
  return (
    <div>
      <h1 className="m-0 text-2xl font-semibold tracking-tight">{title}</h1>
      {description && (
        <p className="mt-1 mb-0 text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
