"use client";

import { useEffect, useState } from "react";

export function LikeButton({ slug, initialLikes }: { slug: string; initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLiked(localStorage.getItem(`liked:${slug}`) === "1");
  }, [slug]);

  async function handleClick() {
    if (liked || loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/articles/${slug}/like`, { method: "POST" });
      if (!res.ok) return;
      const data = await res.json();
      setLikes(data.likes);
      setLiked(true);
      localStorage.setItem(`liked:${slug}`, "1");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={liked || loading}
      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
        liked
          ? "border-accent bg-accent/10 text-accent"
          : "border-neutral-300 text-neutral-600 hover:border-accent hover:text-accent"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.5}
        className="h-4 w-4"
      >
        <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9C4.045 12.733 2 10.352 2 7.5 2 5.015 3.986 3 6.5 3c1.343 0 2.598.598 3.436 1.593l.064.077.064-.077C10.902 3.598 12.157 3 13.5 3 16.014 3 18 5.015 18 7.5c0 2.852-2.045 5.233-3.885 6.82a22.045 22.045 0 01-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 01-.69.001l-.002-.001z" />
      </svg>
      좋아요 {likes}
    </button>
  );
}
