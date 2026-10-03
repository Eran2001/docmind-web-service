import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Unit tests for the web app: plain functions and components, with no network. Next.js keeps `jsx: preserve`-style settings,
// so esbuild is told to use the automatic JSX runtime here.
export default defineConfig({
  esbuild: { jsx: "automatic" },
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    css: false,
  },
});
