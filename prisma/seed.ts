import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

type SeedPost = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  category: string;
  postType: "brief" | "analysis";
  tags: string[];
  status: "draft" | "published";
  daysAgo: number;
};

const posts: SeedPost[] = [
  {
    title: "코스피, 반도체株 강세에 2,650선 회복",
    slug: "kospi-semiconductor-rally-2650",
    excerpt:
      "외국인 순매수와 반도체 대형주 강세에 힘입어 코스피가 2,650선을 다시 넘어섰다.",
    thumbnail: "/images/placeholder-1.svg",
    category: "stocks",
    postType: "brief",
    tags: ["코스피", "반도체", "외국인수급"],
    status: "published",
    daysAgo: 0,
    content: `코스피가 반도체 대형주 강세에 힘입어 2,650선을 회복했다. 12일 한국거래소에 따르면 코스피는 전 거래일 대비 1.2% 오른 2,653.14에 거래를 마쳤다.

## 외국인 매수세 유입

외국인 투자자는 이날 코스피 시장에서 약 4,200억 원 규모를 순매수하며 지수 상승을 견인했다. 특히 메모리 반도체 업황 개선 기대감이 반영되며 관련 대형주에 매수세가 집중됐다.

## 업종별 등락

- 반도체: +2.8%
- 2차전지: +0.6%
- 자동차: -0.3%
- 금융: +0.4%

증권가에서는 하반기 반도체 업황 회복 사이클이 본격화될 경우 추가 상승 여력이 있다는 분석을 내놓고 있다. 다만 미국 금리 정책 방향에 따른 변동성은 여전히 유의해야 할 변수로 꼽힌다.`,
  },
  {
    title: "서울 아파트값 3주 연속 상승…강남권이 견인",
    slug: "seoul-apartment-price-3weeks-rise",
    excerpt:
      "서울 아파트 매매가격이 3주 연속 오르며 강남 3구를 중심으로 회복세가 뚜렷해지고 있다.",
    thumbnail: "/images/placeholder-2.svg",
    category: "realestate",
    postType: "brief",
    tags: ["서울아파트", "강남3구", "매매가격"],
    status: "published",
    daysAgo: 1,
    content: `서울 아파트 매매가격이 3주 연속 상승세를 이어가고 있다. 한국부동산원이 발표한 주간 아파트가격 동향에 따르면 이번 주 서울 아파트값은 전주 대비 0.08% 올랐다.

## 강남 3구 상승폭 확대

강남·서초·송파구 등 이른바 강남 3구는 재건축 기대감이 있는 단지를 중심으로 상승폭이 확대됐다. 반면 외곽 지역은 보합 내지 소폭 하락하며 지역별 온도차가 뚜렷했다.

## 거래량은 여전히 저조

가격은 오르고 있지만 실제 거래량은 예년 대비 낮은 수준에 머물러 있다. 전문가들은 "관망세가 여전한 가운데 일부 선호 단지 위주로만 매수세가 몰리는 국지적 상승"이라고 진단했다.`,
  },
  {
    title: "한국은행, 기준금리 3.25%로 동결…연내 인하 가능성 시사",
    slug: "bok-rate-freeze-325-cut-signal",
    excerpt:
      "한국은행 금융통화위원회가 기준금리를 3.25%로 동결하면서도 연내 추가 인하 가능성을 열어뒀다.",
    thumbnail: "/images/placeholder-3.svg",
    category: "rates",
    postType: "analysis",
    tags: ["한국은행", "기준금리", "금통위"],
    status: "published",
    daysAgo: 2,
    content: `한국은행 금융통화위원회가 기준금리를 현 수준인 연 3.25%로 동결했다. 이번 동결은 시장 예상과 대체로 부합하는 결정이다.

## 동결 배경

금통위는 물가 상승률이 목표치에 근접하고 있으나 가계부채 증가세와 환율 변동성을 감안해 신중한 판단을 내린 것으로 풀이된다.

## 총재 발언 요지

총재는 기자회견에서 "물가 안정 흐름이 이어진다면 연내 금리 인하 가능성을 열어두고 있다"고 밝혔다. 다만 미국 연방준비제도의 정책 기조와 국내 부동산 시장 동향을 함께 살펴보겠다는 신중한 태도를 유지했다.

시장에서는 다음 회의에서의 인하 여부에 촉각을 곤두세우고 있다.`,
  },
  {
    title: "원/달러 환율, 1,380원대 등락…미 고용지표 주시",
    slug: "usd-krw-1380-watching-us-jobs",
    excerpt:
      "원/달러 환율이 1,380원대에서 등락을 거듭하는 가운데 미국 고용지표 발표에 시장의 관심이 쏠리고 있다.",
    thumbnail: "/images/placeholder-4.svg",
    category: "forex",
    postType: "brief",
    tags: ["원달러환율", "외환시장", "미국고용지표"],
    status: "published",
    daysAgo: 3,
    content: `원/달러 환율이 1,380원대에서 좁은 박스권 등락을 이어가고 있다. 서울 외환시장에서 원/달러 환율은 전일 대비 2.1원 오른 1,383.5원에 마감했다.

## 대기 심리 우세

이번 주 발표 예정인 미국 비농업 고용지표를 앞두고 시장 참가자들은 뚜렷한 방향성을 보이지 않은 채 관망하는 분위기다.

## 수급 요인

수출업체의 네고 물량과 결제 수요가 맞물리며 상단과 하단이 제한되는 모습이다. 외환당국의 미세 조정 개입 경계감도 상승 압력을 일부 상쇄하고 있다는 분석이다.

전문가들은 고용지표가 예상치를 웃돌 경우 달러 강세와 함께 환율이 추가로 상승할 수 있다고 내다봤다.`,
  },
  {
    title: "국내 배터리 3사, 북미 신규 공장 가동률 회복세",
    slug: "korea-battery-makers-na-plant-recovery",
    excerpt:
      "전기차 수요 둔화로 어려움을 겪었던 국내 배터리 3사의 북미 공장 가동률이 점진적으로 회복되고 있다.",
    thumbnail: "/images/placeholder-5.svg",
    category: "industry",
    postType: "analysis",
    tags: ["배터리산업", "전기차", "북미공장"],
    status: "published",
    daysAgo: 4,
    content: `LG에너지솔루션, 삼성SDI, SK온 등 국내 배터리 3사의 북미 공장 가동률이 완만한 회복세를 보이고 있다. 지난해 전기차 수요 둔화(캐즘)로 가동률 조정이 이어졌으나 최근 완성차 업체들의 신모델 출시와 함께 물량이 늘고 있다.

## 업체별 동향

- LG에너지솔루션: 미시간·오하이오 공장 가동률 순차 상향
- 삼성SDI: 완성차 업체와 공급 계약 확대 협의
- SK온: 조지아 공장 수율 개선에 주력

## 업계 전망

업계 관계자는 "캐즘이 완전히 해소된 것은 아니지만 하반기로 갈수록 수요 회복 신호가 뚜렷해지고 있다"고 말했다. 다만 미국의 정책 변화에 따른 보조금 불확실성은 여전한 리스크 요인으로 꼽힌다.`,
  },
  {
    title: "연말정산 미리보기, 지금 확인해야 할 3가지",
    slug: "year-end-tax-settlement-checklist",
    excerpt:
      "국세청 연말정산 미리보기 서비스가 열렸다. 놓치기 쉬운 공제 항목 3가지를 정리했다.",
    thumbnail: "/images/placeholder-6.svg",
    category: "money",
    postType: "brief",
    tags: ["연말정산", "세테크", "소득공제"],
    status: "published",
    daysAgo: 5,
    content: `국세청 홈택스에서 연말정산 미리보기 서비스가 시작됐다. 올해 예상 세액을 미리 확인하고 절세 전략을 세울 수 있는 시기다.

## 1. 신용카드 사용액 확인

신용카드와 체크카드 사용 비중을 조정하면 공제율 차이를 활용할 수 있다. 체크카드·현금영수증 사용분이 신용카드보다 공제율이 높다는 점을 기억하자.

## 2. 연금저축·IRP 추가 납입

연금저축과 IRP를 합산해 연 900만 원까지 세액공제를 받을 수 있다. 한도가 남아 있다면 연말 전 추가 납입을 고려할 만하다.

## 3. 월세 세액공제 요건 재확인

무주택 세대주이면서 총급여 요건을 충족하면 월세액의 일부를 세액공제 받을 수 있다. 임대차계약서와 계좌이체 내역을 미리 준비해두는 것이 좋다.`,
  },
  {
    title: "수도권 광역급행철도(GTX) 추가 노선 예비타당성 통과",
    slug: "gtx-new-line-feasibility-pass",
    excerpt:
      "수도권 광역급행철도 신규 노선이 예비타당성 조사를 통과하며 착공에 청신호가 켜졌다.",
    thumbnail: "/images/placeholder-2.svg",
    category: "realestate",
    postType: "analysis",
    tags: ["GTX", "교통호재", "수도권개발"],
    status: "published",
    daysAgo: 6,
    content: `국토교통부는 수도권 광역급행철도(GTX) 신규 노선이 예비타당성 조사를 통과했다고 밝혔다. 이번 노선은 수도권 서북부와 동남부를 연결하는 구간으로 개통 시 통근 시간이 크게 단축될 전망이다.

## 沿선 지역 기대감

해당 노선이 지나는 정차역 인근 지역은 개발 기대감에 부동산 시장이 들썩이고 있다. 다만 실제 착공까지는 기본계획 수립과 설계 등 추가 절차가 남아 있어 시간이 걸릴 것으로 보인다.

전문가들은 "교통 호재가 가격에 선반영되는 경우가 많은 만큼 사업 진행 속도를 지켜보며 신중하게 접근할 필요가 있다"고 조언했다.`,
  },
  {
    title: "미 연준 위원 발언에 국채 금리 소폭 상승",
    slug: "fed-official-remarks-treasury-yield-up",
    excerpt:
      "매파적 발언이 나오며 미 국채 금리가 소폭 상승, 국내 채권 시장에도 영향을 미쳤다.",
    thumbnail: "/images/placeholder-3.svg",
    category: "rates",
    postType: "brief",
    tags: ["미국채", "연준", "채권시장"],
    status: "draft",
    daysAgo: 0,
    content: `미 연방준비제도(Fed) 한 위원의 매파적 발언이 나오며 미 국채 10년물 금리가 소폭 상승했다. 이는 국내 채권 시장에도 영향을 미치며 국고채 금리 역시 동반 상승하는 모습을 보였다.

(초안 - 발행 전 추가 취재 필요)`,
  },
  {
    title: "2차전지 소재주, 실적 발표 앞두고 변동성 확대",
    slug: "battery-materials-earnings-volatility",
    excerpt:
      "2차전지 소재 관련 종목들이 실적 발표를 앞두고 변동성이 커지는 모습이다.",
    thumbnail: "/images/placeholder-1.svg",
    category: "stocks",
    postType: "brief",
    tags: ["2차전지", "소재주", "실적시즌"],
    status: "draft",
    daysAgo: 0,
    content: `2차전지 소재 관련주들의 주가 변동성이 실적 발표를 앞두고 확대되고 있다.

(초안)`,
  },
];

async function main() {
  for (const post of posts) {
    const publishedAt =
      post.status === "published"
        ? new Date(Date.now() - post.daysAgo * 24 * 60 * 60 * 1000)
        : null;

    await prisma.post.upsert({
      where: { slug: post.slug },
      update: { postType: post.postType },
      create: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        thumbnail: post.thumbnail,
        category: post.category,
        postType: post.postType,
        tags: JSON.stringify(post.tags),
        status: post.status,
        createdAt: publishedAt ?? new Date(),
        publishedAt,
      },
    });
  }

  const count = await prisma.post.count();
  console.log(`Seed complete. Total posts: ${count}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
