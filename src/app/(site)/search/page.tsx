import type { Metadata } from "next";
import { searchPublished } from "@/lib/posts";
import { ArticleCard } from "@/components/ArticleCard";
import { SearchBar } from "@/components/SearchBar";
import { Pagination } from "@/components/Pagination";

type Search = { q?: string; page?: string };

export const metadata: Metadata = {
  title: "검색",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { q, page: pageParam } = await searchParams;
  const query = (q ?? "").trim();
  const page = Math.max(1, Number(pageParam) || 1);

  const result = query
    ? await searchPublished(query, page)
    : { posts: [], total: 0, totalPages: 1 };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-4 text-xl font-black text-neutral-900">기사 검색</h1>
      <div className="mb-8 max-w-md">
        <SearchBar initialQuery={query} />
      </div>

      {query && (
        <p className="mb-6 text-sm text-neutral-500">
          &lsquo;{query}&rsquo; 검색 결과 {result.total}건
        </p>
      )}

      {query && result.posts.length === 0 && (
        <p className="py-16 text-center text-neutral-400">검색 결과가 없습니다.</p>
      )}

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {result.posts.map((post) => (
          <ArticleCard key={post.id} post={post} />
        ))}
      </div>

      <Pagination
        page={page}
        totalPages={result.totalPages}
        basePath="/search"
        extraQuery={`q=${encodeURIComponent(query)}`}
      />
    </div>
  );
}
