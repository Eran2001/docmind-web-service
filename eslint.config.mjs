import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", ".next-e2e/**", "test-results/**", "playwright-report/**", "node_modules/**", "src/components/ui/**", "next-env.d.ts"]),
]);
