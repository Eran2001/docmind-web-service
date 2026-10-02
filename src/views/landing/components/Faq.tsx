import { Plus } from "lucide-react";

import { Section } from "@/views/landing/components/Section";

const QUESTIONS: { q: string; a: string }[] = [
  {
    q: "Is my data private?",
    a: "Yes. Every collection belongs to your account, and other users can't see or search your documents. Deleting a document, a collection or your account also removes the stored files.",
  },
  {
    q: "Which files and web pages work?",
    a: "PDF, Word (DOCX and DOC), plain text and Markdown files, plus public web pages by address. Files can be up to 20 MB, and a collection holds up to 50 documents.",
  },
  {
    q: "How does it avoid making things up?",
    a: "Answers are written only from passages found in your documents, and each claim carries a citation you can open. If the documents don't contain the answer, DocMind says it couldn't find it instead of guessing.",
  },
  {
    q: "How does the search work?",
    a: "Two searches run together: keyword search, which catches exact terms like policy numbers, and semantic search, which finds passages with the same meaning. The results are merged with Reciprocal Rank Fusion.",
  },
  {
    q: "What are evals?",
    a: "A set of test questions with known answers. Run it after you change documents or settings, and DocMind scores correctness, faithfulness and whether the right document was retrieved.",
  },
  {
    q: "Are there any limits?",
    a: "Beyond the file and collection limits above, chat is limited to 20 messages a minute and uploads to 30 an hour per account, which keeps the service responsive for everyone.",
  },
];

export function Faq() {
  return (
    <Section
      id="faq"
      kicker="FAQ"
      title="Questions people ask"
      className="max-w-[820px] border-t"
    >
      <div className="divide-y rounded-xl border">
        {QUESTIONS.map(({ q, a }) => (
          <details key={q} className="group px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium outline-none marker:hidden focus-visible:underline [&::-webkit-details-marker]:hidden">
              {q}
              <Plus
                className="size-4 flex-none text-muted-foreground transition-transform group-open:rotate-45"
                aria-hidden
              />
            </summary>
            <p className="mt-3 mb-0 text-[15px] leading-[1.6] text-pretty text-muted-foreground">
              {a}
            </p>
          </details>
        ))}
      </div>
    </Section>
  );
}
