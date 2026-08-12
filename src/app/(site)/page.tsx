import Link from "next/link";
import Image from "next/image";
import { CATEGORIES, getCategoryLabel } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { getHeadlinePost, getLatestByCategory, getLatestPublished } from "@/lib/posts";
import { ArticleCard } from "@/components/ArticleCard";
import { AdSlot } from "@/components/AdSlot";

const FALLBACK_THUMBNAIL = "/images/placeholder-default.svg";

export default async function HomePage() {
  const headline = await getHeadlinePost();
  const sideList = headline ? await getLatestPublished(5, headline.id) : [];

  const categorySections = await Promise.all(
    CATEGORIES.map(async (c) => ({
      category: c,
      posts: await getLatestByCategory(c.slug, 4),
    }))
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {headline && (
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <Link href={`/article/${headline.slug}`} className="group block lg:col-span-2">
            <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-neutral-100">
              <Image
                src={headline.thumbnail || FALLBACK_THUMBNAIL}
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 760px, 100vw"
                className="object-cover transition group-hover:scale-105"
              />
            </div>
            <div className="mt-3">
              <span className="text-xs font-bold text-accent">
                {getCategoryLabel(headline.category)}
              </span>
              <h1 className="mt-1 text-2xl font-black leading-tight text-neutral-900 group-hover:text-brand sm:text-3xl">
                {headline.title}
              </h1>
              <p className="mt-2 text-neutral-600">{headline.excerpt}</p>
              <span className="mt-2 block text-sm text-neutral-400">
                {formatDate(headline.publishedAt ?? headline.createdAt)}
              </span>
            </div>
          </Link>

          <div className="flex flex-col gap-5 divide-y divide-neutral-100 lg:col-span-1">
            {sideList.map((post) => (
              <div key={post.id} className="pt-5 first:pt-0">
                <ArticleCard post={post} layout="horizontal" />
              </div>
            ))}
          </div>
        </section>
      )}

      {!headline && (
        <div className="rounded-lg border border-dashed border-neutral-300 py-16 text-center text-neutral-400">
          아직 발행된 기사가 없습니다. 관리자 페이지에서 첫 기사를 발행해보세요.
        </div>
      )}

      <div className="my-10">
        <AdSlot position="article-bottom" />
      </div>

      <div className="space-y-12">
        {categorySections
          .filter((s) => s.posts.length > 0)
          .map((section) => (
            <section key={section.category.slug}>
              <div className="mb-4 flex items-baseline justify-between border-b-2 border-brand pb-2">
                <h2 className="text-lg font-black text-neutral-900">{section.category.label}</h2>
                <Link
                  href={`/category/${section.category.slug}`}
                  className="text-sm font-medium text-neutral-500 hover:text-brand"
                >
                  더보기 &rarr;
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                {section.posts.map((post) => (
                  <ArticleCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          ))}
      </div>
    </div>
  );
}
