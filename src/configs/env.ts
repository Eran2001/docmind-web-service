import { z } from "zod";

const schema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:4000/api/v1"),
  // Public address of the web app, used for share-link previews (Open Graph). Set it in production.
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  // Show the TanStack Query devtools button (dev builds only; production never includes it).
  NEXT_PUBLIC_QUERY_DEVTOOLS: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true"),
});

// NEXT_PUBLIC_* vars must be read statically so Next can inline them.
export const env = schema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || undefined,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || undefined,
  NEXT_PUBLIC_QUERY_DEVTOOLS:
    process.env.NEXT_PUBLIC_QUERY_DEVTOOLS || undefined,
});
