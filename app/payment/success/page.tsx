import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        <div className="mb-4 flex justify-center">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">결제가 완료되었습니다!</h1>
        <p className="mb-8 text-gray-600 leading-relaxed">
          구매해주셔서 감사합니다.<br />
          입력하신 이메일로 상품 다운로드 링크를 보내드렸습니다.<br />
          이메일이 오지 않았다면 스팸 메일함을 확인해주세요.
        </p>
        <div className="space-y-3">
          <Button asChild className="w-full h-12 text-base font-bold">
            <Link href="/">홈으로 돌아가기</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
