import { ShoppingCartIcon } from '../../../shared/ui/icons';

export function CartEmptyFallback() {
  return (
    <div className="text-center py-8">
      <ShoppingCartIcon
        size="2xl"
        strokeWidth={1}
        className="text-gray-300 mx-auto mb-4"
      />
      <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
    </div>
  );
}
