"use client";

import { Fragment, type ReactNode } from "react";

import { SkeletonLine } from "@/components/common/Skeletons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIsDesktop } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

export interface DataGridColumn<T> {
  key: string;
  /** Table header text, and the label above the value in the card layout. */
  header: string;
  /** Renders the value. The same renderer feeds both layouts. */
  cell: (row: T) => ReactNode;
  /** Card layout: the card title, shown without a label. One column should set this. */
  primary?: boolean;
  /** Card layout: shown at the top right, next to the title (e.g. a row menu). */
  corner?: boolean;
  /** Card layout: the value spans the full card width (long text). */
  wide?: boolean;
  /** Card layout: leave this column out (e.g. a row chevron). */
  hideInGrid?: boolean;
  align?: "left" | "right" | "center";
  headClassName?: string;
  cellClassName?: string;
  /** Skeleton bar width while loading, e.g. "w-24". */
  skeletonClassName?: string;
  /** Custom table-cell placeholder for row `index`, for cells taller than one line. */
  skeleton?: (index: number) => ReactNode;
}

export interface DataGridProps<T> {
  columns: DataGridColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  skeletonCount?: number;
  /** Extra classes for the <table>, e.g. a min width. */
  tableClassName?: string;
  /** Shown instead of rows when there are none (the table keeps its header). */
  empty?: ReactNode;
  /** No outer border or card chrome, for a grid that sits inside another card. Cards become a divided list. */
  bare?: boolean;
  /** Extra classes for the card layout's container. */
  cardsClassName?: string;
  rowClassName?: (row: T) => string | undefined;
  /** Expandable rows: extra content under a row while it's open. */
  expanded?: {
    isOpen: (row: T) => boolean;
    render: (row: T, layout: "table" | "grid") => ReactNode;
  };
}

const ALIGN = { left: undefined, right: "text-right", center: "text-center" } as const;

// A table at `lg` and wider, a grid of cards below it.
export function DataGrid<T>(props: DataGridProps<T>) {
  const isDesktop = useIsDesktop();
  // Loading renders both layouts and lets CSS pick one. The server HTML (always loading) then already has the right
  // one on first paint, so phones don't flash a table before the cards.
  if (props.loading) {
    return (
      <>
        <div className="hidden lg:block">
          <DataTable {...props} />
        </div>
        <div className="lg:hidden">
          <CardGrid {...props} />
        </div>
      </>
    );
  }
  return isDesktop ? <DataTable {...props} /> : <CardGrid {...props} />;
}

function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  loading,
  skeletonCount = 5,
  tableClassName,
  empty,
  bare,
  rowClassName,
  expanded,
}: DataGridProps<T>) {
  const table = (
    <Table className={tableClassName}>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          {columns.map((c) => (
            <TableHead key={c.key} className={cn(ALIGN[c.align ?? "left"], c.headClassName)}>
              {c.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading &&
          Array.from({ length: skeletonCount }, (_, i) => (
            <TableRow key={i} className="animate-dmpulse">
              {columns.map((c) => (
                <TableCell key={c.key} className={cn(ALIGN[c.align ?? "left"], c.cellClassName)}>
                  {c.skeleton
                    ? c.skeleton(i)
                    : c.header && <SkeletonLine align={c.align} className={c.skeletonClassName ?? "w-24"} />}
                </TableCell>
              ))}
            </TableRow>
          ))}

        {!loading && rows.length === 0 && empty && (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={columns.length} className="p-0 whitespace-normal">
              {empty}
            </TableCell>
          </TableRow>
        )}

        {!loading &&
          rows.map((row) => {
            const open = expanded?.isOpen(row) ?? false;
            return (
              <Fragment key={rowKey(row)}>
                <TableRow
                  onClick={onRowClick && (() => onRowClick(row))}
                  aria-expanded={expanded ? open : undefined}
                  className={cn("animate-dmin", onRowClick && "cursor-pointer", rowClassName?.(row))}
                >
                  {columns.map((c) => (
                    <TableCell key={c.key} className={cn(ALIGN[c.align ?? "left"], c.cellClassName)}>
                      {c.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
                {open && expanded && (
                  <TableRow className="bg-surface2 hover:bg-surface2">
                    <TableCell colSpan={columns.length} className="p-0 whitespace-normal">
                      {expanded.render(row, "table")}
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            );
          })}
      </TableBody>
    </Table>
  );
  return bare ? table : <div className="overflow-hidden rounded-xl border">{table}</div>;
}

function CardGrid<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  loading,
  skeletonCount = 4,
  empty,
  bare,
  cardsClassName,
  rowClassName,
  expanded,
}: DataGridProps<T>) {
  const primary = columns.find((c) => c.primary);
  const corner = columns.filter((c) => c.corner);
  const details = columns.filter((c) => !c.primary && !c.corner && !c.hideInGrid);

  const container = cn(
    bare ? "flex flex-col divide-y" : "grid grid-cols-1 gap-3 sm:grid-cols-2",
    cardsClassName,
  );
  const item = cn(
    "flex flex-col gap-3",
    bare ? "py-4 first:pt-0" : "rounded-xl border bg-background p-4 transition-colors",
  );

  if (loading) {
    return (
      <div aria-busy="true" className={container}>
        {Array.from({ length: skeletonCount }, (_, i) => (
          <div key={i} className={cn(item, "animate-dmpulse")}>
            {(primary || corner.length > 0) && (
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  {primary?.skeleton ? primary.skeleton(i) : <SkeletonLine className="w-3/5" />}
                </div>
                {corner.map((c) => (
                  <div key={c.key} className="flex-none">
                    {c.skeleton?.(i)}
                  </div>
                ))}
              </div>
            )}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {details.map((c) => (
                <div key={c.key} className={cn(c.wide && "col-span-2")}>
                  <div className="text-xs">
                    <SkeletonLine className="w-12" />
                  </div>
                  <div className="mt-0.5">
                    {c.skeleton ? c.skeleton(i) : <SkeletonLine className="w-4/5" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (rows.length === 0 && empty) {
    return <div className={bare ? undefined : "rounded-xl border"}>{empty}</div>;
  }

  return (
    <div className={container}>
      {rows.map((row) => {
        const open = expanded?.isOpen(row) ?? false;
        return (
          <div
            key={rowKey(row)}
            onClick={onRowClick && (() => onRowClick(row))}
            // Cards are the touch layout of a clickable row: make them reachable and activatable from the keyboard too.
            role={onRowClick ? "button" : undefined}
            tabIndex={onRowClick ? 0 : undefined}
            aria-expanded={expanded ? open : undefined}
            onKeyDown={
              onRowClick
                ? (e) => {
                    if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      onRowClick(row);
                    }
                  }
                : undefined
            }
            className={cn(
              item,
              "animate-dmin outline-none focus-visible:ring-[3px] focus-visible:ring-ring/15",
              onRowClick && "cursor-pointer",
              onRowClick && !bare && "hover:border-border2 hover:bg-surface2",
              rowClassName?.(row),
            )}
          >
            {(primary || corner.length > 0) && (
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">{primary?.cell(row)}</div>
                {corner.map((c) => (
                  <div key={c.key} className="flex-none">
                    {c.cell(row)}
                  </div>
                ))}
              </div>
            )}
            {details.length > 0 && (
              <dl className="m-0 grid grid-cols-2 gap-x-4 gap-y-3">
                {details.map((c) => (
                  <div key={c.key} className={cn("min-w-0", c.wide && "col-span-2")}>
                    <dt className="text-xs text-muted-foreground">{c.header}</dt>
                    <dd className="m-0 mt-0.5 min-w-0">{c.cell(row)}</dd>
                  </div>
                ))}
              </dl>
            )}
            {open && expanded?.render(row, "grid")}
          </div>
        );
      })}
    </div>
  );
}
