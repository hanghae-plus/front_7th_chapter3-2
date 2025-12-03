import { CartItem, Coupon, Product, ProductWithUI } from "../types";
import { CartList } from "../widgets/cart/ui/CartList";
import { CouponSelector } from "../widgets/coupon/ui/CouponSelector";
import { CartPayment } from "../widgets/cart/ui/CartPayment";
import { calculateCartTotal } from "../features/calculate-price/model/calculateCartTotal";
import { ProductCard } from "../entities/product/ui/ProductCard";

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
        <section>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
            <div className="text-sm text-gray-600">
              총 {products.length}개 상품
            </div>
          </div>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                "{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => {
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    formatPrice={formatPrice}
                    getRemainingStock={getRemainingStock}
                    addToCart={addToCart}
                  />
                );
              })}
            </div>
          )}
        </section>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <>
            <CartList
              cart={cart}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
            />

            {cart.length > 0 && (
              <>
                <CouponSelector
                  coupons={coupons}
                  selectedCoupon={selectedCoupon}
                  setSelectedCoupon={setSelectedCoupon}
                  applyCoupon={applyCoupon}
                />
                <CartPayment
                  totals={calculateCartTotal(cart, selectedCoupon)}
                  completeOrder={completeOrder}
                />
              </>
            )}
          </>
        </div>
      </div>
    </div>
  );
}
