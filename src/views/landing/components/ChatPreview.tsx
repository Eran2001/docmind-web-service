"use client";

import {
  ArrowUp,
  ArrowUpRight,
  Copy,
  FileText,
  PanelRight,
  SquarePen,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

import { useElementWidth } from "@/hooks/useElementWidth";

const W = 1280;
const H = 760;

const CONVERSATIONS = [
  ["Parental leave eligibility", "2m", true],
  ["Remote work stipend limits", "1h", false],
  ["PTO carryover rules", "3h", false],
] as const;
const OLDER = [
  ["Expense reimbursement deadlines", "2d"],
  ["Harassment reporting process", "3d"],
  ["401(k) matching schedule", "5d"],
] as const;

function Chip({ n, active }: { n: number; active?: boolean }) {
  return (
    <span
      className={`mr-px ml-1 inline-flex h-[18px] min-w-[19px] items-center justify-center rounded-full px-[5px] align-[2px] font-mono text-[11px] font-semibold ${
        active ? "bg-link text-background" : "bg-accent-bg text-link"
      }`}
    >
      {n}
    </span>
  );
}

// Static, non-interactive replica of the chat screen at 1280x760, scaled to fit.
export function ChatPreview() {
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const scale = (width ?? 1160) / W;

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-2xl border bg-background"
      style={{ height: Math.round(H * scale) }}
    >
      <div
        aria-hidden
        className="pointer-events-none flex origin-top-left flex-col select-none"
        style={{ width: W, height: H, transform: `scale(${scale})` }}
      >
        <header className="flex h-14 flex-none items-center gap-2 border-b px-5 text-sm">
          <span className="text-muted-foreground">Collections</span>
          <span className="text-faint">/</span>
          <span className="text-muted-foreground">Employee Handbook 2026</span>
          <span className="text-faint">/</span>
          <span className="flex-1 font-medium">Parental leave eligibility</span>
          <span className="inline-flex h-8 items-center gap-1.5 rounded-full border bg-secondary pr-3 pl-2.5 text-[13px] font-medium">
            <PanelRight className="size-[15px]" />
            Sources
          </span>
        </header>

        <div className="flex min-h-0 flex-1">
          <aside className="w-[248px] flex-none border-r">
            <div className="p-3">
              <div className="flex h-9 items-center justify-center gap-1.5 rounded-full border text-[13px] font-medium">
                <SquarePen className="size-[15px]" />
                New chat
              </div>
            </div>
            <div className="px-2">
              <div className="px-2.5 pt-3 pb-1.5 text-xs font-medium text-faint">
                Today
              </div>
              {CONVERSATIONS.map(([title, time, on]) => (
                <div
                  key={title}
                  className={`flex h-[34px] items-center gap-2 rounded-lg px-2.5 text-[13px] ${on ? "bg-secondary font-medium" : "text-fg2"}`}
                >
                  <span className="flex-1 truncate">{title}</span>
                  <span className="text-[11px] font-normal text-faint">
                    {time}
                  </span>
                </div>
              ))}
              <div className="px-2.5 pt-3 pb-1.5 text-xs font-medium text-faint">
                Previous 7 days
              </div>
              {OLDER.map(([title, time]) => (
                <div
                  key={title}
                  className="flex h-[34px] items-center gap-2 rounded-lg px-2.5 text-[13px] text-fg2"
                >
                  <span className="flex-1 truncate">{title}</span>
                  <span className="text-[11px] text-faint">{time}</span>
                </div>
              ))}
            </div>
          </aside>

          <section className="flex min-w-0 flex-1 flex-col">
            <div className="mx-auto flex w-full max-w-[760px] flex-1 flex-col gap-8 px-6 pt-8">
              <div className="flex justify-end">
                <div className="max-w-[560px] rounded-[20px] bg-secondary px-4 py-2.5 text-[15px] leading-[1.55]">
                  How long is parental leave, and who is eligible?
                </div>
              </div>
              <article className="flex flex-col gap-3 text-[15px] leading-[1.7]">
                <p className="m-0">
                  Full-time employees are eligible for{" "}
                  <strong className="font-semibold">
                    16 weeks of fully paid parental leave
                  </strong>{" "}
                  once they&apos;ve completed 90 days of continuous employment
                  <Chip n={1} active />. The policy applies equally to birthing
                  and non-birthing parents, including adoption and foster
                  placement
                  <Chip n={2} />.
                </p>
                <p className="m-0">A few details worth knowing:</p>
                <ul className="m-0 list-disc pl-[22px]">
                  <li className="my-1">
                    Leave can be taken all at once or in up to{" "}
                    <strong className="font-semibold">three blocks</strong>{" "}
                    within 12 months of the birth or placement
                    <Chip n={2} />.
                  </li>
                  <li className="my-1">
                    Part-time employees scheduled for 20+ hours a week receive a
                    prorated benefit
                    <Chip n={1} />.
                  </li>
                  <li className="my-1">
                    Give your manager and People Ops at least{" "}
                    <strong className="font-semibold">
                      30 days&apos; notice
                    </strong>{" "}
                    before your planned start date
                    <Chip n={3} />.
                  </li>
                </ul>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    [1, "Employee_Handbook_2026.pdf", "p. 42"],
                    [2, "Parental_Leave_Policy.docx", "p. 3"],
                    [3, "Parental_Leave_Policy.docx", "p. 7"],
                  ].map(([n, doc, page]) => (
                    <span
                      key={`${n}`}
                      className="inline-flex h-7 items-center gap-1.5 rounded-full border pr-2.5 pl-[5px] text-xs"
                    >
                      <span className="inline-grid h-[18px] min-w-[18px] place-items-center rounded-full bg-accent-bg font-mono text-[11px] font-semibold text-link">
                        {n}
                      </span>
                      <span className="text-fg2">{doc}</span>
                      <span className="text-faint">{page}</span>
                    </span>
                  ))}
                </div>
                <div className="-ml-1.5 flex items-center gap-0.5 text-muted-foreground">
                  <ThumbsUp className="m-[7px] size-[15px]" />
                  <ThumbsDown className="m-[7px] size-[15px]" />
                  <Copy className="m-[7px] size-[15px]" />
                  <span className="ml-auto font-mono text-xs text-faint">
                    1,240 tokens · $0.0041 · 2.3s
                  </span>
                </div>
              </article>
            </div>
            <div className="px-6 pt-2 pb-3.5">
              <div className="mx-auto flex max-w-[760px] items-center gap-2 rounded-[28px] bg-secondary py-1.5 pr-1.5 pl-5">
                <span className="flex-1 text-[15px] text-muted-foreground">
                  Ask anything about Employee Handbook 2026…
                </span>
                <span className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground opacity-30">
                  <ArrowUp className="size-[18px]" strokeWidth={2} />
                </span>
              </div>
            </div>
          </section>

          <aside className="w-80 flex-none border-l">
            <div className="flex h-[52px] items-center gap-2 border-b pl-5 text-[13px] font-medium">
              Source
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-link px-1.5 font-mono text-[11px] font-semibold text-background">
                1
              </span>
            </div>
            <div className="p-5">
              <div className="flex items-start gap-3">
                <div className="grid size-8 place-items-center rounded-lg bg-secondary text-fg2">
                  <FileText className="size-4" />
                </div>
                <div>
                  <div className="text-sm leading-[1.4] font-medium">
                    Employee_Handbook_2026.pdf
                  </div>
                  <div className="mt-0.5 text-[13px] text-muted-foreground">
                    Page 42 · 7.2 Parental leave
                  </div>
                </div>
              </div>
              <div className="mt-4 rounded-xl bg-secondary px-[18px] py-4 text-sm leading-[1.7] text-muted-foreground">
                Acme supports employees welcoming a new child through birth,
                adoption or foster placement.{" "}
                <mark className="rounded-[2px] bg-accent-bg text-foreground shadow-[inset_0_-1.5px_0_var(--link)]">
                  Full-time employees who have completed 90 days of continuous
                  employment are eligible for up to sixteen (16) weeks of paid
                  parental leave at 100% of base salary.
                </mark>{" "}
                Part-time employees regularly scheduled for 20 or more hours per
                week receive a prorated benefit.
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-mono text-xs text-faint">
                  relevance 0.91 · chunk 118 / 312
                </span>
                <span className="inline-flex items-center gap-1 text-[13px] font-medium text-link">
                  Open document <ArrowUpRight className="size-3.5" />
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
