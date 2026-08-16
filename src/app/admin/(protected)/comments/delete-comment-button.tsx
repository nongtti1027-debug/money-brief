"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteCommentButton({ commentId }: { commentId: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("이 댓글을 삭제하시겠습니까?")) return;

    setDeleting(true);
    try {
      await fetch(`/api/admin/comments/${commentId}`, { method: "DELETE" });
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
