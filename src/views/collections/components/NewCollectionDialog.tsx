"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Spinner } from "@/components/common/Spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/lib/api/errors";
import { useCreateCollection } from "@/queries/collections.queries";
import {
  createCollectionSchema,
  type CreateCollectionInput,
} from "@/schemas/collection.schema";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewCollectionDialog({ open, onOpenChange }: Props) {
  const create = useCreateCollection();
  const form = useForm<CreateCollectionInput>({
    resolver: zodResolver(createCollectionSchema),
    defaultValues: { name: "", description: "" },
  });
  const name = useWatch({ control: form.control, name: "name" });

  const onSubmit = form.handleSubmit((values) => {
    create.mutate(values, {
      onSuccess: () => {
        toast.success("Collection created", {
          description: `“${values.name.trim()}” is ready for documents.`,
        });
        form.reset();
        onOpenChange(false);
      },
      onError: (err) =>
        toast.error("Something went wrong", {
          description: getErrorMessage(err),
        }),
    });
  });

  const disabled = !name?.trim() || create.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="text-left">
          <DialogTitle className="text-[17px] leading-tight font-semibold tracking-[-0.015em]">
            New collection
          </DialogTitle>
          <DialogDescription className="text-[13px]">
            You can upload documents right after creating it.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="mt-1 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium">Name</span>
            <Input
              autoFocus
              placeholder="e.g. Sales Enablement"
              maxLength={60}
              {...form.register("name")}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium">
              Description{" "}
              <span className="font-normal text-faint">Optional</span>
            </span>
            <Textarea
              rows={3}
              placeholder="What's in this collection, and who is it for?"
              {...form.register("description")}
            />
          </label>
          <DialogFooter className="mt-1">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => onOpenChange(false)}
              className="h-9"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={disabled} className="h-9">
              {create.isPending && <Spinner />}
              Create collection
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
