import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";
import { SearchBar } from "./SearchBar";
import { AdSlot } from "./AdSlot";

export function Header() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-baseline gap-1">
            <span className="text-2xl font-black tracking-tight text-brand">머니브리프</span>
            <span className="text-xs font-medium text-neutral-400">MONEY BRIEF</span>
          </Link>
          <div className="hidden sm:block">
            <SearchBar />
          </div>
        </div>

        <nav className="scrollbar-none -mx-4 flex items-center gap-1 overflow-x-auto border-t border-neutral-100 px-4 py-2 text-sm font-medium">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="shrink-0 rounded-md px-3 py-1.5 text-neutral-700 hover:bg-neutral-100 hover:text-brand"
            >
              {c.label}
            </Link>
          ))}
        </nav>

        <div className="pb-2 sm:hidden">
          <SearchBar />
        </div>
      </div>

      <div className="border-t border-neutral-100 bg-neutral-50 py-2">
        <div className="mx-auto max-w-6xl px-4">
          <AdSlot position="header" />
        </div>
      </div>
    </header>
  );
}
