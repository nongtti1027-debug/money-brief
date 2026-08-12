import { prisma } from "./db";
import { POSTS_PER_PAGE } from "./constants";
import type { Post } from "@/generated/prisma/client";

export type PostView = Omit<Post, "tags"> & { tags: string[] };

export function toPostView(post: Post): PostView {
  let tags: string[] = [];
  try {
    tags = JSON.parse(post.tags);
  } catch {
    tags = [];
  }
  return { ...post, tags };
}

const PUBLISHED = { status: "published" as const };

export async function getHeadlinePost(): Promise<PostView | null> {
  const post = await prisma.post.findFirst({
    where: PUBLISHED,
    orderBy: { publishedAt: "desc" },
  });
  return post ? toPostView(post) : null;
}

export async function getLatestPublished(limit: number, excludeId?: string): Promise<PostView[]> {
  const posts = await prisma.post.findMany({
    where: { ...PUBLISHED, ...(excludeId ? { id: { not: excludeId } } : {}) },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
  return posts.map(toPostView);
}

export async function getLatestByCategory(category: string, limit: number): Promise<PostView[]> {
  const posts = await prisma.post.findMany({
    where: { ...PUBLISHED, category },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
  return posts.map(toPostView);
}

export async function getPublishedByCategory(
  category: string,
  page: number
): Promise<{ posts: PostView[]; total: number; totalPages: number }> {
  const where = { ...PUBLISHED, category };
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * POSTS_PER_PAGE,
      take: POSTS_PER_PAGE,
    }),
    prisma.post.count({ where }),
  ]);
  return {
    posts: posts.map(toPostView),
    total,
    totalPages: Math.max(1, Math.ceil(total / POSTS_PER_PAGE)),
  };
}

export async function searchPublished(
  query: string,
  page: number
): Promise<{ posts: PostView[]; total: number; totalPages: number }> {
  const where = {
    ...PUBLISHED,
    OR: [
      { title: { contains: query } },
      { content: { contains: query } },
      { excerpt: { contains: query } },
    ],
  };
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * POSTS_PER_PAGE,
      take: POSTS_PER_PAGE,
    }),
    prisma.post.count({ where }),
  ]);
  return {
    posts: posts.map(toPostView),
    total,
    totalPages: Math.max(1, Math.ceil(total / POSTS_PER_PAGE)),
  };
}

export async function getPublishedBySlug(slug: string): Promise<PostView | null> {
  const post = await prisma.post.findFirst({ where: { slug, ...PUBLISHED } });
  return post ? toPostView(post) : null;
}

export async function getRelatedPosts(post: PostView, limit = 4): Promise<PostView[]> {
  const posts = await prisma.post.findMany({
    where: { ...PUBLISHED, category: post.category, id: { not: post.id } },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
  return posts.map(toPostView);
}

// --- Admin (draft + published) ---

export async function listAllPosts(page: number): Promise<{
  posts: PostView[];
  total: number;
  totalPages: number;
}> {
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * POSTS_PER_PAGE,
      take: POSTS_PER_PAGE,
    }),
    prisma.post.count(),
  ]);
  return {
    posts: posts.map(toPostView),
    total,
    totalPages: Math.max(1, Math.ceil(total / POSTS_PER_PAGE)),
  };
}

export async function getPostById(id: string): Promise<PostView | null> {
  const post = await prisma.post.findUnique({ where: { id } });
  return post ? toPostView(post) : null;
}
