import type { Metadata } from "next";
import { getPublishedByType } from "@/lib/posts";
import { ArticleCard } from "@/components/ArticleCard";
import { AdSlot } from "@/components/AdSlot";
import { MobileStickyAd } from "@/components/MobileStickyAd";
import { Pagination } from "@/components/Pagination";

type Search = { page?: string };

export const metadata: Metadata = {
  title: "분석",
  description: "경제 이슈를 깊이 있게 짚어보는 분석 기사를 모아봤습니다.",
};

export default async function AnalysisPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { posts, totalPages } = await getPublishedByType("analysis", page);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center gap-2 border-b-2 border-brand pb-2">
        <span className="rounded bg-brand px-2 py-0.5 text-xs font-bold text-white">분석</span>
        <h1 className="text-xl font-black text-neutral-900">심층 분석</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-3">
          {posts.length === 0 ? (
            <p className="py-16 text-center text-neutral-400">아직 등록된 분석 기사가 없습니다.</p>
          ) : (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
              {posts.map((post) => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>
          )}
          <Pagination page={page} totalPages={totalPages} basePath="/analysis" />
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
