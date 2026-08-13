import { prisma } from "@/lib/db";
import { requireAdminApi } from "@/lib/auth";
import { postInputSchema } from "@/lib/post-schema";
import { uniqueSlug } from "@/lib/slug";

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  const parsed = postInputSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? "잘못된 요청입니다." }, { status: 400 });
  }

  const data = parsed.data;
  const slug = await uniqueSlug(data.title);

  const post = await prisma.post.create({
    data: {
      title: data.title,
      slug,
      excerpt: data.excerpt,
      content: data.content,
      thumbnail: data.thumbnail || null,
      category: data.category,
      postType: data.postType,
      tags: JSON.stringify(data.tags),
      status: data.status,
      publishedAt: data.status === "published" ? new Date() : null,
    },
  });

  return Response.json({ id: post.id, slug: post.slug }, { status: 201 });
}
