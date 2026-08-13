import { prisma } from "@/lib/db";
import { requireAdminApi } from "@/lib/auth";
import { postInputSchema } from "@/lib/post-schema";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) {
    return Response.json({ error: "글을 찾을 수 없습니다." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = postInputSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? "잘못된 요청입니다." }, { status: 400 });
  }

  const data = parsed.data;
  const isNewlyPublished = data.status === "published" && existing.status !== "published";

  const post = await prisma.post.update({
    where: { id },
    data: {
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      thumbnail: data.thumbnail || null,
      category: data.category,
      postType: data.postType,
      tags: JSON.stringify(data.tags),
      status: data.status,
      publishedAt: isNewlyPublished ? new Date() : existing.publishedAt,
    },
  });

  return Response.json({ id: post.id, slug: post.slug });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  await prisma.post.delete({ where: { id } }).catch(() => null);

  return Response.json({ ok: true });
}
