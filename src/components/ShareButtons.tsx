"use client";

import { useEffect, useState } from "react";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — ignore
    }
  }

  async function handleNativeShare() {
    try {
      await navigator.share({ title, url });
    } catch {
      // user cancelled or share failed — ignore
    }
  }

  function openPopup(shareUrl: string) {
    window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=500");
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const buttonClass =
    "inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 text-neutral-500 transition hover:border-brand hover:text-brand";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-sm font-semibold text-neutral-500">공유하기</span>

      {canNativeShare && (
        <button onClick={handleNativeShare} aria-label="공유하기" className={buttonClass}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path d="M15 8a3 3 0 10-2.977-3.5L7.94 6.85a3 3 0 100 2.3l4.083 2.35A3 3 0 1013 10c0-.152-.013-.3-.033-.447l-4.08-2.35a3.02 3.02 0 000-.406l4.08-2.35C13.284 4.85 14.1 5 15 5a3 3 0 013 3z" />
          </svg>
        </button>
      )}

      <button onClick={handleCopy} aria-label="링크 복사" className={buttonClass}>
        {copied ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-green-600">
            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" />
            <path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z" />
          </svg>
        )}
      </button>

      <button
        onClick={() => openPopup(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`)}
        aria-label="페이스북 공유"
        className={buttonClass}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path fillRule="evenodd" d="M10 2a8 8 0 00-1.25 15.9v-5.63H6.9V10h1.85V8.1c0-1.83 1.09-2.84 2.76-2.84.8 0 1.63.14 1.63.14v1.8h-.92c-.9 0-1.18.56-1.18 1.14V10h2.01l-.32 2.27h-1.69v5.63A8 8 0 0010 2z" clipRule="evenodd" />
        </svg>
      </button>

      <button
        onClick={() => openPopup(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`)}
        aria-label="X(트위터) 공유"
        className={buttonClass}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>

      <button
        onClick={() => openPopup(`https://share.naver.com/web/shareView?url=${encodedUrl}&title=${encodedTitle}`)}
        aria-label="네이버 공유"
        className={`${buttonClass} text-[11px] font-black`}
      >
        N
      </button>
    </div>
  );
}
