// Generated from the DocMind Landing design (Claude Design export), then kept as normal source.
export function Architecture() {
  return (
    <section
      id="how"
      data-scene="pin"
      data-len="340"
      aria-labelledby="how-h"
      style={{ height: "340vh", position: "relative" }}
    >
      <div
        data-pin=""
        style={{
          position: "sticky",
          top: "0",
          height: "100dvh",
          display: "flex",
          alignItems: "center",
          padding: "80px 20px 28px",
        }}
      >
        <div
          style={{
            maxWidth: "1160px",
            margin: "0 auto",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "clamp(20px, 3.5vh, 40px)",
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
                How it works
              </span>
              <h2
                id="how-h"
                style={{
                  margin: "0",
                  fontSize: "clamp(32px, 4.4vw, 56px)",
                  fontWeight: "600",
                  letterSpacing: "-0.04em",
                  lineHeight: "1.04",
                }}
              >
                Three services. Two paths.
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
              The browser only talks to the API. The API stores documents and
              queues work. The AI service parses, embeds and writes answers from
              the passages it is given.
            </p>
          </div>
          <div
            data-desk=""
            style={{ display: "flex", justifyContent: "center" }}
          >
            <svg
              role="img"
              aria-label="Architecture: Web app (Next.js) connects to the API (NestJS). The API uses Postgres with pgvector and a Redis queue, and calls the AI service (Python FastAPI), which calls a language model and an embedding model."
              viewBox="0 0 1000 340"
              style={{
                width: "100%",
                maxWidth: "min(960px, calc((100dvh - 400px) * 2.94))",
                height: "auto",
                overflow: "visible",
              }}
            >
              <g
                style={{
                  fill: "none",
                  stroke: "var(--border2)",
                  strokeWidth: "1.5",
                }}
              >
                <path
                  data-r="0 0.05"
                  pathLength="1"
                  d="M220 156 H300"
                  style={{
                    strokeDasharray: "1",
                    strokeDashoffset: "calc(1 - var(--t))",
                  }}
                />
                <path
                  data-r="0.02 0.07"
                  pathLength="1"
                  d="M490 156 H570"
                  style={{
                    strokeDasharray: "1",
                    strokeDashoffset: "calc(1 - var(--t))",
                  }}
                />
                <path
                  data-r="0.04 0.09"
                  pathLength="1"
                  d="M760 156 H795 V68 H830"
                  style={{
                    strokeDasharray: "1",
                    strokeDashoffset: "calc(1 - var(--t))",
                  }}
                />
                <path
                  data-r="0.04 0.09"
                  pathLength="1"
                  d="M760 156 H795 V244 H830"
                  style={{
                    strokeDasharray: "1",
                    strokeDashoffset: "calc(1 - var(--t))",
                  }}
                />
                <path
                  data-r="0.03 0.08"
                  pathLength="1"
                  d="M360 192 V262"
                  style={{
                    strokeDasharray: "1",
                    strokeDashoffset: "calc(1 - var(--t))",
                  }}
                />
                <path
                  data-r="0.03 0.08"
                  pathLength="1"
                  d="M470 192 V262"
                  style={{
                    strokeDasharray: "1",
                    strokeDashoffset: "calc(1 - var(--t))",
                  }}
                />
                <path
                  data-r="0.05 0.1"
                  pathLength="1"
                  d="M600 294 H665 V192"
                  style={{
                    strokeDasharray: "1",
                    strokeDashoffset: "calc(1 - var(--t))",
                  }}
                />
              </g>
              <g
                data-r="0.48 0.54"
                style={{
                  fill: "none",
                  stroke: "var(--fg)",
                  strokeWidth: "2.5",
                  strokeLinejoin: "round",
                  opacity: "calc(1 - var(--t) * 0.85)",
                }}
              >
                <path
                  data-r="0.12 0.17"
                  data-ease="linear"
                  pathLength="1"
                  d="M220 156 H300"
                  style={{
                    strokeDasharray: "1",
                    strokeDashoffset: "calc(1 - var(--t))",
                  }}
                />
                <path
                  data-r="0.17 0.22"
                  data-ease="linear"
                  pathLength="1"
                  d="M470 192 V262"
                  style={{
                    strokeDasharray: "1",
                    strokeDashoffset: "calc(1 - var(--t))",
                  }}
                />
                <path
                  data-r="0.22 0.28"
                  data-ease="linear"
                  pathLength="1"
                  d="M600 294 H665 V192"
                  style={{
                    strokeDasharray: "1",
                    strokeDashoffset: "calc(1 - var(--t))",
                  }}
                />
                <path
                  data-r="0.28 0.34"
                  data-ease="linear"
                  pathLength="1"
                  d="M760 156 H795 V244 H830"
                  style={{
                    strokeDasharray: "1",
                    strokeDashoffset: "calc(1 - var(--t))",
                  }}
                />
                <path
                  data-r="0.34 0.38"
                  data-ease="linear"
                  pathLength="1"
                  d="M570 156 H490"
                  style={{
                    strokeDasharray: "1",
                    strokeDashoffset: "calc(1 - var(--t))",
                  }}
                />
                <path
                  data-r="0.38 0.44"
                  data-ease="linear"
                  pathLength="1"
                  d="M360 192 V262"
                  style={{
                    strokeDasharray: "1",
                    strokeDashoffset: "calc(1 - var(--t))",
                  }}
                />
              </g>
              <g
                style={{
                  fill: "none",
                  stroke: "var(--fg)",
                  strokeWidth: "2.5",
                  strokeLinejoin: "round",
                }}
              >
                <path
                  data-r="0.56 0.6"
                  data-ease="linear"
                  pathLength="1"
                  d="M220 156 H300"
                  style={{
                    strokeDasharray: "1",
                    strokeDashoffset: "calc(1 - var(--t))",
                  }}
                />
                <path
                  data-r="0.6 0.64"
                  data-ease="linear"
                  pathLength="1"
                  d="M490 156 H570"
                  style={{
                    strokeDasharray: "1",
                    strokeDashoffset: "calc(1 - var(--t))",
                  }}
                />
                <path
                  data-r="0.64 0.69"
                  data-ease="linear"
                  pathLength="1"
                  d="M760 156 H795 V244 H830"
                  style={{
                    strokeDasharray: "1",
                    strokeDashoffset: "calc(1 - var(--t))",
                  }}
                />
                <path
                  data-r="0.69 0.75"
                  data-ease="linear"
                  pathLength="1"
                  d="M360 192 V262"
                  style={{
                    strokeDasharray: "1",
                    strokeDashoffset: "calc(1 - var(--t))",
                  }}
                />
                <path
                  data-r="0.78 0.84"
                  data-ease="linear"
                  pathLength="1"
                  d="M760 156 H795 V68 H830"
                  style={{
                    strokeDasharray: "1",
                    strokeDashoffset: "calc(1 - var(--t))",
                  }}
                />
              </g>
              <g
                style={{
                  fill: "var(--bg)",
                  stroke: "var(--border2)",
                  strokeWidth: "1",
                }}
              >
                <rect x="20" y="120" width="200" height="72" rx="12" />
                <rect x="300" y="120" width="190" height="72" rx="12" />
                <rect x="570" y="120" width="190" height="72" rx="12" />
                <rect x="830" y="40" width="150" height="56" rx="12" />
                <rect x="830" y="216" width="150" height="56" rx="12" />
                <rect x="230" y="262" width="200" height="64" rx="12" />
                <rect x="450" y="262" width="150" height="64" rx="12" />
              </g>
              <g
                style={{
                  fill: "var(--fg)",
                  font: "600 16px var(--sans)",
                  letterSpacing: "-0.01em",
                }}
                textAnchor="middle"
              >
                <text x="120" y="152">
                  Web app
                </text>
                <text x="395" y="152">
                  API
                </text>
                <text x="665" y="152">
                  AI service
                </text>{" "}
                <text x="905" y="66">
                  Language model
                </text>
                <text x="905" y="242">
                  Embedding model
                </text>{" "}
                <text x="330" y="290">
                  Postgres
                </text>
                <text x="525" y="290">
                  Redis
                </text>
              </g>
              <g
                style={{ fill: "var(--muted)", font: "400 12px var(--mono)" }}
                textAnchor="middle"
              >
                <text x="120" y="174">
                  {"Next.js · in the browser"}
                </text>
                <text x="395" y="174">
                  NestJS
                </text>
                <text x="665" y="174">
                  {"Python · FastAPI"}
                </text>{" "}
                <text x="905" y="84">
                  writes answers
                </text>
                <text x="905" y="260">
                  vectors
                </text>{" "}
                <text x="330" y="310">
                  + pgvector
                </text>
                <text x="525" y="310">
                  job queue
                </text>
              </g>
            </svg>
          </div>
          <div
            data-mob=""
            style={{ display: "flex", justifyContent: "center" }}
          >
            <svg
              role="img"
              aria-label="Architecture: Web app connects to the API. The API uses Postgres with pgvector and a Redis queue, and calls the AI service, which calls a language model and an embedding model."
              viewBox="0 0 340 570"
              style={{ width: "100%", maxWidth: "360px", height: "auto" }}
            >
              <g
                style={{
                  fill: "none",
                  stroke: "var(--fg)",
                  strokeWidth: "1.5",
                }}
              >
                <path
                  data-r="0 0.15"
                  pathLength="1"
                  d="M170 70 V130"
                  style={{
                    strokeDasharray: "1",
                    strokeDashoffset: "calc(1 - var(--t))",
                  }}
                />
                <path
                  data-r="0.1 0.25"
                  pathLength="1"
                  d="M110 190 V220 H85 V250"
                  style={{
                    strokeDasharray: "1",
                    strokeDashoffset: "calc(1 - var(--t))",
                  }}
                />
                <path
                  data-r="0.1 0.25"
                  pathLength="1"
                  d="M230 190 V220 H255 V250"
                  style={{
                    strokeDasharray: "1",
                    strokeDashoffset: "calc(1 - var(--t))",
                  }}
                />
                <path
                  data-r="0.15 0.35"
                  pathLength="1"
                  d="M170 190 V370"
                  style={{
                    strokeDasharray: "1",
                    strokeDashoffset: "calc(1 - var(--t))",
                  }}
                />
                <path
                  data-r="0.2 0.35"
                  pathLength="1"
                  d="M255 310 V340 H230 V370"
                  style={{
                    strokeDasharray: "1",
                    strokeDashoffset: "calc(1 - var(--t))",
                  }}
                />
                <path
                  data-r="0.3 0.45"
                  pathLength="1"
                  d="M110 430 V460 H85 V490"
                  style={{
                    strokeDasharray: "1",
                    strokeDashoffset: "calc(1 - var(--t))",
                  }}
                />
                <path
                  data-r="0.3 0.45"
                  pathLength="1"
                  d="M230 430 V460 H255 V490"
                  style={{
                    strokeDasharray: "1",
                    strokeDashoffset: "calc(1 - var(--t))",
                  }}
                />
              </g>
              <g
                style={{
                  fill: "var(--bg)",
                  stroke: "var(--border2)",
                  strokeWidth: "1",
                }}
              >
                <rect x="70" y="10" width="200" height="60" rx="12" />
                <rect x="70" y="130" width="200" height="60" rx="12" />
                <rect x="10" y="250" width="150" height="60" rx="12" />
                <rect x="180" y="250" width="150" height="60" rx="12" />
                <rect x="70" y="370" width="200" height="60" rx="12" />
                <rect x="10" y="490" width="150" height="60" rx="12" />
                <rect x="180" y="490" width="150" height="60" rx="12" />
              </g>
              <g
                style={{ fill: "var(--fg)", font: "600 15px var(--sans)" }}
                textAnchor="middle"
              >
                <text x="170" y="37">
                  Web app
                </text>
                <text x="170" y="157">
                  API
                </text>
                <text x="85" y="277">
                  Postgres
                </text>
                <text x="255" y="277">
                  Redis
                </text>
                <text x="170" y="397">
                  AI service
                </text>
                <text x="85" y="517">
                  Language model
                </text>
                <text x="255" y="517">
                  Embedding model
                </text>
              </g>
              <g
                style={{ fill: "var(--muted)", font: "400 11px var(--mono)" }}
                textAnchor="middle"
              >
                <text x="170" y="56">
                  Next.js
                </text>
                <text x="170" y="176">
                  NestJS
                </text>
                <text x="85" y="296">
                  + pgvector
                </text>
                <text x="255" y="296">
                  job queue
                </text>
                <text x="170" y="416">
                  FastAPI
                </text>
                <text x="85" y="536">
                  answers
                </text>
                <text x="255" y="536">
                  vectors
                </text>
              </g>
            </svg>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "8px 12px",
              }}
            >
              <span
                data-r="0.1 0.14 0.5 0.54"
                style={{
                  flex: "0 0 64px",
                  fontFamily: "var(--mono)",
                  fontSize: "11px",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  opacity: "calc(0.4 + var(--t) * 0.6)",
                }}
              >
                Upload
              </span>
              <ol
                data-stagger="0.12 0.44"
                style={{
                  listStyle: "none",
                  margin: "0",
                  padding: "0",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px",
                  alignItems: "center",
                }}
              >
                <li
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "12px",
                    border: "1px solid var(--border2)",
                    borderRadius: "999px",
                    padding: "5px 11px",
                    opacity: "calc(0.3 + var(--t) * 0.7)",
                  }}
                >
                  File or URL
                </li>
                <li
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "12px",
                    border: "1px solid var(--border2)",
                    borderRadius: "999px",
                    padding: "5px 11px",
                    opacity: "calc(0.3 + var(--t) * 0.7)",
                  }}
                >
                  Parse
                </li>
                <li
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "12px",
                    border: "1px solid var(--border2)",
                    borderRadius: "999px",
                    padding: "5px 11px",
                    opacity: "calc(0.3 + var(--t) * 0.7)",
                  }}
                >
                  Clean
                </li>
                <li
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "12px",
                    border: "1px solid var(--border2)",
                    borderRadius: "999px",
                    padding: "5px 11px",
                    opacity: "calc(0.3 + var(--t) * 0.7)",
                  }}
                >
                  {"Split ~500 tokens"}
                </li>
                <li
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "12px",
                    border: "1px solid var(--border2)",
                    borderRadius: "999px",
                    padding: "5px 11px",
                    opacity: "calc(0.3 + var(--t) * 0.7)",
                  }}
                >
                  Embed each chunk
                </li>
                <li
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "12px",
                    border: "1px solid var(--border2)",
                    borderRadius: "999px",
                    padding: "5px 11px",
                    opacity: "calc(0.3 + var(--t) * 0.7)",
                  }}
                >
                  Store chunks + vectors
                </li>
              </ol>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "8px 12px",
              }}
            >
              <span
                data-r="0.54 0.58"
                style={{
                  flex: "0 0 64px",
                  fontFamily: "var(--mono)",
                  fontSize: "11px",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  opacity: "calc(0.4 + var(--t) * 0.6)",
                }}
              >
                Ask
              </span>
              <ol
                data-stagger="0.56 0.94"
                style={{
                  listStyle: "none",
                  margin: "0",
                  padding: "0",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px",
                  alignItems: "center",
                }}
              >
                <li
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "12px",
                    border: "1px solid var(--border2)",
                    borderRadius: "999px",
                    padding: "5px 11px",
                    opacity: "calc(0.3 + var(--t) * 0.7)",
                  }}
                >
                  Question
                </li>
                <li
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "12px",
                    border: "1px solid var(--border2)",
                    borderRadius: "999px",
                    padding: "5px 11px",
                    opacity: "calc(0.3 + var(--t) * 0.7)",
                  }}
                >
                  Rewrite follow-up
                </li>
                <li
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "12px",
                    border: "1px solid var(--border2)",
                    borderRadius: "999px",
                    padding: "5px 11px",
                    opacity: "calc(0.3 + var(--t) * 0.7)",
                  }}
                >
                  Embed
                </li>
                <li
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "12px",
                    border: "1px solid var(--border2)",
                    borderRadius: "999px",
                    padding: "5px 11px",
                    opacity: "calc(0.3 + var(--t) * 0.7)",
                  }}
                >
                  Vector + keyword
                </li>
                <li
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "12px",
                    border: "1px solid var(--border2)",
                    borderRadius: "999px",
                    padding: "5px 11px",
                    opacity: "calc(0.3 + var(--t) * 0.7)",
                  }}
                >
                  RRF merge
                </li>
                <li
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "12px",
                    border: "1px solid var(--border2)",
                    borderRadius: "999px",
                    padding: "5px 11px",
                    opacity: "calc(0.3 + var(--t) * 0.7)",
                  }}
                >
                  Top 8
                </li>
                <li
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "12px",
                    border: "1px solid var(--border2)",
                    borderRadius: "999px",
                    padding: "5px 11px",
                    opacity: "calc(0.3 + var(--t) * 0.7)",
                  }}
                >
                  Answer from passages
                </li>
                <li
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "12px",
                    border: "1px solid var(--border2)",
                    borderRadius: "999px",
                    padding: "5px 11px",
                    opacity: "calc(0.3 + var(--t) * 0.7)",
                  }}
                >
                  Link citations
                </li>
                <li
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "12px",
                    border: "1px solid var(--border2)",
                    borderRadius: "999px",
                    padding: "5px 11px",
                    opacity: "calc(0.3 + var(--t) * 0.7)",
                  }}
                >
                  Stream
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
