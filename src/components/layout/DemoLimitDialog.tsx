"use client";

import { useLeaveDemo } from "@/components/layout/DemoBanner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDemoStore } from "@/stores/demo.store";

/** Opens when a demo visitor hits a limit (see lib/api/demo-limit.ts). */
export function DemoLimitDialog() {
  const message = useDemoStore((s) => s.limitMessage);
  const close = useDemoStore((s) => s.closeLimit);
  const leave = useLeaveDemo();
  return (
    <Dialog open={message !== null} onOpenChange={(open) => !open && close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>You&apos;ve reached the demo limit</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => leave("login")}>
            Sign in
          </Button>
          <Button
            onClick={() => {
              close();
              leave("register");
            }}
          >
            Create free account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
