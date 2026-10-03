// Generated from the DocMind Landing design (Claude Design export), then kept as normal source.
import { routes } from "@/configs/routes";

export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        padding: "36px 20px 44px",
      }}
    >
      <div
        style={{
          maxWidth: "1160px",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "20px 32px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            aria-hidden="true"
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "7px",
              background: "var(--fg)",
              color: "var(--on-fg)",
              display: "grid",
              placeItems: "center",
              fontWeight: "700",
              fontSize: "13px",
            }}
          >
            D
          </span>
          <span
            style={{
              fontWeight: "600",
              fontSize: "15px",
              letterSpacing: "-0.025em",
            }}
          >
            DocMind
          </span>
        </div>
        <span
          style={{
            fontSize: "13px",
            color: "var(--muted)",
            marginRight: "auto",
          }}
        >
          Built as a full-stack AI project
        </span>
        <nav
          aria-label="Footer"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px 22px",
            fontSize: "13px",
          }}
        >
          <a
            href="#product"
            style={{ color: "var(--fg2)", textDecoration: "none" }}
            data-h="9"
          >
            Product
          </a>
          <a
            href="#how"
            style={{ color: "var(--fg2)", textDecoration: "none" }}
            data-h="10"
          >
            How it works
          </a>
          <a
            href="#faq"
            style={{ color: "var(--fg2)", textDecoration: "none" }}
            data-h="11"
          >
            FAQ
          </a>
          <a
            href={routes.login}
            style={{ color: "var(--fg2)", textDecoration: "none" }}
            data-h="12"
          >
            Sign in
          </a>
          <a
            href={routes.register}
            style={{ color: "var(--fg2)", textDecoration: "none" }}
            data-h="13"
          >
            Get started
          </a>
        </nav>
      </div>
    </footer>
  );
}
