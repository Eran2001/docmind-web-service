// Generated from the DocMind Landing design (Claude Design export), then kept as normal source.
import { routes } from "@/configs/routes";
import type { DemoProps } from "@/views/landing/types";

export function Hero({ onDemo, demoPending }: DemoProps) {
  return (
    <section
      id="top"
      data-scene="hero"
      style={{
        height: "100dvh",
        minHeight: "600px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "64px 20px 0",
        position: "relative",
      }}
    >
      <div
        data-r="0 1"
        style={{
          maxWidth: "1320px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "28px",
          opacity: "calc(1 - var(--t) * 0.9)",
          transform:
            "translateY(calc(var(--t) * -56px)) scale(calc(1 - var(--t) * 0.06))",
          willChange: "transform, opacity",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            height: "30px",
            padding: "0 14px 0 10px",
            border: "1px solid var(--border)",
            borderRadius: "999px",
            fontSize: "13px",
            color: "var(--fg2)",
            background: "var(--bg)",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "999px",
              background: "var(--fg)",
            }}
          />
          {"Chat with your own documents "}
        </span>
        <h1
          style={{
            margin: "0",
            fontSize: "clamp(46px, 7.6vw, 100px)",
            fontWeight: "600",
            letterSpacing: "-0.045em",
            lineHeight: "1.02",
            textWrap: "balance",
          }}
        >
          Answers from your documents. With sources.
        </h1>
        <p
          style={{
            margin: "0",
            maxWidth: "1000px",
            fontSize: "clamp(16px, 1.6vw, 19px)",
            lineHeight: "1.55",
            color: "var(--fg2)",
            textWrap: "pretty",
          }}
        >
          {
            "Upload handbooks, contracts and papers, then ask in plain language. DocMind answers only from your files and cites the exact page and passage behind every claim. If the answer isn't there, it says so."
          }
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
            data-h="1"
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
            data-h="2"
            type="button"
            onClick={onDemo}
            disabled={demoPending}
          >
            Try the demo
          </button>
        </div>
        <p style={{ margin: "0", fontSize: "13px", color: "var(--muted)" }}>
          For handbooks, contracts, product manuals and research papers
        </p>
      </div>
      <div
        data-cue=""
        data-r="0 0.25"
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "28px",
          left: "0",
          right: "0",
          display: "flex",
          justifyContent: "center",
          opacity: "calc(1 - var(--t))",
        }}
      >
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: "11px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--muted)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
        >
          Scroll to see it work
          <span
            style={{
              width: "1px",
              height: "28px",
              background: "var(--border2)",
            }}
          />
        </span>
      </div>
    </section>
  );
}
