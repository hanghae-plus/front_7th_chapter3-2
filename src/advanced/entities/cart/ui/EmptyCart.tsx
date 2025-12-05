import { ShoppingBagIcon } from '../../../shared/ui/Icons';

export const EmptyCart = () => (
  <div className="text-center py-8">
    <ShoppingBagIcon
      size={64}
      strokeWidth={1}
      className="text-gray-300 mx-auto mb-4"
    />
    <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
  </div>
);
