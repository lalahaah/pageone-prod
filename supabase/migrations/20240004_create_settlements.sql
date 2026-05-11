-- settlements (정산)
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
