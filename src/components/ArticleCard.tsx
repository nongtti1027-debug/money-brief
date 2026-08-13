import Link from "next/link";
import Image from "next/image";
import { getCategoryLabel, getPostTypeLabel } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import type { PostView } from "@/lib/posts";

const FALLBACK_THUMBNAIL = "/images/placeholder-default.svg";

export function ArticleCard({
  post,
  priority = false,
  layout = "vertical",
}: {
  post: PostView;
  priority?: boolean;
  layout?: "vertical" | "horizontal";
}) {
  const date = post.publishedAt ?? post.createdAt;

  if (layout === "horizontal") {
    return (
      <Link href={`/article/${post.slug}`} className="group flex gap-4">
        <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-md bg-neutral-100 sm:h-24 sm:w-40">
          <Image
            src={post.thumbnail || FALLBACK_THUMBNAIL}
            alt=""
            fill
            sizes="160px"
            className="object-cover transition group-hover:scale-105"
          />
        </div>
        <div className="min-w-0">
          <span className="text-xs font-semibold text-accent">
            {getCategoryLabel(post.category)}
          </span>
          <h3 className="mt-0.5 line-clamp-2 text-sm font-bold text-neutral-900 group-hover:text-brand sm:text-base">
            {post.title}
          </h3>
          <p className="mt-1 hidden text-sm text-neutral-500 line-clamp-2 sm:block">
            {post.excerpt}
          </p>
          <span className="mt-1 block text-xs text-neutral-400">{formatDate(date)}</span>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/article/${post.slug}`} className="group block">
      <div className="relative aspect-video overflow-hidden rounded-md bg-neutral-100">
        <Image
          src={post.thumbnail || FALLBACK_THUMBNAIL}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition group-hover:scale-105"
        />
      </div>
      <div className="mt-2">
        <span className="inline-flex items-center gap-1.5">
          {post.postType === "analysis" && (
            <span className="rounded bg-brand px-1.5 py-0.5 text-[11px] font-bold text-white">
              {getPostTypeLabel("analysis")}
            </span>
          )}
          <span className="text-xs font-semibold text-accent">{getCategoryLabel(post.category)}</span>
        </span>
        <h3 className="mt-1 line-clamp-2 text-base font-bold text-neutral-900 group-hover:text-brand">
          {post.title}
        </h3>
        <p className="mt-1 text-sm text-neutral-500 line-clamp-2">{post.excerpt}</p>
        <span className="mt-1 block text-xs text-neutral-400">{formatDate(date)}</span>
      </div>
    </Link>
  );
}
