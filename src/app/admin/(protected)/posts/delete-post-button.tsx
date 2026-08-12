"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeletePostButton({ postId, title }: { postId: string; title: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`'${title}' 글을 삭제하시겠습니까?`)) return;

    setDeleting(true);
    try {
      await fetch(`/api/admin/posts/${postId}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="font-medium text-red-600 hover:underline disabled:opacity-50"
    >
      삭제
    </button>
  );
}
