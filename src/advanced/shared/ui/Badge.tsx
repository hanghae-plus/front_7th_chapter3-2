import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/styles';

const variants = {
  // 재고 상태: 색상은 외부에서 주입 (예: bg-red-100 text-red-800)
  stock:
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',

  // 할인율: 주황색 배경, 절대 위치
  discount:
    'absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded',

  // 인기 상품: 빨간색 배경, 절대 위치
  best: 'absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded',

  // 쿠폰: 흰색 배경, 보라색 글씨, 둥근 모양
  coupon:
    'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-indigo-700 shadow-sm border border-gray-200',
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant: keyof typeof variants;
  children: ReactNode;
}

export const Badge = ({
  variant,
  children,
  className,
  ...props
}: BadgeProps) => {
  return (
    <span
      className={cn(variants[variant], className)} // 👈 이렇게 감싸주면 끝!
      {...props}
    >
      {children}
    </span>
  );
};
