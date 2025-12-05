import { ShoppingBagIcon } from '../../../shared/ui/Icons';

export const CartHeader = () => (
  <h2 className="text-lg font-semibold mb-4 flex items-center">
    <ShoppingBagIcon size={20} className="mr-2" />
    장바구니
  </h2>
);
