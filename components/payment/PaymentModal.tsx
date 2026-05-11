'use client';

import { useState } from 'react';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import { nanoid } from 'nanoid';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    title: string;
    price: number;
  };
}

export function PaymentModal({ isOpen, onClose, product }: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState({
    name: '',
    email: '',
  });

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerInfo.name || !buyerInfo.email) {
      alert('이름과 이메일을 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;
      const tossPayments = await loadTossPayments(clientKey);

      await tossPayments.requestPayment('CARD', {
        amount: product.price,
        orderId: `po_${nanoid(12)}`,
        orderName: product.title.slice(0, 100),
        customerEmail: buyerInfo.email,
        customerName: buyerInfo.name,
        successUrl: `${window.location.origin}/api/payments/confirm?productId=${product.id}`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (error) {
      console.error('Payment request failed:', error);
      alert('결제 요청 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>상품 구매하기</DialogTitle>
          <DialogDescription>
            구매 정보를 입력하시면 결제창으로 이동합니다.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handlePayment} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              이름
            </Label>
            <Input
              id="name"
              placeholder="홍길동"
              className="col-span-3"
              value={buyerInfo.name}
              onChange={(e) => setBuyerInfo({ ...buyerInfo, name: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              이메일
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              className="col-span-3"
              value={buyerInfo.email}
              onChange={(e) => setBuyerInfo({ ...buyerInfo, email: e.target.value })}
              required
            />
          </div>
          <div className="mt-2 text-center text-sm text-gray-500">
            결제 금액: <span className="font-bold text-gray-900">{product.price.toLocaleString()}원</span>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '처리 중...' : '결제하기'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
