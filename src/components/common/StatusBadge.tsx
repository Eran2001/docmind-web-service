import { CircleAlert, LoaderCircle } from "lucide-react";
import type { DocumentStatus } from "@/types";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const STYLES: Record<DocumentStatus, { label: string; className: string }> = {
  ready: { label: "Ready", className: "bg-ok-bg text-ok" },
  processing: { label: "Processing", className: "bg-warn-bg text-warn" },
  queued: { label: "Queued", className: "bg-secondary text-muted-foreground" },
  failed: {
    label: "Failed",
    className: "bg-err-bg text-destructive cursor-help",
  },
};

export function StatusBadge({
  status,
  error,
}: {
  status: DocumentStatus;
  error?: string | null;
}) {
  const s = STYLES[status];
  const badge = (
    <span
      className={cn(
        "inline-flex h-[22px] items-center gap-1.5 rounded-full px-[9px] text-xs font-medium whitespace-nowrap",
        s.className,
      )}
    >
      {status === "processing" && (
        <LoaderCircle className="size-3 animate-dmspin" strokeWidth={2} />
      )}
      {(status === "ready" || status === "queued") && (
        <span className="size-1.5 rounded-full bg-current" />
      )}
      {status === "failed" && (
        <CircleAlert className="size-3" strokeWidth={2} />
      )}
      {s.label}
    </span>
  );
  if (status !== "failed" || !error) return badge;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" className="inline-flex">
          {badge}
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        align="start"
        className="w-[260px] rounded-[10px] px-3 py-2.5 text-xs leading-[1.45]"
      >
        <span className="mb-0.5 block font-medium">Processing failed</span>
        {error}
      </TooltipContent>
    </Tooltip>
  );
}
