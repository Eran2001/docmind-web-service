// Generated from the DocMind Landing design (Claude Design export), then kept as normal source.
import { routes } from "@/configs/routes";

const SHOW_PROGRESS_BAR = true;

export function Header({
  themeLabel,
  toggleTheme,
}: {
  themeLabel: string;
  toggleTheme: () => void;
}) {
  return (
    <header
      data-header=""
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        right: "0",
        zIndex: "50",
        height: "64px",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "0",
          opacity: "var(--hs)",
          transition: "opacity .25s ease",
          background: "color-mix(in srgb, var(--bg) 80%, transparent)",
          backdropFilter: "saturate(1.5) blur(14px)",
          borderBottom: "1px solid var(--border)",
        }}
      />
      {/* Reading-progress hairline under the header. */}
      {SHOW_PROGRESS_BAR && (
        <>
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "0",
              right: "0",
              bottom: "-1px",
              height: "1px",
              background: "var(--fg)",
              transformOrigin: "0 50%",
              transform: "scaleX(var(--pg))",
              opacity: "var(--hs)",
            }}
          />
        </>
      )}
      <nav
        aria-label="Main"
        style={{
          position: "relative",
          height: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <a
          href="#top"
          aria-label="DocMind home"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
            color: "var(--fg)",
            marginRight: "auto",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "8px",
              background: "var(--fg)",
              color: "var(--on-fg)",
              display: "grid",
              placeItems: "center",
              fontWeight: "700",
              fontSize: "15px",
              letterSpacing: "-0.02em",
            }}
          >
            D
          </span>
          <span
            style={{
              fontWeight: "600",
              fontSize: "17px",
              letterSpacing: "-0.025em",
            }}
          >
            DocMind
          </span>
        </a>
        <a
          data-desk=""
          href="#product"
          style={{
            fontSize: "14px",
            color: "var(--fg2)",
            textDecoration: "none",
            padding: "8px 12px",
            borderRadius: "999px",
          }}
          data-h="5"
        >
          Product
        </a>
        <a
          href={routes.login}
          style={{
            fontSize: "14px",
            color: "var(--fg2)",
            textDecoration: "none",
            padding: "8px 12px",
            borderRadius: "999px",
          }}
          data-h="6"
        >
          Sign in
        </a>
        <a
          href={routes.register}
          style={{
            fontSize: "14px",
            fontWeight: "500",
            color: "var(--on-fg)",
            background: "var(--fg)",
            textDecoration: "none",
            height: "36px",
            padding: "0 16px",
            borderRadius: "999px",
            display: "inline-flex",
            alignItems: "center",
          }}
          data-h="7"
        >
          Get started
        </a>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={themeLabel}
          title={themeLabel}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "999px",
            border: "1px solid var(--border)",
            background: "transparent",
            color: "var(--fg)",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
            padding: "0",
          }}
          data-h="8"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <circle
              cx="8"
              cy="8"
              r="6.5"
              style={{
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1.3",
              }}
            />
            <path
              d="M8 1.5 A6.5 6.5 0 0 1 8 14.5 Z"
              style={{ fill: "currentColor" }}
            />
          </svg>
        </button>
      </nav>
    </header>
  );
}
