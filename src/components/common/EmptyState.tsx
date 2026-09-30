import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  dashed?: boolean;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  dashed = true,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-xl px-6 py-[72px] text-center",
        dashed && "border border-dashed border-border2",
        className,
      )}
    >
      <div className="grid size-11 place-items-center rounded-full border text-muted-foreground">
        <Icon className="size-5" />
      </div>
      <h2 className="mt-4 mb-0 text-base font-semibold tracking-[-0.01em]">
        {title}
      </h2>
      <p className="mt-1.5 mb-5 max-w-[360px] text-muted-foreground">
        {description}
      </p>
      {action}
    </div>
  );
}
