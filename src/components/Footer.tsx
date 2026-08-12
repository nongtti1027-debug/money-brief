import Link from "next/link";
import { CATEGORIES, SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
          <div>
            <div className="text-lg font-black text-brand">{SITE_NAME}</div>
            <p className="mt-1 max-w-sm text-sm text-neutral-500">{SITE_DESCRIPTION}</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-neutral-600">
            {CATEGORIES.map((c) => (
              <Link key={c.slug} href={`/category/${c.slug}`} className="hover:text-brand">
                {c.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-8 border-t border-neutral-200 pt-6 text-xs text-neutral-400">
          <p>
            본 사이트의 콘텐츠는 정보 제공을 목적으로 하며, 투자 판단에 대한 책임은 이용자
            본인에게 있습니다.
          </p>
          <p className="mt-1">© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
