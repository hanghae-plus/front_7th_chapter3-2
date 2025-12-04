import { useState, useMemo, useCallback } from "react";
import { ProductWithUI } from "../store/useProductStore";
import { CartList, ProductList, CheckoutSection } from "../features";
import { useProductStore } from "../store/useProductStore";
import { useCouponStore } from "../store/useCouponStore";
import { useNotificationStore } from "../store/useNotificationStore";
import { useCartStore } from "../store/useCartStore";
import { useDebounce } from "../hooks/useDebounce";

export const MainPage = () => {
  // Store에서 상태 가져오기
  const { products } = useProductStore();
  const { coupons } = useCouponStore();
  const { addNotification } = useNotificationStore();
  const {
    cart,
    selectedCoupon,
    getTotals,
    addToCart: addToCartAction,
    removeFromCart,
    updateQuantity: updateQuantityAction,
    applyCoupon: applyCouponAction,
    removeCoupon,
    completeOrder: completeOrderAction,
    getRemainingStock,
  } = useCartStore();

  // totals 계산
  const totals = getTotals();

  // 로컬 상태: 검색어
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // 필터링된 상품 목록 계산
  const filteredProducts = useMemo(
    () =>
      debouncedSearchTerm
        ? products.filter(
            (product) =>
              product.name
                .toLowerCase()
                .includes(debouncedSearchTerm.toLowerCase()) ||
              (product.description &&
                product.description
                  .toLowerCase()
                  .includes(debouncedSearchTerm.toLowerCase()))
          )
        : products,
    [products, debouncedSearchTerm]
  );

  // Notification 래퍼 함수들
  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const result = addToCartAction(product);
      addNotification(result.message, result.success ? "success" : "error");
    },
    [addToCartAction, addNotification]
  );

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      const result = updateQuantityAction(productId, newQuantity);
      if (result) {
        addNotification(result.message, result.success ? "success" : "error");
      }
    },
    [updateQuantityAction, addNotification]
  );

  const applyCoupon = useCallback(
    (coupon: typeof coupons[0]) => {
      const result = applyCouponAction(coupon);
      addNotification(result.message, result.success ? "success" : "error");
    },
    [applyCouponAction, addNotification, coupons]
  );

  const completeOrder = useCallback(() => {
    const result = completeOrderAction();
    addNotification(result.message, result.success ? "success" : "error");
  }, [completeOrderAction, addNotification]);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <ProductList
          filteredProducts={filteredProducts}
          debouncedSearchTerm={debouncedSearchTerm}
          getRemainingStock={getRemainingStock}
          addToCart={addToCart}
        />
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <CartList
            cart={cart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
          />

          {cart.length > 0 && (
            <CheckoutSection
              coupons={coupons}
              selectedCoupon={selectedCoupon}
              applyCoupon={applyCoupon}
              removeCoupon={removeCoupon}
              totals={totals}
              completeOrder={completeOrder}
            />
          )}
        </div>
      </div>
    </div>
  );
};
