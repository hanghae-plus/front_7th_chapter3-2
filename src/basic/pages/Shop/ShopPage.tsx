import { CartItem, Coupon, ProductWithUI } from "../../../types";
import { ProductList } from "./components/ProductList";
import { formatUserPrice } from "../../utils/formatters";
import { CartSection } from "./components/CartSection";

interface ShopPageProps {
  products: ProductWithUI[];
  filteredProducts: ProductWithUI[];
  debouncedSearchTerm: string;
  cart: {
    value: CartItem[];
    add: (product: ProductWithUI) => void;
    remove: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    apply: (coupon: Coupon) => void;
    clearSelectedCoupon: () => void;
    selectedCoupon: Coupon | null;
  };
  coupons: {
    value: Coupon[];
  };
  totals: {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
  completeOrder: () => void;
}

export function ShopPage({
  products,
  filteredProducts,
  debouncedSearchTerm,
  cart,
  coupons,
  totals,
  completeOrder,
}: ShopPageProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <ProductList
          productsLength={products.length}
          filteredProducts={filteredProducts}
          debouncedSearchTerm={debouncedSearchTerm}
          cart={cart.value}
          addToCart={cart.add}
          formatPrice={formatUserPrice}
        />
      </div>

      <div className="lg:col-span-1">
        <CartSection
          cart={cart}
          coupons={coupons}
          totals={totals}
          completeOrder={completeOrder}
        />
      </div>
    </div>
  );
}
