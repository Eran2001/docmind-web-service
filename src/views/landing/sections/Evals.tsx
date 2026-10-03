// Generated from the DocMind Landing design (Claude Design export), then kept as normal source.
export function Evals() {
  return (
    <section
      id="evals"
      data-scene="reveal"
      aria-labelledby="evals-h"
      style={{ padding: "clamp(96px, 14vh, 160px) 20px" }}
    >
      <div
        style={{
          maxWidth: "1160px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "48px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            gap: "16px 48px",
          }}
        >
          <div
            data-r="0 0.2"
            style={{
              flex: "1 1 420px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              opacity: "var(--t)",
              transform: "translateY(calc((1 - var(--t)) * 20px))",
            }}
          >
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: "12px",
                color: "var(--muted)",
              }}
            >
              Evals
            </span>
            <h2
              id="evals-h"
              style={{
                margin: "0",
                fontSize: "clamp(32px, 4.4vw, 56px)",
                fontWeight: "600",
                letterSpacing: "-0.04em",
                lineHeight: "1.04",
                textWrap: "balance",
              }}
            >
              Know when an answer gets worse.
            </h2>
          </div>
          <p
            data-r="0.05 0.25"
            style={{
              flex: "1 1 340px",
              margin: "0",
              fontSize: "16px",
              lineHeight: "1.55",
              color: "var(--fg2)",
              opacity: "var(--t)",
              textWrap: "pretty",
            }}
          >
            {
              "Write test questions with known answers. Run them after you change your documents. Every run is scored, with the judge's reasoning, and a usage view shows what it cost."
            }
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            alignItems: "stretch",
          }}
        >
          <div
            data-r="0.1 0.3"
            style={{
              flex: "1.5 1 460px",
              minWidth: "0",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              background: "var(--bg)",
              display: "flex",
              flexDirection: "column",
              opacity: "var(--t)",
              transform: "translateY(calc((1 - var(--t)) * 28px))",
            }}
          >
            <div
              style={{
                padding: "16px 22px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <span style={{ fontSize: "14px", fontWeight: "600" }}>
                {"Eval run · HR Handbook 2026"}
              </span>
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "11.5px",
                  color: "var(--muted)",
                }}
              >
                24 test questions
              </span>
            </div>
            <div
              style={{
                padding: "8px 22px 4px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "minmax(110px, 160px) minmax(0, 1fr) 48px",
                  alignItems: "center",
                  gap: "16px",
                  padding: "14px 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <span style={{ fontSize: "14px" }}>Correctness</span>
                <span
                  style={{
                    height: "6px",
                    borderRadius: "999px",
                    background: "var(--surface)",
                    overflow: "hidden",
                  }}
                >
                  <span
                    data-r="0.2 0.5"
                    style={{
                      display: "block",
                      height: "100%",
                      borderRadius: "999px",
                      background: "var(--fg)",
                      transformOrigin: "0 50%",
                      transform: "scaleX(calc(var(--t) * 0.92))",
                    }}
                  />
                </span>
                <span
                  data-r="0.2 0.5"
                  data-count="0.92"
                  data-dec="2"
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "14px",
                    textAlign: "right",
                  }}
                >
                  0.92
                </span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "minmax(110px, 160px) minmax(0, 1fr) 48px",
                  alignItems: "center",
                  gap: "16px",
                  padding: "14px 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <span style={{ fontSize: "14px" }}>Faithfulness</span>
                <span
                  style={{
                    height: "6px",
                    borderRadius: "999px",
                    background: "var(--surface)",
                    overflow: "hidden",
                  }}
                >
                  <span
                    data-r="0.25 0.55"
                    style={{
                      display: "block",
                      height: "100%",
                      borderRadius: "999px",
                      background: "var(--fg)",
                      transformOrigin: "0 50%",
                      transform: "scaleX(calc(var(--t) * 0.96))",
                    }}
                  />
                </span>
                <span
                  data-r="0.25 0.55"
                  data-count="0.96"
                  data-dec="2"
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "14px",
                    textAlign: "right",
                  }}
                >
                  0.96
                </span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "minmax(110px, 160px) minmax(0, 1fr) 48px",
                  alignItems: "center",
                  gap: "16px",
                  padding: "14px 0",
                }}
              >
                <span style={{ fontSize: "14px" }}>Retrieval hit rate</span>
                <span
                  style={{
                    height: "6px",
                    borderRadius: "999px",
                    background: "var(--surface)",
                    overflow: "hidden",
                  }}
                >
                  <span
                    data-r="0.3 0.6"
                    style={{
                      display: "block",
                      height: "100%",
                      borderRadius: "999px",
                      background: "var(--fg)",
                      transformOrigin: "0 50%",
                      transform: "scaleX(calc(var(--t) * 0.88))",
                    }}
                  />
                </span>
                <span
                  data-r="0.3 0.6"
                  data-count="0.88"
                  data-dec="2"
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "14px",
                    textAlign: "right",
                  }}
                >
                  0.88
                </span>
              </div>
            </div>
            <div
              data-r="0.5 0.7"
              style={{
                margin: "8px 12px 12px",
                borderRadius: "12px",
                background: "var(--subtle)",
                border: "1px solid var(--border)",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                opacity: "var(--t)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: "14px", fontWeight: "500" }}>
                  Can contractors take parental leave?
                </span>
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "11px",
                    padding: "2px 8px",
                    borderRadius: "999px",
                    background: "var(--ok-bg)",
                    color: "var(--ok)",
                  }}
                >
                  Pass
                </span>
              </div>
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "11.5px",
                  color: "var(--muted)",
                }}
              >
                {
                  "Expected: No, employees only · Retrieved: Employee Handbook.pdf p. 31"
                }
              </span>
              <p
                style={{
                  margin: "0",
                  fontSize: "13.5px",
                  lineHeight: "1.6",
                  color: "var(--fg2)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "11.5px",
                    color: "var(--muted)",
                  }}
                >
                  {"Judge "}
                </span>
                The answer says contractors are not eligible and cites p. 31,
                which matches the expected answer. No claims go beyond the
                retrieved passages.
              </p>
            </div>
          </div>
          <div
            data-r="0.15 0.35"
            style={{
              flex: "1 1 320px",
              minWidth: "0",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              background: "var(--bg)",
              display: "flex",
              flexDirection: "column",
              opacity: "var(--t)",
              transform: "translateY(calc((1 - var(--t)) * 28px))",
            }}
          >
            <div
              style={{
                padding: "16px 22px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <span style={{ fontSize: "14px", fontWeight: "600" }}>Usage</span>
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "11.5px",
                  color: "var(--muted)",
                }}
              >
                last 7 days
              </span>
            </div>
            <div
              style={{
                padding: "18px 22px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px 20px",
              }}
            >
              <div
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                  Tokens
                </span>
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "20px",
                    letterSpacing: "-0.02em",
                  }}
                >
                  <span
                    data-r="0.3 0.65"
                    data-count="418"
                    style={{ fontFamily: "var(--mono)" }}
                  >
                    418
                  </span>
                  k
                </span>
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                  Requests
                </span>
                <span
                  data-r="0.3 0.65"
                  data-count="312"
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "20px",
                    letterSpacing: "-0.02em",
                  }}
                >
                  312
                </span>
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                  Est. cost
                </span>
                <span
                  data-r="0.3 0.65"
                  data-count="0.84"
                  data-dec="2"
                  data-pre="$"
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "20px",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {"$0.84"}
                </span>
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                  Median latency
                </span>
                <span
                  data-r="0.3 0.65"
                  data-count="1.8"
                  data-dec="1"
                  data-suf=" s"
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "20px",
                    letterSpacing: "-0.02em",
                  }}
                >
                  1.8 s
                </span>
              </div>
            </div>
            <div
              style={{
                padding: "0 22px 18px",
                marginTop: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                Tokens per day
              </span>
              <div style={{ position: "relative", height: "110px" }}>
                <div
                  style={{
                    position: "absolute",
                    left: "0",
                    right: "0",
                    top: "0",
                    borderTop: "1px dashed var(--border)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: "0",
                    right: "0",
                    top: "50%",
                    borderTop: "1px dashed var(--border)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: "0",
                    right: "0",
                    bottom: "0",
                    borderTop: "1px solid var(--border2)",
                  }}
                />
                <svg
                  data-r="0.3 0.85"
                  data-ease="linear"
                  viewBox="0 0 300 100"
                  preserveAspectRatio="none"
                  aria-label="Line chart of tokens per day over the last 7 days, rising from about 40 thousand to 80 thousand."
                  role="img"
                  style={{
                    position: "absolute",
                    inset: "0",
                    width: "100%",
                    height: "100%",
                    overflow: "visible",
                    clipPath:
                      "inset(-4px calc((1 - var(--t)) * 100%) -4px -4px)",
                  }}
                >
                  <polyline
                    points="0,70 50,58 100,64 150,40 200,46 250,22 300,16"
                    vectorEffect="non-scaling-stroke"
                    style={{
                      fill: "none",
                      stroke: "var(--fg)",
                      strokeWidth: "1.75",
                      strokeLinejoin: "round",
                    }}
                  />
                </svg>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: "var(--mono)",
                  fontSize: "10.5px",
                  color: "var(--muted)",
                }}
              >
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
