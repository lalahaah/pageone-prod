-- products (상품)
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
