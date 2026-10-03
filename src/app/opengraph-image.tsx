import { ImageResponse } from "next/og";

// The preview card shown when a DocMind link is shared (Slack, LinkedIn, X, iMessage ...).
export const alt = "DocMind: answers from your documents, with sources";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#0a0a0a",
        color: "#fafafa",
        padding: "72px 80px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            background: "#fafafa",
            color: "#0a0a0a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 44,
            fontWeight: 700,
          }}
        >
          D
        </div>
        <div style={{ fontSize: 40, fontWeight: 600 }}>DocMind</div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 84,
          whiteSpace: "nowrap",
          fontWeight: 700,
          lineHeight: 1.04,
          letterSpacing: -3,
        }}
      >
        <div>Answers from your</div>
        <div>documents. With sources.</div>
      </div>
      <div style={{ fontSize: 30, color: "#a3a3a3" }}>
        Ask in plain language. Every claim cites the exact page it came from.
      </div>
    </div>,
    size,
  );
}
