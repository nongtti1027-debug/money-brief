"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CATEGORIES } from "@/lib/constants";
import type { PostView } from "@/lib/posts";

type Props = {
  mode: "create" | "edit";
  postId?: string;
  initial?: PostView;
};

export function PostForm({ mode, postId, initial }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [thumbnail, setThumbnail] = useState(initial?.thumbnail ?? "");
  const [category, setCategory] = useState(initial?.category ?? CATEGORIES[0].slug);
  const [tagsInput, setTagsInput] = useState(initial?.tags.join(", ") ?? "");
  const [status, setStatus] = useState<"draft" | "published">(
    (initial?.status as "draft" | "published") ?? "draft"
  );
  const [showPreview, setShowPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "업로드에 실패했습니다.");
        return;
      }
      setThumbnail(data.url);
    } catch {
      setError("업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  }

  async function submit(nextStatus: "draft" | "published") {
    setError(null);
    setSaving(true);

    const payload = {
      title,
      excerpt,
      content,
      thumbnail: thumbnail || null,
      category,
      tags: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      status: nextStatus,
    };

    try {
      const url = mode === "create" ? "/api/admin/posts" : `/api/admin/posts/${postId}`;
      const method = mode === "create" ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "저장에 실패했습니다.");
        return;
      }
      router.push("/admin/posts");
      router.refresh();
    } catch {
      setError("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    submit(status);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">제목</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">요약 (1~2줄)</label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          required
          rows={2}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">카테고리</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          >
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            태그 (쉼표로 구분)
          </label>
          <input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="코스피, 반도체"
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">썸네일 이미지</label>
        <div className="flex items-center gap-4">
          {thumbnail && (
            <div className="relative h-20 w-32 overflow-hidden rounded-md border border-neutral-200 bg-neutral-100">
              <Image src={thumbnail} alt="" fill className="object-cover" unoptimized />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50 disabled:opacity-60"
            >
              {uploading ? "업로드 중..." : "이미지 업로드"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <input
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            placeholder="/uploads/... 또는 이미지 URL"
            className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="block text-sm font-medium text-neutral-700">
            본문 (마크다운)
          </label>
          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
            className="text-xs font-medium text-blue-700 hover:underline"
          >
            {showPreview ? "편집으로 돌아가기" : "미리보기"}
          </button>
        </div>
        {showPreview ? (
          <div className="prose prose-neutral min-h-[300px] max-w-none rounded-md border border-neutral-300 px-4 py-3 text-sm">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || "*내용 없음*"}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={16}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 font-mono text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        )}
      </div>

      <div className="flex items-center justify-between border-t border-neutral-200 pt-4">
        <div>
          <label className="mr-2 text-sm font-medium text-neutral-700">상태</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "draft" | "published")}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm"
          >
            <option value="draft">임시저장</option>
            <option value="published">발행</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => submit("draft")}
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-semibold hover:bg-neutral-50 disabled:opacity-60"
          >
            임시저장
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => submit("published")}
            className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
          >
            발행하기
          </button>
        </div>
      </div>
    </form>
  );
}
