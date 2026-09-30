"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, FlaskConical, Folder, Plus } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { Bone } from "@/components/common/Skeletons";
import {
  PageContainer,
  PageHeader,
  PageTitle,
} from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { routes } from "@/configs/routes";
import { getErrorMessage } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { useEvalSets } from "@/queries/evals.queries";
import { formatRelative } from "@/utils/format-date";
import { NewEvalSetDialog } from "@/views/evals/components/NewEvalSetDialog";

const mono = "font-mono text-[13px]";

export function EvalsView() {
  const router = useRouter();
  const { data, isPending, isError, error, refetch } = useEvalSets();
  const [dialog, setDialog] = useState(false);
  const sets = data ?? [];

  const newButton = (
    <Button onClick={() => setDialog(true)}>
      <Plus />
      New eval set
    </Button>
  );

  return (
    <div className="min-h-screen">
      <PageHeader crumbs={[{ label: "Evals" }]} actions={newButton} />
      <PageContainer>
        <PageTitle
          title="Evals"
          description="Test questions with known answers. Run them after changing documents or retrieval settings to catch regressions."
        />
        <div className="mt-6">
          {isError && (
            <EmptyState
              icon={FlaskConical}
              title="Couldn't load eval sets"
              description={getErrorMessage(error)}
              action={<Button onClick={() => refetch()}>Try again</Button>}
            />
          )}

          {!isPending && !isError && sets.length === 0 && (
            <EmptyState
              icon={FlaskConical}
              title="No eval sets yet"
              description="Create an eval set to measure answer quality for a collection."
              action={
                <Button size="lg" onClick={() => setDialog(true)}>
                  <Plus />
                  New eval set
                </Button>
              }
            />
          )}

          {(isPending || sets.length > 0) && (
            <div className="overflow-hidden rounded-xl border">
              <Table className="min-w-[760px]">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="min-w-[260px]">Name</TableHead>
                    <TableHead>Collection</TableHead>
                    <TableHead className="w-[100px] text-right">
                      Questions
                    </TableHead>
                    <TableHead className="w-[170px]">Last run score</TableHead>
                    <TableHead className="w-[130px]">Last run</TableHead>
                    <TableHead className="w-11" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isPending &&
                    [48, 36, 52, 40, 44].map((w, i) => (
                      <TableRow key={i} className="animate-dmpulse">
                        <TableCell className="py-4">
                          <Bone className="h-3" style={{ width: `${w}%` }} />
                        </TableCell>
                        <TableCell>
                          <Bone className="h-3 w-[140px]" />
                        </TableCell>
                        <TableCell>
                          <Bone className="ml-auto h-3 w-7" />
                        </TableCell>
                        <TableCell>
                          <Bone className="h-3 w-[90px]" />
                        </TableCell>
                        <TableCell>
                          <Bone className="h-3 w-[70px]" />
                        </TableCell>
                        <TableCell />
                      </TableRow>
                    ))}
                  {sets.map((s) => {
                    const score = s.lastRun?.avgCorrectness;
                    const low = score !== undefined && score < 0.7;
                    return (
                      <TableRow
                        key={s.id}
                        onClick={() => router.push(routes.evalSet(s.id))}
                        className="animate-dmin cursor-pointer"
                      >
                        <TableCell className="py-3.5">
                          <Link
                            href={routes.evalSet(s.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="font-medium hover:underline"
                          >
                            {s.name}
                          </Link>
                          <div className="mt-px text-xs text-muted-foreground">
                            {s.description ?? "No description"}
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-fg2">
                          <span className="inline-flex items-center gap-1.5">
                            <Folder className="size-3.5 text-faint" />
                            {s.collectionName}
                          </span>
                        </TableCell>
                        <TableCell className={cn("text-right", mono)}>
                          {s.questionCount}
                        </TableCell>
                        <TableCell>
                          {score !== undefined ? (
                            <span className="inline-flex items-center gap-2.5">
                              <span
                                className={cn(
                                  mono,
                                  "font-medium",
                                  low && "text-warn",
                                )}
                              >
                                {score.toFixed(2)}
                              </span>
                              <span className="block h-1 w-16 overflow-hidden rounded-full bg-secondary">
                                <span
                                  className={cn(
                                    "block h-full rounded-full",
                                    low ? "bg-warn" : "bg-foreground",
                                  )}
                                  style={{
                                    width: `${Math.round(score * 100)}%`,
                                  }}
                                />
                              </span>
                            </span>
                          ) : (
                            <span className="text-faint">—</span>
                          )}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {s.lastRun
                            ? formatRelative(s.lastRun.finishedAt)
                            : "Never run"}
                        </TableCell>
                        <TableCell className="px-3 text-faint">
                          <ChevronRight className="size-4" />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </PageContainer>

      <NewEvalSetDialog
        open={dialog}
        onOpenChange={setDialog}
        onCreated={(id) => router.push(routes.evalSet(id))}
      />
    </div>
  );
}
