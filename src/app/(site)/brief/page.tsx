import type { Metadata } from "next";
import { getPublishedByType } from "@/lib/posts";
import { BriefItem } from "@/components/BriefItem";
import { AdSlot } from "@/components/AdSlot";
import { Pagination } from "@/components/Pagination";

type Search = { page?: string };

export const metadata: Metadata = {
  title: "속보",
  description: "빠르게 정리한 경제 속보를 모아봤습니다.",
};

export default async function BriefPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { posts, totalPages } = await getPublishedByType("brief", page);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center gap-2 border-b-2 border-accent pb-2">
        <span className="rounded bg-accent px-2 py-0.5 text-xs font-bold text-white">속보</span>
        <h1 className="text-xl font-black text-neutral-900">경제 속보</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-3">
          {posts.length === 0 ? (
            <p className="py-16 text-center text-neutral-400">아직 등록된 속보가 없습니다.</p>
          ) : (
            <div className="divide-y divide-neutral-100">
              {posts.map((post) => (
                <BriefItem key={post.id} post={post} />
              ))}
            </div>
          )}
          <Pagination page={page} totalPages={totalPages} basePath="/brief" />
        </div>
        <aside className="hidden lg:block">
          <div className="sticky top-4">
            <AdSlot position="sidebar" />
          </div>
        </aside>
      </div>
    </div>
  );
}
