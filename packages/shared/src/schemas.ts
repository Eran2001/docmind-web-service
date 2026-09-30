import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Enter your email address")
    .email("Enter a valid email, like name@company.com"),
  password: z.string().min(1, "Enter your password"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Enter your full name").max(100),
  email: loginSchema.shape.email,
  password: z
    .string()
    .min(1, "Create a password")
    .min(8, "Password must be at least 8 characters")
    .max(128),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const updateProfileSchema = z.object({
  name: registerSchema.shape.name,
  email: loginSchema.shape.email,
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: z
      .string()
      .min(8, "Use at least 8 characters")
      .max(128),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  });
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

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

export const sendMessageSchema = z.object({
  content: z.string().trim().min(1).max(4000),
});
export type SendMessageInput = z.infer<typeof sendMessageSchema>;

export const feedbackSchema = z.object({
  rating: z.union([z.literal(1), z.literal(-1)]),
  comment: z.string().trim().max(1000).optional(),
});
export type FeedbackInput = z.infer<typeof feedbackSchema>;

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
