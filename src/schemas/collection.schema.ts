import { z } from "zod";

export const createCollectionSchema = z.object({
  name: z.string().trim().min(1, "Enter a name").max(60),
  description: z.string().trim().max(500).optional(),
});
export type CreateCollectionInput = z.infer<typeof createCollectionSchema>;

export const addUrlSchema = z.object({
  url: z
    .string()
    .trim()
    .url("Enter a full URL starting with https://")
    .refine(
      (v) => /^https?:\/\//i.test(v),
      "Enter a full URL starting with https://",
    ),
});
export type AddUrlInput = z.infer<typeof addUrlSchema>;
