'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PaymentModal } from './PaymentModal';

interface PaymentButtonProps {
  product: {
    id: string;
    title: string;
    price: number;
  };
}

export function PaymentButton({ product }: PaymentButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        size="lg"
        className="flex-1 h-14 text-lg font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-transform"
        onClick={() => setIsModalOpen(true)}
      >
        {product.price === 0 ? '무료로 받기' : '구매하기'}
      </Button>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
      />
    </>
  );
}
