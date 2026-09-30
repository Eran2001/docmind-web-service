"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { User } from "@/types";

import { Spinner } from "@/components/common/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/axios";
import { useUpdateProfile } from "@/queries/auth.queries";
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from "@/schemas/auth.schema";
import { FieldError } from "@/views/settings/components/FieldError";

export function ProfileForm({ user }: { user: User }) {
  const update = useUpdateProfile();
  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: user.name, email: user.email },
  });
  const { errors, isDirty } = form.formState;
  const email = useWatch({ control: form.control, name: "email" });

  // Re-baseline once the saved user comes back so "Save changes" disables again.
  useEffect(() => {
    form.reset({ name: user.name, email: user.email });
  }, [user.name, user.email, form]);

  const onSubmit = form.handleSubmit((values) =>
    update.mutate(values, {
      onSuccess: () =>
        toast.success("Saved", {
          description: "Your profile has been updated.",
        }),
      onError: (err) =>
        toast.error("Couldn't save profile", {
          description: getErrorMessage(err),
        }),
    }),
  );

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-medium">Full name</span>
        <Input
          autoComplete="name"
          aria-invalid={!!errors.name}
          {...form.register("name")}
          placeholder="Enter your full name"
        />
        <FieldError message={errors.name?.message} />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-medium">Email</span>
        <Input
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          {...form.register("email")}
          placeholder="Enter your email address"
        />
        <FieldError message={errors.email?.message} />
        {!errors.email && email !== user.email && (
          <span className="pl-3.5 text-xs text-muted-foreground">
            We&apos;ll send a confirmation link to the new address.
          </span>
        )}
      </label>

      <div className="flex justify-end">
        <Button type="submit" disabled={!isDirty || update.isPending}>
          {update.isPending && <Spinner />}
          Save changes
        </Button>
      </div>
    </form>
  );
}

// Same structure and sizes as ProfileForm so nothing shifts when the user loads.
export function ProfileFormSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true">
      <div className="flex flex-col gap-1.5">
        <span className="text-[13px] font-medium">Full name</span>
        <Skeleton className="h-10 rounded-full" />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-[13px] font-medium">Email</span>
        <Skeleton className="h-10 rounded-full" />
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-8.5 w-30.75 rounded-full" />
      </div>
    </div>
  );
}
