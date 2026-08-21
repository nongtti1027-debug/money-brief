import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORIES, getCategoryLabel } from "@/lib/constants";
import { getPublishedByCategory } from "@/lib/posts";
import { ArticleCard } from "@/components/ArticleCard";
import { AdSlot } from "@/components/AdSlot";
import { MobileStickyAd } from "@/components/MobileStickyAd";
import { Pagination } from "@/components/Pagination";

type Params = { slug: string };
type Search = { page?: string };

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!CATEGORIES.some((c) => c.slug === slug)) return {};
  const label = getCategoryLabel(slug);
  return {
    title: label,
    description: `${label} 관련 최신 경제 뉴스를 모아봤습니다.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;

  if (!CATEGORIES.some((c) => c.slug === slug)) {
    notFound();
  }

  const page = Math.max(1, Number(pageParam) || 1);
  const { posts, totalPages } = await getPublishedByCategory(slug, page);
  const label = getCategoryLabel(slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 border-b-2 border-brand pb-2">
        <h1 className="text-xl font-black text-neutral-900">{label}</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-3">
          {posts.length === 0 ? (
            <p className="py-16 text-center text-neutral-400">
              아직 등록된 기사가 없습니다.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
              {posts.map((post) => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>
          )}
          <Pagination page={page} totalPages={totalPages} basePath={`/category/${slug}`} />
        </div>
        {posts.length > 0 && (
          <aside className="hidden lg:block">
            <div className="sticky top-4">
              <AdSlot position="sidebar" />
            </div>
          </aside>
        )}
      </div>
      {posts.length > 0 && <MobileStickyAd />}
    </div>
  );
}
