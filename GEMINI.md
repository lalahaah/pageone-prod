# GEMINI.md — PageOne 프로젝트 마스터 컨텍스트
> **Gemini CLI (antigravity)용 프로젝트 바이블**
> 이 파일을 모든 작업 세션 시작 시 Gemini CLI에 로드한다.
> 마지막 업데이트: 2025년 5월

---

## 0. 이 파일의 사용법

```bash
# 모든 세션 시작 시 이 파일을 컨텍스트로 주입
gemini -f GEMINI.md "작업 지시"

# 또는 antigravity에서
@GEMINI.md [프롬프트]
```

**규칙:**
- 새 세션마다 반드시 이 파일을 먼저 로드한다
- 코드 생성 시 이 파일의 스택/스키마/컨벤션을 100% 따른다
- 이 파일에 없는 기술 스택은 임의로 추가하지 않는다
- 작업 완료 후 변경사항이 생기면 이 파일을 업데이트한다
- **모든 답변은 반드시 한국어로 작성한다. 코드 블록 내부는 제외, 코드 주석은 한국어로 작성한다.**

### ⛔ 절대 금지 — @[username] 병렬 라우트 주의사항

**`app/@[username]` 폴더 관련 필수 규칙:**

- `app/@[username]/` 폴더 생성 시 반드시 `default.tsx`를 함께 생성해야 한다
- `default.tsx` 없으면 `ReferenceError: username is not defined` 에러 발생
- PROMPT-05 (판매 페이지) 작업 전까지 `@[username]` 폴더를 절대 생성하지 않는다
- PROMPT-05 실행 시 아래 두 파일을 반드시 동시에 생성한다:
  - `app/@[username]/default.tsx` → `export default function Default() { return null; }`
  - `app/@[username]/[slug]/page.tsx` → 판매 페이지

---

### ⛔ 절대 금지 — 자의적 다음 스텝 진행 금지

**지시한 작업만 하고, 반드시 멈춰라.**

- 요청한 작업이 완료되면 즉시 멈추고 결과만 출력한다
- "다음으로 X도 해드릴까요?", "이어서 Y를 진행하겠습니다" 같은 말 금지
- 지시하지 않은 파일, 함수, 컴포넌트를 임의로 추가 생성하지 않는다
- 요청 범위를 벗어난 "개선", "최적화", "추가 기능"을 자의적으로 구현하지 않는다
- 다음 스프린트나 다음 프롬프트를 선제적으로 실행하지 않는다
- 작업 완료 후 다음 작업 제안이 필요하면 내가 직접 요청한다

**올바른 행동:**
```
나: PROMPT-03 Auth 구현해줘
Gemini: [Auth 코드 출력]
        --- 완료 ---       ← 여기서 멈춤
```

**잘못된 행동:**
```
나: PROMPT-03 Auth 구현해줘
Gemini: [Auth 코드 출력]
        "Auth 구현이 완료되었습니다. 이어서 PROMPT-04 상품 등록 폼도 진행할까요?"  ← 금지
        "미들웨어도 추가로 구현해두었습니다"  ← 금지
```

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **서비스명** | PageOne (페이지원) |
| **도메인** | pageone.kr (예정) |
| **슬로건** | "5분 만에 내 디지털 상품 판매 시작" |
| **카테고리** | 디지털 상품 판매 빌더 (한국판 Gumroad) |
| **레퍼런스** | Gumroad, Lemon Squeezy |
| **타깃 유저** | 크몽/탈잉의 높은 수수료에 불만인 한국 크리에이터 |
| **핵심 가치** | 5분 셋업 + 내 URL + 카카오페이/토스 + 원화 정산 |

### 핵심 포지셔닝
```
크몽/탈잉  → 마켓플레이스 (수수료 20%+, 심사 필요, 내 브랜드 없음)
아임웹     → 풀 쇼핑몰 빌더 (셋업 며칠, 월 수십만원)
Gumroad   → 해외 서비스 (카카오페이 없음, 달러 정산)

PageOne   → 5분 셋업 + 내 URL + 카카오페이 + 원화 정산
           "크몽에 수수료 갖다 바치지 말고, 내 페이지에서 팔아라"
```

---

## 2. 기술 스택 (변경 불가 — 반드시 준수)

```
Frontend   : Next.js 14 (App Router) + TypeScript
Styling    : Tailwind CSS + shadcn/ui
Backend    : Supabase (PostgreSQL + Auth + Storage + Edge Functions)
결제       : 토스페이먼츠 (단일 SDK → 카카오페이 + 토스페이 + 신용카드 통합)
이메일     : Resend (트랜잭셔널)
배포       : Vercel
패키지     : pnpm
Node       : 20.x LTS
```

### 절대 사용하지 않을 것
- ❌ Prisma (Supabase 직접 쿼리 사용)
- ❌ Redux (Zustand 또는 Context API)
- ❌ Express/NestJS (Supabase Edge Functions으로 대체)
- ❌ AWS S3 (Supabase Storage 사용)
- ❌ Stripe (토스페이먼츠로 대체)
- ❌ pages/ 라우터 (App Router만 사용)

---

## 3. 프로젝트 디렉토리 구조

```
pageone/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx              # 크리에이터 대시보드 레이아웃
│   │   ├── dashboard/
│   │   │   └── page.tsx            # 매출 현황 메인
│   │   ├── products/
│   │   │   ├── page.tsx            # 상품 목록
│   │   │   ├── new/
│   │   │   │   └── page.tsx        # 상품 등록
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx    # 상품 수정
│   │   └── settings/
│   │       └── page.tsx            # 계좌/프로필 설정
│   ├── @[username]/
│   │   ├── page.tsx                # 크리에이터 스토어 홈
│   │   └── [slug]/
│   │       └── page.tsx            # 상품 판매 페이지 (퍼블릭)
│   ├── api/
│   │   ├── payments/
│   │   │   ├── confirm/
│   │   │   │   └── route.ts        # 토스페이먼츠 결제 확인
│   │   │   └── webhook/
│   │   │       └── route.ts        # 결제 웹훅
│   │   └── downloads/
│   │       └── [token]/
│   │           └── route.ts        # 파일 다운로드 (Signed URL)
│   ├── layout.tsx
│   └── page.tsx                    # 랜딩 페이지
├── components/
│   ├── ui/                         # shadcn/ui 컴포넌트
│   ├── dashboard/
│   │   ├── StatsCard.tsx
│   │   ├── RecentOrders.tsx
│   │   └── RevenueChart.tsx
│   ├── product/
│   │   ├── ProductForm.tsx         # 상품 등록/수정 폼
│   │   ├── FileUploader.tsx        # 파일 업로드 컴포넌트
│   │   └── SalesPage.tsx           # 판매 페이지 렌더러
│   └── payment/
│       ├── PaymentButton.tsx       # 결제 버튼
│       └── PaymentModal.tsx        # 구매자 정보 입력 모달
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # 브라우저용 Supabase 클라이언트
│   │   ├── server.ts               # 서버용 Supabase 클라이언트
│   │   └── admin.ts                # Service Role 클라이언트 (웹훅용)
│   ├── toss/
│   │   └── payments.ts             # 토스페이먼츠 유틸
│   ├── resend/
│   │   └── emails.ts               # 이메일 템플릿 + 발송
│   └── utils.ts                    # 공통 유틸
├── types/
│   └── database.ts                 # Supabase 자동생성 타입
├── supabase/
│   ├── migrations/                 # DB 마이그레이션 파일
│   └── seed.sql                    # 개발용 시드 데이터
├── .env.local                      # 환경변수 (절대 커밋 금지)
├── .env.example                    # 환경변수 템플릿
└── GEMINI.md                       # 이 파일
```

---

## 4. 데이터베이스 스키마 (Supabase PostgreSQL)

### 4-1. profiles (크리에이터)
```sql
CREATE TABLE profiles (
  id              UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username        TEXT UNIQUE NOT NULL,           -- @닉네임 (URL에 사용)
  display_name    TEXT,
  bio             TEXT,
  avatar_url      TEXT,
  bank_name       TEXT,                           -- 은행명 (정산용)
  bank_account    TEXT,                           -- 계좌번호 (암호화 저장)
  bank_holder     TEXT,                           -- 예금주
  plan            TEXT DEFAULT 'free'             -- 'free' | 'pro' | 'biz'
                  CHECK (plan IN ('free', 'pro', 'biz')),
  plan_expires_at TIMESTAMPTZ,
  total_revenue   INTEGER DEFAULT 0,              -- 누적 매출 (원)
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 정책
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "본인 프로필만 수정 가능" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "프로필은 누구나 조회 가능" ON profiles
  FOR SELECT USING (true);
```

### 4-2. products (상품)
```sql
CREATE TABLE products (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id               UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title                 TEXT NOT NULL,
  description           TEXT,                    -- HTML 리치텍스트
  price                 INTEGER NOT NULL DEFAULT 0, -- 원화, 0=무료
  pay_what_you_want     BOOLEAN DEFAULT FALSE,
  min_price             INTEGER DEFAULT 0,        -- PWYW 최소 금액
  file_path             TEXT,                     -- Supabase Storage 경로
  file_name             TEXT,                     -- 원본 파일명
  file_size             BIGINT,                   -- bytes
  file_type             TEXT,                     -- 'pdf'|'zip'|'video_link'|'notion_link'
  external_url          TEXT,                     -- 외부 링크형 상품
  thumbnail_url         TEXT,
  slug                  TEXT NOT NULL,            -- URL 슬러그
  is_published          BOOLEAN DEFAULT FALSE,
  download_limit        INTEGER DEFAULT 5,        -- 다운로드 횟수 제한
  download_expire_hours INTEGER DEFAULT 48,       -- 링크 유효시간 (시간)
  sales_count           INTEGER DEFAULT 0,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, slug)
);

-- RLS 정책
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "상품 등록은 본인만" ON products
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "상품 수정은 본인만" ON products
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "퍼블리시된 상품은 누구나 조회" ON products
  FOR SELECT USING (is_published = TRUE OR auth.uid() = user_id);
```

### 4-3. orders (주문)
```sql
CREATE TABLE orders (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id      UUID REFERENCES products(id) NOT NULL,
  seller_id       UUID REFERENCES profiles(id) NOT NULL,
  buyer_email     TEXT NOT NULL,
  buyer_name      TEXT,
  amount          INTEGER NOT NULL,               -- 실 결제금액 (원)
  fee             INTEGER NOT NULL DEFAULT 0,     -- 플랫폼 수수료
  fee_rate        NUMERIC(4,2) NOT NULL,          -- 수수료율 (5.00 = 5%)
  net_amount      INTEGER NOT NULL,               -- 크리에이터 정산 예정액
  status          TEXT DEFAULT 'pending'
                  CHECK (status IN ('pending','paid','refunded','failed')),
  payment_key     TEXT UNIQUE,                    -- 토스페이먼츠 paymentKey
  payment_method  TEXT,                           -- 'CARD'|'카카오페이'|'토스페이'
  download_token  TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  download_count  INTEGER DEFAULT 0,
  receipt_url     TEXT,                           -- 영수증 URL
  cash_receipt_issued BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  paid_at         TIMESTAMPTZ
);

-- RLS 정책
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "판매자는 본인 주문 조회 가능" ON orders
  FOR SELECT USING (auth.uid() = seller_id);
-- 구매자 조회는 API Route에서 service role로 처리
```

### 4-4. settlements (정산)
```sql
CREATE TABLE settlements (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID REFERENCES profiles(id) NOT NULL,
  amount          INTEGER NOT NULL,               -- 정산 신청 금액
  order_ids       UUID[] NOT NULL,                -- 포함된 주문 ID 배열
  status          TEXT DEFAULT 'requested'
                  CHECK (status IN ('requested','processing','done','rejected')),
  reject_reason   TEXT,
  requested_at    TIMESTAMPTZ DEFAULT NOW(),
  processed_at    TIMESTAMPTZ,
  settled_at      TIMESTAMPTZ
);

ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "본인 정산 내역만 조회" ON settlements
  FOR SELECT USING (auth.uid() = user_id);
```

### 4-5. 핵심 View
```sql
-- 크리에이터별 미정산 금액 View
CREATE VIEW pending_settlement_amounts AS
SELECT
  o.seller_id,
  SUM(o.net_amount) AS unsettled_amount,
  COUNT(*) AS unsettled_orders
FROM orders o
WHERE o.status = 'paid'
  AND o.id NOT IN (
    SELECT UNNEST(s.order_ids) FROM settlements s
    WHERE s.status IN ('requested', 'processing', 'done')
  )
GROUP BY o.seller_id;
```

---

## 5. 수수료 정책

```typescript
// lib/utils.ts
export const FEE_RATES = {
  free: 0.05,   // 5%
  pro: 0.03,    // 3%
  biz: 0.00,    // 0%
} as const;

export function calculateFee(amount: number, plan: 'free' | 'pro' | 'biz') {
  const feeRate = FEE_RATES[plan];
  const fee = Math.round(amount * feeRate);
  return {
    amount,
    fee,
    feeRate: feeRate * 100,
    netAmount: amount - fee,
  };
}
```

### 플랜별 제한
| 항목 | FREE | PRO (9,900원/월) | BIZ (29,900원/월) |
|------|------|-----------------|------------------|
| 수수료 | 5% | 3% | 0% |
| 상품 수 | 5개 | 무제한 | 무제한 |
| 파일 용량 | 1GB | 10GB | 50GB |
| 커스텀 도메인 | ❌ | ❌ | ✅ |
| 구매자 이메일 수출 | ❌ | ✅ | ✅ |

---

## 6. 환경변수 (.env.local)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 토스페이먼츠
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_...
TOSS_SECRET_KEY=test_sk_...

# Resend
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@pageone.kr

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=PageOne

# 보안
DOWNLOAD_TOKEN_SALT=랜덤_강력한_문자열_32자이상
```

---

## 7. 핵심 API 설계

### 7-1. 결제 흐름 (토스페이먼츠)

```
[구매자 클릭 "구매하기"]
       ↓
[PaymentModal] 이메일/이름 입력
       ↓
[토스페이먼츠 SDK] 결제창 호출
  - amount: 상품가격
  - orderId: `po_${nanoid(12)}`  ← 우리 주문 ID
  - orderName: 상품명
  - customerEmail: 구매자 이메일
       ↓
[결제 완료] → 토스페이먼츠가 /api/payments/confirm 으로 리다이렉트
       ↓
[/api/payments/confirm/route.ts]
  1. paymentKey, amount, orderId 수신
  2. 토스페이먼츠 서버사이드 검증
  3. orders 테이블 INSERT (status: 'paid')
  4. download_token 생성
  5. Resend로 구매 완료 이메일 발송 (다운로드 링크 포함)
  6. products.sales_count +1
       ↓
[구매자] 이메일에서 다운로드 링크 클릭
       ↓
[/api/downloads/[token]/route.ts]
  1. token으로 orders 조회
  2. 만료 시간 체크 (created_at + expire_hours)
  3. 다운로드 횟수 체크 (download_count < download_limit)
  4. Supabase Storage에서 Signed URL 생성 (60초 유효)
  5. 307 리다이렉트 → 파일 다운로드
  6. download_count +1
```

### 7-2. API Routes 목록

```
POST /api/payments/confirm         결제 확인 및 주문 생성
POST /api/payments/webhook         토스페이먼츠 웹훅 (환불 등)
GET  /api/downloads/[token]        파일 다운로드
GET  /api/products/[id]/stats      상품 통계 (크리에이터 전용)
POST /api/settlements/request      정산 신청
```

---

## 8. 핵심 컴포넌트 스펙

### 8-1. 판매 페이지 URL 구조
```
pageone.kr/@laha/notion-template-2025
           ↑     ↑
           username  slug
```

### 8-2. SalesPage 컴포넌트 필수 요소
```tsx
// 모바일 퍼스트, 카톡 공유 최적화
// OG 태그: title, description, image(썸네일)
// 구조:
// 1. 썸네일 이미지
// 2. 상품명 + 판매자명
// 3. 가격 + 구매하기 버튼 (sticky)
// 4. 상품 설명 (리치텍스트)
// 5. 판매자 소개
// 6. 구매 후기 (v2)
```

### 8-3. ProductForm 필수 필드
```typescript
interface ProductFormData {
  title: string;           // 필수, max 100자
  description: string;     // HTML, max 50000자
  price: number;           // 0 이상 정수 (원)
  payWhatYouWant: boolean;
  minPrice?: number;
  fileType: 'file' | 'external_url';
  file?: File;             // 파일 업로드 (max 1GB free)
  externalUrl?: string;    // 노션/구글드라이브 링크
  thumbnail?: File;        // 썸네일 (권장 1200x630)
  slug: string;            // 자동생성 + 수동 수정 가능
  isPublished: boolean;
}
```

---

## 9. Supabase Storage 설정

```
버킷 구조:
  products/           → 상품 파일 (비공개, Signed URL만 접근)
    {user_id}/
      {product_id}/
        {filename}
  
  thumbnails/         → 썸네일 (공개)
    {user_id}/
      {product_id}/
        thumbnail.webp

  avatars/            → 프로필 이미지 (공개)
    {user_id}/
      avatar.webp
```

```sql
-- Storage 버킷 정책
-- products 버킷: 소유자만 업로드, 다운로드는 API Route 경유
-- thumbnails 버킷: 소유자만 업로드, 누구나 읽기
-- avatars 버킷: 소유자만 업로드, 누구나 읽기
```

---

## 10. 이메일 템플릿 (Resend)

### 10-1. 구매 완료 이메일
```
제목: [PageOne] {상품명} 구매가 완료되었습니다 🎉
수신: 구매자 이메일

내용:
- 구매한 상품명
- 다운로드 버튼 (큰 버튼, 눈에 띄게)
- 링크 유효기간: {N}시간 / {N}회 다운로드 제한
- 문의: {판매자 이메일}
```

### 10-2. 판매 알림 이메일 (크리에이터 수신)
```
제목: [PageOne] {상품명}이 판매되었습니다 💰
수신: 크리에이터 이메일

내용:
- 상품명 + 판매 금액
- 정산 예정액 (수수료 차감 후)
- 구매자 이메일
- 대시보드 바로가기 버튼
```

---

## 11. 스프린트 계획

### Sprint 1 (Week 1~2): 코어 인프라
**목표:** 프로젝트 셋업 + Auth + 파일 업로드

완료 기준:
- [ ] Next.js 14 + Supabase 프로젝트 초기화
- [ ] Supabase DB 마이그레이션 전체 실행
- [ ] 이메일/카카오 로그인 구현
- [ ] 크리에이터 프로필 설정 페이지
- [ ] Supabase Storage 파일 업로드 (products 버킷)
- [ ] 상품 등록 폼 (저장까지)

### Sprint 2 (Week 3): 판매 페이지
**목표:** 상품 등록 → 판매 페이지 퍼블릭 공개

완료 기준:
- [ ] 판매 페이지 동적 라우팅 (`@[username]/[slug]`)
- [ ] OG 태그 자동 생성
- [ ] 모바일 최적화 UI
- [ ] 상품 목록/수정/삭제

### Sprint 3 (Week 4): 결제 + 파일 전달
**목표:** 실제 돈이 오가는 플로우 완성

완료 기준:
- [ ] 토스페이먼츠 SDK 연동 (테스트 모드)
- [ ] `/api/payments/confirm` 구현
- [ ] 다운로드 토큰 생성 + Signed URL
- [ ] Resend 이메일 발송 (구매 완료)
- [ ] 판매 알림 이메일 (크리에이터)

### Sprint 4 (Week 5): 대시보드 + 정산
**목표:** 크리에이터 수익 관리 완성

완료 기준:
- [ ] 대시보드 (총 매출, 판매 건수, 상품별 통계)
- [ ] 구매자 이메일 리스트 CSV 다운로드
- [ ] 정산 신청 폼 (계좌 등록 → 신청)
- [ ] 토스페이먼츠 실제 모드 전환
- [ ] 베타 오픈 준비

---

## 12. 코드 컨벤션

### 파일/폴더 네이밍
```
컴포넌트: PascalCase.tsx          (ProductForm.tsx)
훅:       camelCase.ts            (useProducts.ts)
유틸:     camelCase.ts            (formatPrice.ts)
타입:     camelCase.ts            (database.ts)
API:      route.ts                (app/api/payments/confirm/route.ts)
```

### TypeScript 규칙
```typescript
// 1. 모든 함수에 반환 타입 명시
async function confirmPayment(paymentKey: string): Promise<Order> {}

// 2. any 사용 금지 → unknown 사용
const data: unknown = await response.json();

// 3. Supabase 쿼리는 항상 에러 핸들링
const { data, error } = await supabase.from('products').select('*');
if (error) throw new Error(error.message);

// 4. 서버 컴포넌트에서 Supabase 클라이언트
import { createServerClient } from '@/lib/supabase/server';

// 5. 클라이언트 컴포넌트에서 Supabase 클라이언트
'use client';
import { createBrowserClient } from '@/lib/supabase/client';
```

### 가격 표시
```typescript
// 항상 이 함수를 통해 표시
export function formatPrice(price: number): string {
  if (price === 0) return '무료';
  return `${price.toLocaleString('ko-KR')}원`;
}
```

---

## 13. 보안 체크리스트

- [ ] 결제 금액 서버사이드 재검증 (클라이언트 전송값 신뢰 금지)
- [ ] 파일 다운로드는 반드시 API Route 경유 (Storage 직접 공개 금지)
- [ ] SUPABASE_SERVICE_ROLE_KEY는 서버사이드에서만 사용
- [ ] download_token은 UUID가 아닌 crypto.randomBytes(32) 사용
- [ ] 결제 웹훅 서명 검증 (토스페이먼츠 webhook secret)
- [ ] RLS 정책 모든 테이블에 적용
- [ ] 환경변수 절대 클라이언트에 노출 금지 (NEXT_PUBLIC_ 주의)

---

## 14. Gemini CLI 작업 프롬프트 모음

> **사용법:** 아래 프롬프트를 복사해서 그대로 Gemini CLI에 전달한다.
> 각 프롬프트 앞에 `@GEMINI.md` 를 붙여 컨텍스트를 주입한다.

---

### [PROMPT-01] 프로젝트 초기화

```
@GEMINI.md

## 작업: Next.js + Supabase 프로젝트 초기 셋업

GEMINI.md의 기술 스택과 디렉토리 구조를 기반으로 다음을 실행해라.

1. pnpm으로 Next.js 14 프로젝트 생성 (TypeScript, Tailwind, App Router)
2. 필요한 패키지 설치:
   - @supabase/supabase-js @supabase/ssr
   - @toss/slash-react (토스페이먼츠)
   - resend
   - @radix-ui/react-* (shadcn/ui 기반)
   - nanoid
   - zustand
3. .env.example 파일 생성 (GEMINI.md 섹션 6 참고)
4. lib/supabase/client.ts, server.ts, admin.ts 생성
5. GEMINI.md의 디렉토리 구조대로 폴더/파일 스캐폴딩
6. tailwind.config.ts + shadcn/ui 초기화

각 파일의 전체 코드를 출력해라. 설명은 최소화하고 코드 위주로.
```

---

### [PROMPT-02] DB 마이그레이션 생성

```
@GEMINI.md

## 작업: Supabase DB 마이그레이션 파일 생성

GEMINI.md 섹션 4의 스키마를 기반으로 supabase/migrations/ 폴더에
순서대로 실행 가능한 마이그레이션 SQL 파일을 생성해라.

파일명 규칙: 20240001_[description].sql

생성할 파일:
1. 20240001_create_profiles.sql
2. 20240002_create_products.sql
3. 20240003_create_orders.sql
4. 20240004_create_settlements.sql
5. 20240005_create_views_and_functions.sql
   - pending_settlement_amounts 뷰
   - updated_at 자동 업데이트 트리거 (profiles, products)
   - sales_count 증가 함수

각 파일은 실제 Supabase SQL 에디터에서 바로 실행 가능해야 한다.
RLS 정책 포함. 전체 SQL 코드를 출력해라.
```

---

### [PROMPT-03] Auth 구현

```
@GEMINI.md

## 작업: Supabase Auth 구현 (이메일 + 카카오)

다음 파일들을 생성해라:

1. app/(auth)/login/page.tsx
   - 이메일/비밀번호 로그인
   - 카카오 소셜 로그인 버튼
   - shadcn/ui Card + Form 사용

2. app/(auth)/register/page.tsx
   - 이메일/비밀번호 회원가입
   - username(닉네임) 입력 + 중복 체크 (실시간)
   - 가입 완료 시 profiles 테이블 자동 INSERT

3. app/api/auth/callback/route.ts
   - Supabase OAuth 콜백 처리

4. middleware.ts
   - 인증 필요 경로: /dashboard/*, /products/* 보호
   - 비인증 시 /login 리다이렉트

조건:
- GEMINI.md 코드 컨벤션 준수
- 에러 메시지 한국어
- 로딩 상태 처리 포함
- 전체 코드 출력 (주석 최소화)
```

---

### [PROMPT-04] 상품 등록 폼

```
@GEMINI.md

## 작업: 상품 등록 폼 구현

app/(dashboard)/products/new/page.tsx 와
components/product/ProductForm.tsx 를 생성해라.

GEMINI.md 섹션 8-3의 ProductFormData 인터페이스 기반으로:

필수 기능:
1. 상품명 입력 (100자 제한, 실시간 카운터)
2. 가격 설정
   - 유료(원화 직접 입력) / 무료 / PWYW(Pay What You Want) 토글
3. 파일 업로드
   - 드래그앤드롭 지원
   - 파일 타입: file(업로드) / external_url(링크 입력) 선택
   - Supabase Storage products 버킷에 업로드
   - 업로드 진행률 표시
4. 썸네일 업로드 (선택, 1200x630 가이드 표시)
5. 상품 설명 (기본 텍스트 에디터 — v1에서는 textarea로 구현)
6. slug 자동생성 (상품명 → 한글 로마자 변환) + 수동 수정
7. 공개/비공개 토글
8. 저장 버튼 → products 테이블 INSERT

UI:
- shadcn/ui 컴포넌트 사용
- 모바일 반응형
- 저장 중 로딩 표시
- 성공 시 /dashboard/products 리다이렉트

전체 코드 출력.
```

---

### [PROMPT-05] 판매 페이지 생성

```
@GEMINI.md

## 작업: 공개 판매 페이지 구현

app/@[username]/[slug]/page.tsx 를 생성해라.
(Next.js App Router 동적 라우팅)

필수 요소:
1. generateMetadata 함수로 OG 태그 생성
   - og:title: {상품명} | PageOne
   - og:description: 상품 설명 첫 100자
   - og:image: 썸네일 URL
   - 카카오톡 공유 시 미리보기 최적화

2. 페이지 UI (모바일 퍼스트 — 375px 기준 설계)
   - 썸네일 이미지 (없으면 기본 이미지)
   - 판매자 프로필 (아바타 + 닉네임)
   - 상품명 (큰 폰트)
   - 가격 표시 (formatPrice 함수 사용)
   - 상품 설명
   - 하단 고정 "구매하기" 버튼 (sticky bottom)

3. PaymentButton 컴포넌트 연결
   - 클릭 시 구매자 정보 입력 모달 열기

4. 존재하지 않는 상품/비공개 상품 → notFound()

데이터 패칭: Supabase 서버 컴포넌트에서 직접 쿼리
전체 코드 출력.
```

---

### [PROMPT-06] 토스페이먼츠 결제 연동

```
@GEMINI.md

## 작업: 토스페이먼츠 결제 전체 플로우 구현

다음 파일들을 생성해라:

1. components/payment/PaymentModal.tsx
   - 구매자 이름/이메일 입력 폼
   - 입력 완료 → 토스페이먼츠 SDK 호출
   - SDK 초기화: loadTossPayments(NEXT_PUBLIC_TOSS_CLIENT_KEY)
   - 결제 요청 파라미터:
     - amount: 상품 가격
     - orderId: `po_${nanoid(12)}`
     - orderName: 상품명 (max 100자)
     - customerEmail: 구매자 이메일
     - successUrl: `${APP_URL}/api/payments/confirm`
     - failUrl: `${APP_URL}/payment/fail`

2. app/api/payments/confirm/route.ts
   - GET 파라미터: paymentKey, amount, orderId
   - 토스페이먼츠 서버사이드 검증 API 호출
     (POST https://api.tosspayments.com/v1/payments/confirm)
   - 검증 성공 시:
     a. orders 테이블 INSERT (GEMINI.md 스키마 참고)
     b. 수수료 계산 (calculateFee 함수 사용)
     c. Resend로 구매 완료 이메일 발송
     d. products.sales_count +1
   - /payment/success?orderId={orderId} 리다이렉트

3. app/payment/success/page.tsx
   - 구매 완료 화면
   - "이메일로 다운로드 링크를 보내드렸습니다" 메시지
   - 이메일 확인 유도

4. app/api/downloads/[token]/route.ts
   - GET: token으로 orders 조회
   - 만료 체크: paid_at + download_expire_hours < NOW()
   - 횟수 체크: download_count >= download_limit
   - 유효 시 Supabase Storage createSignedUrl (60초)
   - 307 리다이렉트 → 파일 다운로드
   - download_count +1 업데이트

보안 주의사항 (GEMINI.md 섹션 13 참고):
- 결제 금액 반드시 서버사이드 재검증
- download_token은 crypto.randomBytes(32) 사용

전체 코드 출력.
```

---

### [PROMPT-07] 이메일 템플릿

```
@GEMINI.md

## 작업: Resend 이메일 템플릿 구현

lib/resend/emails.ts 파일을 생성해라.

구현할 함수:

1. sendPurchaseConfirmation(params)
   params: { buyerEmail, buyerName, productTitle, downloadUrl, expireHours, downloadLimit, sellerName }
   - 제목: "[PageOne] {productTitle} 구매가 완료되었습니다 🎉"
   - HTML 템플릿 (인라인 스타일 — Resend 권장)
   - 큰 다운로드 버튼 (배경색: #000, 텍스트: 흰색)
   - 유효기간 + 다운로드 횟수 제한 안내
   - 모바일 최적화 (max-width: 600px)

2. sendSaleNotification(params)
   params: { sellerEmail, productTitle, amount, netAmount, feeRate, buyerEmail }
   - 제목: "[PageOne] {productTitle}이 판매되었습니다 💰"
   - 매출 금액 / 수수료 / 정산 예정액 표시
   - 대시보드 바로가기 버튼

3. sendDownloadExpiredNotice(params) -- 선택 구현
   - 다운로드 링크 만료 시 재발급 요청 안내

React Email 대신 순수 HTML 문자열로 구현 (의존성 최소화)
전체 코드 출력.
```

---

### [PROMPT-08] 크리에이터 대시보드

```
@GEMINI.md

## 작업: 크리에이터 대시보드 구현

app/(dashboard)/dashboard/page.tsx 와 관련 컴포넌트를 생성해라.

섹션 구성:

1. StatsCard 컴포넌트 (4개)
   - 총 매출 (원)
   - 이번 달 매출
   - 총 판매 건수
   - 미정산 금액 (pending_settlement_amounts 뷰 사용)

2. 상품별 판매 현황 테이블
   - 상품명 / 가격 / 판매 건수 / 매출 / 판매 페이지 링크

3. 최근 주문 목록 (최근 10건)
   - 상품명 / 구매자 이메일 / 금액 / 결제 시간
   - 구매자 이메일 리스트 CSV 다운로드 버튼 (pro 플랜 이상)

4. 정산 신청 섹션
   - 미정산 금액 표시
   - 계좌 미등록 시 → 설정 페이지 유도
   - 정산 신청 버튼 (최소 금액: 10,000원)

데이터 패칭: 서버 컴포넌트 + Supabase 서버 클라이언트
UI: shadcn/ui Table, Card, Badge 사용
전체 코드 출력.
```

---

### [PROMPT-09] 랜딩 페이지

```
@GEMINI.md

## 작업: PageOne 랜딩 페이지 구현

app/page.tsx 를 생성해라. (마케팅 랜딩 페이지)

섹션 구성:

1. Hero 섹션
   - 헤드라인: "크몽 수수료 갖다 바치지 말고,\n내 페이지에서 팔아라"
   - 서브: "5분 만에 전자책, 템플릿, 강의를 판매 페이지로. 카카오페이 결제 즉시 연동."
   - CTA 버튼: "무료로 시작하기" → /register
   - 우측/하단: 판매 페이지 목업 이미지 (간단한 UI 스케치)

2. 경쟁 비교 섹션
   - Gumroad vs 크몽 vs PageOne 비교 테이블
   - 수수료 / 결제 방법 / 셋업 시간 / 정산 통화

3. 기능 소개 (3개 카드)
   - "5분 셋업" / "카카오페이·토스 결제" / "원화 즉시 정산"

4. 수수료 플랜 테이블 (GEMINI.md 섹션 5 참고)

5. CTA 섹션
   - "지금 바로 첫 상품을 올려보세요"
   - 버튼: "무료로 시작하기"

디자인 톤: 깔끔한 다크/라이트 미니멀 (흰 배경, 검정 텍스트, 포인트 컬러 #6366f1)
Tailwind + shadcn/ui 사용
전체 코드 출력.
```

---

### [PROMPT-10] 배포 설정

```
@GEMINI.md

## 작업: Vercel 배포 설정

다음 파일들을 생성/설정해라:

1. vercel.json
   - 한국 리전 최적화 (icn1 — 서울)
   - API Route 타임아웃 설정 (결제 확인: 30초)

2. next.config.ts
   - Supabase Storage 이미지 도메인 허용
   - 보안 헤더 설정 (X-Frame-Options, CSP 기본)

3. .github/workflows/deploy.yml (선택)
   - main 브랜치 push → Vercel 자동 배포

4. Supabase 프로덕션 체크리스트 (README에 추가)
   - [ ] Storage 버킷 생성 (products, thumbnails, avatars)
   - [ ] RLS 정책 확인
   - [ ] 토스페이먼츠 실제 모드 키 교체
   - [ ] 도메인 연결 (pageone.kr)
   - [ ] Resend 도메인 인증

전체 코드 출력.
```

---

## 15. 자주 쓰는 Supabase 쿼리 스니펫

```typescript
// 크리에이터의 상품 목록 조회
const { data: products } = await supabase
  .from('products')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false });

// 판매 페이지용 상품 조회 (공개)
const { data: product } = await supabase
  .from('products')
  .select(`
    *,
    profiles!user_id (
      username,
      display_name,
      avatar_url,
      bio
    )
  `)
  .eq('slug', slug)
  .eq('is_published', true)
  .single();

// 크리에이터 매출 통계
const { data: stats } = await supabase
  .from('orders')
  .select('amount, net_amount, created_at')
  .eq('seller_id', userId)
  .eq('status', 'paid');

// 이번 달 매출
const startOfMonth = new Date();
startOfMonth.setDate(1);
startOfMonth.setHours(0, 0, 0, 0);

const { data: monthlyOrders } = await supabase
  .from('orders')
  .select('net_amount')
  .eq('seller_id', userId)
  .eq('status', 'paid')
  .gte('paid_at', startOfMonth.toISOString());
```

---

## 16. 트러블슈팅 가이드

### 토스페이먼츠 연동 이슈
```
문제: CORS 오류
해결: 결제 요청은 반드시 클라이언트, 검증은 서버사이드

문제: 결제 금액 불일치
해결: successUrl 호출 시 DB에 저장된 상품 가격과 재검증

문제: 카카오페이 미표시
해결: 토스페이먼츠 대시보드 → 카카오페이 활성화 확인
```

### Supabase RLS 이슈
```
문제: 데이터 조회 안 됨 (빈 배열)
해결: RLS 정책 확인, auth.uid() 일치 여부 체크

문제: 서버사이드에서 데이터 없음
해결: createServerClient 사용 확인 (not createBrowserClient)

문제: Storage 업로드 실패
해결: 버킷 정책 확인, 파일 크기 제한 확인
```

### Next.js App Router 이슈
```
문제: @[username] 라우팅 충돌
해결: 예약 경로 우선순위 설정, middleware에서 처리

문제: 서버/클라이언트 컴포넌트 혼용 오류
해결: 'use client' 경계 명확히 설정
```

---

## 17. 향후 로드맵 (v2 이후)

**v1.5 (베타 이후 첫 업데이트)**
- 쿠폰/할인 코드 기능
- 구매자 리뷰/후기
- 상품 번들 판매

**v2.0**
- 구독형 멤버십 상품
- 강의 플레이어 (영상 스트리밍)
- 제휴 마케팅 (Affiliate)

**v2.5**
- 커스텀 도메인 연결 (BIZ 플랜)
- 다국어 지원 (영어)
- 글로벌 결제 (스트라이프 추가)

---

*이 파일은 PageOne 프로젝트의 단일 진실 공급원(Single Source of Truth)이다.*
*코드 생성 전 반드시 이 파일을 참조하고, 변경사항은 이 파일에 반영한다.*
