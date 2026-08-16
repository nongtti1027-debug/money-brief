"use client";

import { useState, type FormEvent } from "react";
import { formatDateTime } from "@/lib/format";

type Comment = {
  id: string;
  author: string;
  content: string;
  createdAt: string | Date;
};

export function CommentSection({
  slug,
  initialComments,
}: {
  slug: string;
  initialComments: Comment[];
}) {
  const [comments, setComments] = useState(initialComments);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch(`/api/articles/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, content }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "댓글 등록에 실패했습니다.");
        return;
      }
      setComments((prev) => [data, ...prev]);
      setContent("");
    } catch {
      setError("댓글 등록 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h2 className="mb-4 text-lg font-black text-neutral-900">댓글 {comments.length}</h2>

      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="이름"
          maxLength={30}
          required
          className="w-full max-w-[200px] rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="댓글을 남겨주세요"
          rows={3}
          maxLength={1000}
          required
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="text-right">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90 disabled:opacity-60"
          >
            {submitting ? "등록 중..." : "댓글 등록"}
          </button>
        </div>
      </form>

      {comments.length === 0 ? (
        <p className="py-6 text-center text-sm text-neutral-400">첫 댓글을 남겨보세요.</p>
      ) : (
        <ul className="divide-y divide-neutral-100">
          {comments.map((c) => (
            <li key={c.id} className="py-3">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-bold text-neutral-800">{c.author}</span>
                <span className="text-xs text-neutral-400">{formatDateTime(c.createdAt)}</span>
              </div>
              <p className="mt-1 whitespace-pre-wrap text-sm text-neutral-700">{c.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
