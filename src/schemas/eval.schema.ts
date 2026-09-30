import { z } from "zod";

export const createEvalSetSchema = z.object({
  name: z.string().trim().min(1, "Enter a name").max(100),
  collectionId: z.string().min(1, "Choose a collection"),
  description: z.string().trim().max(300).optional(),
});
export type CreateEvalSetInput = z.infer<typeof createEvalSetSchema>;

export const createEvalQuestionSchema = z.object({
  question: z.string().trim().min(1, "Enter a question").max(1000),
  expectedAnswer: z
    .string()
    .trim()
    .min(1, "Enter the expected answer")
    .max(2000),
  expectedDocumentId: z.string().optional(),
});
export type CreateEvalQuestionInput = z.infer<typeof createEvalQuestionSchema>;
