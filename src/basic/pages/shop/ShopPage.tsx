import { useEffect, useState } from "react";
import { ProductWithUI } from "../../App";
import { CartItem, Coupon } from "../../../types";
import { ProductListSection } from "./ProductListSection/ProductListSection";
import { CartSection } from "./CartSection/CartSection";

type ShopPageProps = {
  cart: CartItem[];
  coupons: Coupon[];
  productAmount: number;
  filteredProducts: ProductWithUI[];
  searchTerm: string;
  onAddToCart: (product: ProductWithUI) => void;
  onDeleteFromCart: (productId: string) => void;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  selectedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon) => void;
  onRemoveCoupon: () => void;
  totals: {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
  onCompleteOrder: () => void;
};

export function ShopPage({
  productAmount,
  filteredProducts,
  searchTerm,
  onAddToCart,
  onDeleteFromCart,
  onUpdateQuantity,
  cart,
  coupons,
  selectedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  totals,
  onCompleteOrder,
}: ShopPageProps) {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const getMaxApplicableDiscount = (item: CartItem): number => {
    const { discounts } = item.product;
    const { quantity } = item;

    const baseDiscount = discounts.reduce((maxDiscount, discount) => {
      return quantity >= discount.quantity && discount.rate > maxDiscount
        ? discount.rate
        : maxDiscount;
    }, 0);

    const hasBulkPurchase = cart.some((cartItem) => cartItem.quantity >= 10);
    if (hasBulkPurchase) {
      return Math.min(baseDiscount + 0.05, 0.5); // 대량 구매 시 추가 5% 할인
    }

    return baseDiscount;
  };

  const calculateItemTotal = (item: CartItem): number => {
    const { price } = item.product;
    const { quantity } = item;
    const discount = getMaxApplicableDiscount(item);

    return Math.round(price * quantity * (1 - discount));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <ProductListSection
        productAmount={productAmount}
        filteredProducts={filteredProducts}
        debouncedSearchTerm={debouncedSearchTerm}
        cart={cart}
        onAddToCart={onAddToCart}
      />

      <CartSection
        cart={cart}
        calculateItemTotal={calculateItemTotal}
        onDeleteFromCart={onDeleteFromCart}
        onUpdateQuantity={onUpdateQuantity}
        coupons={coupons}
        selectedCoupon={selectedCoupon}
        onApplyCoupon={onApplyCoupon}
        onRemoveCoupon={onRemoveCoupon}
        totals={totals}
        onCompleteOrder={onCompleteOrder}
      />
    </div>
  );
}
