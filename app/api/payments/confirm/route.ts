import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { calculateFee } from '@/lib/utils';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const paymentKey = searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId');
  const amount = Number(searchParams.get('amount'));
  const productId = searchParams.get('productId');

  if (!paymentKey || !orderId || !amount || !productId) {
    return NextResponse.redirect(new URL('/payment/fail?message=missing_params', request.url));
  }

  try {
    // 1. 상품 정보 및 판매자 플랜 조회 (서버사이드 재검증)
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select('*, profiles!user_id(plan)')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      throw new Error('상품 정보를 찾을 수 없습니다.');
    }

    if (product.price !== amount) {
      throw new Error('결제 금액이 일치하지 않습니다.');
    }

    // 2. 토스페이먼츠 결제 승인 API 호출
    const secretKey = process.env.TOSS_SECRET_KEY;
    const basicAuth = Buffer.from(`${secretKey}:`).toString('base64');

    const confirmResponse = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    });

    const confirmData = await confirmResponse.json();

    if (!confirmResponse.ok) {
      throw new Error(confirmData.message || '결제 승인 실패');
    }

    // 3. 수수료 계산
    const sellerPlan = product.profiles.plan as 'free' | 'pro' | 'biz';
    const { fee, feeRate, netAmount } = calculateFee(amount, sellerPlan);

    // 4. 주문 정보 생성
    const downloadToken = crypto.randomBytes(32).toString('hex');

    const { error: orderError } = await supabaseAdmin.from('orders').insert({
      product_id: product.id,
      seller_id: product.user_id,
      buyer_email: confirmData.customerEmail || 'unknown',
      buyer_name: confirmData.customerName || '구매자',
      amount: amount,
      fee: fee,
      fee_rate: feeRate,
      net_amount: netAmount,
      status: 'paid',
      payment_key: paymentKey,
      payment_method: confirmData.method,
      download_token: downloadToken,
      receipt_url: confirmData.receipt?.url,
      paid_at: new Date().toISOString(),
    });

    if (orderError) throw orderError;

    // 5. 상품 판매 수 증가
    await supabaseAdmin.rpc('increment_sales_count', { product_id: product.id });

    // 6. 이메일 발송 (v1: TODO, v2: Resend 연동)
    // TODO: PROMPT-07에서 구현할 Resend 이메일 발송 로직 호출

    return NextResponse.redirect(new URL(`/payment/success?orderId=${orderId}`, request.url));
  } catch (error: any) {
    console.error('Payment confirmation error:', error);
    return NextResponse.redirect(
      new URL(`/payment/fail?message=${encodeURIComponent(error.message)}`, request.url)
    );
  }
}
