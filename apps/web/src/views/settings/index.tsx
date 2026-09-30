"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { PageContainer, PageHeader, PageTitle } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { routes } from "@/configs/routes";
import { getErrorMessage } from "@/lib/axios";
import { useDeleteAccount, useMe } from "@/queries/auth.queries";
import { DeleteAccountDialog } from "@/views/settings/components/DeleteAccountDialog";
import { PasswordForm } from "@/views/settings/components/PasswordForm";
import { ProfileForm } from "@/views/settings/components/ProfileForm";
import { SettingsSection } from "@/views/settings/components/SettingsSection";

export function SettingsView() {
  const router = useRouter();
  const { data: user } = useMe();
  const del = useDeleteAccount();
  const [deleting, setDeleting] = useState(false);

  const deleteAccount = () =>
    del.mutate(undefined, {
      onSuccess: () => router.replace(routes.home),
      onError: (err) => toast.error("Couldn't delete account", { description: getErrorMessage(err) }),
    });

  return (
    <div className="min-h-screen">
      <PageHeader crumbs={[{ label: "Settings" }]} />
      <PageContainer className="max-w-[880px] pb-20">
        <PageTitle title="Settings" description="Manage your profile and account security." />

        <div className="mt-4">
          <SettingsSection title="Profile" description="Shown to teammates in shared collections.">
            {user ? (
              <ProfileForm user={user} />
            ) : (
              <div className="flex flex-col gap-4">
                <Skeleton className="size-12 rounded-full" />
                <Skeleton className="h-10 w-full rounded-full" />
                <Skeleton className="h-10 w-full rounded-full" />
              </div>
            )}
          </SettingsSection>

          <SettingsSection title="Password" description="Change the password you use to sign in.">
            <PasswordForm />
          </SettingsSection>

          <SettingsSection title="Danger zone" description="Irreversible actions." danger last>
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-destructive px-5 py-[18px]">
              <div className="flex-[1_1_220px]">
                <div className="font-medium">Delete account</div>
                <div className="mt-0.5 text-[13px] text-muted-foreground">
                  Permanently removes your account, your chats and feedback. Shared collections stay with the workspace.
                </div>
              </div>
              <Button variant="outline" onClick={() => setDeleting(true)} className="flex-none border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive">
                Delete account
              </Button>
            </div>
          </SettingsSection>
        </div>
      </PageContainer>

      <DeleteAccountDialog open={deleting} onOpenChange={setDeleting} loading={del.isPending} onConfirm={deleteAccount} />
    </div>
  );
}
