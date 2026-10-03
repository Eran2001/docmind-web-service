import { ImageResponse } from "next/og";

// The icon iOS uses when someone adds DocMind to their home screen.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
        color: "#ffffff",
        fontSize: 112,
        fontWeight: 700,
        fontFamily: "sans-serif",
      }}
    >
      D
    </div>,
    size,
  );
}
