"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMe } from "@/queries/auth.queries";

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

export function AvatarPicker() {
  const { data: user } = useMe();
  return (
    <div className="flex items-center gap-3.5">
      {user ? (
        <div className="grid size-12 place-items-center rounded-full border bg-secondary text-[15px] font-medium">
          {initialsOf(user.name)}
        </div>
      ) : (
        <Skeleton className="size-12 rounded-full" />
      )}
      <Button type="button" variant="outline" size="sm" disabled title="Avatars aren't supported yet">
        Change avatar
      </Button>
    </div>
  );
}
