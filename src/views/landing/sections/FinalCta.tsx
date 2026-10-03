// Generated from the DocMind Landing design (Claude Design export), then kept as normal source.
import { routes } from "@/configs/routes";
import type { DemoProps } from "@/views/landing/types";

export function FinalCta({ onDemo, demoPending }: DemoProps) {
  return (
    <section
      data-scene="reveal"
      aria-labelledby="cta-h"
      style={{
        padding: "clamp(80px, 14vh, 160px) 20px",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div
        data-r="0 0.45"
        style={{
          maxWidth: "880px",
          margin: "0 auto",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "26px",
          opacity: "var(--t)",
          transform:
            "translateY(calc((1 - var(--t)) * 32px)) scale(calc(0.97 + var(--t) * 0.03))",
        }}
      >
        <h2
          id="cta-h"
          style={{
            margin: "0",
            fontSize: "clamp(40px, 6.4vw, 84px)",
            fontWeight: "600",
            letterSpacing: "-0.045em",
            lineHeight: "1.03",
            textWrap: "balance",
          }}
        >
          Ask your documents anything.
        </h2>
        <p
          style={{
            margin: "0",
            fontSize: "16px",
            lineHeight: "1.55",
            color: "var(--fg2)",
            maxWidth: "520px",
          }}
        >
          Start with the demo: sample documents, 5 questions and 1 upload. No
          sign-up.
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "12px",
          }}
        >
          <a
            href={routes.register}
            style={{
              height: "44px",
              padding: "0 22px",
              borderRadius: "999px",
              background: "var(--fg)",
              color: "var(--on-fg)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              fontSize: "15px",
              fontWeight: "500",
            }}
            data-h="3"
          >
            Get started
          </a>
          <button
            style={{
              cursor: "pointer",
              font: "inherit",
              ...{
                height: "44px",
                padding: "0 22px",
                borderRadius: "999px",
                background: "var(--bg)",
                color: "var(--fg)",
                border: "1px solid var(--border2)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                fontSize: "15px",
                fontWeight: "500",
              },
            }}
            data-h="4"
            type="button"
            onClick={onDemo}
            disabled={demoPending}
          >
            Try the demo
          </button>
        </div>
      </div>
    </section>
  );
}
