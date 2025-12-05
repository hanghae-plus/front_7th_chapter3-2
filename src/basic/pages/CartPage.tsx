import { CartItem, Coupon, Product, ProductWithUI } from "../types";
import { CouponSelector } from "../components/CouponSelector";
import { CartPayment } from "../components/CartPayment";
import { calculateCartTotal } from "../models/calculateCartTotal";
import { ProductCard } from "../components/ProductCard";
import { calculateRemainingStock } from "../models/calculateRemainingStock";
import { CartListItem } from "../components/CartListItem";
import { IconShopping } from "../components/icons";
import { calculateItemTotal } from "../models/calculateItemTotal";
import { isSoldOut } from "../models/isSoldOut";
import { formatPriceWon } from "../utils/formatPriceWon";

export function CartPage({
  products,
  filteredProducts,
  debouncedSearchTerm,
  addToCart,
  cart,
  coupons,
  selectedCoupon,
  setSelectedCoupon,
  applyCoupon,
  onPurchase,
  removeFromCart,
  updateQuantity,
}: {
  products: ProductWithUI[];
  filteredProducts: ProductWithUI[];
  debouncedSearchTerm: string;
  addToCart: (product: ProductWithUI) => void;
  cart: CartItem[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  applyCoupon: (coupon: Coupon) => void;
  onPurchase: () => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (product: Product, newQuantity: number) => void;
}) {
  const formatPrice = (product: ProductWithUI) => {
    return isSoldOut(product, cart)
      ? "SOLD OUT"
      : formatPriceWon(product.price);
  };

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
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  remainingStock={calculateRemainingStock(product, cart)}
                  onAddToCart={addToCart}
                  formattedPrice={formatPrice(product)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <IconShopping className="w-5 h-5 mr-2" />
              장바구니
            </h2>
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <IconShopping className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <CartListItem
                    key={item.product.id}
                    item={item}
                    itemTotal={calculateItemTotal(cart, item)}
                    onRemove={removeFromCart}
                    onChangeQuantity={updateQuantity}
                  />
                ))}
              </div>
            )}
          </section>

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
                onPurchase={onPurchase}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
