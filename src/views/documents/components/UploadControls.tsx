"use client";

import { useState } from "react";
import { Link as LinkIcon, Upload } from "lucide-react";
import { toast } from "sonner";

import { Spinner } from "@/components/common/Spinner";
import { Button } from "@/components/ui/button";
import {
  UPLOAD_ACCEPT,
  UPLOAD_EXTENSIONS,
  UPLOAD_MAX_BYTES,
} from "@/configs/constants";
import { getErrorMessage, normalizeError } from "@/lib/api/errors";
import { cn } from "@/lib/utils";
import { useAddUrl, useUploadDocument } from "@/queries/documents.queries";
import { addUrlSchema } from "@/schemas/collection.schema";
import { formatBytes } from "@/utils/format-bytes";

const ERROR_TITLES: Record<string, string> = {
  DUPLICATE_DOCUMENT: "Already in this collection",
  LIMIT_REACHED: "Collection is full",
  URL_FETCH_FAILED: "Couldn't fetch URL",
};

export function useUploadHandlers(collectionId: string) {
  const upload = useUploadDocument(collectionId);
  const addUrl = useAddUrl(collectionId);

  const uploadFiles = async (files: FileList | File[] | null) => {
    const list = Array.from(files ?? []);
    const valid = list.filter((f) => {
      const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
      if (!(UPLOAD_EXTENSIONS as readonly string[]).includes(ext)) {
        toast.error("Unsupported file type", {
          description: `${f.name} isn't supported. Upload PDF, DOCX, TXT or MD.`,
        });
        return false;
      }
      if (f.size > UPLOAD_MAX_BYTES) {
        toast.error("File too large", {
          description: `${f.name} is ${formatBytes(f.size)}. The limit is 20 MB.`,
        });
        return false;
      }
      return true;
    });
    await Promise.all(
      valid.map((f) =>
        upload.mutateAsync(f).catch((err: unknown) => {
          const e = normalizeError(err);
          toast.error(ERROR_TITLES[e.code] ?? "Upload failed", {
            description: e.message,
          });
        }),
      ),
    );
  };

  const submitUrl = async (raw: string): Promise<boolean> => {
    const parsed = addUrlSchema.safeParse({ url: raw });
    if (!parsed.success) {
      toast.error("Invalid URL", {
        description: "Enter a full URL starting with https://",
      });
      return false;
    }
    try {
      await addUrl.mutateAsync(parsed.data.url);
      return true;
    } catch (err) {
      const e = normalizeError(err);
      toast.error(ERROR_TITLES[e.code] ?? "Something went wrong", {
        description: getErrorMessage(err),
      });
      return false;
    }
  };

  return {
    uploadFiles,
    uploading: upload.isPending,
    submitUrl,
    addingUrl: addUrl.isPending,
  };
}

type Handlers = ReturnType<typeof useUploadHandlers>;

export function Dropzone({
  handlers,
  inputRef,
}: {
  handlers: Handlers;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const [drag, setDrag] = useState(false);
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) =>
        (e.key === "Enter" || e.key === " ") && inputRef.current?.click()
      }
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        void handlers.uploadFiles(e.dataTransfer.files);
      }}
      className={cn(
        "flex cursor-pointer flex-col items-center gap-2.5 rounded-xl border-[1.5px] border-dashed px-5 py-7 text-center transition-colors hover:border-faint",
        drag ? "border-foreground bg-secondary" : "border-border2 bg-surface2",
      )}
    >
      <div className="grid size-10 place-items-center rounded-full border bg-background text-fg2">
        {handlers.uploading ? <Spinner /> : <Upload className="size-[18px]" />}
      </div>
      <div className="text-sm font-medium">
        {drag
          ? "Release to upload"
          : handlers.uploading
            ? "Uploading…"
            : "Upload documents"}
      </div>
      <div className="text-[13px] text-muted-foreground">
        Drop PDF, DOCX, TXT or MD — max 20 MB · or{" "}
        <span className="text-link">browse files</span>
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={UPLOAD_ACCEPT}
        className="hidden"
        onChange={(e) => {
          void handlers.uploadFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}

export function AddUrlForm({ handlers }: { handlers: Handlers }) {
  const [url, setUrl] = useState("");
  const disabled = !url.trim() || handlers.addingUrl;
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (disabled) return;
        if (await handlers.submitUrl(url)) setUrl("");
      }}
      className="flex items-center gap-2"
    >
      <label className="relative flex min-w-0 flex-1">
        <LinkIcon className="absolute top-3 left-3.5 size-3.5 text-faint" />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://docs.acme.com/benefits"
          aria-label="Add URL"
          className="h-[38px] min-w-0 flex-1 rounded-full border border-transparent bg-secondary pr-4 pl-9 text-sm outline-none focus:border-ring focus:bg-background focus:ring-[3px] focus:ring-ring/15"
        />
      </label>
      <Button
        type="submit"
        variant="outline"
        size="lg"
        disabled={disabled}
        className="h-[38px] flex-none"
      >
        {handlers.addingUrl && <Spinner className="size-3.5" />}
        Add URL
      </Button>
    </form>
  );
}
