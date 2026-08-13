import Link from "next/link";
import Image from "next/image";
import { getCategoryLabel } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { getHeadlinePost, getLatestByType, getLatestPublished } from "@/lib/posts";
import { ArticleCard } from "@/components/ArticleCard";
import { BriefItem } from "@/components/BriefItem";
import { AdSlot } from "@/components/AdSlot";

const FALLBACK_THUMBNAIL = "/images/placeholder-default.svg";

export default async function HomePage() {
  const headline = await getHeadlinePost();
  const sideList = headline ? await getLatestPublished(5, headline.id) : [];
  const briefs = await getLatestByType("brief", 10, headline?.id);
  const analyses = await getLatestByType("analysis", 4, headline?.id);

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

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <section>
          <div className="mb-2 flex items-center justify-between border-b-2 border-accent pb-2">
            <div className="flex items-center gap-2">
              <span className="rounded bg-accent px-2 py-0.5 text-xs font-bold text-white">속보</span>
              <h2 className="text-lg font-black text-neutral-900">최신 속보</h2>
            </div>
            <Link href="/brief" className="text-sm font-medium text-neutral-500 hover:text-brand">
              더보기 &rarr;
            </Link>
          </div>
          {briefs.length === 0 ? (
            <p className="py-8 text-center text-sm text-neutral-400">아직 등록된 속보가 없습니다.</p>
          ) : (
            <div className="divide-y divide-neutral-100">
              {briefs.map((post) => (
                <BriefItem key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between border-b-2 border-brand pb-2">
            <div className="flex items-center gap-2">
              <span className="rounded bg-brand px-2 py-0.5 text-xs font-bold text-white">분석</span>
              <h2 className="text-lg font-black text-neutral-900">심층 분석</h2>
            </div>
            <Link href="/analysis" className="text-sm font-medium text-neutral-500 hover:text-brand">
              더보기 &rarr;
            </Link>
          </div>
          {analyses.length === 0 ? (
            <p className="py-8 text-center text-sm text-neutral-400">아직 등록된 분석 기사가 없습니다.</p>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {analyses.map((post) => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
