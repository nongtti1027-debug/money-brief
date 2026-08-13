import Link from "next/link";
import { getCategoryLabel } from "@/lib/constants";
import type { PostView } from "@/lib/posts";

function formatTime(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function BriefItem({ post }: { post: PostView }) {
  const date = post.publishedAt ?? post.createdAt;

  return (
    <Link
      href={`/article/${post.slug}`}
      className="group flex items-baseline gap-3 border-b border-neutral-100 py-2.5 last:border-0"
    >
      <span className="shrink-0 font-mono text-xs text-neutral-400">{formatTime(date)}</span>
      <span className="shrink-0 rounded bg-accent/10 px-1.5 py-0.5 text-[11px] font-bold text-accent">
        {getCategoryLabel(post.category)}
      </span>
      <span className="truncate text-sm font-medium text-neutral-800 group-hover:text-brand">
        {post.title}
      </span>
    </Link>
  );
}
