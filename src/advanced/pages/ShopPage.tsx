import { ProductListWidget } from '../widgets/product/ui/ProductListWidget';
import { CartListWidget } from '../widgets/cart/ui/CartListWidget';

interface ShopPageProps {
  searchTerm: string;
}

export const ShopPage = ({ searchTerm }: ShopPageProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <ProductListWidget searchTerm={searchTerm} />
      </div>
      <div className="lg:col-span-1">
        <CartListWidget />
      </div>
    </div>
  );
};
