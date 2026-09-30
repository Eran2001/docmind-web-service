import { z } from "zod";

const schema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:4000/api/v1"),
  // Serve the API from an in-browser mock until apps/api exists.
  NEXT_PUBLIC_USE_MOCKS: z
    .enum(["true", "false"])
    .default("true")
    .transform((v) => v === "true"),
  // Show the TanStack Query devtools button (dev builds only; production never includes it).
  NEXT_PUBLIC_QUERY_DEVTOOLS: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true"),
});

// NEXT_PUBLIC_* vars must be read statically so Next can inline them.
export const env = schema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || undefined,
  NEXT_PUBLIC_USE_MOCKS: process.env.NEXT_PUBLIC_USE_MOCKS || undefined,
  NEXT_PUBLIC_QUERY_DEVTOOLS: process.env.NEXT_PUBLIC_QUERY_DEVTOOLS || undefined,
});
