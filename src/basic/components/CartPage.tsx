import { useState, useEffect } from 'react';
import { CartItem as CartItemType, Coupon, ProductWithUI } from '../../types';
import { ProductCard } from './ProductCard';
import { CartItem } from './CartItem';
import { calculateItemTotal, calculateCartTotal } from '../utils/cartCalculator';
import { getRemainingStock, formatCurrency } from '../utils/productUtils';
import { CartIcon, ShoppingBagIcon } from './common/Icons';

interface CartPageProps {
  products: ProductWithUI[];
  cart: CartItemType[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  onAddToCart: (product: ProductWithUI) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onApplyCoupon: (coupon: Coupon) => void;
  onClearCoupon: () => void;
  onCompleteOrder: () => void;
}

export const CartPage = ({
  products,
  cart,
  coupons,
  selectedCoupon,
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
  onApplyCoupon,
  onClearCoupon,
  onCompleteOrder,
}: CartPageProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredProducts = debouncedSearchTerm
    ? products.filter(
        product =>
          product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          (product.description &&
            product.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
      )
    : products;

  const totals = calculateCartTotal(cart, selectedCoupon);
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center flex-1">
              <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
              <div className="ml-8 flex-1 max-w-md">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="상품 검색..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <nav className="flex items-center space-x-4">
              <div className="relative">
                <CartIcon className="text-gray-700" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItemCount}
                  </span>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <section>
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
                <div className="text-sm text-gray-600">총 {products.length}개 상품</div>
              </div>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    "{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      remainingStock={getRemainingStock(product, cart)}
                      formatPrice={(price, isSoldOut) =>
                        isSoldOut ? 'SOLD OUT' : formatCurrency(price)
                      }
                      onAddToCart={onAddToCart}
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
                  <ShoppingBagIcon className="mr-2" />
                  장바구니
                </h2>
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map(item => (
                      <CartItem
                        key={item.product.id}
                        item={item}
                        itemTotal={calculateItemTotal(item, cart)}
                        onUpdateQuantity={onUpdateQuantity}
                        onRemove={onRemoveFromCart}
                      />
                    ))}
                  </div>
                )}
              </section>

              {cart.length > 0 && (
                <>
                  <section className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-700">쿠폰 할인</h3>
                      <button className="text-xs text-blue-600 hover:underline">쿠폰 등록</button>
                    </div>
                    {coupons.length > 0 && (
                      <select
                        className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                        value={selectedCoupon?.code || ''}
                        onChange={e => {
                          const coupon = coupons.find(c => c.code === e.target.value);
                          if (coupon) onApplyCoupon(coupon);
                          else onClearCoupon();
                        }}
                      >
                        <option value="">쿠폰 선택</option>
                        {coupons.map(coupon => (
                          <option key={coupon.code} value={coupon.code}>
                            {coupon.name} (
                            {coupon.discountType === 'amount'
                              ? `${coupon.discountValue.toLocaleString()}원`
                              : `${coupon.discountValue}%`}
                            )
                          </option>
                        ))}
                      </select>
                    )}
                  </section>

                  <section className="bg-white rounded-lg border border-gray-200 p-4">
                    <h3 className="text-lg font-semibold mb-4">결제 정보</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">상품 금액</span>
                        <span className="font-medium">
                          {totals.totalBeforeDiscount.toLocaleString()}원
                        </span>
                      </div>
                      {totals.totalBeforeDiscount - totals.totalAfterDiscount > 0 && (
                        <div className="flex justify-between text-red-500">
                          <span>할인 금액</span>
                          <span>
                            -
                            {(
                              totals.totalBeforeDiscount - totals.totalAfterDiscount
                            ).toLocaleString()}
                            원
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between py-2 border-t border-gray-200">
                        <span className="font-semibold">결제 예정 금액</span>
                        <span className="font-bold text-lg text-gray-900">
                          {totals.totalAfterDiscount.toLocaleString()}원
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={onCompleteOrder}
                      className="w-full mt-4 py-3 bg-yellow-400 text-gray-900 rounded-md font-medium hover:bg-yellow-500 transition-colors"
                    >
                      {totals.totalAfterDiscount.toLocaleString()}원 결제하기
                    </button>

                    <div className="mt-3 text-xs text-gray-500 text-center">
                      <p>* 실제 결제는 이루어지지 않습니다</p>
                    </div>
                  </section>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
