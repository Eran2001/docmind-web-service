"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Folder, FolderPlus, Plus, Search } from "lucide-react";

import { CardGridSkeleton } from "@/components/common/Skeletons";
import { EmptyState } from "@/components/common/EmptyState";
import { PageContainer, PageHeader, PageTitle, HEADER_BUTTON, HeaderButtonLabel } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { routes } from "@/configs/routes";
import { getErrorMessage } from "@/lib/api/errors";
import { useCollections } from "@/queries/collections.queries";
import { NewCollectionDialog } from "@/views/collections/components/NewCollectionDialog";
import { formatRelative } from "@/utils/format-date";

const NEW_WINDOW_MS = 2 * 60_000;

export function CollectionsView() {
  const { data, isPending, isError, error, refetch } = useCollections();
  const [dialog, setDialog] = useState(false);
  const [q, setQ] = useState("");
  const [now] = useState(() => Date.now());

  const items = data ?? [];
  const filter = q.trim().toLowerCase();
  const visible = items.filter(
    (c) => !filter || c.name.toLowerCase().includes(filter),
  );
  const newButton = (
    <Button onClick={() => setDialog(true)} aria-label="New collection" className={HEADER_BUTTON}>
      <Plus />
      <HeaderButtonLabel>New collection</HeaderButtonLabel>
    </Button>
  );

  return (
    <div className="min-h-screen">
      <PageHeader crumbs={[{ label: "Collections" }]} actions={newButton} />
      <PageContainer>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <PageTitle
            title="Collections"
            description="Group related documents so answers only draw from the right sources."
          />
          {!isPending && items.length > 0 && (
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

        {!isPending && !isError && items.length === 0 && (
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

        {items.length > 0 && (
          <>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
              {visible.map((c) => (
                <Link
                  key={c.id}
                  href={routes.collection(c.id)}
                  className="flex min-h-44 flex-col rounded-xl border bg-background p-5 text-left transition-colors hover:border-border2 hover:bg-surface2"
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="grid size-8 place-items-center rounded-lg bg-secondary text-fg2">
                      <Folder className="size-4" />
                    </div>
                    {now - new Date(c.createdAt).getTime() < NEW_WINDOW_MS && (
                      <span className="inline-flex h-5 items-center rounded-full bg-accent-bg px-2 text-[11px] font-medium text-link">
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
              ))}
            </div>
            {visible.length === 0 && (
              <p className="py-12 text-center text-muted-foreground">
                No collections match “{q}”.
              </p>
            )}
          </>
        )}
      </PageContainer>

      <NewCollectionDialog open={dialog} onOpenChange={setDialog} />
    </div>
  );
}
