// Generated from the DocMind Landing design (Claude Design export), then kept as normal source.
import type { FaqProps } from "@/views/landing/types";

export function FaqCta({ open, toggleFaq }: FaqProps) {
  return (
    <section
      id="faq"
      aria-labelledby="faq-h"
      style={{
        padding: "clamp(96px, 14vh, 160px) 20px clamp(64px, 10vh, 120px)",
      }}
    >
      <div
        style={{
          maxWidth: "1160px",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          gap: "32px 64px",
        }}
      >
        <div
          style={{
            flex: "1 1 280px",
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
            FAQ
          </span>
          <h2
            id="faq-h"
            style={{
              margin: "0",
              fontSize: "clamp(32px, 4.4vw, 56px)",
              fontWeight: "600",
              letterSpacing: "-0.04em",
              lineHeight: "1.04",
            }}
          >
            Questions, answered.
          </h2>
        </div>
        <div
          style={{
            flex: "2 1 480px",
            minWidth: "0",
            borderTop: "1px solid var(--border)",
          }}
        >
          <div style={{ borderBottom: "1px solid var(--border)" }}>
            <h3 style={{ margin: "0" }}>
              <button
                type="button"
                id="faq-b0"
                aria-expanded={open === 0}
                aria-controls="faq-p0"
                onClick={() => toggleFaq(0)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                  padding: "20px 0",
                  background: "none",
                  border: "0",
                  color: "var(--fg)",
                  font: "500 17px var(--sans)",
                  letterSpacing: "-0.01em",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                Does DocMind ever make up an answer?
                <span
                  aria-hidden="true"
                  style={{
                    flex: "none",
                    fontFamily: "var(--mono)",
                    fontSize: "18px",
                    color: "var(--muted)",
                    width: "20px",
                    textAlign: "center",
                  }}
                >
                  {open === 0 ? "−" : "+"}
                </span>
              </button>
            </h3>
            {open === 0 && (
              <>
                <div
                  id="faq-p0"
                  role="region"
                  aria-labelledby="faq-b0"
                  style={{
                    padding: "0 40px 22px 0",
                    fontSize: "15px",
                    lineHeight: "1.6",
                    color: "var(--fg2)",
                  }}
                >
                  {
                    "It's built not to. Answers are written only from the passages retrieved from your documents, and every claim carries a citation you can open. If those passages don't contain the answer, DocMind says “I couldn't find that in your documents.”"
                  }
                </div>
              </>
            )}
          </div>
          <div style={{ borderBottom: "1px solid var(--border)" }}>
            <h3 style={{ margin: "0" }}>
              <button
                type="button"
                id="faq-b1"
                aria-expanded={open === 1}
                aria-controls="faq-p1"
                onClick={() => toggleFaq(1)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                  padding: "20px 0",
                  background: "none",
                  border: "0",
                  color: "var(--fg)",
                  font: "500 17px var(--sans)",
                  letterSpacing: "-0.01em",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                Which files can I upload?
                <span
                  aria-hidden="true"
                  style={{
                    flex: "none",
                    fontFamily: "var(--mono)",
                    fontSize: "18px",
                    color: "var(--muted)",
                    width: "20px",
                    textAlign: "center",
                  }}
                >
                  {open === 1 ? "−" : "+"}
                </span>
              </button>
            </h3>
            {open === 1 && (
              <>
                <div
                  id="faq-p1"
                  role="region"
                  aria-labelledby="faq-b1"
                  style={{
                    padding: "0 40px 22px 0",
                    fontSize: "15px",
                    lineHeight: "1.6",
                    color: "var(--fg2)",
                  }}
                >
                  {
                    "PDF, Word (DOCX and DOC), plain text, Markdown, and web pages by URL. Each file can be up to 20 MB and a collection holds up to 50 documents. Scanned PDFs aren't supported yet, because there's no OCR."
                  }
                </div>
              </>
            )}
          </div>
          <div style={{ borderBottom: "1px solid var(--border)" }}>
            <h3 style={{ margin: "0" }}>
              <button
                type="button"
                id="faq-b2"
                aria-expanded={open === 2}
                aria-controls="faq-p2"
                onClick={() => toggleFaq(2)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                  padding: "20px 0",
                  background: "none",
                  border: "0",
                  color: "var(--fg)",
                  font: "500 17px var(--sans)",
                  letterSpacing: "-0.01em",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                Who can see my documents?
                <span
                  aria-hidden="true"
                  style={{
                    flex: "none",
                    fontFamily: "var(--mono)",
                    fontSize: "18px",
                    color: "var(--muted)",
                    width: "20px",
                    textAlign: "center",
                  }}
                >
                  {open === 2 ? "−" : "+"}
                </span>
              </button>
            </h3>
            {open === 2 && (
              <>
                <div
                  id="faq-p2"
                  role="region"
                  aria-labelledby="faq-b2"
                  style={{
                    padding: "0 40px 22px 0",
                    fontSize: "15px",
                    lineHeight: "1.6",
                    color: "var(--fg2)",
                  }}
                >
                  {
                    "Only you. Collections are private to the account that created them. Team sharing isn't available yet."
                  }
                </div>
              </>
            )}
          </div>
          <div style={{ borderBottom: "1px solid var(--border)" }}>
            <h3 style={{ margin: "0" }}>
              <button
                type="button"
                id="faq-b3"
                aria-expanded={open === 3}
                aria-controls="faq-p3"
                onClick={() => toggleFaq(3)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                  padding: "20px 0",
                  background: "none",
                  border: "0",
                  color: "var(--fg)",
                  font: "500 17px var(--sans)",
                  letterSpacing: "-0.01em",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                How does it find the right passage?
                <span
                  aria-hidden="true"
                  style={{
                    flex: "none",
                    fontFamily: "var(--mono)",
                    fontSize: "18px",
                    color: "var(--muted)",
                    width: "20px",
                    textAlign: "center",
                  }}
                >
                  {open === 3 ? "−" : "+"}
                </span>
              </button>
            </h3>
            {open === 3 && (
              <>
                <div
                  id="faq-p3"
                  role="region"
                  aria-labelledby="faq-b3"
                  style={{
                    padding: "0 40px 22px 0",
                    fontSize: "15px",
                    lineHeight: "1.6",
                    color: "var(--fg2)",
                  }}
                >
                  Two searches run together: keyword search for exact terms such
                  as policy numbers, and semantic search for the same meaning in
                  different words. Reciprocal Rank Fusion merges both lists into
                  the top 8 passages. Follow-up questions are first rewritten
                  into a standalone search, so “what about contractors?” still
                  works.
                </div>
              </>
            )}
          </div>
          <div style={{ borderBottom: "1px solid var(--border)" }}>
            <h3 style={{ margin: "0" }}>
              <button
                type="button"
                id="faq-b4"
                aria-expanded={open === 4}
                aria-controls="faq-p4"
                onClick={() => toggleFaq(4)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                  padding: "20px 0",
                  background: "none",
                  border: "0",
                  color: "var(--fg)",
                  font: "500 17px var(--sans)",
                  letterSpacing: "-0.01em",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                Can I try it without signing up?
                <span
                  aria-hidden="true"
                  style={{
                    flex: "none",
                    fontFamily: "var(--mono)",
                    fontSize: "18px",
                    color: "var(--muted)",
                    width: "20px",
                    textAlign: "center",
                  }}
                >
                  {open === 4 ? "−" : "+"}
                </span>
              </button>
            </h3>
            {open === 4 && (
              <>
                <div
                  id="faq-p4"
                  role="region"
                  aria-labelledby="faq-b4"
                  style={{
                    padding: "0 40px 22px 0",
                    fontSize: "15px",
                    lineHeight: "1.6",
                    color: "var(--fg2)",
                  }}
                >
                  Yes. The demo opens a private sandbox account with sample
                  documents. You can ask 5 questions and upload 1 file of your
                  own.
                </div>
              </>
            )}
          </div>
          <div style={{ borderBottom: "1px solid var(--border)" }}>
            <h3 style={{ margin: "0" }}>
              <button
                type="button"
                id="faq-b5"
                aria-expanded={open === 5}
                aria-controls="faq-p5"
                onClick={() => toggleFaq(5)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                  padding: "20px 0",
                  background: "none",
                  border: "0",
                  color: "var(--fg)",
                  font: "500 17px var(--sans)",
                  letterSpacing: "-0.01em",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                How do I know answers stay good when documents change?
                <span
                  aria-hidden="true"
                  style={{
                    flex: "none",
                    fontFamily: "var(--mono)",
                    fontSize: "18px",
                    color: "var(--muted)",
                    width: "20px",
                    textAlign: "center",
                  }}
                >
                  {open === 5 ? "−" : "+"}
                </span>
              </button>
            </h3>
            {open === 5 && (
              <>
                <div
                  id="faq-p5"
                  role="region"
                  aria-labelledby="faq-b5"
                  style={{
                    padding: "0 40px 22px 0",
                    fontSize: "15px",
                    lineHeight: "1.6",
                    color: "var(--fg2)",
                  }}
                >
                  {
                    "Write test questions with known answers and run them after each change. Each run scores correctness, faithfulness and whether the right document was retrieved, and shows the judge's reasoning. You can also rate any answer with a thumbs up or down."
                  }
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
