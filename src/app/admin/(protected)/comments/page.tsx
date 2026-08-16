import Link from "next/link";
import { listAllCommentsAdmin } from "@/lib/comments";
import { formatDateTime } from "@/lib/format";
import { Pagination } from "@/components/Pagination";
import { DeleteCommentButton } from "./delete-comment-button";

export default async function AdminCommentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { comments, total, totalPages } = await listAllCommentsAdmin(page);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-neutral-900">댓글 관리 ({total})</h1>
      </div>

      {comments.length === 0 ? (
        <div className="rounded-lg border border-dashed border-neutral-300 py-16 text-center text-neutral-400">
          아직 등록된 댓글이 없습니다.
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="rounded-lg border border-neutral-200 bg-white p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <Link
                    href={`/article/${c.post.slug}`}
                    target="_blank"
                    className="text-xs font-medium text-blue-700 hover:underline"
                  >
                    {c.post.title}
                  </Link>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-sm font-bold text-neutral-800">{c.author}</span>
                    <span className="text-xs text-neutral-400">{formatDateTime(c.createdAt)}</span>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-neutral-700">{c.content}</p>
                </div>
                <DeleteCommentButton commentId={c.id} />
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} basePath="/admin/comments" />
    </div>
  );
}
