"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { User } from "@docmind/shared";

import { Spinner } from "@/components/common/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/axios";
import { useUpdateProfile } from "@/queries/auth.queries";
import { updateProfileSchema, type UpdateProfileInput } from "@/schemas/auth.schema";
import { FieldError } from "@/views/settings/components/FieldError";

function initialsOf(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((p) => p[0] ?? "")
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?"
  );
}

export function ProfileForm({ user }: { user: User }) {
  const update = useUpdateProfile();
  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: user.name, email: user.email },
  });
  const { errors, isDirty } = form.formState;
  const [name, email] = form.watch(["name", "email"]);

  // Re-baseline once the saved user comes back so "Save changes" disables again.
  useEffect(() => {
    form.reset({ name: user.name, email: user.email });
  }, [user.name, user.email, form]);

  const onSubmit = form.handleSubmit((values) =>
    update.mutate(values, {
      onSuccess: () => toast.success("Saved", { description: "Your profile has been updated." }),
      onError: (err) => toast.error("Couldn't save profile", { description: getErrorMessage(err) }),
    }),
  );

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <div className="flex items-center gap-3.5">
        <div className="grid size-12 place-items-center rounded-full border bg-secondary text-[15px] font-medium">
          {initialsOf(name)}
        </div>
        <Button type="button" variant="outline" size="sm" disabled title="Avatars aren't supported yet">
          Change avatar
        </Button>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-medium">Full name</span>
        <Input autoComplete="name" aria-invalid={!!errors.name} {...form.register("name")} />
        <FieldError message={errors.name?.message} />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-medium">Email</span>
        <Input type="email" autoComplete="email" aria-invalid={!!errors.email} {...form.register("email")} />
        <FieldError message={errors.email?.message} />
        {!errors.email && email !== user.email && (
          <span className="pl-3.5 text-xs text-muted-foreground">We&apos;ll send a confirmation link to the new address.</span>
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
