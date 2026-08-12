# 머니브리프 (Money Brief)

경제/금융 뉴스를 큐레이션·요약해서 발행하는 1인 운영 뉴스형 웹사이트입니다.

## 기술 스택

- **Next.js 16** (App Router, TypeScript, Tailwind CSS v4)
- **Prisma 7 + SQLite** (`@prisma/adapter-libsql` 드라이버 어댑터 사용)
- **iron-session** 기반 관리자 세션 쿠키 인증 (회원가입 없음, 비밀번호 1개)
- **react-markdown** 마크다운 렌더링

## 시작하기

```bash
npm install
npx prisma migrate dev   # DB 스키마 생성 (최초 1회)
npx prisma db seed       # 샘플 기사 9건 생성 (선택)
npm run dev
```

http://localhost:3000 에서 사이트를, http://localhost:3000/admin 에서 관리자 페이지를 확인할 수 있습니다.

### 환경 변수 (`.env`)

`.env.example`을 참고해 `.env`를 만드세요.

| 변수 | 설명 |
| --- | --- |
| `DATABASE_URL` | 로컬 개발은 SQLite 파일 경로(기본값 `file:./dev.db`), 프로덕션은 Turso 연결 URL — [프로덕션 DB (Turso)](#프로덕션-db-turso) 참고 |
| `ADMIN_PASSWORD` | 관리자 로그인 비밀번호. **배포 전 반드시 변경하세요.** |
| `SESSION_SECRET` | 세션 쿠키 암호화 키. 32자 이상 랜덤 문자열. `node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"`로 생성 가능 |
| `NEXT_PUBLIC_SITE_URL` | 배포 도메인 (sitemap, OG 이미지, 메타데이터에 사용) |

## 디렉터리 구조

```
src/
  app/
    (site)/          공개 페이지 (홈, 카테고리, 기사, 검색) — 공통 헤더/푸터 레이아웃
    admin/
      login/         관리자 로그인 (인증 불필요)
      (protected)/   글 목록/작성/수정 — 레이아웃에서 세션 검사 후 미인증 시 로그인으로 리다이렉트
    api/admin/       로그인/로그아웃/글 CRUD/이미지 업로드 API
    sitemap.ts       robots.ts   SEO 파일
  components/        Header, Footer, ArticleCard, AdSlot 등 공통 컴포넌트
  lib/                DB 클라이언트, 세션/인증, 데이터 조회 함수, 상수(카테고리 등)
prisma/
  schema.prisma      Post 모델
  seed.ts            샘플 기사 시드 스크립트
```

## 광고 슬롯

`src/components/AdSlot.tsx`의 `<AdSlot position="..." />`로 헤더, 사이드바, 본문 중간(3문단마다), 기사 하단, 모바일 하단 고정 배너 위치에 플레이스홀더가 배치되어 있습니다.

구글 애드센스 승인 후에는:

1. `src/app/layout.tsx`의 `<head>`에 애드센스 스크립트 태그 추가
2. `AdSlot.tsx`의 플레이스홀더 `<div>`를 실제 `<ins className="adsbygoogle">` 스니펫으로 교체

## 카테고리 수정

`src/lib/constants.ts`의 `CATEGORIES` 배열만 수정하면 헤더 내비게이션, 카테고리 페이지, 글쓰기 폼 선택지에 모두 반영됩니다.

## 알려진 제약 사항 (Vercel 배포 시 주의)

- **이미지 업로드**: `/api/admin/upload`는 업로드한 파일을 `public/uploads`에 씁니다. 로컬/자체 서버(Node 서버, Docker)에서는 그대로 동작하지만, **Vercel 등 서버리스 환경은 파일 시스템이 읽기 전용**이라 업로드가 배포 간 유지되지 않습니다. 프로덕션에서는 Vercel Blob, S3, Cloudinary 등 외부 스토리지로 교체가 필요합니다. (썸네일 필드에 외부 이미지 URL을 직접 입력하는 것은 지금도 가능합니다.)
- **로컬 SQLite 파일**: 서버리스 다중 인스턴스 환경에서는 파일이 유지되지 않으므로, 배포 전 아래 Turso 전환이 필요합니다.

## 프로덕션 DB (Turso)

로컬 SQLite 파일(`dev.db`) 대신 [Turso](https://turso.tech)(관리형 libSQL, 무료 티어 제공)를 쓰도록 코드가 이미 준비되어 있습니다 (`@prisma/adapter-libsql`을 그대로 사용하므로 어댑터 교체가 필요 없습니다). 아래는 계정 생성이 필요한 단계라 직접 진행해주셔야 합니다.

### 1. Turso 데이터베이스 만들기

**웹 대시보드**로 하려면 https://turso.tech 에서 가입 후 데이터베이스를 생성하고, 생성된 DB의 "Connect" 화면에서 URL과 auth token을 확인하세요.

**CLI**로 하려면:

```bash
# Turso CLI 설치 (Windows는 scoop 또는 WSL/Git Bash에서 아래 스크립트 사용)
curl -sSfL https://get.tur.so/install.sh | bash

turso auth login          # 브라우저 로그인 (본인이 직접 진행)
turso db create money-brief
turso db show money-brief --url          # -> libsql://money-brief-xxxx.turso.io
turso db tokens create money-brief       # -> eyJhbGc... (토큰)
```

### 2. `DATABASE_URL` 조합하기

앱 코드(`src/lib/db.ts`)와 시드 스크립트는 토큰을 **URL 쿼리 파라미터로 합친** 하나의 `DATABASE_URL`을 씁니다.

```env
DATABASE_URL="libsql://money-brief-xxxx.turso.io?authToken=eyJhbGc..."
```

이 값을 로컬에서 테스트하려면 `.env`에, Vercel에 배포한다면 프로젝트의 Environment Variables에 넣으세요.

### 3. 스키마 적용 + (선택) 시드

> **주의**: `npx prisma migrate deploy`는 이 프로젝트에서 Turso에 대해 동작하지 않습니다. Prisma 7의 SQLite 마이그레이션 엔진이 `libsql://` 스킴을 인식하지 못하고 `P1013` 에러를 내기 때문입니다 (런타임에 쓰는 `@prisma/adapter-libsql` 드라이버 어댑터와 CLI의 마이그레이션 엔진은 별개 경로입니다). 대신 아래 스크립트로 `prisma/migrations`의 SQL을 `@libsql/client`를 통해 직접 적용하세요.

```bash
# DATABASE_URL이 Turso를 가리키는 상태에서 실행
npm run db:apply:turso   # prisma/migrations/*/migration.sql을 Turso에 직접 적용
npx prisma db seed       # 샘플 기사가 필요 없다면 생략 (이건 정상적으로 동작함)
```

스키마를 바꿔서(`schema.prisma` 수정) `npx prisma migrate dev`로 새 마이그레이션을 로컬에 생성했다면, 그 다음 Turso에도 반영하기 위해 `npm run db:apply:turso`를 다시 실행하세요.

### 4. Vercel에 연결

Vercel 프로젝트 설정 → Environment Variables에 `DATABASE_URL`(Turso URL), `ADMIN_PASSWORD`, `SESSION_SECRET`, `NEXT_PUBLIC_SITE_URL`을 등록하면 배포된 앱이 Turso를 바로 사용합니다.

> Postgres(Supabase 등)로 가고 싶다면 `@prisma/adapter-pg`+`pg` 설치, `schema.prisma`의 `datasource` provider를 `postgresql`로, `src/lib/db.ts`/`prisma/seed.ts`의 어댑터를 `PrismaPg`로 교체하면 됩니다. 스키마 정의(모델) 자체는 거의 그대로 재사용 가능합니다.

## 배포 (Vercel)

1. 이 저장소를 GitHub에 push
2. Vercel에서 Import → 위 환경 변수 설정 (로컬 SQLite 파일은 Vercel에서 영속되지 않으므로 배포 전 위 Turso 전환 필요)
3. Build Command: `npm run build` (기본값 그대로 사용 가능)
