import { useAtom, useSetAtom } from 'jotai';

import { Product } from "../../types";
import { ProductCard } from "../components/entities/ProductCard";
import { Cart } from "../components/entities/Cart";
import { getMaxApplicableDiscount } from "../utils/cartCalculations";
import { generateOrderNumber } from "../utils/idGenerator";
import { useSearch } from "../hooks/useSearch";
import { useCouponValidation } from "../hooks/useCouponValidation";
import { useCartPage } from "../hooks/useCartPage";

import {
  cartAtom,
  productsAtom,
  couponsAtom,
  debouncedSearchTermAtom,
  addToCartAtom,
  removeFromCartAtom,
  updateQuantityAtom,
  completeOrderAtom,
  getRemainingStockAtom,
  addNotificationAtom
} from '../atoms';

interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

const CartPage = () => {
  const [cart] = useAtom(cartAtom);
  const [products] = useAtom(productsAtom);
  const [coupons] = useAtom(couponsAtom);
  const [debouncedSearchTerm] = useAtom(debouncedSearchTermAtom);
  
  const addToCart = useSetAtom(addToCartAtom);
  const removeFromCart = useSetAtom(removeFromCartAtom);
  const updateQuantity = useSetAtom(updateQuantityAtom);
  const completeOrderAction = useSetAtom(completeOrderAtom);
  const getRemainingStock = useSetAtom(getRemainingStockAtom);
  const addNotification = useSetAtom(addNotificationAtom);
  
  // 페이지 비즈니스 로직 (쿠폰 관련)
  const {
    selectedCoupon,
    totals,
    handleCouponChange,
    handleCompleteOrder: handleCompleteOrderFromHook
  } = useCartPage({
    coupons,
    cart,
    onCompleteOrder: () => {
      // 액션: 주문번호 생성 (시간 의존)
      const orderNumber = generateOrderNumber();
      
      // 순수: 상태 업데이트
      const result = completeOrderAction(orderNumber);
      if (result.message) {
        addNotification({ message: result.message, type: 'success' });
      }
      return result;
    }
  });
  
  // 검색/필터링 로직
  const { filteredItems: filteredProducts } = useSearch({
    items: products as ProductWithUI[],
    searchTerm: debouncedSearchTerm,
    searchFields: ['name', 'description']
  });

  // 쿠폰 검증 로직 (자동 감시)
  useCouponValidation({
    selectedCoupon,
    coupons,
    cart,
    onCouponInvalid: () => handleCouponChange(''),
    onMinimumAmountWarning: (message) => addNotification({ message, type: 'warning' })
  });

  const handleAddToCart = (product: ProductWithUI) => {
    const result = addToCart(product);
    if (result.error) {
      addNotification({ message: result.error, type: 'error' });
    } else if (result.message) {
      addNotification({ message: result.message, type: 'success' });
    }
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    const result = updateQuantity({ productId, newQuantity: quantity, products });
    if (result.error) {
      addNotification({ message: result.error, type: 'error' });
    }
  };

  // Wrapper for hook's complete order
  const handleCompleteOrder = () => {
    handleCompleteOrderFromHook();
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        {/* 상품 목록 */}
        <section>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
            <div className="text-sm text-gray-600">
              총 {products.length}개 상품
            </div>
          </div>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">"{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  remainingStock={getRemainingStock(product)}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="lg:col-span-1">
        <Cart
          cart={cart}
          totals={totals}
          coupons={coupons}
          selectedCouponCode={selectedCoupon?.code || null}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveFromCart={removeFromCart}
          onSelectCoupon={handleCouponChange}
          onCompleteOrder={handleCompleteOrder}
          getMaxApplicableDiscount={(item) => getMaxApplicableDiscount(item, cart)}
        />
      </div>
    </div>
  );
}

export default CartPage;
