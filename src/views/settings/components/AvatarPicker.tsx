"use client";

import { useRef } from "react";
import { toast } from "sonner";

import { Spinner } from "@/components/common/Spinner";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/api/errors";
import {
  useMe,
  useRemoveAvatar,
  useUploadAvatar,
} from "@/queries/auth.queries";

const MAX_BYTES = 2 * 1024 * 1024;
const TYPES = ["image/png", "image/jpeg", "image/webp"];

export function AvatarPicker() {
  const { data: user } = useMe();
  const upload = useUploadAvatar();
  const remove = useRemoveAvatar();
  const input = useRef<HTMLInputElement>(null);
  const busy = upload.isPending || remove.isPending;

  const onPick = (file: File | undefined) => {
    if (input.current) input.current.value = ""; // so picking the same file again still fires
    if (!file) return;
    if (!TYPES.includes(file.type)) {
      toast.error("Couldn't use that picture", {
        description: "Use a PNG, JPEG or WebP picture.",
      });
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("Couldn't use that picture", {
        description: "Use a picture of 2 MB or less.",
      });
      return;
    }
    upload.mutate(file, {
      onSuccess: () => toast.success("Avatar updated"),
      onError: (err) =>
        toast.error("Couldn't update avatar", {
          description: getErrorMessage(err),
        }),
    });
  };

  const onRemove = () =>
    remove.mutate(undefined, {
      onSuccess: () => toast.success("Avatar removed"),
      onError: (err) =>
        toast.error("Couldn't remove avatar", {
          description: getErrorMessage(err),
        }),
    });

  return (
    <div className="flex items-center gap-3.5">
      {user ? (
        <UserAvatar user={user} className="size-12 text-[15px]" />
      ) : (
        <Skeleton className="size-12 rounded-full" />
      )}
      <input
        ref={input}
        type="file"
        accept={TYPES.join(",")}
        className="hidden"
        onChange={(e) => onPick(e.target.files?.[0])}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={!user || busy}
        onClick={() => input.current?.click()}
      >
        {upload.isPending && <Spinner />}
        Change avatar
      </Button>
      {user?.hasAvatar && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={busy}
          onClick={onRemove}
        >
          {remove.isPending && <Spinner />}
          Remove
        </Button>
      )}
    </div>
  );
}
