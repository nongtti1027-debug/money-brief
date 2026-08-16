import { prisma } from "@/lib/db";
import { incrementLikes } from "@/lib/posts";

export async function POST(
  _request: Request,
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

  const likes = await incrementLikes(post.id);
  return Response.json({ likes });
}
