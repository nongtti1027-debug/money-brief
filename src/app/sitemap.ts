import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { CATEGORIES, POST_TYPES } from "@/lib/constants";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await prisma.post.findMany({
    where: { status: "published" },
    select: { slug: true, updatedAt: true },
    orderBy: { publishedAt: "desc" },
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "hourly", priority: 1 },
    { url: `${siteUrl}/search`, changeFrequency: "monthly", priority: 0.3 },
    ...POST_TYPES.map((t) => ({
      url: `${siteUrl}${t.path}`,
      changeFrequency: "hourly" as const,
      priority: 0.8,
    })),
    ...CATEGORIES.map((c) => ({
      url: `${siteUrl}/category/${c.slug}`,
      changeFrequency: "hourly" as const,
      priority: 0.7,
    })),
  ];

  const articleRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/article/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "daily",
    priority: 0.6,
  }));

  return [...staticRoutes, ...articleRoutes];
}
