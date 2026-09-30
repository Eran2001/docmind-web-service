"use client";

import { useRef } from "react";
import Link from "next/link";
import { FolderX, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import type { DocumentDto } from "@/types";

import { EmptyState } from "@/components/common/EmptyState";
import { Bone, SkeletonLine } from "@/components/common/Skeletons";
import {
  PageContainer,
  PageHeader,
  PageTitle,
} from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { routes } from "@/configs/routes";
import { getErrorMessage } from "@/lib/axios";
import { useCollection } from "@/queries/collections.queries";
import {
  useDeleteDocument,
  useDocuments,
  useReprocessDocument,
} from "@/queries/documents.queries";
import { DocumentsTable } from "@/views/documents/components/DocumentsTable";
import {
  AddUrlForm,
  Dropzone,
  useUploadHandlers,
} from "@/views/documents/components/UploadControls";

export function DocumentsView({ collectionId }: { collectionId: string }) {
  const collection = useCollection(collectionId);
  const documents = useDocuments(collectionId);
  const reprocess = useReprocessDocument(collectionId);
  const remove = useDeleteDocument(collectionId);
  const handlers = useUploadHandlers(collectionId);
  const fileInput = useRef<HTMLInputElement>(null);

  const name = collection.data?.name;
  const docs = documents.data ?? [];

  if (collection.isSuccess && !collection.data) {
    return (
      <div className="min-h-screen">
        <PageHeader
          crumbs={[
            { label: "Collections", href: routes.collections },
            { label: "Not found" },
          ]}
        />
        <PageContainer>
          <EmptyState
            icon={FolderX}
            title="Collection not found"
            description="It may have been deleted, or you don't have access to it."
            action={
              <Button asChild size="lg">
                <Link href={routes.collections}>Back to collections</Link>
              </Button>
            }
          />
        </PageContainer>
      </div>
    );
  }

  const count = (s: DocumentDto["status"]) =>
    docs.filter((d) => d.status === s).length;
  const summary = (["ready", "processing", "queued", "failed"] as const)
    .filter((s) => count(s) > 0)
    .map((s) => `${count(s)} ${s}`)
    .join(" · ");
  const chunks = docs.reduce((a, d) => a + d.chunkCount, 0);
  const pages = docs.reduce((a, d) => a + (d.pageCount ?? 0), 0);

  return (
    <div className="min-h-screen">
      <PageHeader
        crumbs={[
          { label: "Collections", href: routes.collections },
          { label: name ?? "…" },
        ]}
        actions={
          <Button asChild className="flex-none">
            <Link href={routes.chat(collectionId)}>
              <MessageSquare />
              Open chat
            </Link>
          </Button>
        }
      />
      <PageContainer>
        {collection.isPending ? (
          <div aria-busy="true" className="animate-dmpulse">
            <div className="text-2xl">
              <SkeletonLine className="h-5 w-56" />
            </div>
            <div className="mt-1">
              <SkeletonLine className="w-96 max-w-full" />
              <div className="sm:hidden">
                <SkeletonLine className="w-2/3" />
              </div>
            </div>
          </div>
        ) : (
          <PageTitle
            title={name ?? " "}
            description={collection.data?.description}
          />
        )}
        <div className="mt-3 flex flex-wrap gap-4 font-mono text-[13px] text-muted-foreground">
          {documents.isPending ? (
            <div className="flex h-lh animate-dmpulse items-center gap-4">
              <Bone className="h-2.5 w-20" />
              <Bone className="h-2.5 w-20" />
              <Bone className="h-2.5 w-16" />
            </div>
          ) : (
            <>
              <span>{docs.length} documents</span>
              <span>{chunks.toLocaleString()} chunks</span>
              <span>{pages} pages</span>
            </>
          )}
        </div>

        <div className="mt-7 flex flex-col gap-3">
          <Dropzone handlers={handlers} inputRef={fileInput} />
          <AddUrlForm handlers={handlers} />
        </div>

        <div className="mt-9 mb-3 flex items-center justify-between">
          <h2 className="m-0 text-[15px] font-semibold tracking-[-0.01em]">
            Documents
          </h2>
          {docs.length > 0 && (
            <span className="text-[13px] text-muted-foreground">{summary}</span>
          )}
        </div>

        {documents.isError ? (
          <EmptyState
            icon={FolderX}
            title="Couldn't load documents"
            description={getErrorMessage(documents.error)}
            action={
              <Button onClick={() => documents.refetch()}>Try again</Button>
            }
          />
        ) : (
          <DocumentsTable
            documents={documents.data}
            loading={documents.isPending}
            expectedCount={collection.data?.documentCount}
            onBrowse={() => fileInput.current?.click()}
            onReprocess={(d) =>
              reprocess.mutate(d.id, {
                onSuccess: () =>
                  toast.info("Reprocessing", {
                    description: `${d.title} was added to the processing queue.`,
                  }),
                onError: (err) =>
                  toast.error("Something went wrong", {
                    description: getErrorMessage(err),
                  }),
              })
            }
            onDelete={(d) =>
              remove
                .mutateAsync(d.id)
                .then(() =>
                  toast.success("Document deleted", {
                    description: `${d.title} and its ${d.chunkCount} chunks were removed.`,
                  }),
                )
                .catch((err) =>
                  toast.error("Something went wrong", {
                    description: getErrorMessage(err),
                  }),
                )
            }
          />
        )}
      </PageContainer>
    </div>
  );
}
