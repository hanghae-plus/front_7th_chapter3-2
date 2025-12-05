import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useMemo } from "react";
import { useDebounce } from "../utils/hooks/useDebounce";
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
import { useToast } from "../utils/hooks/useToast";
import {
  cartAtom,
  productsAtom,
  searchTermAtom,
  couponsAtom,
  selectedCouponAtom,
  addToCartAtom,
  removeFromCartAtom,
  updateQuantityAtom,
  applyCouponAtom,
} from "../store";

export function CartPage({ onPurchase }: { onPurchase: () => void }) {
  const products = useAtomValue(productsAtom);
  const searchTerm = useAtomValue(searchTermAtom);
  // 초기 렌더링에서는 즉시 반환, 이후 변경사항만 debounce
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const cart = useAtomValue(cartAtom);
  const coupons = useAtomValue(couponsAtom);
  const selectedCoupon = useAtomValue(selectedCouponAtom);
  const setSelectedCoupon = useSetAtom(selectedCouponAtom);
  const addToCartAction = useSetAtom(addToCartAtom);
  const removeFromCartAction = useSetAtom(removeFromCartAtom);
  const updateQuantityAction = useSetAtom(updateQuantityAtom);
  const applyCouponAction = useSetAtom(applyCouponAtom);
  const { notify } = useToast();

  const handleAddToCart = useCallback(
    (product: (typeof products)[0]) => {
      const remainingStock = calculateRemainingStock(product, cart);
      if (remainingStock <= 0) {
        notify("재고가 부족합니다!", "error");
        return;
      }

      const existingItem = cart.find((item) => item.product.id === product.id);
      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;
        if (newQuantity > product.stock) {
          notify(`재고는 ${product.stock}개까지만 있습니다.`, "error");
          return;
        }
      }

      addToCartAction(product);
      notify("장바구니에 담았습니다", "success");
    },
    [cart, addToCartAction, notify]
  );

  const handleRemoveFromCart = useCallback(
    (productId: string) => {
      removeFromCartAction(productId);
    },
    [removeFromCartAction]
  );

  const handleUpdateQuantity = useCallback(
    (product: (typeof products)[0], newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCartAction(product.id);
        return;
      }

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        notify(`재고는 ${maxStock}개까지만 있습니다.`, "error");
        return;
      }

      updateQuantityAction(product, newQuantity);
    },
    [updateQuantityAction, removeFromCartAction, notify]
  );

  const handleApplyCoupon = useCallback(
    (coupon: (typeof coupons)[0]) => {
      const currentTotal = calculateCartTotal(
        cart,
        selectedCoupon
      ).totalAfterDiscount;

      if (currentTotal < 10000 && coupon.discountType === "percentage") {
        notify(
          "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
          "error"
        );
        return;
      }

      applyCouponAction(coupon);
      notify("쿠폰이 적용되었습니다.", "success");
    },
    [cart, selectedCoupon, applyCouponAction, notify]
  );
  // 컴포넌트 레벨에서 필터링 처리
  const filteredProducts = useMemo(() => {
    if (!debouncedSearchTerm) return products;

    return products.filter(
      (product) =>
        product.name
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()) ||
        (product.description &&
          product.description
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()))
    );
  }, [products, debouncedSearchTerm]);

  const formatPrice = (product: (typeof products)[0]) => {
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
          {debouncedSearchTerm && filteredProducts.length === 0 ? (
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
                  onAddToCart={handleAddToCart}
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
                    onRemove={handleRemoveFromCart}
                    onChangeQuantity={handleUpdateQuantity}
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
                applyCoupon={handleApplyCoupon}
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
