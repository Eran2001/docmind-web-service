import Link from "next/link";

import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";
import { routes } from "@/configs/routes";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <Logo href={routes.home} size="lg" />
      <div>
        <p className="m-0 font-mono text-sm text-faint">404</p>
        <h1 className="mt-1 mb-0 text-2xl font-semibold tracking-tight">
          Page not found
        </h1>
        <p className="mt-1.5 mb-0 text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or was moved.
        </p>
      </div>
      <Button asChild size="lg">
        <Link href={routes.collections}>Go to collections</Link>
      </Button>
    </div>
  );
}
