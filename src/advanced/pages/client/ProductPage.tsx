import CartView from './cart-view/CartView';
import ProductSection from './product-section/ProductSection';
import { type Coupon } from '../../entities/coupon';
import { Dispatch, SetStateAction } from 'react';
interface ProductPageProps {
  selectedCoupon: Coupon | null;
  debouncedSearchTerm: string;
  setSelectedCoupon: Dispatch<SetStateAction<Coupon | null>>;
}

export default function ProductPage({
  selectedCoupon,
  setSelectedCoupon,
  debouncedSearchTerm,
}: ProductPageProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <ProductSection debouncedSearchTerm={debouncedSearchTerm} />
      <CartView selectedCoupon={selectedCoupon} setSelectedCoupon={setSelectedCoupon} />
    </div>
  );
}
