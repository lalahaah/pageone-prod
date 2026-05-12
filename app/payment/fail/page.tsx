import { Suspense } from 'react';
import Link from 'next/link';

function FailContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <h1 className="text-2xl font-bold mb-4">결제에 실패했습니다</h1>
      <p className="text-gray-600 mb-8">결제 중 오류가 발생했습니다. 다시 시도해 주세요.</p>
      <Link href="/" className="bg-black text-white px-6 py-3 rounded-md font-medium">
        홈으로 돌아가기
      </Link>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <FailContent />
    </Suspense>
  );
}
