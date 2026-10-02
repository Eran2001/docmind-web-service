"use client";

import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/lib/api/errors";
import { useCollections } from "@/queries/collections.queries";
import { useCreateEvalSet } from "@/queries/evals.queries";
import {
  createEvalSetSchema,
  type CreateEvalSetInput,
} from "@/schemas/eval.schema";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (id: string) => void;
}

export function NewEvalSetDialog({ open, onOpenChange, onCreated }: Props) {
  const collections = useCollections();
  const create = useCreateEvalSet();
  const form = useForm<CreateEvalSetInput>({
    resolver: zodResolver(createEvalSetSchema),
    defaultValues: { name: "", collectionId: "", description: "" },
  });

  const firstCollection = collections.data?.[0]?.resourceId;
  useEffect(() => {
    if (firstCollection && !form.getValues("collectionId"))
      form.setValue("collectionId", firstCollection);
  }, [firstCollection, form]);

  const [name, collectionId] = useWatch({
    control: form.control,
    name: ["name", "collectionId"],
  });

  const onSubmit = form.handleSubmit((values) =>
    create.mutate(values, {
      onSuccess: (set) => {
        toast.success("Eval set created", {
          description: `Add questions to “${set.name}” to run your first eval.`,
        });
        form.reset({
          name: "",
          collectionId: values.collectionId,
          description: "",
        });
        onOpenChange(false);
        onCreated?.(set.id);
      },
      onError: (err) =>
        toast.error("Something went wrong", {
          description: getErrorMessage(err),
        }),
    }),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader className="text-left">
          <DialogTitle className="text-[17px] leading-tight font-semibold tracking-[-0.015em]">
            New eval set
          </DialogTitle>
          <DialogDescription className="text-[13px]">
            Add questions and expected answers after it&apos;s created.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="mt-1 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium">Name</span>
            <Input
              autoFocus
              placeholder="e.g. Benefits FAQ"
              maxLength={100}
              {...form.register("name")}
            />
          </label>
          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium">Collection</span>
            <Controller
              control={form.control}
              name="collectionId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full" aria-label="Collection">
                    <SelectValue placeholder="Choose a collection" />
                  </SelectTrigger>
                  <SelectContent>
                    {collections.data?.map((c) => (
                      <SelectItem key={c.resourceId} value={c.resourceId}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium">
              Description{" "}
              <span className="font-normal text-faint">Optional</span>
            </span>
            <Textarea
              rows={2}
              placeholder="What does this eval set cover?"
              {...form.register("description")}
            />
          </label>
          <DialogFooter className="mt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-9"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name?.trim() || !collectionId || create.isPending}
              className="h-9"
            >
              {create.isPending && <Spinner />}
              Create eval set
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
