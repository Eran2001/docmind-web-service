// Generated from the DocMind Landing design (Claude Design export), then kept as normal source.
export function Problem() {
  return (
    <section
      data-scene="pin"
      data-len="260"
      aria-labelledby="problem-h"
      style={{ height: "260vh", position: "relative" }}
    >
      <div
        data-pin=""
        style={{
          position: "sticky",
          top: "0",
          height: "100dvh",
          display: "flex",
          alignItems: "center",
          padding: "80px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "1120px",
            margin: "0 auto",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "clamp(32px, 5vh, 56px)",
          }}
        >
          <div
            data-r="0.66 0.76"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "28px",
              opacity: "calc(1 - var(--t) * 0.7)",
            }}
          >
            <h2
              id="problem-h"
              style={{
                margin: "0",
                fontSize: "clamp(38px, 6.6vw, 88px)",
                fontWeight: "600",
                letterSpacing: "-0.045em",
                lineHeight: "1.03",
                display: "flex",
                flexDirection: "column",
                gap: "0.16em",
              }}
            >
              <span
                data-stagger="0.03 0.24"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  columnGap: "0.24em",
                }}
              >
                <span style={{ opacity: "calc(0.12 + var(--t) * 0.88)" }}>
                  Keyword
                </span>
                <span style={{ opacity: "calc(0.12 + var(--t) * 0.88)" }}>
                  search
                </span>
                <span style={{ opacity: "calc(0.12 + var(--t) * 0.88)" }}>
                  misses
                </span>
                <span style={{ opacity: "calc(0.12 + var(--t) * 0.88)" }}>
                  it.
                </span>
              </span>
              <span
                data-stagger="0.34 0.56"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  columnGap: "0.24em",
                }}
              >
                <span style={{ opacity: "calc(0.12 + var(--t) * 0.88)" }}>
                  A
                </span>
                <span style={{ opacity: "calc(0.12 + var(--t) * 0.88)" }}>
                  chatbot
                </span>
                <span style={{ opacity: "calc(0.12 + var(--t) * 0.88)" }}>
                  makes
                </span>
                <span style={{ opacity: "calc(0.12 + var(--t) * 0.88)" }}>
                  it
                </span>
                <span style={{ opacity: "calc(0.12 + var(--t) * 0.88)" }}>
                  up.
                </span>
              </span>
            </h2>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px 40px",
                fontFamily: "var(--mono)",
                fontSize: "13px",
                lineHeight: "1.6",
                color: "var(--muted)",
              }}
            >
              <p
                data-r="0.22 0.3"
                style={{
                  margin: "0",
                  maxWidth: "420px",
                  opacity: "var(--t)",
                  transform: "translateY(calc((1 - var(--t)) * 12px))",
                }}
              >
                You search “parental leave”. The handbook says “time off after a
                birth or adoption”. Zero results.
              </p>
              <p
                data-r="0.54 0.62"
                style={{
                  margin: "0",
                  maxWidth: "420px",
                  opacity: "var(--t)",
                  transform: "translateY(calc((1 - var(--t)) * 12px))",
                }}
              >
                A general chatbot has never read your files. It answers fluently
                anyway, with no page to check it against.
              </p>
            </div>
          </div>
          <p
            data-r="0.7 0.84"
            style={{
              margin: "0",
              fontSize: "clamp(28px, 4.2vw, 54px)",
              fontWeight: "600",
              letterSpacing: "-0.035em",
              lineHeight: "1.1",
              maxWidth: "960px",
              textWrap: "balance",
              opacity: "var(--t)",
              transform: "translateY(calc((1 - var(--t)) * 28px))",
            }}
          >
            {"DocMind finds it, and "}
            <mark
              data-r="0.84 0.96"
              style={{
                background:
                  "color-mix(in srgb, var(--hl) calc(var(--t) * 100%), transparent)",
                borderRadius: "6px",
                padding: "0 4px",
                boxDecorationBreak: "clone",
                WebkitBoxDecorationBreak: "clone",
              }}
            >
              shows you where it came from.
            </mark>
          </p>
        </div>
      </div>
    </section>
  );
}
