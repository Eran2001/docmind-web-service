import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The end-to-end tests build into their own folder so they never clash with a running `npm run dev`.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // The production Docker image runs the self-contained server that `next build` produces in this mode.
  output: process.env.NEXT_OUTPUT === "standalone" ? "standalone" : undefined,
  // Hides the floating "N" dev-mode badge.
  devIndicators: false,
};

export default nextConfig;
