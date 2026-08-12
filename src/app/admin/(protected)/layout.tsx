import Link from "next/link";
import { requireAdminPage } from "@/lib/auth";
import { LogoutButton } from "./logout-button";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminPage();

  return (
    <div className="min-h-screen bg-neutral-100">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/admin/posts" className="font-bold text-neutral-900">
            머니브리프 관리자
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/admin/posts" className="text-neutral-600 hover:text-neutral-900">
              글 목록
            </Link>
            <Link
              href="/admin/posts/new"
              className="rounded-md bg-blue-700 px-3 py-1.5 font-semibold text-white hover:bg-blue-800"
            >
              새 글 작성
            </Link>
            <Link href="/" target="_blank" className="text-neutral-600 hover:text-neutral-900">
              사이트 보기
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
