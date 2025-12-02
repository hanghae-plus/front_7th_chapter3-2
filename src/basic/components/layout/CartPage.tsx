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

import { CartItem, Coupon, Product } from "../../../types";
import { XIcon, BagIcon, ProductIcon } from "../icons";
import { ProductList } from "../cart/ProductList";
import { useEffect } from "react";

interface CartPageProps {
  products: Product[];
  filteredProducts: Product[];
  debouncedSearchTerm: string;
  getRemainingStock: (product: Product) => number;
  formatPrice: (price: number, productId?: string) => string;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  applyCoupon: (coupon: Coupon) => void;
  calculateItemTotal: (item: CartItem, cart: CartItem[]) => number;
  calculateTotal: (
    cart: CartItem[],
    selectedCoupon: Coupon | null
  ) => { totalBeforeDiscount: number; totalAfterDiscount: number };
  clearCart: () => void;
  cart: CartItem[];
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  coupons: Coupon[];
  totals: { totalBeforeDiscount: number; totalAfterDiscount: number };
  completeOrder: () => void;
}

export function CartPage({
  products,
  debouncedSearchTerm,
  getRemainingStock,
  formatPrice,
  addToCart,
  removeFromCart,
  updateQuantity,
  applyCoupon,
  calculateItemTotal,
  calculateTotal,
  clearCart,
}: CartPageProps) {
  const useCart = useCart();
  const filteredProducts = debouncedSearchTerm
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          (product.description &&
            product.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
      )
    : products;

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
      <div className='lg:col-span-3'>
        {/* 상품 목록 */}
        <ProductList
          filteredProducts={filteredProducts}
          debouncedSearchTerm={debouncedSearchTerm}
          getRemainingStock={getRemainingStock}
          formatPrice={formatPrice}
          addToCart={addToCart}
        />
      </div>

      <div className='lg:col-span-1'>
        <div className='sticky top-24 space-y-4'>
          <section className='bg-white rounded-lg border border-gray-200 p-4'>
            <h2 className='text-lg font-semibold mb-4 flex items-center'>
              <BagIcon className='w-5 h-5 mr-2' />
              장바구니
            </h2>
            {cart.length === 0 ? (
              <div className='text-center py-8'>
                <BagIcon className='w-16 h-16 text-gray-300 mx-auto mb-4' strokeWidth={1} />
                <p className='text-gray-500 text-sm'>장바구니가 비어있습니다</p>
              </div>
            ) : (
              <div className='space-y-3'>
                {cart.map((item) => {
                  const itemTotal = calculateItemTotal(item, cart);
                  const originalPrice = item.product.price * item.quantity;
                  const hasDiscount = itemTotal < originalPrice;
                  const discountRate = hasDiscount
                    ? Math.round((1 - itemTotal / originalPrice) * 100)
                    : 0;

                  return (
                    <div key={item.product.id} className='border-b pb-3 last:border-b-0'>
                      <div className='flex justify-between items-start mb-2'>
                        <h4 className='text-sm font-medium text-gray-900 flex-1'>
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className='text-gray-400 hover:text-red-500 ml-2'
                        >
                          <XIcon />
                        </button>
                      </div>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center'>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className='w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100'
                          >
                            <span className='text-xs'>−</span>
                          </button>
                          <span className='mx-3 text-sm font-medium w-8 text-center'>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className='w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100'
                          >
                            <span className='text-xs'>+</span>
                          </button>
                        </div>
                        <div className='text-right'>
                          {hasDiscount && (
                            <span className='text-xs text-red-500 font-medium block'>
                              -{discountRate}%
                            </span>
                          )}
                          <p className='text-sm font-medium text-gray-900'>
                            {Math.round(itemTotal).toLocaleString()}원
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {cart.length > 0 && (
            <>
              <section className='bg-white rounded-lg border border-gray-200 p-4'>
                <div className='flex items-center justify-between mb-3'>
                  <h3 className='text-sm font-semibold text-gray-700'>쿠폰 할인</h3>
                  <button className='text-xs text-blue-600 hover:underline'>쿠폰 등록</button>
                </div>
                {coupons.length > 0 && (
                  <select
                    className='w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500'
                    value={selectedCoupon?.code || ""}
                    onChange={(e) => {
                      const coupon = coupons.find((c) => c.code === e.target.value);
                      if (coupon) applyCoupon(coupon);
                      else setSelectedCoupon(null);
                    }}
                  >
                    <option value=''>쿠폰 선택</option>
                    {coupons.map((coupon) => (
                      <option key={coupon.code} value={coupon.code}>
                        {coupon.name} (
                        {coupon.discountType === "amount"
                          ? `${coupon.discountValue.toLocaleString()}원`
                          : `${coupon.discountValue}%`}
                        )
                      </option>
                    ))}
                  </select>
                )}
              </section>

              <section className='bg-white rounded-lg border border-gray-200 p-4'>
                <h3 className='text-lg font-semibold mb-4'>결제 정보</h3>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>상품 금액</span>
                    <span className='font-medium'>
                      {totals.totalBeforeDiscount.toLocaleString()}원
                    </span>
                  </div>
                  {totals.totalBeforeDiscount - totals.totalAfterDiscount > 0 && (
                    <div className='flex justify-between text-red-500'>
                      <span>할인 금액</span>
                      <span>
                        -{(totals.totalBeforeDiscount - totals.totalAfterDiscount).toLocaleString()}
                        원
                      </span>
                    </div>
                  )}
                  <div className='flex justify-between py-2 border-t border-gray-200'>
                    <span className='font-semibold'>결제 예정 금액</span>
                    <span className='font-bold text-lg text-gray-900'>
                      {totals.totalAfterDiscount.toLocaleString()}원
                    </span>
                  </div>
                </div>

                <button
                  onClick={completeOrder}
                  className='w-full mt-4 py-3 bg-yellow-400 text-gray-900 rounded-md font-medium hover:bg-yellow-500 transition-colors'
                >
                  {totals.totalAfterDiscount.toLocaleString()}원 결제하기
                </button>

                <div className='mt-3 text-xs text-gray-500 text-center'>
                  <p>* 실제 결제는 이루어지지 않습니다</p>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
