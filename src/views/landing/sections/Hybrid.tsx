// Generated from the DocMind Landing design (Claude Design export), then kept as normal source.
export function Hybrid() {
  return (
    <section
      id="search"
      data-scene="pin"
      data-len="320"
      aria-labelledby="search-h"
      style={{ height: "320vh", position: "relative" }}
    >
      <div
        data-pin=""
        style={{
          position: "sticky",
          top: "0",
          height: "100dvh",
          display: "flex",
          alignItems: "center",
          padding: "80px 20px 32px",
        }}
      >
        <div
          style={{
            maxWidth: "1160px",
            margin: "0 auto",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "clamp(28px, 4.5vh, 48px)",
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
              style={{
                flex: "1 1 420px",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "12px",
                  color: "var(--muted)",
                }}
              >
                Hybrid search
              </span>
              <h2
                id="search-h"
                style={{
                  margin: "0",
                  fontSize: "clamp(32px, 4.4vw, 56px)",
                  fontWeight: "600",
                  letterSpacing: "-0.04em",
                  lineHeight: "1.04",
                  textWrap: "balance",
                }}
              >
                Two searches. One ranked list.
              </h2>
            </div>
            <p
              style={{
                flex: "1 1 340px",
                margin: "0",
                fontSize: "16px",
                lineHeight: "1.55",
                color: "var(--fg2)",
                textWrap: "pretty",
              }}
            >
              Keyword search catches exact terms like policy numbers. Semantic
              search catches the same meaning in different words. Reciprocal
              Rank Fusion merges both into the 8 passages the answer is written
              from.
            </p>
          </div>
          <div
            role="img"
            aria-label="Diagram: the question runs as a keyword search and a meaning search. Each returns its own ranked list. Reciprocal Rank Fusion merges them into one list of the top 8 passages."
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "stretch",
              gap: "16px 0",
            }}
          >
            <div
              style={{
                flex: "1 1 200px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                data-r="0 0.07"
                style={{
                  width: "100%",
                  border: "1px solid var(--border2)",
                  borderRadius: "14px",
                  padding: "16px",
                  background: "var(--bg)",
                  boxShadow: "var(--shadow)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  opacity: "var(--t)",
                  transform: "translateY(calc((1 - var(--t)) * 14px))",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "11px",
                    color: "var(--muted)",
                  }}
                >
                  Question
                </span>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "500",
                    lineHeight: "1.35",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Can contractors take parental leave?
                </span>
              </div>
            </div>
            <div
              data-desk=""
              aria-hidden="true"
              style={{ flex: "0 0 64px", position: "relative" }}
            >
              <svg
                data-r="0.08 0.2"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{
                  position: "absolute",
                  inset: "0",
                  width: "100%",
                  height: "100%",
                  overflow: "visible",
                  clipPath: "inset(-2px calc((1 - var(--t)) * 100%) -2px 0)",
                }}
              >
                <path
                  d="M0 50 C50 50 50 25 100 25"
                  vectorEffect="non-scaling-stroke"
                  style={{
                    fill: "none",
                    stroke: "var(--fg)",
                    strokeWidth: "1.25",
                  }}
                />
                <path
                  d="M0 50 C50 50 50 75 100 75"
                  vectorEffect="non-scaling-stroke"
                  style={{
                    fill: "none",
                    stroke: "var(--fg)",
                    strokeWidth: "1.25",
                  }}
                />
              </svg>
            </div>
            <div
              style={{
                flex: "1 1 270px",
                display: "grid",
                gridTemplateRows: "1fr 1fr",
                gap: "16px",
                minWidth: "0",
              }}
            >
              <div
                data-r="0.18 0.24"
                style={{
                  alignSelf: "center",
                  border: "1px solid var(--border)",
                  borderRadius: "14px",
                  padding: "12px 14px",
                  background: "var(--bg)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  opacity: "var(--t)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "8px",
                    fontFamily: "var(--mono)",
                    fontSize: "11px",
                  }}
                >
                  <span>Keyword</span>
                  <span style={{ color: "var(--muted)" }}>exact terms</span>
                </div>
                <ol
                  data-stagger="0.22 0.4"
                  style={{ listStyle: "none", margin: "0", padding: "0" }}
                >
                  <li
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "baseline",
                      padding: "6px 0",
                      borderTop: "1px solid var(--border)",
                      fontSize: "13px",
                      opacity: "var(--t)",
                      transform: "translateX(calc((1 - var(--t)) * -10px))",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "11px",
                        color: "var(--muted)",
                      }}
                    >
                      1
                    </span>
                    <span
                      style={{ flex: "1", minWidth: "0", color: "var(--fg2)" }}
                    >
                      <strong style={{ color: "var(--fg)", fontWeight: "600" }}>
                        Parental leave
                      </strong>
                      {" request steps"}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "10.5px",
                        color: "var(--muted)",
                      }}
                    >
                      Leave p.2
                    </span>
                  </li>
                  <li
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "baseline",
                      padding: "6px 0",
                      borderTop: "1px solid var(--border)",
                      fontSize: "13px",
                      opacity: "var(--t)",
                      transform: "translateX(calc((1 - var(--t)) * -10px))",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "11px",
                        color: "var(--muted)",
                      }}
                    >
                      2
                    </span>
                    <span
                      style={{ flex: "1", minWidth: "0", color: "var(--fg2)" }}
                    >
                      {"§4.2 "}
                      <strong style={{ color: "var(--fg)", fontWeight: "600" }}>
                        Contractors
                      </strong>
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "10.5px",
                        color: "var(--muted)",
                      }}
                    >
                      Handbook p.31
                    </span>
                  </li>
                  <li
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "baseline",
                      padding: "6px 0",
                      borderTop: "1px solid var(--border)",
                      fontSize: "13px",
                      opacity: "var(--t)",
                      transform: "translateX(calc((1 - var(--t)) * -10px))",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "11px",
                        color: "var(--muted)",
                      }}
                    >
                      3
                    </span>
                    <span
                      style={{ flex: "1", minWidth: "0", color: "var(--fg2)" }}
                    >
                      <strong style={{ color: "var(--fg)", fontWeight: "600" }}>
                        Leave
                      </strong>
                      {" carry-over rules"}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "10.5px",
                        color: "var(--muted)",
                      }}
                    >
                      Handbook p.16
                    </span>
                  </li>
                  <li
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "baseline",
                      padding: "6px 0",
                      borderTop: "1px solid var(--border)",
                      fontSize: "13px",
                      opacity: "var(--t)",
                      transform: "translateX(calc((1 - var(--t)) * -10px))",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "11px",
                        color: "var(--muted)",
                      }}
                    >
                      4
                    </span>
                    <span
                      style={{ flex: "1", minWidth: "0", color: "var(--fg2)" }}
                    >
                      <strong style={{ color: "var(--fg)", fontWeight: "600" }}>
                        Parental
                      </strong>
                      {" benefits FAQ"}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "10.5px",
                        color: "var(--muted)",
                      }}
                    >
                      FAQ.md
                    </span>
                  </li>
                </ol>
              </div>
              <div
                data-r="0.2 0.26"
                style={{
                  alignSelf: "center",
                  border: "1px solid var(--border)",
                  borderRadius: "14px",
                  padding: "12px 14px",
                  background: "var(--bg)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  opacity: "var(--t)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "8px",
                    fontFamily: "var(--mono)",
                    fontSize: "11px",
                  }}
                >
                  <span>Meaning</span>
                  <span style={{ color: "var(--muted)" }}>
                    same idea, other words
                  </span>
                </div>
                <ol
                  data-stagger="0.25 0.44"
                  style={{ listStyle: "none", margin: "0", padding: "0" }}
                >
                  <li
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "baseline",
                      padding: "6px 0",
                      borderTop: "1px solid var(--border)",
                      fontSize: "13px",
                      opacity: "var(--t)",
                      transform: "translateX(calc((1 - var(--t)) * -10px))",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "11px",
                        color: "var(--muted)",
                      }}
                    >
                      1
                    </span>
                    <span
                      style={{ flex: "1", minWidth: "0", color: "var(--fg2)" }}
                    >
                      {"Non-employees aren't eligible for paid time off"}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "10.5px",
                        color: "var(--muted)",
                      }}
                    >
                      Handbook p.31
                    </span>
                  </li>
                  <li
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "baseline",
                      padding: "6px 0",
                      borderTop: "1px solid var(--border)",
                      fontSize: "13px",
                      opacity: "var(--t)",
                      transform: "translateX(calc((1 - var(--t)) * -10px))",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "11px",
                        color: "var(--muted)",
                      }}
                    >
                      2
                    </span>
                    <span
                      style={{ flex: "1", minWidth: "0", color: "var(--fg2)" }}
                    >
                      Time off after a birth or adoption
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "10.5px",
                        color: "var(--muted)",
                      }}
                    >
                      Leave p.1
                    </span>
                  </li>
                  <li
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "baseline",
                      padding: "6px 0",
                      borderTop: "1px solid var(--border)",
                      fontSize: "13px",
                      opacity: "var(--t)",
                      transform: "translateX(calc((1 - var(--t)) * -10px))",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "11px",
                        color: "var(--muted)",
                      }}
                    >
                      3
                    </span>
                    <span
                      style={{ flex: "1", minWidth: "0", color: "var(--fg2)" }}
                    >
                      Freelance agreements exclude benefits
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "10.5px",
                        color: "var(--muted)",
                      }}
                    >
                      Handbook p.32
                    </span>
                  </li>
                  <li
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "baseline",
                      padding: "6px 0",
                      borderTop: "1px solid var(--border)",
                      fontSize: "13px",
                      opacity: "var(--t)",
                      transform: "translateX(calc((1 - var(--t)) * -10px))",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "11px",
                        color: "var(--muted)",
                      }}
                    >
                      4
                    </span>
                    <span
                      style={{ flex: "1", minWidth: "0", color: "var(--fg2)" }}
                    >
                      Returning to work with a new child
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "10.5px",
                        color: "var(--muted)",
                      }}
                    >
                      Leave p.4
                    </span>
                  </li>
                </ol>
              </div>
            </div>
            <div
              data-desk=""
              aria-hidden="true"
              style={{ flex: "0 0 88px", position: "relative" }}
            >
              <svg
                data-r="0.46 0.58"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{
                  position: "absolute",
                  inset: "0",
                  width: "100%",
                  height: "100%",
                  overflow: "visible",
                  clipPath: "inset(-2px calc((1 - var(--t)) * 100%) -2px 0)",
                }}
              >
                <path
                  d="M0 25 C50 25 50 50 100 50"
                  vectorEffect="non-scaling-stroke"
                  style={{
                    fill: "none",
                    stroke: "var(--fg)",
                    strokeWidth: "1.25",
                  }}
                />
                <path
                  d="M0 75 C50 75 50 50 100 50"
                  vectorEffect="non-scaling-stroke"
                  style={{
                    fill: "none",
                    stroke: "var(--fg)",
                    strokeWidth: "1.25",
                  }}
                />
              </svg>{" "}
              <span
                data-r="0.54 0.6"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform:
                    "translate(-50%, -50%) scale(calc(0.9 + var(--t) * 0.1))",
                  opacity: "var(--t)",
                  fontFamily: "var(--mono)",
                  fontSize: "10.5px",
                  background: "var(--fg)",
                  color: "var(--on-fg)",
                  borderRadius: "999px",
                  padding: "3px 8px",
                }}
              >
                RRF
              </span>
            </div>
            <div
              style={{
                flex: "1 1 290px",
                display: "flex",
                alignItems: "center",
                minWidth: "0",
              }}
            >
              <div
                data-r="0.56 0.62"
                style={{
                  width: "100%",
                  border: "1px solid var(--border2)",
                  borderRadius: "14px",
                  padding: "12px 14px",
                  background: "var(--bg)",
                  boxShadow: "var(--shadow)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  opacity: "var(--t)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "8px",
                    fontFamily: "var(--mono)",
                    fontSize: "11px",
                  }}
                >
                  <span>Top 8 passages</span>
                  <span style={{ color: "var(--muted)" }}>merged</span>
                </div>
                <ol
                  data-stagger="0.6 0.92"
                  style={{ listStyle: "none", margin: "0", padding: "0" }}
                >
                  <li
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      padding: "5px 0",
                      borderTop: "1px solid var(--border)",
                      fontSize: "12.5px",
                      opacity: "var(--t)",
                      transform: "translateX(calc((1 - var(--t)) * 10px))",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "11px",
                        width: "12px",
                      }}
                    >
                      1
                    </span>
                    <span
                      style={{
                        flex: "1",
                        minWidth: "0",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {"§4.2 Contractors"}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "10px",
                        color: "var(--muted)",
                      }}
                    >
                      p.31
                    </span>
                    <span
                      style={{
                        display: "flex",
                        gap: "3px",
                        fontFamily: "var(--mono)",
                        fontSize: "9.5px",
                      }}
                    >
                      <span
                        style={{
                          border: "1px solid var(--border2)",
                          borderRadius: "4px",
                          padding: "0 4px",
                        }}
                      >
                        K
                      </span>
                      <span
                        style={{
                          border: "1px solid var(--border2)",
                          borderRadius: "4px",
                          padding: "0 4px",
                        }}
                      >
                        M
                      </span>
                    </span>
                  </li>
                  <li
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      padding: "5px 0",
                      borderTop: "1px solid var(--border)",
                      fontSize: "12.5px",
                      opacity: "var(--t)",
                      transform: "translateX(calc((1 - var(--t)) * 10px))",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "11px",
                        width: "12px",
                      }}
                    >
                      2
                    </span>
                    <span
                      style={{
                        flex: "1",
                        minWidth: "0",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Time off after a birth
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "10px",
                        color: "var(--muted)",
                      }}
                    >
                      Leave p.1
                    </span>
                    <span
                      style={{
                        display: "flex",
                        gap: "3px",
                        fontFamily: "var(--mono)",
                        fontSize: "9.5px",
                      }}
                    >
                      <span
                        style={{
                          border: "1px solid var(--border2)",
                          borderRadius: "4px",
                          padding: "0 4px",
                        }}
                      >
                        M
                      </span>
                    </span>
                  </li>
                  <li
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      padding: "5px 0",
                      borderTop: "1px solid var(--border)",
                      fontSize: "12.5px",
                      opacity: "var(--t)",
                      transform: "translateX(calc((1 - var(--t)) * 10px))",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "11px",
                        width: "12px",
                      }}
                    >
                      3
                    </span>
                    <span
                      style={{
                        flex: "1",
                        minWidth: "0",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Parental leave request steps
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "10px",
                        color: "var(--muted)",
                      }}
                    >
                      Leave p.2
                    </span>
                    <span
                      style={{
                        display: "flex",
                        gap: "3px",
                        fontFamily: "var(--mono)",
                        fontSize: "9.5px",
                      }}
                    >
                      <span
                        style={{
                          border: "1px solid var(--border2)",
                          borderRadius: "4px",
                          padding: "0 4px",
                        }}
                      >
                        K
                      </span>
                    </span>
                  </li>
                  <li
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      padding: "5px 0",
                      borderTop: "1px solid var(--border)",
                      fontSize: "12.5px",
                      opacity: "var(--t)",
                      transform: "translateX(calc((1 - var(--t)) * 10px))",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "11px",
                        width: "12px",
                      }}
                    >
                      4
                    </span>
                    <span
                      style={{
                        flex: "1",
                        minWidth: "0",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Freelance agreements
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "10px",
                        color: "var(--muted)",
                      }}
                    >
                      p.32
                    </span>
                    <span
                      style={{
                        display: "flex",
                        gap: "3px",
                        fontFamily: "var(--mono)",
                        fontSize: "9.5px",
                      }}
                    >
                      <span
                        style={{
                          border: "1px solid var(--border2)",
                          borderRadius: "4px",
                          padding: "0 4px",
                        }}
                      >
                        M
                      </span>
                    </span>
                  </li>
                  <li
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      padding: "5px 0",
                      borderTop: "1px solid var(--border)",
                      fontSize: "12.5px",
                      opacity: "var(--t)",
                      transform: "translateX(calc((1 - var(--t)) * 10px))",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "11px",
                        width: "12px",
                      }}
                    >
                      5
                    </span>
                    <span
                      style={{
                        flex: "1",
                        minWidth: "0",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Parental benefits FAQ
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "10px",
                        color: "var(--muted)",
                      }}
                    >
                      FAQ.md
                    </span>
                    <span
                      style={{
                        display: "flex",
                        gap: "3px",
                        fontFamily: "var(--mono)",
                        fontSize: "9.5px",
                      }}
                    >
                      <span
                        style={{
                          border: "1px solid var(--border2)",
                          borderRadius: "4px",
                          padding: "0 4px",
                        }}
                      >
                        K
                      </span>
                    </span>
                  </li>
                  <li
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      padding: "5px 0",
                      borderTop: "1px solid var(--border)",
                      fontSize: "12.5px",
                      opacity: "var(--t)",
                      transform: "translateX(calc((1 - var(--t)) * 10px))",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "11px",
                        width: "12px",
                      }}
                    >
                      6
                    </span>
                    <span
                      style={{
                        flex: "1",
                        minWidth: "0",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Returning with a new child
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "10px",
                        color: "var(--muted)",
                      }}
                    >
                      Leave p.4
                    </span>
                    <span
                      style={{
                        display: "flex",
                        gap: "3px",
                        fontFamily: "var(--mono)",
                        fontSize: "9.5px",
                      }}
                    >
                      <span
                        style={{
                          border: "1px solid var(--border2)",
                          borderRadius: "4px",
                          padding: "0 4px",
                        }}
                      >
                        M
                      </span>
                    </span>
                  </li>
                  <li
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      padding: "5px 0",
                      borderTop: "1px solid var(--border)",
                      fontSize: "12.5px",
                      opacity: "var(--t)",
                      transform: "translateX(calc((1 - var(--t)) * 10px))",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "11px",
                        width: "12px",
                      }}
                    >
                      7
                    </span>
                    <span
                      style={{
                        flex: "1",
                        minWidth: "0",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Leave carry-over rules
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "10px",
                        color: "var(--muted)",
                      }}
                    >
                      p.16
                    </span>
                    <span
                      style={{
                        display: "flex",
                        gap: "3px",
                        fontFamily: "var(--mono)",
                        fontSize: "9.5px",
                      }}
                    >
                      <span
                        style={{
                          border: "1px solid var(--border2)",
                          borderRadius: "4px",
                          padding: "0 4px",
                        }}
                      >
                        K
                      </span>
                    </span>
                  </li>
                  <li
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      padding: "5px 0",
                      borderTop: "1px solid var(--border)",
                      fontSize: "12.5px",
                      opacity: "var(--t)",
                      transform: "translateX(calc((1 - var(--t)) * 10px))",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "11px",
                        width: "12px",
                      }}
                    >
                      8
                    </span>
                    <span
                      style={{
                        flex: "1",
                        minWidth: "0",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Eligibility after six months
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "10px",
                        color: "var(--muted)",
                      }}
                    >
                      Leave p.2
                    </span>
                    <span
                      style={{
                        display: "flex",
                        gap: "3px",
                        fontFamily: "var(--mono)",
                        fontSize: "9.5px",
                      }}
                    >
                      <span
                        style={{
                          border: "1px solid var(--border2)",
                          borderRadius: "4px",
                          padding: "0 4px",
                        }}
                      >
                        M
                      </span>
                    </span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
          <p
            data-desk=""
            style={{
              margin: "0",
              fontFamily: "var(--mono)",
              fontSize: "11px",
              color: "var(--muted)",
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <span>{"K = found by keyword"}</span>
            <span>{"M = found by meaning"}</span>
            <span>Found by both ranks higher</span>
          </p>
        </div>
      </div>
    </section>
  );
}
