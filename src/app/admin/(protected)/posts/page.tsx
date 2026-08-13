import Link from "next/link";
import { listAllPosts } from "@/lib/posts";
import { getCategoryLabel, getPostTypeLabel } from "@/lib/constants";
import { formatDateTime } from "@/lib/format";
import { Pagination } from "@/components/Pagination";
import { DeletePostButton } from "./delete-post-button";

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { posts, totalPages, total } = await listAllPosts(page);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-neutral-900">글 목록 ({total})</h1>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-neutral-300 py-16 text-center text-neutral-400">
          아직 작성된 글이 없습니다.{" "}
          <Link href="/admin/posts/new" className="font-medium text-blue-700 hover:underline">
            첫 글을 작성해보세요
          </Link>
          .
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium">제목</th>
                <th className="px-4 py-3 font-medium">유형</th>
                <th className="px-4 py-3 font-medium">카테고리</th>
                <th className="px-4 py-3 font-medium">상태</th>
                <th className="px-4 py-3 font-medium">작성일</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {posts.map((post) => (
                <tr key={post.id}>
                  <td className="max-w-xs truncate px-4 py-3 font-medium text-neutral-900">
                    {post.title}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-1.5 py-0.5 text-xs font-bold text-white ${
                        post.postType === "analysis" ? "bg-brand" : "bg-accent"
                      }`}
                    >
                      {getPostTypeLabel(post.postType)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{getCategoryLabel(post.category)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        post.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {post.status === "published" ? "발행됨" : "임시저장"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-500">{formatDateTime(post.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="font-medium text-blue-700 hover:underline"
                      >
                        수정
                      </Link>
                      <DeletePostButton postId={post.id} title={post.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} basePath="/admin/posts" />
    </div>
  );
}
