import { z } from "zod";
import { CATEGORIES } from "./constants";

const categorySlugs = CATEGORIES.map((c) => c.slug) as [string, ...string[]];

export const postInputSchema = z.object({
  title: z.string().trim().min(1, "제목을 입력해주세요.").max(200),
  excerpt: z.string().trim().min(1, "요약을 입력해주세요.").max(300),
  content: z.string().trim().min(1, "본문을 입력해주세요."),
  thumbnail: z.string().trim().optional().nullable(),
  category: z.enum(categorySlugs, { message: "올바른 카테고리를 선택해주세요." }),
  postType: z.enum(["brief", "analysis"], { message: "글 유형을 선택해주세요." }),
  tags: z.array(z.string().trim().min(1)).max(10),
  status: z.enum(["draft", "published"]),
});

export type PostInput = z.infer<typeof postInputSchema>;
