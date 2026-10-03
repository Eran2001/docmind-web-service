// Generated from the DocMind Landing design (Claude Design export), then kept as normal source.
export function ProductWindow() {
  return (
    <section
      id="product"
      data-scene="pin"
      data-len="420"
      aria-labelledby="product-h"
      style={{ height: "420vh", position: "relative" }}
    >
      <div
        data-pin=""
        style={{
          position: "sticky",
          top: "0",
          height: "100dvh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "18px",
          padding: "80px 20px 24px",
        }}
      >
        <h2
          id="product-h"
          style={{
            position: "absolute",
            width: "1px",
            height: "1px",
            overflow: "hidden",
            clip: "rect(0 0 0 0)",
            whiteSpace: "nowrap",
            margin: "0",
          }}
        >
          How DocMind works, in four steps
        </h2>
        <p
          style={{
            position: "absolute",
            width: "1px",
            height: "1px",
            overflow: "hidden",
            clip: "rect(0 0 0 0)",
            whiteSpace: "nowrap",
            margin: "0",
          }}
        >
          Step 1: three documents are added to a collection and move from Queued
          to Processing to Ready. Step 2: a question is typed: how much paid
          parental leave do employees get? Step 3: the answer streams in with
          numbered citations. Step 4: clicking citation 1 opens a source panel
          showing Employee Handbook, page 14, with the quoted passage
          highlighted.
        </p>
        <div
          data-r="enter 0.3 1"
          style={{
            maxWidth: "1160px",
            width: "100%",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            opacity: "var(--t)",
          }}
        >
          <ol
            aria-hidden="true"
            style={{
              listStyle: "none",
              margin: "0",
              padding: "0",
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: "12px",
            }}
          >
            <li
              data-r="0 0 0.27 0.29"
              style={{
                opacity: "calc(0.32 + var(--t) * 0.68)",
                display: "flex",
                gap: "8px",
                alignItems: "baseline",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "11px",
                  color: "var(--muted)",
                }}
              >
                01
              </span>
              Upload
            </li>
            <li
              data-r="0.27 0.29 0.46 0.48"
              style={{
                opacity: "calc(0.32 + var(--t) * 0.68)",
                display: "flex",
                gap: "8px",
                alignItems: "baseline",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "11px",
                  color: "var(--muted)",
                }}
              >
                02
              </span>
              Ask
            </li>
            <li
              data-r="0.46 0.48 0.73 0.75"
              style={{
                opacity: "calc(0.32 + var(--t) * 0.68)",
                display: "flex",
                gap: "8px",
                alignItems: "baseline",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "11px",
                  color: "var(--muted)",
                }}
              >
                03
              </span>
              Answer
            </li>
            <li
              data-r="0.73 0.75"
              style={{
                opacity: "calc(0.32 + var(--t) * 0.68)",
                display: "flex",
                gap: "8px",
                alignItems: "baseline",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "11px",
                  color: "var(--muted)",
                }}
              >
                04
              </span>
              Verify
            </li>
          </ol>
          <div
            aria-hidden="true"
            style={{
              height: "1px",
              background: "var(--border)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              data-r="0 1"
              data-ease="linear"
              style={{
                position: "absolute",
                inset: "0",
                background: "var(--fg)",
                transformOrigin: "0 50%",
                transform: "scaleX(var(--t))",
              }}
            />
          </div>
        </div>
        <div
          data-r="enter 0.1 0.95"
          data-window=""
          aria-hidden="true"
          style={{
            maxWidth: "1160px",
            width: "100%",
            margin: "0 auto",
            height: "min(640px, calc(100dvh - 160px))",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            background: "var(--bg)",
            boxShadow: "var(--shadow)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            transform:
              "translateY(calc((1 - var(--t)) * 160px)) scale(calc(0.94 + var(--t) * 0.06))",
            opacity: "calc(0.25 + var(--t) * 0.75)",
            willChange: "transform, opacity",
          }}
        >
          <div
            style={{
              height: "44px",
              flex: "none",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "0 16px",
              fontSize: "13px",
            }}
          >
            <span
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "6px",
                background: "var(--fg)",
                color: "var(--on-fg)",
                display: "grid",
                placeItems: "center",
                fontWeight: "700",
                fontSize: "11px",
              }}
            >
              D
            </span>
            <span style={{ color: "var(--muted)" }}>Collections</span>
            <span style={{ color: "var(--faint)" }}>/</span>
            <span style={{ fontWeight: "500" }}>HR Handbook 2026</span>
            <span
              style={{
                marginLeft: "auto",
                fontFamily: "var(--mono)",
                fontSize: "11px",
                color: "var(--muted)",
              }}
            >
              3 documents
            </span>
          </div>
          <div
            style={{
              flex: "1",
              minHeight: "0",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            <aside
              style={{
                flex: "1 1 240px",
                maxWidth: "100%",
                minWidth: "0",
                background: "var(--subtle)",
                borderRight: "1px solid var(--border)",
                padding: "16px 12px",
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              }}
            >
              <div
                style={{ display: "flex", flexDirection: "column", gap: "2px" }}
              >
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "10.5px",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                    padding: "0 8px 6px",
                  }}
                >
                  Collections
                </span>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: "500",
                    padding: "7px 8px",
                    borderRadius: "8px",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                  }}
                >
                  HR Handbook 2026
                </span>
                <span
                  data-short-hide=""
                  style={{
                    fontSize: "13px",
                    color: "var(--muted)",
                    padding: "7px 8px",
                  }}
                >
                  Supplier contracts
                </span>
                <span
                  data-short-hide=""
                  style={{
                    fontSize: "13px",
                    color: "var(--muted)",
                    padding: "7px 8px",
                  }}
                >
                  Thesis sources
                </span>
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "10.5px",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                    padding: "0 8px",
                  }}
                >
                  Documents
                </span>
                <div
                  data-short-hide=""
                  data-r="0 0 0.02 0.08"
                  style={{
                    fontSize: "12px",
                    color: "var(--muted)",
                    border: "1px dashed var(--border2)",
                    borderRadius: "10px",
                    padding: "12px",
                    textAlign: "center",
                    opacity: "var(--t)",
                  }}
                >
                  Drop files or paste a URL
                </div>
                <div
                  data-r="0.03 0.08"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px",
                    borderRadius: "10px",
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    opacity: "var(--t)",
                    transform: "translateY(calc((1 - var(--t)) * -18px))",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: "9.5px",
                      border: "1px solid var(--border2)",
                      borderRadius: "4px",
                      padding: "2px 4px",
                      color: "var(--fg2)",
                    }}
                  >
                    PDF
                  </span>
                  <span
                    style={{
                      flex: "1",
                      minWidth: "0",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12.5px",
                        fontWeight: "500",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Employee Handbook
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "10px",
                        color: "var(--muted)",
                      }}
                    >
                      {"48 pages · 2.1 MB"}
                    </span>
                  </span>
                  <span style={{ display: "grid", justifyItems: "end" }}>
                    <span
                      data-r="0 0 0.11 0.13"
                      style={{
                        gridArea: "1/1",
                        opacity: "var(--t)",
                        fontFamily: "var(--mono)",
                        fontSize: "10px",
                        padding: "2px 7px",
                        borderRadius: "999px",
                        background: "var(--surface)",
                        color: "var(--muted)",
                      }}
                    >
                      Queued
                    </span>
                    <span
                      data-r="0.11 0.13 0.18 0.2"
                      style={{
                        gridArea: "1/1",
                        opacity: "var(--t)",
                        fontFamily: "var(--mono)",
                        fontSize: "10px",
                        padding: "2px 7px",
                        borderRadius: "999px",
                        background: "var(--warn-bg)",
                        color: "var(--warn)",
                      }}
                    >
                      Processing
                    </span>
                    <span
                      data-r="0.18 0.2"
                      style={{
                        gridArea: "1/1",
                        opacity: "var(--t)",
                        fontFamily: "var(--mono)",
                        fontSize: "10px",
                        padding: "2px 7px",
                        borderRadius: "999px",
                        background: "var(--ok-bg)",
                        color: "var(--ok)",
                      }}
                    >
                      Ready
                    </span>
                  </span>
                </div>
                <div
                  data-r="0.07 0.12"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px",
                    borderRadius: "10px",
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    opacity: "var(--t)",
                    transform: "translateY(calc((1 - var(--t)) * -18px))",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: "9.5px",
                      border: "1px solid var(--border2)",
                      borderRadius: "4px",
                      padding: "2px 4px",
                      color: "var(--fg2)",
                    }}
                  >
                    DOCX
                  </span>
                  <span
                    style={{
                      flex: "1",
                      minWidth: "0",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12.5px",
                        fontWeight: "500",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Leave Policy
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "10px",
                        color: "var(--muted)",
                      }}
                    >
                      {"6 pages · 84 KB"}
                    </span>
                  </span>
                  <span style={{ display: "grid", justifyItems: "end" }}>
                    <span
                      data-r="0 0 0.14 0.16"
                      style={{
                        gridArea: "1/1",
                        opacity: "var(--t)",
                        fontFamily: "var(--mono)",
                        fontSize: "10px",
                        padding: "2px 7px",
                        borderRadius: "999px",
                        background: "var(--surface)",
                        color: "var(--muted)",
                      }}
                    >
                      Queued
                    </span>
                    <span
                      data-r="0.14 0.16 0.21 0.23"
                      style={{
                        gridArea: "1/1",
                        opacity: "var(--t)",
                        fontFamily: "var(--mono)",
                        fontSize: "10px",
                        padding: "2px 7px",
                        borderRadius: "999px",
                        background: "var(--warn-bg)",
                        color: "var(--warn)",
                      }}
                    >
                      Processing
                    </span>
                    <span
                      data-r="0.21 0.23"
                      style={{
                        gridArea: "1/1",
                        opacity: "var(--t)",
                        fontFamily: "var(--mono)",
                        fontSize: "10px",
                        padding: "2px 7px",
                        borderRadius: "999px",
                        background: "var(--ok-bg)",
                        color: "var(--ok)",
                      }}
                    >
                      Ready
                    </span>
                  </span>
                </div>
                <div
                  data-r="0.11 0.16"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px",
                    borderRadius: "10px",
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    opacity: "var(--t)",
                    transform: "translateY(calc((1 - var(--t)) * -18px))",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: "9.5px",
                      border: "1px solid var(--border2)",
                      borderRadius: "4px",
                      padding: "2px 4px",
                      color: "var(--fg2)",
                    }}
                  >
                    MD
                  </span>
                  <span
                    style={{
                      flex: "1",
                      minWidth: "0",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12.5px",
                        fontWeight: "500",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Benefits FAQ
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "10px",
                        color: "var(--muted)",
                      }}
                    >
                      12 KB
                    </span>
                  </span>
                  <span style={{ display: "grid", justifyItems: "end" }}>
                    <span
                      data-r="0 0 0.17 0.19"
                      style={{
                        gridArea: "1/1",
                        opacity: "var(--t)",
                        fontFamily: "var(--mono)",
                        fontSize: "10px",
                        padding: "2px 7px",
                        borderRadius: "999px",
                        background: "var(--surface)",
                        color: "var(--muted)",
                      }}
                    >
                      Queued
                    </span>
                    <span
                      data-r="0.17 0.19 0.24 0.26"
                      style={{
                        gridArea: "1/1",
                        opacity: "var(--t)",
                        fontFamily: "var(--mono)",
                        fontSize: "10px",
                        padding: "2px 7px",
                        borderRadius: "999px",
                        background: "var(--warn-bg)",
                        color: "var(--warn)",
                      }}
                    >
                      Processing
                    </span>
                    <span
                      data-r="0.24 0.26"
                      style={{
                        gridArea: "1/1",
                        opacity: "var(--t)",
                        fontFamily: "var(--mono)",
                        fontSize: "10px",
                        padding: "2px 7px",
                        borderRadius: "999px",
                        background: "var(--ok-bg)",
                        color: "var(--ok)",
                      }}
                    >
                      Ready
                    </span>
                  </span>
                </div>
              </div>
            </aside>
            <div
              data-chatmain=""
              style={{
                flex: "999 1 400px",
                minWidth: "0",
                minHeight: "0",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  flex: "1",
                  minHeight: "0",
                  padding: "24px clamp(16px, 3vw, 40px)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                  position: "relative",
                }}
              >
                <div
                  data-r="0 0 0.43 0.45"
                  style={{
                    position: "absolute",
                    inset: "0",
                    display: "grid",
                    placeItems: "center",
                    opacity: "var(--t)",
                    pointerEvents: "none",
                  }}
                >
                  <div
                    style={{
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    <span style={{ fontSize: "15px", fontWeight: "500" }}>
                      Ask anything about these 3 documents
                    </span>
                    <span style={{ fontSize: "13px", color: "var(--muted)" }}>
                      Answers cite the page they came from.
                    </span>
                  </div>
                </div>
                <div
                  data-r="0.44 0.47"
                  style={{
                    alignSelf: "flex-end",
                    maxWidth: "78%",
                    background: "var(--surface)",
                    borderRadius: "14px",
                    padding: "10px 14px",
                    fontSize: "14px",
                    lineHeight: "1.5",
                    opacity: "var(--t)",
                    transform: "translateY(calc((1 - var(--t)) * 10px))",
                  }}
                >
                  How much paid parental leave do employees get?
                </div>
                <div style={{ display: "grid" }}>
                  <div
                    data-r="0.47 0.49 0.51 0.53"
                    style={{
                      gridArea: "1/1",
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                      opacity: "var(--t)",
                      fontFamily: "var(--mono)",
                      fontSize: "12px",
                      color: "var(--muted)",
                    }}
                  >
                    <span
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "7px",
                        border: "1px solid var(--border2)",
                        display: "grid",
                        placeItems: "center",
                        fontFamily: "var(--sans)",
                        fontWeight: "700",
                        fontSize: "11px",
                        color: "var(--fg)",
                      }}
                    >
                      D
                    </span>
                    {"Searching 3 documents · keyword + meaning "}
                  </div>
                  <div
                    style={{
                      gridArea: "1/1",
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      data-r="0.5 0.52"
                      style={{
                        flex: "none",
                        width: "24px",
                        height: "24px",
                        borderRadius: "7px",
                        background: "var(--fg)",
                        color: "var(--on-fg)",
                        display: "grid",
                        placeItems: "center",
                        fontWeight: "700",
                        fontSize: "11px",
                        opacity: "var(--t)",
                      }}
                    >
                      D
                    </span>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "14px",
                        minWidth: "0",
                      }}
                    >
                      <p
                        style={{
                          margin: "0",
                          fontSize: "14.5px",
                          lineHeight: "1.6",
                          color: "var(--fg)",
                          textWrap: "pretty",
                        }}
                      >
                        <span
                          data-r="0.52 0.57"
                          style={{ opacity: "var(--t)" }}
                        >
                          {
                            "Full-time employees get 16 weeks of paid parental leave "
                          }
                          <span
                            style={{
                              position: "relative",
                              display: "inline-grid",
                              placeItems: "center",
                              minWidth: "20px",
                              height: "18px",
                              padding: "0 5px",
                              borderRadius: "6px",
                              background: "var(--chip)",
                              border: "1px solid var(--chip-border)",
                              fontFamily: "var(--mono)",
                              fontSize: "10.5px",
                              verticalAlign: "1px",
                            }}
                          >
                            1
                            <span
                              data-r="0.76 0.78"
                              style={{
                                position: "absolute",
                                inset: "-1px",
                                borderRadius: "6px",
                                background: "var(--fg)",
                                color: "var(--on-fg)",
                                display: "grid",
                                placeItems: "center",
                                opacity: "var(--t)",
                              }}
                            >
                              1
                            </span>
                          </span>
                          .
                        </span>{" "}
                        <span
                          data-r="0.57 0.62"
                          style={{ opacity: "var(--t)" }}
                        >
                          {
                            " It can be taken in up to two blocks within the first year after a birth or adoption "
                          }
                          <span
                            style={{
                              display: "inline-grid",
                              placeItems: "center",
                              minWidth: "20px",
                              height: "18px",
                              padding: "0 5px",
                              borderRadius: "6px",
                              background: "var(--chip)",
                              border: "1px solid var(--chip-border)",
                              fontFamily: "var(--mono)",
                              fontSize: "10.5px",
                              verticalAlign: "1px",
                            }}
                          >
                            2
                          </span>
                          .
                        </span>{" "}
                        <span
                          data-r="0.62 0.67"
                          style={{ opacity: "var(--t)" }}
                        >
                          {
                            " Tell your manager at least 4 weeks before it starts "
                          }
                          <span
                            style={{
                              display: "inline-grid",
                              placeItems: "center",
                              minWidth: "20px",
                              height: "18px",
                              padding: "0 5px",
                              borderRadius: "6px",
                              background: "var(--chip)",
                              border: "1px solid var(--chip-border)",
                              fontFamily: "var(--mono)",
                              fontSize: "10.5px",
                              verticalAlign: "1px",
                            }}
                          >
                            3
                          </span>
                          .
                        </span>
                      </p>
                      <div
                        data-r="0.68 0.71"
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          gap: "8px",
                          opacity: "var(--t)",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "12px",
                            color: "var(--fg2)",
                            border: "1px solid var(--border)",
                            borderRadius: "999px",
                            padding: "4px 10px",
                          }}
                        >
                          Helpful
                        </span>
                        <span
                          style={{
                            fontSize: "12px",
                            color: "var(--fg2)",
                            border: "1px solid var(--border)",
                            borderRadius: "999px",
                            padding: "4px 10px",
                          }}
                        >
                          Not helpful
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--mono)",
                            fontSize: "11px",
                            color: "var(--muted)",
                            marginLeft: "4px",
                          }}
                        >
                          {"3 sources · 2 documents"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  flex: "none",
                  padding: "0 clamp(16px, 3vw, 40px) 18px",
                }}
              >
                <div
                  style={{
                    height: "48px",
                    border: "1px solid var(--border2)",
                    borderRadius: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "0 6px 0 16px",
                    background: "var(--bg)",
                  }}
                >
                  <div
                    style={{
                      flex: "1",
                      minWidth: "0",
                      display: "grid",
                      fontSize: "14px",
                    }}
                  >
                    <span
                      data-r="0 0 0.29 0.31"
                      style={{
                        gridArea: "1/1",
                        color: "var(--faint)",
                        opacity: "var(--t)",
                      }}
                    >
                      {"Ask a question about HR Handbook 2026…"}
                    </span>
                    <span
                      data-r="0 0 0.43 0.44"
                      style={{
                        gridArea: "1/1",
                        opacity: "var(--t)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                      }}
                    >
                      <span
                        data-r="0.3 0.42"
                        data-ease="linear"
                        style={{
                          display: "inline-block",
                          clipPath: "inset(0 calc((1 - var(--t)) * 100%) 0 0)",
                        }}
                      >
                        How much paid parental leave do employees get?
                      </span>
                    </span>
                  </div>
                  <span
                    style={{
                      flex: "none",
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      background: "var(--fg)",
                      color: "var(--on-fg)",
                      display: "grid",
                      placeItems: "center",
                      fontSize: "16px",
                    }}
                  >
                    {"↑"}
                  </span>
                </div>
              </div>
              <div
                data-r="0.78 0.86"
                style={{
                  position: "absolute",
                  top: "0",
                  right: "0",
                  bottom: "0",
                  width: "min(360px, 90%)",
                  background: "var(--bg)",
                  borderLeft: "1px solid var(--border)",
                  boxShadow: "var(--shadow)",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  transform: "translateX(calc((1 - var(--t)) * 108%))",
                  willChange: "transform",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span
                    style={{
                      display: "inline-grid",
                      placeItems: "center",
                      minWidth: "20px",
                      height: "18px",
                      padding: "0 5px",
                      borderRadius: "6px",
                      background: "var(--fg)",
                      color: "var(--on-fg)",
                      fontFamily: "var(--mono)",
                      fontSize: "10.5px",
                    }}
                  >
                    1
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: "11px",
                      color: "var(--muted)",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                    }}
                  >
                    Source
                  </span>
                  <span
                    style={{
                      marginLeft: "auto",
                      color: "var(--muted)",
                      fontSize: "16px",
                    }}
                  >
                    {"×"}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "15px",
                      fontWeight: "600",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Employee Handbook.pdf
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: "11.5px",
                      color: "var(--muted)",
                    }}
                  >
                    {"Page 14 · §6.1 Parental leave"}
                  </span>
                </div>
                <div
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    padding: "14px",
                    background: "var(--subtle)",
                    fontSize: "13px",
                    lineHeight: "1.65",
                    color: "var(--muted)",
                  }}
                >
                  {" …adoption or foster placement. "}
                  <mark
                    data-r="0.86 0.93"
                    style={{
                      color: "var(--fg)",
                      background:
                        "color-mix(in srgb, var(--hl) calc(var(--t) * 100%), transparent)",
                      borderRadius: "3px",
                      padding: "1px 2px",
                      boxDecorationBreak: "clone",
                      WebkitBoxDecorationBreak: "clone",
                    }}
                  >
                    Full-time employees are entitled to sixteen (16) weeks of
                    paid parental leave following the birth or adoption of a
                    child.
                  </mark>
                  {" Part-time employees receive a pro-rated entitlement… "}
                </div>
                <span style={{ fontSize: "12.5px", color: "var(--fg2)" }}>
                  {"Open page 14 →"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
