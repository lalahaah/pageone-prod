import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils';
import { PaymentButton } from '@/components/payment/PaymentButton';

interface Props {
  params: {
    username: string;
    slug: string;
  };
}

async function getProduct(username: string, slug: string) {
  const supabase = createClient();
  const cleanUsername = username.replace('%40', '').replace('@', '');

  const { data: product, error } = await supabase
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
    .eq('profiles.username', cleanUsername)
    .eq('is_published', true)
    .single();

  if (error || !product) return null;
  return product;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.username, params.slug);

  if (!product) {
    return {
      title: '상품을 찾을 수 없습니다 | PageOne',
    };
  }

  const description = product.description?.replace(/<[^>]*>?/gm, '').slice(0, 100) || '';

  return {
    title: `${product.title} | PageOne`,
    description,
    openGraph: {
      title: `${product.title} | PageOne`,
      description,
      images: product.thumbnail_url ? [product.thumbnail_url] : [],
      type: 'website',
    },
  };
}

export default async function SalesPage({ params }: Props) {
  const product = await getProduct(params.username, params.slug);

  if (!product) {
    notFound();
  }

  const seller = product.profiles;

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* 썸네일 영역 */}
      <div className="relative aspect-video w-full bg-gray-100 overflow-hidden">
        {product.thumbnail_url ? (
          <Image
            src={product.thumbnail_url}
            alt={product.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            이미지가 없습니다
          </div>
        )}
      </div>

      <div className="px-6 py-8 space-y-8 max-w-2xl mx-auto">
        {/* 상품 정보 헤더 */}
        <div className="space-y-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 leading-tight">
            {product.title}
          </h1>
          
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-200">
              {seller.avatar_url && (
                <Image
                  src={seller.avatar_url}
                  alt={seller.display_name || seller.username}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {seller.display_name || seller.username}
              </p>
              <p className="text-xs text-gray-500">@{seller.username}</p>
            </div>
          </div>
        </div>

        {/* 가격 정보 (모바일 대응) */}
        <div className="py-6 border-y border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-500 font-medium">판매 가격</span>
          <span className="text-2xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* 상품 설명 */}
        <div className="prose prose-sm max-w-none">
          <h3 className="text-lg font-bold text-gray-900 mb-4">상품 상세 설명</h3>
          <div className="whitespace-pre-wrap text-gray-600 leading-relaxed">
            {product.description}
          </div>
        </div>

        {/* 판매자 소개 */}
        {seller.bio && (
          <div className="bg-gray-50 rounded-2xl p-6 mt-12">
            <h4 className="text-sm font-bold text-gray-900 mb-2">판매자 소개</h4>
            <p className="text-sm text-gray-600 leading-relaxed">{seller.bio}</p>
          </div>
        )}
      </div>

      {/* 하단 고정 구매 버튼 */}
      <div className="fixed bottom-0 inset-x-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <div className="hidden sm:block flex-1">
            <p className="text-xs text-gray-500 font-medium">총 합계</p>
            <p className="text-xl font-bold text-gray-900">{formatPrice(product.price)}</p>
          </div>
          <PaymentButton product={{ id: product.id, title: product.title, price: product.price }} />
        </div>
      </div>
    </div>
  );
}
