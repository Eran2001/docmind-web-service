import Link from "next/link";

import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

// The last crumb is the current page; earlier ones link back.
export function Breadcrumbs({
  items,
  className,
}: {
  items: Crumb[];
  className?: string;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex min-w-0 items-center gap-2 overflow-hidden text-sm whitespace-nowrap",
        className,
      )}
    >
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <span
            key={`${item.label}-${i}`}
            className={cn("flex min-w-0 items-center gap-2", last && "flex-1")}
          >
            {last || !item.href ? (
              <span
                className={cn(
                  "truncate",
                  last ? "font-medium" : "text-muted-foreground",
                )}
                aria-current={last ? "page" : undefined}
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="truncate text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </Link>
            )}
            {!last && <span className="text-faint">/</span>}
          </span>
        );
      })}
    </nav>
  );
}
