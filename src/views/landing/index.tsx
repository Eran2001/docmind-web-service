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
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/configs/constants";
import { routes } from "@/configs/routes";
import { getErrorMessage } from "@/lib/api/errors";
import { useLogin } from "@/queries/auth.queries";
import { ChatPreview } from "@/views/landing/components/ChatPreview";

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

const pad = "px-[clamp(16px,4vw,32px)]";

export function LandingView() {
  const router = useRouter();
  const login = useLogin();

  const tryDemo = () =>
    login.mutate(
      { email: DEMO_EMAIL, password: DEMO_PASSWORD },
      {
        onSuccess: () => router.push(routes.collections),
        onError: (err) =>
          toast.error("Couldn't start the demo", {
            description: getErrorMessage(err),
          }),
      },
    );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header
        className={`mx-auto flex h-16 max-w-[1160px] items-center gap-6 ${pad}`}
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
        className={`mx-auto max-w-[880px] pt-[clamp(56px,10vw,120px)] pb-[clamp(40px,6vw,64px)] text-center ${pad}`}
      >
        <h1 className="m-0 text-[clamp(38px,6.6vw,68px)] leading-[1.03] font-semibold tracking-[-0.04em] text-balance">
          Answers from your documents. With sources.
        </h1>
        <p className="mx-auto mt-[22px] mb-0 max-w-[560px] text-[clamp(16px,2vw,18px)] leading-[1.55] text-pretty text-muted-foreground">
          Upload PDFs, Word files, and web pages into collections. Ask questions
          in plain language and get answers that cite the exact page they came
          from.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-2.5">
          <Button asChild size="xl">
            <Link href={routes.register}>Get started</Link>
          </Button>
          <Button
            variant="outline"
            size="xl"
            onClick={tryDemo}
            disabled={login.isPending}
          >
            Try the demo
            {login.isPending ? <Spinner /> : <ArrowRight />}
          </Button>
        </div>
      </section>

      <section className={`mx-auto max-w-[1224px] ${pad}`}>
        <ChatPreview />
      </section>

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

      <footer className="border-t">
        <div
          className={`mx-auto flex max-w-[1160px] items-center gap-2.5 py-7 text-[13px] text-muted-foreground ${pad}`}
        >
          <LogoMark size="sm" />
          <span>© 2026 DocMind, Inc.</span>
        </div>
      </footer>
    </div>
  );
}
