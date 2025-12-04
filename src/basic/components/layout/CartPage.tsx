// TODO: 장바구니 페이지 컴포넌트
// 힌트:
// 1. 상품 목록 표시 (검색 기능 포함)
// 2. 장바구니 관리
// 3. 쿠폰 적용
// 4. 주문 처리
//
// 필요한 hooks:
// - useProducts: 상품 목록 관리
// - useCart: 장바구니 상태 관리
// - useCoupons: 쿠폰 목록 관리
// - useDebounce: 검색어 디바운싱
//
// 하위 컴포넌트:
// - SearchBar: 검색 입력
// - ProductList: 상품 목록 표시
// - Cart: 장바구니 표시 및 결제

import { ProductList } from "../cart/ProductList";
import { CartItem, Coupon } from "../../../types";
import { Cart } from "../cart/Cart";
import { ProductWithUI } from "../../hooks/useProducts";
interface CartPageProps {
  cart: CartItem[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  applyCoupon: (coupon: Coupon) => void;
  calcItemTotal: (item: CartItem) => number;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  totals: { totalBeforeDiscount: number; totalAfterDiscount: number };
  completeOrder: () => void;
  searchTerm: string;
  products: ProductWithUI[];
  addToCart: (product: ProductWithUI) => void;
  remainingStock: (product: ProductWithUI) => number;
}

export function CartPage({
  cart,
  coupons,
  selectedCoupon,
  setSelectedCoupon,
  applyCoupon,
  calcItemTotal,
  removeFromCart,
  updateQuantity,
  totals,
  completeOrder,
  searchTerm,
  products,
  addToCart,
  remainingStock,
}: CartPageProps) {
  const filteredProducts = searchTerm
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.description &&
            product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : products;

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
      <div className='lg:col-span-3'>
        {/* 상품 목록 */}
        <ProductList
          filteredProducts={filteredProducts}
          searchTerm={searchTerm}
          remainingStock={remainingStock}
          addToCart={addToCart}
        />
      </div>

      <div className='lg:col-span-1'>
        <Cart
          cart={cart}
          coupons={coupons}
          selectedCoupon={selectedCoupon}
          setSelectedCoupon={setSelectedCoupon}
          applyCoupon={applyCoupon}
          calcItemTotal={calcItemTotal}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
          totals={totals}
          completeOrder={completeOrder}
        />
      </div>
    </div>
  );
}
