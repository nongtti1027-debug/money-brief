import Link from "next/link";

export function Pagination({
  page,
  totalPages,
  basePath,
  queryParam = "page",
  extraQuery = "",
}: {
  page: number;
  totalPages: number;
  basePath: string;
  queryParam?: string;
  extraQuery?: string;
}) {
  if (totalPages <= 1) return null;

  function hrefFor(p: number) {
    const params = new URLSearchParams(extraQuery);
    params.set(queryParam, String(p));
    return `${basePath}?${params.toString()}`;
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="mt-8 flex items-center justify-center gap-1 text-sm" aria-label="페이지네이션">
      <Link
        href={hrefFor(Math.max(1, page - 1))}
        aria-disabled={page === 1}
        className={`rounded-md px-3 py-1.5 ${
          page === 1
            ? "pointer-events-none text-neutral-300"
            : "text-neutral-600 hover:bg-neutral-100"
        }`}
      >
        이전
      </Link>
      {pages.map((p) => (
        <Link
          key={p}
          href={hrefFor(p)}
          className={`rounded-md px-3 py-1.5 ${
            p === page ? "bg-brand font-semibold text-white" : "text-neutral-600 hover:bg-neutral-100"
          }`}
        >
          {p}
        </Link>
      ))}
      <Link
        href={hrefFor(Math.min(totalPages, page + 1))}
        aria-disabled={page === totalPages}
        className={`rounded-md px-3 py-1.5 ${
          page === totalPages
            ? "pointer-events-none text-neutral-300"
            : "text-neutral-600 hover:bg-neutral-100"
        }`}
      >
        다음
      </Link>
    </nav>
  );
}
