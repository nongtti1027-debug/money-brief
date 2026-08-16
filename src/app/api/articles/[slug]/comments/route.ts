import { prisma } from "@/lib/db";
import { createComment } from "@/lib/comments";
import { commentInputSchema } from "@/lib/comment-schema";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = await prisma.post.findFirst({
    where: { slug, status: "published" },
    select: { id: true },
  });

  if (!post) {
    return Response.json({ error: "글을 찾을 수 없습니다." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = commentInputSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "잘못된 요청입니다." },
      { status: 400 }
    );
  }

  const comment = await createComment({
    postId: post.id,
    author: parsed.data.author,
    content: parsed.data.content,
  });

  return Response.json(comment, { status: 201 });
}
