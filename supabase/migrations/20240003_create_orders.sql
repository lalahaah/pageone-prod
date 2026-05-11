-- orders (주문)
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
