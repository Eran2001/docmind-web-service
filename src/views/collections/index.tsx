"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Ellipsis,
  FileText,
  Folder,
  FolderPlus,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import type { Collection } from "@/types";

import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { EmptyState } from "@/components/common/EmptyState";
import { CardGridSkeleton } from "@/components/common/Skeletons";
import {
  PageContainer,
  PageHeader,
  PageTitle,
  HEADER_BUTTON,
  HeaderButtonLabel,
} from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { routes } from "@/configs/routes";
import { useDebounce } from "@/hooks/useDebounce";
import { getErrorMessage } from "@/lib/api/errors";
import { cn } from "@/lib/utils";
import {
  useCollections,
  useDeleteCollection,
} from "@/queries/collections.queries";
import { useDemo } from "@/queries/auth.queries";
import { NewCollectionDialog } from "@/views/collections/components/NewCollectionDialog";
import { formatRelative } from "@/utils/format-date";

const NEW_WINDOW_MS = 2 * 60_000;

export function CollectionsView() {
  const [q, setQ] = useState("");
  // The API does the filtering (?search=); wait a moment after the last keystroke instead of asking on every letter.
  const search = useDebounce(q.trim(), 300);
  const { data, isPending, isPlaceholderData, isError, error, refetch } =
    useCollections(search);
  const remove = useDeleteCollection();
  const demo = useDemo(); // demo visitors can't create or delete collections
  const [dialog, setDialog] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Collection | null>(null);
  const [now] = useState(() => Date.now());

  const items = data ?? [];
  const searching = q.trim() !== "";
  const newButton = (
    <Button
      onClick={() => setDialog(true)}
      aria-label="New collection"
      className={HEADER_BUTTON}
    >
      <Plus />
      <HeaderButtonLabel>New collection</HeaderButtonLabel>
    </Button>
  );

  const confirmDelete = () => {
    const target = pendingDelete;
    if (!target) return;
    remove.mutate(target.resourceId, {
      onSuccess: () => {
        toast.success("Collection deleted", {
          description: `“${target.name}” and its documents were removed.`,
        });
        setPendingDelete(null);
      },
      onError: (err) =>
        toast.error("Couldn't delete the collection", {
          description: getErrorMessage(err),
        }),
    });
  };

  return (
    <div className="min-h-screen">
      <PageHeader
        crumbs={[{ label: "Collections" }]}
        actions={demo ? undefined : newButton}
      />
      <PageContainer>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <PageTitle
            title="Collections"
            description="Group related documents so answers only draw from the right sources."
          />
          {!isPending && (items.length > 0 || searching) && (
            <label className="relative flex w-full sm:w-65">
              <Search className="absolute top-3 left-3.5 size-3.5 text-faint" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Filter collections"
                aria-label="Filter collections"
                className="h-9.5 min-w-0 flex-1 rounded-full border border-transparent bg-secondary pr-3.5 pl-9 text-sm outline-none focus:border-ring focus:bg-background focus:ring-[3px] focus:ring-ring/15"
              />
            </label>
          )}
        </div>

        {isPending && <CardGridSkeleton />}

        {isError && (
          <EmptyState
            icon={Folder}
            title="Couldn't load collections"
            description={getErrorMessage(error)}
            action={<Button onClick={() => refetch()}>Try again</Button>}
          />
        )}

        {!isPending && !isError && items.length === 0 && !searching && (
          <EmptyState
            icon={FolderPlus}
            title="No collections yet"
            description="Create a collection, then upload documents to start asking questions."
            action={
              <Button size="lg" onClick={() => setDialog(true)}>
                <Plus />
                New collection
              </Button>
            }
          />
        )}

        {!isPending && !isError && items.length === 0 && searching && (
          <p className="py-12 text-center text-muted-foreground">
            No collections match “{q.trim()}”.
          </p>
        )}

        {items.length > 0 && (
          <div
            className={cn(
              "grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 transition-opacity",
              isPlaceholderData && "opacity-60",
            )}
          >
            {items.map((c) => (
              // The card is a link; the menu button sits on top of it (not inside it, so clicking the menu never opens the collection).
              <div key={c.resourceId} className="relative">
                <Link
                  href={routes.collection(c.resourceId)}
                  className="flex min-h-44 flex-col rounded-xl border bg-background p-5 text-left transition-colors hover:border-border2 hover:bg-surface2"
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="grid size-8 place-items-center rounded-lg bg-secondary text-fg2">
                      <Folder className="size-4" />
                    </div>
                    {now - new Date(c.createdAt).getTime() < NEW_WINDOW_MS && (
                      <span className="mr-9 inline-flex h-5 items-center rounded-full bg-accent-bg px-2 text-[11px] font-medium text-link">
                        New
                      </span>
                    )}
                  </div>
                  <div className="mt-4 text-[15px] font-medium tracking-[-0.01em]">
                    {c.name}
                  </div>
                  <div className="mt-1 line-clamp-2 text-[13px] leading-normal text-muted-foreground">
                    {c.description ?? "No description"}
                  </div>
                  <div className="mt-auto flex items-center gap-1.5 pt-4 text-xs text-muted-foreground">
                    <FileText className="size-3.25" />
                    <span>
                      {c.documentCount === 1
                        ? "1 document"
                        : `${c.documentCount} documents`}
                    </span>
                    <span className="text-faint">·</span>
                    <span>Updated {formatRelative(c.updatedAt)}</span>
                  </div>
                </Link>
                {!demo && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Actions for ${c.name}`}
                        className="absolute top-3.5 right-3.5 size-8 text-muted-foreground focus-visible:ring-0"
                      >
                        <Ellipsis />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem
                        variant="destructive"
                        onSelect={() => setPendingDelete(c)}
                      >
                        <Trash2 /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ))}
          </div>
        )}
      </PageContainer>

      <NewCollectionDialog open={dialog} onOpenChange={setDialog} />

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(open) =>
          !open && !remove.isPending && setPendingDelete(null)
        }
        title="Delete collection?"
        description={
          <>
            <span className="font-medium text-foreground">
              {pendingDelete?.name}
            </span>{" "}
            and its{" "}
            {pendingDelete?.documentCount === 1
              ? "1 document"
              : `${pendingDelete?.documentCount ?? 0} documents`}{" "}
            will be permanently deleted. This can&apos;t be undone.
          </>
        }
        confirmLabel="Delete"
        destructive
        loading={remove.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
