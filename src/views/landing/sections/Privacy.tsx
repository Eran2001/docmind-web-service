// Generated from the DocMind Landing design (Claude Design export), then kept as normal source.
export function Privacy() {
  return (
    <section
      data-scene="reveal"
      aria-labelledby="trust-h"
      style={{
        padding: "clamp(72px, 10vh, 120px) 20px",
        background: "var(--subtle)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          maxWidth: "1160px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "36px",
        }}
      >
        <h2
          id="trust-h"
          data-r="0 0.2"
          style={{
            margin: "0",
            fontSize: "clamp(26px, 3vw, 36px)",
            fontWeight: "600",
            letterSpacing: "-0.03em",
            opacity: "var(--t)",
          }}
        >
          Private by default.
        </h2>
        <ul
          data-stagger="0.1 0.6"
          style={{
            listStyle: "none",
            margin: "0",
            padding: "0",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "28px",
          }}
        >
          <li
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              opacity: "var(--t)",
              transform: "translateY(calc((1 - var(--t)) * 18px))",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: "36px",
                height: "36px",
                border: "1px solid var(--border2)",
                borderRadius: "10px",
                display: "grid",
                placeItems: "center",
                background: "var(--bg)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16">
                <rect
                  x="3"
                  y="7"
                  width="10"
                  height="7"
                  rx="1.5"
                  style={{
                    fill: "none",
                    stroke: "var(--fg)",
                    strokeWidth: "1.3",
                  }}
                />
                <path
                  d="M5.5 7 V5 a2.5 2.5 0 0 1 5 0 V7"
                  style={{
                    fill: "none",
                    stroke: "var(--fg)",
                    strokeWidth: "1.3",
                  }}
                />
              </svg>
            </span>
            <span style={{ fontSize: "15px", fontWeight: "600" }}>
              Your collections are yours
            </span>
            <span
              style={{
                fontSize: "14px",
                lineHeight: "1.55",
                color: "var(--fg2)",
              }}
            >
              Each collection is visible only to the account that created it.
            </span>
          </li>
          <li
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              opacity: "var(--t)",
              transform: "translateY(calc((1 - var(--t)) * 18px))",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: "36px",
                height: "36px",
                border: "1px solid var(--border2)",
                borderRadius: "10px",
                display: "grid",
                placeItems: "center",
                background: "var(--bg)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path
                  d="M6 2 L5 14 M11 2 L10 14 M2.5 5.5 H14 M2 10.5 H13.5"
                  style={{
                    fill: "none",
                    stroke: "var(--fg)",
                    strokeWidth: "1.3",
                  }}
                />
              </svg>
            </span>
            <span style={{ fontSize: "15px", fontWeight: "600" }}>
              Argon2 password hashing
            </span>
            <span
              style={{
                fontSize: "14px",
                lineHeight: "1.55",
                color: "var(--fg2)",
              }}
            >
              Passwords are hashed with Argon2 and never stored as plain text.
            </span>
          </li>
          <li
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              opacity: "var(--t)",
              transform: "translateY(calc((1 - var(--t)) * 18px))",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: "36px",
                height: "36px",
                border: "1px solid var(--border2)",
                borderRadius: "10px",
                display: "grid",
                placeItems: "center",
                background: "var(--bg)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16">
                <circle
                  cx="8"
                  cy="8"
                  r="5.5"
                  style={{
                    fill: "none",
                    stroke: "var(--fg)",
                    strokeWidth: "1.3",
                  }}
                />
                <path
                  d="M8 8 L11 5.5"
                  style={{
                    fill: "none",
                    stroke: "var(--fg)",
                    strokeWidth: "1.3",
                  }}
                />
              </svg>
            </span>
            <span style={{ fontSize: "15px", fontWeight: "600" }}>
              Rate-limited routes
            </span>
            <span
              style={{
                fontSize: "14px",
                lineHeight: "1.55",
                color: "var(--fg2)",
              }}
            >
              Sign-in and other sensitive routes are rate-limited.
            </span>
          </li>
          <li
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              opacity: "var(--t)",
              transform: "translateY(calc((1 - var(--t)) * 18px))",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: "36px",
                height: "36px",
                border: "1px solid var(--border2)",
                borderRadius: "10px",
                display: "grid",
                placeItems: "center",
                background: "var(--bg)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16">
                <rect
                  x="3.5"
                  y="2"
                  width="9"
                  height="12"
                  rx="1.5"
                  style={{
                    fill: "none",
                    stroke: "var(--fg)",
                    strokeWidth: "1.3",
                  }}
                />
                <path
                  d="M6 6 H10 M6 9 H9"
                  style={{
                    fill: "none",
                    stroke: "var(--fg)",
                    strokeWidth: "1.3",
                  }}
                />
              </svg>
            </span>
            <span style={{ fontSize: "15px", fontWeight: "600" }}>
              {"Honest when it can't answer"}
            </span>
            <span
              style={{
                fontSize: "14px",
                lineHeight: "1.55",
                color: "var(--fg2)",
              }}
            >
              {
                "If your documents don't contain it, you'll read “I couldn't find that in your documents.”"
              }
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
}
