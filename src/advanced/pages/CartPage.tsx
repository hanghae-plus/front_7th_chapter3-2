import { Coupon } from "../types/types";
import { ProductList } from "../components/CartPage/products/ProductList";
import { Cart } from "../components/CartPage/carts/Cart";

interface CartPageProps {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  setSelectedCoupon: React.Dispatch<React.SetStateAction<Coupon | null>>;
}

const CartPage = ({
  coupons,
  selectedCoupon,
  setSelectedCoupon,
}: CartPageProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <ProductList />
      <Cart
        coupons={coupons}
        selectedCoupon={selectedCoupon}
        setSelectedCoupon={setSelectedCoupon}
      />
    </div>
  );
};

export default CartPage;
