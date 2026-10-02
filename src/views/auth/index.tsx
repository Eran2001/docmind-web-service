"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert } from "lucide-react";
import { toast } from "sonner";

import { Logo } from "@/components/layout/Logo";
import { PasswordInput } from "@/components/common/PasswordInput";
import { Spinner } from "@/components/common/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { routes } from "@/configs/routes";
import { getErrorMessage, normalizeError } from "@/lib/api/errors";
import { useLogin, useRegister } from "@/queries/auth.queries";
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from "@/schemas/auth.schema";

type Mode = "login" | "register";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <span
      role="alert"
      className="flex items-center gap-1.5 pl-3.5 text-xs text-destructive"
    >
      <CircleAlert className="size-3.25" />
      {message}
    </span>
  );
}

// Only same-origin paths are allowed as a post-login target.
function safeNext(next: string | null): string {
  return next && next.startsWith("/") && !next.startsWith("//")
    ? next
    : routes.collections;
}

export function AuthView({ mode }: { mode: Mode }) {
  const isRegister = mode === "register";
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const login = useLogin();
  const register = useRegister();

  const form = useForm<RegisterInput>({
    resolver: (isRegister
      ? zodResolver(registerSchema)
      : zodResolver(loginSchema)) as Resolver<RegisterInput>,
    defaultValues: { name: "", email: "", password: "" },
  });
  const { errors } = form.formState;
  const loading = login.isPending || register.isPending;

  const onSubmit = form.handleSubmit((values) => {
    const options = {
      onSuccess: () => router.replace(next),
      onError: (err: unknown) => {
        // Field-level problems from the API (e.g. "email already registered") show under the input, not as a toast.
        const fields = Object.entries(normalizeError(err).fieldErrors).filter(
          (entry): entry is [keyof RegisterInput, string[]] =>
            entry[0] in form.getValues(),
        );
        if (fields.length) {
          fields.forEach(([field, messages], i) =>
            form.setError(
              field,
              { message: messages[0] },
              { shouldFocus: i === 0 },
            ),
          );
          return;
        }
        toast.error(isRegister ? "Couldn't create account" : "Sign in failed", {
          description: getErrorMessage(err),
        });
      },
    };
    if (isRegister) register.mutate(values, options);
    else
      login.mutate(
        { email: values.email, password: values.password } satisfies LoginInput,
        options,
      );
  });

  const label = loading
    ? isRegister
      ? "Creating account…"
      : "Signing in…"
    : isRegister
      ? "Create account"
      : "Sign in";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 text-foreground">
      <Logo href={routes.home} size="lg" />

      <div className="mt-7 w-full max-w-100 rounded-xl border bg-background p-[clamp(24px,6vw,32px)]">
        <h1 className="m-0 text-xl font-semibold tracking-[-0.02em]">
          {isRegister ? "Create your account" : "Sign in"}
        </h1>
        <p className="mt-1 mb-0 text-muted-foreground">
          {isRegister
            ? "Start with a free workspace. No credit card required."
            : "Welcome back. Enter your work email to continue."}
        </p>

        <form
          onSubmit={onSubmit}
          noValidate
          className="mt-6 flex flex-col gap-4"
        >
          {isRegister && (
            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-medium">Full name</span>
              <Input
                placeholder="Enter your fullname"
                autoComplete="name"
                aria-invalid={!!errors.name}
                {...form.register("name")}
              />
              <FieldError message={errors.name?.message} />
            </label>
          )}

          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium">Work email</span>
            <Input
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              aria-invalid={!!errors.email}
              {...form.register("email")}
            />
            <FieldError message={errors.email?.message} />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium">Password</span>
            <PasswordInput
              placeholder={
                isRegister ? "Create a password" : "Enter your password"
              }
              autoComplete={isRegister ? "new-password" : "current-password"}
              aria-invalid={!!errors.password}
              {...form.register("password")}
            />
            <FieldError message={errors.password?.message} />
            {isRegister && !errors.password && (
              <span className="pl-3.5 text-xs text-muted-foreground">
                At least 8 characters.
              </span>
            )}
          </label>

          <Button
            type="submit"
            disabled={loading}
            className="mt-1 h-10.5 w-full"
          >
            {loading && <Spinner />}
            {label}
          </Button>
        </form>
      </div>

      <p className="mt-5 mb-0 text-muted-foreground">
        {isRegister ? (
          <>
            Already have an account?{" "}
            <Link
              href={routes.login}
              className="font-medium text-link underline underline-offset-2 hover:decoration-2"
            >
              Sign in
            </Link>
          </>
        ) : (
          <>
            No account?{" "}
            <Link
              href={routes.register}
              className="font-medium text-link underline underline-offset-2 hover:decoration-2"
            >
              Create one
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
