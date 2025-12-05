import { ProductListWidget } from '../widgets/product/ui/ProductListWidget';
import { CartListWidget } from '../widgets/cart/ui/CartListWidget';
import { ToastMessage } from '../shared/hooks/useToast';

interface ShopPageProps {
  searchTerm: string;
  onShowToast?: (message: string, type: ToastMessage['type']) => void;
}

export const ShopPage = ({ searchTerm, onShowToast }: ShopPageProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <ProductListWidget searchTerm={searchTerm} onShowToast={onShowToast} />
      </div>
      <div className="lg:col-span-1">
        <CartListWidget onShowToast={onShowToast} />
      </div>
    </div>
  );
};
