export type Category = {
  slug: string;
  label: string;
};

export const CATEGORIES: Category[] = [
  { slug: "stocks", label: "증시" },
  { slug: "realestate", label: "부동산" },
  { slug: "rates", label: "금리" },
  { slug: "forex", label: "환율" },
  { slug: "industry", label: "산업" },
  { slug: "money", label: "재테크" },
];

export function getCategoryLabel(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}

export const SITE_NAME = "머니브리프";
export const SITE_DESCRIPTION = "경제 뉴스와 시황을 한눈에 정리해서 전해드립니다.";
export const POSTS_PER_PAGE = 12;
