import { prisma } from "./db";

const COMMENTS_PER_PAGE = 30;

export async function getCommentsForPost(postId: string) {
  return prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createComment(data: { postId: string; author: string; content: string }) {
  return prisma.comment.create({ data });
}

export async function deleteComment(id: string): Promise<void> {
  await prisma.comment.delete({ where: { id } }).catch(() => null);
}

export async function listAllCommentsAdmin(page: number) {
  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * COMMENTS_PER_PAGE,
      take: COMMENTS_PER_PAGE,
      include: { post: { select: { title: true, slug: true } } },
    }),
    prisma.comment.count(),
  ]);
  return {
    comments,
    total,
    totalPages: Math.max(1, Math.ceil(total / COMMENTS_PER_PAGE)),
  };
}
