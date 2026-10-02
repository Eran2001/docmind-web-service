"use client";

import type { User } from "@/types";

import { useAvatar } from "@/queries/auth.queries";
import { cn } from "@/lib/utils";

export function initialsOf(name: string) {
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

/** The signed-in user's picture, or their initials (also shown while the picture loads, so nothing shifts). */
export function UserAvatar({
  user,
  className,
}: {
  user: User;
  className?: string;
}) {
  const { data: url } = useAvatar();

  return (
    <div
      className={cn(
        "grid size-8 flex-none place-items-center overflow-hidden rounded-full border bg-secondary text-xs font-medium",
        className,
      )}
    >
      {url && user.hasAvatar ? (
        // eslint-disable-next-line @next/next/no-img-element -- a blob URL made from an authenticated request
        <img src={url} alt="" className="size-full object-cover" />
      ) : (
        initialsOf(user.name)
      )}
    </div>
  );
}
