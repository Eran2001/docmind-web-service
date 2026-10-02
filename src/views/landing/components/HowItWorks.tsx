import {
  MessageSquareText,
  Quote,
  Upload,
  type LucideIcon,
} from "lucide-react";

import { Section } from "@/views/landing/components/Section";

const STEPS: { Icon: LucideIcon; title: string; body: string }[] = [
  {
    Icon: Upload,
    title: "Add your documents",
    body: "Drop in PDFs, Word files, text or Markdown, or paste a web page address. DocMind reads, splits and indexes them in the background.",
  },
  {
    Icon: MessageSquareText,
    title: "Ask in plain language",
    body: "Chat with a collection. Follow-up questions work too: DocMind rewrites them so they make sense on their own before searching.",
  },
  {
    Icon: Quote,
    title: "Check the source",
    body: "Every claim carries a citation. Click it to read the exact passage and page the answer came from.",
  },
];

export function HowItWorks() {
  return (
    <Section
      id="how-it-works"
      kicker="How it works"
      title="From a pile of files to a cited answer"
    >
      <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4 p-0">
        {STEPS.map(({ Icon, title, body }, index) => (
          <li key={title} className="flex flex-col gap-3 rounded-xl border p-6">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-full bg-primary font-mono text-[13px] font-medium text-primary-foreground">
                {index + 1}
              </span>
              <Icon className="size-4 text-muted-foreground" aria-hidden />
            </div>
            <h3 className="m-0 text-base font-semibold tracking-[-0.01em]">
              {title}
            </h3>
            <p className="m-0 text-[15px] leading-[1.55] text-pretty text-muted-foreground">
              {body}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
