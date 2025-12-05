import { InputHTMLAttributes } from 'react';
import { cn } from '../lib/styles'; // 유틸 함수 import

const variants = {
  // 검색창: 둥근 모서리, 포커스 시 파란 테두리
  search:
    'px-4 py-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500',

  // 일반 텍스트: 약간 덜 둥근 모서리, 그림자 효과, 포커스 시 인디고 링
  text: 'border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2',

  // 숫자 입력: 심플하게
  number: 'px-2 py-1 rounded',
};

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: keyof typeof variants;
}

export const Input = ({
  variant = 'text',
  className,
  ...props
}: InputProps) => {
  return (
    <input
      className={cn(
        // 1. 공통 기본 스타일 (너비 꽉 참, 테두리 두께)
        'w-full border',

        // 2. 타입별 변형 스타일
        variants[variant],

        // 3. 외부 커스텀 스타일 (가장 마지막에 위치하여 오버라이딩 가능)
        className,
      )}
      {...props}
    />
  );
};
