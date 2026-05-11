import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const FEE_RATES = {
  free: 0.05, // 5%
  pro: 0.03,  // 3%
  biz: 0.00,  // 0%
} as const;

export function calculateFee(amount: number, plan: 'free' | 'pro' | 'biz') {
  const feeRate = FEE_RATES[plan];
  const fee = Math.round(amount * feeRate);
  return {
    amount,
    fee,
    feeRate: feeRate * 100,
    netAmount: amount - fee,
  };
}

export function formatPrice(price: number): string {
  if (price === 0) return '무료';
  return `${price.toLocaleString('ko-KR')}원`;
}
