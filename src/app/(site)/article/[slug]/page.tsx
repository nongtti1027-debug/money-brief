import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getCategoryLabel } from "@/lib/constants";
import { formatDateTime } from "@/lib/format";
import { getPublishedBySlug, getRelatedPosts } from "@/lib/posts";
import { ArticleContent } from "@/components/ArticleContent";
import { ArticleCard } from "@/components/ArticleCard";
import { AdSlot } from "@/components/AdSlot";

type Params = { slug: string };
const FALLBACK_THUMBNAIL = "/images/placeholder-default.svg";

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBySlug(slug);
  if (!post) return {};

  const imageUrl = post.thumbnail || FALLBACK_THUMBNAIL;

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      images: [{ url: imageUrl }],
      publishedTime: (post.publishedAt ?? post.createdAt).toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getPublishedBySlug(slug);

  if (!post) {
    notFound();
  }

  const related = await getRelatedPosts(post, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <article className="lg:col-span-3">
          <div className="mb-4">
            <Link
              href={`/category/${post.category}`}
              className="text-sm font-bold text-accent hover:underline"
            >
              {getCategoryLabel(post.category)}
            </Link>
            <h1 className="mt-2 text-2xl font-black leading-tight text-neutral-900 sm:text-3xl">
              {post.title}
            </h1>
            <div className="mt-3 flex items-center gap-3 border-b border-neutral-200 pb-4 text-sm text-neutral-400">
              <span>{formatDateTime(post.publishedAt ?? post.createdAt)}</span>
            </div>
          </div>

          <div className="relative mb-6 aspect-video overflow-hidden rounded-lg bg-neutral-100">
            <Image
              src={post.thumbnail || FALLBACK_THUMBNAIL}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 760px, 100vw"
              className="object-cover"
            />
          </div>

          <ArticleContent content={post.content} />

          {post.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2 border-t border-neutral-200 pt-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-500"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="my-8">
            <AdSlot position="article-bottom" />
          </div>

          {related.length > 0 && (
            <div className="border-t border-neutral-200 pt-8">
              <h2 className="mb-4 text-lg font-black text-neutral-900">관련 기사</h2>
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                {related.map((r) => (
                  <ArticleCard key={r.id} post={r} />
                ))}
              </div>
            </div>
          )}
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-4">
            <AdSlot position="sidebar" />
          </div>
        </aside>
      </div>
    </div>
  );
}
