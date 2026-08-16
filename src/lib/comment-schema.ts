import { z } from "zod";

export const commentInputSchema = z.object({
  author: z.string().trim().min(1, "이름을 입력해주세요.").max(30, "이름은 30자 이내로 입력해주세요."),
  content: z
    .string()
    .trim()
    .min(1, "댓글 내용을 입력해주세요.")
    .max(1000, "댓글은 1000자 이내로 입력해주세요."),
});

export type CommentInput = z.infer<typeof commentInputSchema>;
