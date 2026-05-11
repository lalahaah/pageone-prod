import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  const { token } = params;

  try {
    // 1. 토큰으로 주문 및 상품 정보 조회
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        products (
          file_path,
          download_limit,
          download_expire_hours
        )
      `)
      .eq('download_token', token)
      .single();

    if (orderError || !order) {
      return new NextResponse('유효하지 않은 다운로드 링크입니다.', { status: 404 });
    }

    const product = order.products;

    // 2. 만료 시간 체크
    const paidAt = new Date(order.paid_at || order.created_at);
    const expireHours = product.download_expire_hours || 48;
    const isExpired = new Date().getTime() > paidAt.getTime() + expireHours * 60 * 60 * 1000;

    if (isExpired) {
      return new NextResponse('다운로드 링크가 만료되었습니다. (최대 48시간)', { status: 403 });
    }

    // 3. 다운로드 횟수 체크
    if (order.download_count >= (product.download_limit || 5)) {
      return new NextResponse('다운로드 허용 횟수를 초과했습니다.', { status: 403 });
    }

    // 4. Supabase Storage Signed URL 생성 (60초 유효)
    if (!product.file_path) {
      return new NextResponse('파일 정보를 찾을 수 없습니다.', { status: 404 });
    }

    const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin.storage
      .from('products')
      .createSignedUrl(product.file_path, 60);

    if (signedUrlError || !signedUrlData) {
      throw signedUrlError || new Error('Signed URL 생성 실패');
    }

    // 5. 다운로드 횟수 업데이트
    await supabaseAdmin
      .from('orders')
      .update({ download_count: order.download_count + 1 })
      .eq('id', order.id);

    // 6. Signed URL로 리다이렉트 (307)
    return NextResponse.redirect(signedUrlData.signedUrl, 307);
  } catch (error) {
    console.error('Download error:', error);
    return new NextResponse('다운로드 처리 중 오류가 발생했습니다.', { status: 500 });
  }
}
