"use client";

import { useState } from "react";
import { Ellipsis, FileText, RefreshCw, Trash2, Upload } from "lucide-react";
import type { DocumentDto } from "@/types";

import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { DataGrid, type DataGridColumn } from "@/components/common/DataGrid";
import { DocIcon } from "@/components/common/DocIcon";
import { EmptyState } from "@/components/common/EmptyState";
import { Bone } from "@/components/common/Skeletons";
import { StatusBadge } from "@/components/common/StatusBadge";
import { TruncatedText } from "@/components/common/TruncatedText";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { documentTypeLabel } from "@/utils/documents";
import { formatAdded } from "@/utils/format-date";

interface Props {
  documents: DocumentDto[] | undefined;
  loading: boolean;
  onReprocess: (doc: DocumentDto) => void;
  onDelete: (doc: DocumentDto) => Promise<unknown>;
  onBrowse: () => void;
  /** Placeholder rows while loading (the collection's document count, when known). */
  expectedCount?: number;
}

const mono = "font-mono text-[13px]";
const TITLE_WIDTHS = [52, 38, 46, 60, 34, 44];

export function DocumentsTable({
  documents,
  loading,
  onReprocess,
  onDelete,
  onBrowse,
  expectedCount,
}: Props) {
  const [pendingDelete, setPendingDelete] = useState<DocumentDto | null>(null);
  const [deleting, setDeleting] = useState(false);
  const docs = documents ?? [];

  const columns: DataGridColumn<DocumentDto>[] = [
    {
      key: "title",
      header: "Title",
      primary: true,
      cellClassName: "py-3",
      skeleton: (i) => (
        <div className="flex items-center gap-2.5">
          <Bone className="size-7 rounded-[7px]" />
          <Bone className="h-3" style={{ width: `${TITLE_WIDTHS[i % TITLE_WIDTHS.length]}%` }} />
        </div>
      ),
      cell: (d) => (
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="grid size-7 flex-none place-items-center rounded-[7px] bg-secondary text-fg2">
            <DocIcon type={documentTypeLabel(d)} className="size-[15px]" />
          </div>
          <TruncatedText className="max-w-[340px] font-medium">{d.title}</TruncatedText>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      headClassName: "w-20",
      cellClassName: "font-mono text-xs text-muted-foreground",
      skeletonClassName: "w-9",
      cell: (d) => documentTypeLabel(d),
    },
    {
      key: "status",
      header: "Status",
      headClassName: "w-[140px]",
      skeleton: () => (
        <div className="flex h-6 items-center">
          <Bone className="h-5 w-[72px] rounded-full" />
        </div>
      ),
      cell: (d) => <StatusBadge status={d.status} error={d.errorMessage} />,
    },
    {
      key: "chunks",
      header: "Chunks",
      align: "right",
      headClassName: "w-20",
      skeletonClassName: "w-8",
      cell: (d) => (
        <span className={cn(mono, d.chunkCount ? "text-fg2" : "text-faint")}>
          {d.chunkCount ? d.chunkCount.toLocaleString() : "—"}
        </span>
      ),
    },
    {
      key: "pages",
      header: "Pages",
      align: "right",
      headClassName: "w-[72px]",
      skeletonClassName: "w-6",
      cell: (d) => (
        <span className={cn(mono, d.pageCount ? "text-fg2" : "text-faint")}>{d.pageCount ?? "—"}</span>
      ),
    },
    {
      key: "added",
      header: "Added",
      headClassName: "w-[120px]",
      cellClassName: "whitespace-nowrap text-muted-foreground",
      skeletonClassName: "w-16",
      cell: (d) => formatAdded(d.createdAt),
    },
    {
      key: "actions",
      header: "",
      corner: true,
      headClassName: "w-[52px]",
      cellClassName: "px-2.5 text-right",
      skeleton: () => <div className="h-[30px]" />,
      cell: (d) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Document actions" className="size-[30px] text-muted-foreground">
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px]">
            <DropdownMenuItem
              onSelect={() => onReprocess(d)}
              disabled={d.status === "queued" || d.status === "processing"}
            >
              <RefreshCw /> Reprocess
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onSelect={() => setPendingDelete(d)}>
              <Trash2 /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <DataGrid
        columns={columns}
        rows={docs}
        rowKey={(d) => d.id}
        loading={loading}
        skeletonCount={expectedCount || TITLE_WIDTHS.length}
        tableClassName="min-w-[820px]"
        empty={
          <EmptyState
            icon={FileText}
            title="No documents yet"
            description="Upload files or add a URL. Documents are chunked and indexed automatically."
            dashed={false}
            className="py-14"
            action={
              <Button size="lg" onClick={onBrowse}>
                <Upload />
                Upload documents
              </Button>
            }
          />
        }
      />

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete document?"
        description={
          <>
            <span className="font-medium text-foreground">
              {pendingDelete?.title}
            </span>{" "}
            and its {pendingDelete?.chunkCount ?? 0} chunks will be permanently
            removed.
          </>
        }
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={async () => {
          if (!pendingDelete) return;
          setDeleting(true);
          try {
            await onDelete(pendingDelete);
          } finally {
            setDeleting(false);
            setPendingDelete(null);
          }
        }}
      />
    </>
  );
}
