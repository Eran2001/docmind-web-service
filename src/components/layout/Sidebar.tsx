"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChartLine,
  FlaskConical,
  Folder,
  LogOut,
  PanelLeft,
  Settings,
  Shield,
} from "lucide-react";

import { UserAvatar } from "@/components/common/UserAvatar";
import { Logo, LogoMark } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  {
    href: routes.settings,
    label: "Settings",
    Icon: Settings,
    match: "/settings",
    admin: false,
  },
];

interface SidebarProps {
  onNavigate?: () => void;
  /** Collapses (desktop) or closes (overlay) the sidebar. */
  onClose?: () => void;
  /** Icon-only rail. */
  collapsed?: boolean;
  /** Expands the icon-only rail. */
  onExpand?: () => void;
}

function RailTip({
  label,
  children,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

export function Sidebar({
  onNavigate,
  onClose,
  collapsed = false,
  onExpand,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: user, isPending } = useMe();
  const logout = useLogout();

  const signOut = () => {
    onNavigate?.();
    logout.mutate(undefined, { onSettled: () => router.replace(routes.login) });
  };

  if (collapsed) {
    return (
      <div className="flex h-full w-14 flex-col items-center bg-background">
        <div className="flex h-14 flex-none items-center justify-center">
          <RailTip label="Expand sidebar">
            <button
              onClick={onExpand}
              aria-label="Expand sidebar"
              className="group grid size-9 place-items-center rounded-lg hover:bg-secondary"
            >
              <LogoMark className="group-hover:hidden group-focus-visible:hidden" />
              <PanelLeft className="hidden size-4 text-muted-foreground group-hover:block group-focus-visible:block" />
            </button>
          </RailTip>
        </div>

        <nav
          className="flex flex-col items-center gap-1 py-2"
          aria-label="Main"
        >
          {NAV.map(({ href, label, Icon, match, admin }) => {
            // The role isn't known until /auth/me returns: hold the admin item's spot with a placeholder.
            if (admin && isPending)
              return <Skeleton key={href} className="size-9 rounded-lg" />;
            if (admin && user?.role !== "admin") return null;
            const active =
              pathname === match || pathname.startsWith(`${match}/`);
            return (
              <RailTip key={href} label={label}>
                <Link
                  href={href}
                  aria-label={label}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "grid size-9 place-items-center rounded-lg transition-colors hover:bg-secondary hover:text-foreground",
                    active
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  <Icon className="size-4" />
                </Link>
              </RailTip>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col items-center gap-1 border-t py-3">
          {isPending || !user ? (
            <Skeleton className="size-8 rounded-full" />
          ) : (
            <RailTip
              label={
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="opacity-70">{user.email}</div>
                </div>
              }
            >
              <div>
                <UserAvatar user={user} />
              </div>
            </RailTip>
          )}
          <RailTip label="Toggle theme">
            <div>
              <ThemeToggle compact />
            </div>
          </RailTip>
          <RailTip label="Sign out">
            <button
              onClick={signOut}
              disabled={logout.isPending}
              aria-label="Sign out"
              className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <LogOut className="size-4" />
            </button>
          </RailTip>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-60 flex-col bg-background">
      <div className="flex h-14 flex-none items-center justify-between pr-3 pl-5">
        <Link href={routes.home} onClick={onNavigate} aria-label="DocMind home">
          <Logo />
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Collapse sidebar"
            className="inline-grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <PanelLeft className="size-4" />
          </button>
        )}
      </div>

      <nav className="flex flex-col gap-0.5 px-3 py-2" aria-label="Main">
        {NAV.map(({ href, label, Icon, match, admin }) => {
          // The role isn't known until /auth/me returns: hold the admin item's spot with a placeholder.
          if (admin && isPending)
            return <Skeleton key={href} className="h-9 rounded-lg" />;
          if (admin && user?.role !== "admin") return null;
          const active = pathname === match || pathname.startsWith(`${match}/`);
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
                <span className="inline-flex h-4.5 items-center rounded-full border px-1.75 text-[11px] font-medium text-muted-foreground">
                  Admin
                </span>
              )}
            </Link>
          );
        })}
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
              <UserAvatar user={user} />
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
