import { ProductList } from "../widgets/product/ui/ProductList";
import { CartItem, Coupon, Product, ProductWithUI } from "../types";
import { PaymentBanner } from "../widgets/payment/ui/PaymentBanner";

export function CartPage({
  products,
  filteredProducts,
  debouncedSearchTerm,
  getRemainingStock,
  formatPrice,
  addToCart,
  cart,
  coupons,
  selectedCoupon,
  setSelectedCoupon,
  applyCoupon,
  completeOrder,
  removeFromCart,
  updateQuantity,
}: {
  products: ProductWithUI[];
  filteredProducts: ProductWithUI[];
  debouncedSearchTerm: string;
  getRemainingStock: (product: ProductWithUI) => number;
  formatPrice: (price: number, productId?: string) => string;
  addToCart: (product: ProductWithUI) => void;
  cart: CartItem[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  applyCoupon: (coupon: Coupon) => void;
  completeOrder: () => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (product: Product, newQuantity: number) => void;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        {/* 상품 목록 */}
        <ProductList
          products={products}
          filteredProducts={filteredProducts}
          debouncedSearchTerm={debouncedSearchTerm}
          formatPrice={formatPrice}
          getRemainingStock={getRemainingStock}
          addToCart={addToCart}
        />
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <PaymentBanner
            cart={cart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            applyCoupon={applyCoupon}
            completeOrder={completeOrder}
          />
        </div>
      </div>
    </div>
  );
}
