'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

export default function PaymentFailPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        <div className="mb-4 flex justify-center">
          <XCircle className="h-16 w-16 text-red-500" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">결제에 실패했습니다</h1>
        <p className="mb-8 text-gray-600 leading-relaxed">
          {message || '결제 처리 중 오류가 발생했습니다.'}
          <br /> 다시 시도해 주세요.
        </p>
        <div className="space-y-3">
          <Button asChild variant="outline" className="w-full h-12 text-base font-bold">
            <Link href="/">메인으로 가기</Link>
          </Button>
          <Button onClick={() => window.history.back()} className="w-full h-12 text-base font-bold">
            이전 페이지로 돌아가기
          </Button>
        </div>
      </div>
    </div>
  );
}
