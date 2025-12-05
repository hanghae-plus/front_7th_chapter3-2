import { SelectHTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/styles';

const variants = {
  // [간단한 선택] 쿠폰 적용 등: 기본 테두리, 파란 포커스
  simple:
    'text-sm border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500',

  // [폼 입력] 관리자 페이지 등: 그림자(shadow-sm), 인디고 포커스 링
  form: 'border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm',
};

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  // variant를 optional(?)로 바꾸고 기본값을 주면 사용하기 더 편합니다.
  variant?: keyof typeof variants;
  children: ReactNode;
}

export const Select = ({
  variant = 'simple', // 기본값 설정 (안 넣으면 simple 적용)
  children,
  className,
  ...props
}: SelectProps) => {
  return (
    <select
      className={cn(
        // 1. 공통 기본 스타일 (w-full, border는 기본이지만 덮어쓰기 가능)
        'w-full border',

        // 2. 변형 스타일
        variants[variant],

        // 3. 커스텀 스타일 (최종 오버라이딩)
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
};
