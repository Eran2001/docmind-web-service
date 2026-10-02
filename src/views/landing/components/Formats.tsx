import { FileText, Globe, type LucideIcon } from "lucide-react";

import { Section } from "@/views/landing/components/Section";

const FORMATS: { label: string; Icon: LucideIcon }[] = [
  { label: "PDF", Icon: FileText },
  { label: "Word (DOCX, DOC)", Icon: FileText },
  { label: "Plain text", Icon: FileText },
  { label: "Markdown", Icon: FileText },
  { label: "Web pages", Icon: Globe },
];

export function Formats() {
  return (
    <Section
      title="Bring the documents you already have"
      lead="Up to 20 MB per file and 50 documents per collection. Collections are private to your account, and deleting a document removes its file."
      className="border-t"
    >
      <ul className="m-0 flex list-none flex-wrap justify-center gap-2.5 p-0">
        {FORMATS.map(({ label, Icon }) => (
          <li
            key={label}
            className="inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm"
          >
            <Icon className="size-4 text-muted-foreground" aria-hidden />
            {label}
          </li>
        ))}
      </ul>
    </Section>
  );
}
