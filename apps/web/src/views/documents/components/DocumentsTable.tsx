"use client";

import { useState } from "react";
import { Ellipsis, FileText, RefreshCw, Trash2, Upload } from "lucide-react";
import type { DocumentDto } from "@docmind/shared";

import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { DocIcon } from "@/components/common/DocIcon";
import { EmptyState } from "@/components/common/EmptyState";
import { Bone } from "@/components/common/Skeletons";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { documentTypeLabel } from "@/utils/documents";
import { formatAdded } from "@/utils/format-date";

interface Props {
  documents: DocumentDto[] | undefined;
  loading: boolean;
  onReprocess: (doc: DocumentDto) => void;
  onDelete: (doc: DocumentDto) => Promise<unknown>;
  onBrowse: () => void;
}

const mono = "font-mono text-[13px]";

export function DocumentsTable({
  documents,
  loading,
  onReprocess,
  onDelete,
  onBrowse,
}: Props) {
  const [pendingDelete, setPendingDelete] = useState<DocumentDto | null>(null);
  const [deleting, setDeleting] = useState(false);
  const docs = documents ?? [];

  return (
    <div className="relative overflow-hidden rounded-xl border">
      <Table className="min-w-[820px]">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Title</TableHead>
            <TableHead className="w-20">Type</TableHead>
            <TableHead className="w-[140px]">Status</TableHead>
            <TableHead className="w-20 text-right">Chunks</TableHead>
            <TableHead className="w-[72px] text-right">Pages</TableHead>
            <TableHead className="w-[120px]">Added</TableHead>
            <TableHead aria-label="Actions" className="w-[52px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading &&
            [52, 38, 46, 60, 34, 44].map((w, i) => (
              <TableRow key={i} className="animate-dmpulse">
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Bone className="size-7 rounded-[7px]" />
                    <Bone className="h-3" style={{ width: `${w}%` }} />
                  </div>
                </TableCell>
                <TableCell>
                  <Bone className="h-3 w-9" />
                </TableCell>
                <TableCell>
                  <Bone className="h-5 w-[72px] rounded-full" />
                </TableCell>
                <TableCell>
                  <Bone className="ml-auto h-3 w-8" />
                </TableCell>
                <TableCell>
                  <Bone className="ml-auto h-3 w-6" />
                </TableCell>
                <TableCell>
                  <Bone className="h-3 w-16" />
                </TableCell>
                <TableCell />
              </TableRow>
            ))}

          {docs.map((d) => {
            const type = documentTypeLabel(d);
            return (
              <TableRow key={d.id} className="animate-dmin">
                <TableCell className="py-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className="grid size-7 flex-none place-items-center rounded-[7px] bg-secondary text-fg2">
                      <DocIcon type={type} className="size-[15px]" />
                    </div>
                    <span className="max-w-[340px] truncate font-medium">
                      {d.title}
                    </span>
                  </div>
                </TableCell>
                <TableCell
                  className={cn("text-xs text-muted-foreground", "font-mono")}
                >
                  {type}
                </TableCell>
                <TableCell>
                  <StatusBadge status={d.status} error={d.errorMessage} />
                </TableCell>
                <TableCell
                  className={cn(
                    "text-right",
                    mono,
                    d.chunkCount ? "text-fg2" : "text-faint",
                  )}
                >
                  {d.chunkCount ? d.chunkCount.toLocaleString() : "—"}
                </TableCell>
                <TableCell
                  className={cn(
                    "text-right",
                    mono,
                    d.pageCount ? "text-fg2" : "text-faint",
                  )}
                >
                  {d.pageCount ?? "—"}
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {formatAdded(d.createdAt)}
                </TableCell>
                <TableCell className="px-2.5 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Document actions"
                        className="size-[30px] text-muted-foreground"
                      >
                        <Ellipsis />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[180px]">
                      <DropdownMenuItem
                        onSelect={() => onReprocess(d)}
                        disabled={
                          d.status === "queued" || d.status === "processing"
                        }
                      >
                        <RefreshCw /> Reprocess
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onSelect={() => setPendingDelete(d)}
                      >
                        <Trash2 /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {!loading && docs.length === 0 && (
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
      )}

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
    </div>
  );
}
