import { cn } from "@/lib/utils";

// Skeleton blocks use the design's surface color and pulse animation.
export function Bone({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div style={style} className={cn("rounded-md bg-secondary", className)} />
  );
}

// One text line: a wrapper exactly a line tall (h-lh) around a thin bar, so a placeholder takes the same height as the text it stands in for.
export function SkeletonLine({
  className,
  align = "left",
}: {
  className?: string;
  align?: "left" | "right" | "center";
}) {
  return (
    <div
      className={cn(
        "flex h-lh items-center",
        align === "right" && "justify-end",
        align === "center" && "justify-center",
      )}
    >
      <Bone className={cn("h-2.5", className)} />
    </div>
  );
}

// Mirrors a collection card (views/collections): same padding, min height and text sizes, with a two-line description.
export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      aria-busy="true"
      className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4"
    >
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="flex min-h-44 animate-dmpulse flex-col rounded-xl border p-5"
        >
          <Bone className="size-8 rounded-lg" />
          <div className="mt-4 text-[15px]">
            <SkeletonLine className="w-3/5" />
          </div>
          <div className="mt-1 text-[13px] leading-normal">
            <SkeletonLine className="w-[90%]" />
            <SkeletonLine className="w-[70%]" />
          </div>
          <div className="mt-auto pt-4 text-xs">
            <SkeletonLine className="w-2/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
