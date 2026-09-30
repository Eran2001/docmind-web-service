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

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      aria-busy="true"
      className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4"
    >
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="flex animate-dmpulse flex-col gap-3 rounded-xl border p-5"
        >
          <Bone className="size-8 rounded-lg" />
          <Bone className="h-3.5 w-3/5" />
          <Bone className="h-2.5 w-[90%]" />
          <Bone className="h-2.5 w-[70%]" />
          <Bone className="mt-3 h-2.5 w-2/5" />
        </div>
      ))}
    </div>
  );
}
