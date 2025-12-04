/**
 * Shared Assets - Icons
 * 
 * SVG 아이콘 컴포넌트 모음
 * 
 * 위치: shared/assets/icons
 * - UI 컴포넌트 내부에서 사용되는 보조 컴포넌트
 * - 이미지, 폰트와 같은 정적 리소스로 분류
 * - 직접 페이지에 렌더링되지 않고 다른 컴포넌트 안에서만 사용
 */

interface IconProps {
  className?: string;
}

/**
 * 닫기 (X) 아이콘
 */
export const CloseIcon = ({ className = "w-4 h-4" }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

/**
 * 장바구니 아이콘
 */
export const CartIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

/**
 * 이미지 플레이스홀더 아이콘
 */
export const ImageIcon = ({ className = "w-24 h-24" }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

/**
 * 검색 아이콘
 */
export const SearchIcon = ({ className = "w-6 h-6" }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

/**
 * 플러스 아이콘
 */
export const PlusIcon = ({ className = "w-8 h-8" }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

/**
 * 휴지통 아이콘
 */
export const TrashIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

/**
 * 마이너스 아이콘
 */
export const MinusIcon = ({ className = "text-xs" }: IconProps) => (
  <span className={className}>−</span>
);

/**
 * 플러스 텍스트 아이콘
 */
export const PlusTextIcon = ({ className = "text-xs" }: IconProps) => (
  <span className={className}>+</span>
);
