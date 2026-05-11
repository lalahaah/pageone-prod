import { createClient } from '@/lib/supabase/server';
import { StatsCard } from '@/components/dashboard/StatsCard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { Banknote, CreditCard, ShoppingBag, Wallet } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // 1. 통계 데이터 패칭
  const [
    { data: profile },
    { data: orders },
    { data: pendingAmount },
    { data: products },
  ] = await Promise.all([
    supabase.from('profiles').select('total_revenue, username').eq('id', user.id).single(),
    supabase.from('orders').select('*').eq('seller_id', user.id).order('created_at', { ascending: false }),
    supabase.from('pending_settlement_amounts').select('unsettled_amount').eq('seller_id', user.id).single(),
    supabase.from('products').select('*').eq('user_id', user.id).order('sales_count', { ascending: false }),
  ]);

  // 이번 달 매출 계산
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const { data: monthlyOrders } = await supabase
    .from('orders')
    .select('amount')
    .eq('seller_id', user.id)
    .eq('status', 'paid')
    .gte('paid_at', firstDayOfMonth);

  const monthlyRevenue = monthlyOrders?.reduce((sum, order) => sum + order.amount, 0) || 0;
  const totalSalesCount = orders?.filter(o => o.status === 'paid').length || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">대시보드</h1>
        <p className="text-muted-foreground">판매 현황 및 통계를 한눈에 확인하세요.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="총 매출"
          value={formatPrice(profile?.total_revenue || 0)}
          icon={<Banknote className="h-4 w-4" />}
        />
        <StatsCard
          title="이번 달 매출"
          value={formatPrice(monthlyRevenue)}
          icon={<CreditCard className="h-4 w-4" />}
        />
        <StatsCard
          title="총 판매 건수"
          value={`${totalSalesCount}건`}
          icon={<ShoppingBag className="h-4 w-4" />}
        />
        <StatsCard
          title="미정산 금액"
          value={formatPrice(pendingAmount?.unsettled_amount || 0)}
          icon={<Wallet className="h-4 w-4" />}
          description="정산 신청 가능한 금액입니다."
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* 상품별 판매 현황 */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>상품별 판매 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>상품명</TableHead>
                  <TableHead className="text-right">가격</TableHead>
                  <TableHead className="text-right">판매 건수</TableHead>
                  <TableHead className="text-right">매출</TableHead>
                  <TableHead className="text-right">링크</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products?.slice(0, 5).map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.title}</TableCell>
                    <TableCell className="text-right">{formatPrice(product.price)}</TableCell>
                    <TableCell className="text-right">{product.sales_count}건</TableCell>
                    <TableCell className="text-right">
                      {formatPrice(product.price * product.sales_count)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/@${profile?.username}/${product.slug}`}
                        target="_blank"
                        className="text-xs text-blue-500 hover:underline"
                      >
                        보기
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
                {(!products || products.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      등록된 상품이 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 최근 주문 목록 */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>최근 주문 목록</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders?.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between space-x-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {products?.find(p => p.id === order.product_id)?.title || '상품 정보 없음'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{order.buyer_email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{formatPrice(order.amount)}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(order.paid_at || order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {(!orders || orders.length === 0) && (
                <p className="text-center py-8 text-sm text-muted-foreground">주문 내역이 없습니다.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
