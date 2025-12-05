import { useCallback, useMemo } from "react";
import { CartItem, Coupon, ProductWithUI } from "../../../types";
import { ProductList } from "./components/ProductList";
import { CartSection } from "./components/CartSection";
import { calculateCartTotal } from "../../models/cart";
import { filterProductsBySearchTerm } from "../../models/product";

interface ShopPageProps {
  products: ProductWithUI[];
  searchTerm: string;
  cart: {
    value: CartItem[];
    add: (product: ProductWithUI) => void;
    remove: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    apply: (coupon: Coupon) => void;
    clearSelectedCoupon: () => void;
    clearCart: () => void;
    selectedCoupon: Coupon | null;
  };
  coupons: {
    value: Coupon[];
  };
  addNotification: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
}

export function ShopPage({
  products,
  searchTerm,
  cart,
  coupons,
  addNotification,
}: ShopPageProps) {
  // 파생 상태: 필터링된 상품 목록
  const filteredProducts = useMemo(
    () => filterProductsBySearchTerm(products, searchTerm),
    [products, searchTerm]
  );

  // 파생 상태: 장바구니 총액
  const totals = useMemo(
    () => calculateCartTotal(cart.value, cart.selectedCoupon),
    [cart.value, cart.selectedCoupon]
  );

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      "success"
    );
    cart.clearCart();
  }, [addNotification, cart]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <ProductList
          productsLength={products.length}
          filteredProducts={filteredProducts}
          debouncedSearchTerm={searchTerm}
          cart={cart.value}
          addToCart={cart.add}
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
