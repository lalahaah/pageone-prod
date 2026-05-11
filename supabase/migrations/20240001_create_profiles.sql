-- profiles (크리에이터)
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
