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

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 설정
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- sales_count 증가 함수 (결제 완료 시 호출용)
CREATE OR REPLACE FUNCTION increment_sales_count(product_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE products
  SET sales_count = sales_count + 1
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql;
