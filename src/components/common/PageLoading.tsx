import { Spinner } from "@/components/common/Spinner";

// Route-level fallback while a page's code loads (app/(app)/loading.tsx).
export function PageLoading() {
  return (
    <div role="status" aria-label="Loading" className="grid min-h-[60vh] place-items-center text-muted-foreground">
      <Spinner className="size-5" />
    </div>
  );
}
