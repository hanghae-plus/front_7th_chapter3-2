interface IconProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
}

// NOTE: 아이콘 네이밍을 용도 기반(close, delete, add 등)으로 할지 모양 기반(x, trash, plus 등)으로 할지 고민했습니다만,
// 재사용성과 유연성을 위해 모양 기반으로 결정했습니다.

export const XIcon = ({ size = 16, strokeWidth = 2, className }: IconProps) => (
  <svg width={size} height={size} className={className} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={strokeWidth} d='M6 18L18 6M6 6l12 12' />
  </svg>
);

export const CartIcon = ({ size = 24, strokeWidth = 2, className }: IconProps) => (
  <svg width={size} height={size} className={className} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={strokeWidth}
      d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
    />
  </svg>
);

export const TrashIcon = ({ size = 20, strokeWidth = 2, className }: IconProps) => (
  <svg width={size} height={size} className={className} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={strokeWidth}
      d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
    />
  </svg>
);

export const PlusIcon = ({ size = 32, strokeWidth = 2, className }: IconProps) => (
  <svg width={size} height={size} className={className} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={strokeWidth} d='M12 4v16m8-8H4' />
  </svg>
);

export const ImageIcon = ({ size = 96, strokeWidth = 1, className }: IconProps) => (
  <svg width={size} height={size} className={className} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={strokeWidth}
      d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
    />
  </svg>
);

export const ShoppingBagIcon = ({ size = 20, strokeWidth = 2, className }: IconProps) => (
  <svg width={size} height={size} className={className} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={strokeWidth} d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
  </svg>
);

// NOTE: 편의를 위해 네임스페이스를 지원하지만,
// 트리쉐이킹을 위해 개별 import 사용을 권장합니다.
const Icons = {
  X: XIcon,
  Cart: CartIcon,
  Trash: TrashIcon,
  Plus: PlusIcon,
  Image: ImageIcon,
  ShoppingBag: ShoppingBagIcon
} as const;

export default Icons;
