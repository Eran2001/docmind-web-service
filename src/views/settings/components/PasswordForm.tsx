"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Spinner } from "@/components/common/Spinner";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/common/PasswordInput";
import { getErrorMessage } from "@/lib/api/errors";
import { useChangePassword } from "@/queries/auth.queries";
import {
  changePasswordSchema,
  type ChangePasswordInput,
} from "@/schemas/auth.schema";
import { FieldError } from "@/views/settings/components/FieldError";

const EMPTY: ChangePasswordInput = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export function PasswordForm() {
  const change = useChangePassword();
  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: EMPTY,
  });
  const { errors } = form.formState;
  const values = useWatch({ control: form.control });
  const incomplete =
    !values.currentPassword || !values.newPassword || !values.confirmPassword;

  const onSubmit = form.handleSubmit(({ currentPassword, newPassword }) =>
    change.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          form.reset(EMPTY);
          toast.success("Password updated", {
            description: "Other sessions have been signed out.",
          });
        },
        onError: (err) =>
          form.setError("currentPassword", { message: getErrorMessage(err) }),
      },
    ),
  );

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-medium">Current password</span>
        <PasswordInput
          placeholder="Enter your current password"
          autoComplete="current-password"
          aria-invalid={!!errors.currentPassword}
          {...form.register("currentPassword")}
        />
        <FieldError message={errors.currentPassword?.message} />
      </label>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-medium">New password</span>
          <PasswordInput
            placeholder="Enter your new password"
            autoComplete="new-password"
            aria-invalid={!!errors.newPassword}
            {...form.register("newPassword")}
          />
          <FieldError message={errors.newPassword?.message} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-medium">Confirm new password</span>
          <PasswordInput
            placeholder="Confirm your new password"
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
            {...form.register("confirmPassword")}
          />
          <FieldError message={errors.confirmPassword?.message} />
        </label>
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">
          At least 8 characters.
        </span>
        <Button type="submit" disabled={incomplete || change.isPending}>
          {change.isPending && <Spinner />}
          Update password
        </Button>
      </div>
    </form>
  );
}
