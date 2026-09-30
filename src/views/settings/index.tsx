"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  PageContainer,
  PageHeader,
  PageTitle,
} from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { routes } from "@/configs/routes";
import { getErrorMessage } from "@/lib/api/errors";
import { useDeleteAccount, useMe } from "@/queries/auth.queries";
import { AvatarPicker } from "@/views/settings/components/AvatarPicker";
import { DeleteAccountDialog } from "@/views/settings/components/DeleteAccountDialog";
import { PasswordForm } from "@/views/settings/components/PasswordForm";
import { ProfileForm, ProfileFormSkeleton } from "@/views/settings/components/ProfileForm";
import { SettingsSection } from "@/views/settings/components/SettingsSection";

export function SettingsView() {
  const router = useRouter();
  const { data: user } = useMe();
  const del = useDeleteAccount();
  const [deleting, setDeleting] = useState(false);

  const deleteAccount = () =>
    del.mutate(undefined, {
      onSuccess: () => router.replace(routes.home),
      onError: (err) =>
        toast.error("Couldn't delete account", {
          description: getErrorMessage(err),
        }),
    });

  return (
    <div className="min-h-screen">
      <PageHeader crumbs={[{ label: "Settings" }]} />
      <PageContainer>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <PageTitle
            title="Settings"
            description="Manage your profile and account security."
          />
          <AvatarPicker />
        </div>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 lg:gap-x-12">
          <SettingsSection
            title="Profile"
            description="Shown to teammates in shared collections."
          >
            {user ? (
              <ProfileForm user={user} />
            ) : (
              <ProfileFormSkeleton />
            )}
          </SettingsSection>

          <SettingsSection
            title="Password"
            description="Change the password you use to sign in."
          >
            <PasswordForm />
          </SettingsSection>

          <SettingsSection
            title="Danger zone"
            description="Irreversible actions."
            danger
            last
            className="lg:col-span-2"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-destructive px-5 py-4.5">
              <div className="flex-[1_1_220px]">
                <div className="font-medium">Delete account</div>
                <div className="mt-0.5 text-[13px] text-muted-foreground">
                  Permanently removes your account, your chats and feedback.
                  Shared collections stay with the workspace.
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setDeleting(true)}
                className="flex-none border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                Delete account
              </Button>
            </div>
          </SettingsSection>
        </div>
      </PageContainer>

      <DeleteAccountDialog
        open={deleting}
        onOpenChange={setDeleting}
        loading={del.isPending}
        onConfirm={deleteAccount}
      />
    </div>
  );
}
