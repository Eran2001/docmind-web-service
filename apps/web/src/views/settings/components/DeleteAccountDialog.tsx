"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CONFIRM_WORD = "DELETE";

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading: boolean;
  onConfirm: () => void;
}

export function DeleteAccountDialog({ open, onOpenChange, loading, onConfirm }: DeleteAccountDialogProps) {
  const [text, setText] = useState("");
  const ready = text === CONFIRM_WORD;

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setText("");
        onOpenChange(next);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete your account?</AlertDialogTitle>
          <AlertDialogDescription>
            This can&apos;t be undone. All your conversations and feedback will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px]">
            Type <span className="font-mono font-semibold">{CONFIRM_WORD}</span> to confirm
          </span>
          <Input
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoComplete="off"
            className="font-mono focus-visible:border-destructive focus-visible:ring-destructive/20"
          />
        </label>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancel</Button>
          </AlertDialogCancel>
          <Button variant="destructive" disabled={!ready || loading} onClick={onConfirm}>
            {loading && <LoaderCircle className="animate-dmspin" />}
            Delete account
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
