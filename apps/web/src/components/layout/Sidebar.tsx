"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChartLine,
  FlaskConical,
  Folder,
  LogOut,
  Shield,
  X,
} from "lucide-react";

import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Skeleton } from "@/components/ui/skeleton";
import { routes } from "@/configs/routes";
import { cn } from "@/lib/utils";
import { useLogout, useMe } from "@/queries/auth.queries";

const NAV = [
  {
    href: routes.collections,
    label: "Collections",
    Icon: Folder,
    match: "/collections",
    admin: false,
  },
  {
    href: routes.evals,
    label: "Evals",
    Icon: FlaskConical,
    match: "/evals",
    admin: false,
  },
  {
    href: routes.usage,
    label: "Usage",
    Icon: ChartLine,
    match: "/usage",
    admin: false,
  },
  {
    href: routes.adminUsage,
    label: "Admin usage",
    Icon: Shield,
    match: "/admin",
    admin: true,
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

interface SidebarProps {
  onNavigate?: () => void;
  onClose?: () => void;
}

export function Sidebar({ onNavigate, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: user, isPending } = useMe();
  const logout = useLogout();

  const signOut = () => {
    onNavigate?.();
    logout.mutate(undefined, { onSettled: () => router.replace(routes.login) });
  };

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex h-14 flex-none items-center justify-between pr-3 pl-5">
        <Link href={routes.home} onClick={onNavigate} aria-label="DocMind home">
          <Logo />
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="inline-grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <nav className="flex flex-col gap-0.5 px-3 py-2" aria-label="Main">
        {NAV.filter((n) => !n.admin || user?.role === "admin").map(
          ({ href, label, Icon, match, admin }) => {
            const active =
              pathname === match || pathname.startsWith(`${match}/`);
            return (
              <Link
                key={href}
                href={href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm transition-colors hover:bg-secondary hover:text-foreground",
                  active
                    ? "bg-secondary font-medium text-foreground"
                    : "text-muted-foreground",
                )}
              >
                <Icon className="size-4" />
                <span className="flex-1">{label}</span>
                {admin && (
                  <span className="inline-flex h-[18px] items-center rounded-full border px-[7px] text-[11px] font-medium text-muted-foreground">
                    Admin
                  </span>
                )}
              </Link>
            );
          },
        )}
      </nav>

      <div className="mt-auto flex flex-col gap-2 border-t p-3">
        <div className="flex items-center gap-2.5 p-2">
          {isPending || !user ? (
            <>
              <Skeleton className="size-8 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </>
          ) : (
            <>
              <div className="grid size-8 flex-none place-items-center rounded-full border bg-secondary text-xs font-medium">
                {initials(user.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] leading-[1.3] font-medium">
                  {user.name}
                </div>
                <div className="truncate text-xs leading-[1.3] text-muted-foreground">
                  {user.email}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center justify-between px-1">
          <ThemeToggle />
          <button
            onClick={signOut}
            disabled={logout.isPending}
            className="inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[13px] text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <LogOut className="size-3.5" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
