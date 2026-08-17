export type Category = {
  slug: string;
  label: string;
  placeholder: string;
};

export const CATEGORIES: Category[] = [
  { slug: "stocks", label: "증시", placeholder: "/images/placeholder-1.svg" },
  { slug: "realestate", label: "부동산", placeholder: "/images/placeholder-2.svg" },
  { slug: "rates", label: "금리", placeholder: "/images/placeholder-3.svg" },
  { slug: "forex", label: "환율", placeholder: "/images/placeholder-4.svg" },
  { slug: "industry", label: "산업", placeholder: "/images/placeholder-5.svg" },
  { slug: "money", label: "재테크", placeholder: "/images/placeholder-6.svg" },
];

export function getCategoryLabel(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}

const DEFAULT_PLACEHOLDER = "/images/placeholder-default.svg";

export function getThumbnail(category: string, thumbnail?: string | null): string {
  if (thumbnail) return thumbnail;
  return CATEGORIES.find((c) => c.slug === category)?.placeholder ?? DEFAULT_PLACEHOLDER;
}

export type PostType = {
  slug: "brief" | "analysis";
  label: string;
  path: string;
};

export const POST_TYPES: PostType[] = [
  { slug: "brief", label: "속보", path: "/brief" },
  { slug: "analysis", label: "분석", path: "/analysis" },
];

export function getPostTypeLabel(slug: string): string {
  return POST_TYPES.find((t) => t.slug === slug)?.label ?? slug;
}

export const SITE_NAME = "머니브리프";
export const SITE_DESCRIPTION = "경제 뉴스와 시황을 한눈에 정리해서 전해드립니다.";
export const POSTS_PER_PAGE = 12;
export const AUTHOR_NAME = "머니브리프 편집부";
export const CONTACT_EMAIL = "nongtti1027@gmail.com";
