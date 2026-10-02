"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  FlaskConical,
  Quote,
  Search,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Spinner } from "@/components/common/Spinner";
import { Logo, LogoMark } from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";
import { routes } from "@/configs/routes";
import { getErrorMessage } from "@/lib/api/errors";
import { useStartDemo } from "@/queries/auth.queries";
import { ChatPreview } from "@/views/landing/components/ChatPreview";
import { Faq } from "@/views/landing/components/Faq";
import { Formats } from "@/views/landing/components/Formats";
import { HowItWorks } from "@/views/landing/components/HowItWorks";
import { pad } from "@/views/landing/components/Section";

const FEATURES: { Icon: LucideIcon; title: string; body: string }[] = [
  {
    Icon: Search,
    title: "Hybrid search",
    body: "Keyword and semantic retrieval run together, merged with Reciprocal Rank Fusion. Exact terms like policy numbers and SKUs are never missed.",
  },
  {
    Icon: Quote,
    title: "Cited answers",
    body: "Every claim links to the page it came from. Open a citation to read the source passage in context before you rely on it.",
  },
  {
    Icon: FlaskConical,
    title: "Built-in evals",
    body: "Write test questions once and run them on every change. Track correctness, faithfulness and retrieval over time.",
  },
];

/** Starts a private demo sandbox (the API copies the sample collection into a fresh account) and opens the app. */
function useTryDemo() {
  const router = useRouter();
  const start = useStartDemo();
  const run = () =>
    start.mutate(undefined, {
      onSuccess: () => router.push(routes.collections),
      onError: (err) =>
        toast.error("Couldn't start the demo", {
          description: getErrorMessage(err),
        }),
    });
  return { start: run, pending: start.isPending };
}

function CtaButtons({ demo }: { demo: ReturnType<typeof useTryDemo> }) {
  return (
    <div className="flex flex-wrap justify-center gap-2.5">
      <Button asChild size="xl">
        <Link href={routes.register}>Get started</Link>
      </Button>
      <Button
        variant="outline"
        size="xl"
        onClick={demo.start}
        disabled={demo.pending}
      >
        Try the demo
        {demo.pending ? <Spinner /> : <ArrowRight />}
      </Button>
    </div>
  );
}

export function LandingView() {
  const demo = useTryDemo();

  return (
    <div className="bg-background text-foreground">
      {/* First screen: the header plus the hero fill exactly the visible height (dvh follows mobile browser bars), whatever the device.
          The hero content is centred in what is left, and its text and gaps shrink with a short screen so it still fits. */}
      <div className="flex h-dvh min-h-[28rem] flex-col">
        <header
          className={`mx-auto flex h-16 w-full max-w-[1160px] flex-none items-center gap-6 ${pad}`}
        >
          <Logo size="lg" />
          <nav className="ml-auto flex items-center gap-1">
            <a
              href="#features"
              className="mr-2 hidden h-[34px] items-center rounded-full px-3 text-sm text-fg2 hover:bg-secondary min-[720px]:inline-flex"
            >
              Product
            </a>
            <Button asChild variant="ghost" className="px-3.5">
              <Link href={routes.login}>Sign in</Link>
            </Button>
            <Button asChild className="px-4">
              <Link href={routes.register}>Get started</Link>
            </Button>
          </nav>
        </header>

        <section
          className={`mx-auto flex min-h-0 w-full max-w-[880px] flex-1 flex-col items-center justify-center gap-[clamp(14px,3.2dvh,28px)] pb-16 text-center ${pad}`}
        >
          <span className="inline-flex h-7 items-center rounded-full border px-3 text-[13px] font-medium text-muted-foreground">
            Chat with your own documents
          </span>
          <h1 className="m-0 text-[clamp(32px,min(6.6vw,9dvh),68px)] leading-[1.03] font-semibold tracking-[-0.04em] text-balance">
            Answers from your documents. With sources.
          </h1>
          <p className="m-0 max-w-[560px] text-[clamp(15px,min(2vw,2.6dvh),18px)] leading-[1.55] text-pretty text-muted-foreground">
            Stop digging through files. Upload PDFs, Word files and web pages,
            ask in plain language, and get answers that cite the exact page they
            came from. If it isn&apos;t in your documents, DocMind says so.
          </p>
          <CtaButtons demo={demo} />
          {/* Dropped on short screens so the hero still fits without scrolling. */}
          <p className="m-0 text-[13px] text-muted-foreground [@media(max-height:680px)]:hidden">
            For handbooks, contracts, product manuals and research papers
          </p>
        </section>
      </div>

      <section className={`mx-auto max-w-[1224px] ${pad}`}>
        <ChatPreview />
      </section>

      <HowItWorks />

      <section
        id="features"
        className={`mx-auto grid max-w-[1160px] grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[clamp(32px,5vw,56px)] py-[clamp(64px,9vw,112px)] ${pad}`}
      >
        {FEATURES.map(({ Icon, title, body }) => (
          <div key={title} className="flex flex-col gap-3">
            <div className="grid size-9 place-items-center rounded-full border">
              <Icon className="size-4" />
            </div>
            <h3 className="mt-1.5 mb-0 text-base font-semibold tracking-[-0.01em]">
              {title}
            </h3>
            <p className="m-0 text-[15px] leading-[1.55] text-pretty text-muted-foreground">
              {body}
            </p>
          </div>
        ))}
      </section>

      <Formats />
      <Faq />

      <section className="border-t">
        <div
          className={`mx-auto flex max-w-[640px] flex-col items-center gap-6 py-[clamp(64px,9vw,112px)] text-center ${pad}`}
        >
          <h2 className="m-0 text-[clamp(28px,4vw,40px)] leading-[1.1] font-semibold tracking-[-0.03em] text-balance">
            Ask your documents anything.
          </h2>
          <p className="m-0 text-[16px] leading-[1.55] text-pretty text-muted-foreground">
            Create a free account, or try the demo with sample documents.
          </p>
          <CtaButtons demo={demo} />
        </div>
      </section>

      <footer className="border-t">
        <div
          className={`mx-auto flex max-w-[1160px] flex-wrap items-center justify-between gap-x-8 gap-y-4 py-7 text-[13px] text-muted-foreground ${pad}`}
        >
          <div className="flex items-center gap-2.5">
            <LogoMark size="sm" />
            <span>© 2026 DocMind. Built as a full-stack AI project.</span>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
            <a href="#features" className="hover:text-foreground">
              Product
            </a>
            <a href="#how-it-works" className="hover:text-foreground">
              How it works
            </a>
            <a href="#faq" className="hover:text-foreground">
              FAQ
            </a>
            <Link href={routes.login} className="hover:text-foreground">
              Sign in
            </Link>
            <Link href={routes.register} className="hover:text-foreground">
              Get started
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
