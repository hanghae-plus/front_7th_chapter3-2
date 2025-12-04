import { ProductWithUI } from '../../types';
import CartSection from '../components/CartSection';
import CouponSelector from '../components/CouponSelector';
import Empty from '../components/Empty';
import OrderSummary from '../components/OrderSummary';
import ProductList from '../components/ProductList';
import useDebounce from '../hooks/useDebounce';
import * as productModel from '../models/product';
import {
  useNotificationContext,
  useCartContext,
  useProductContext,
  useCouponContext,
  useSearchContext,
} from '../contexts';

const Cart = () => {
  const { addNotification } = useNotificationContext();
  const {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    clearCoupon,
    selectedCoupon,
    calculateTotal,
    getRemainingStock,
    getItemTotal,
    clearCart,
  } = useCartContext();
  const { products } = useProductContext();
  const { coupons } = useCouponContext();
  const { searchTerm } = useSearchContext();

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const handleClickAddToCart = (product: ProductWithUI) => {
    addToCart(product);
  };

  const handleClickRemoveFromCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      removeFromCart(product);
    }
  };

  const handleClickUpdateQuantity = (
    productId: string,
    newQuantity: number
  ) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      updateQuantity(product, newQuantity);
    }
  };

  const handleChangeCoupon = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const coupon = coupons.find((c) => c.code === e.target.value);
    if (coupon) applyCoupon(coupon);
    else clearCoupon();
  };

  const handleClickCompleteOrder = () => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      'success'
    );
    clearCart();
  };

  const totals = calculateTotal();

  const filteredProducts = productModel.filterProductsBySearchTerm(
    products,
    debouncedSearchTerm
  );

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
            <Empty searchTerm={debouncedSearchTerm} />
          ) : (
            <ProductList
              products={filteredProducts}
              getRemainingStock={getRemainingStock}
              onAddToCart={handleClickAddToCart}
            />
          )}
        </section>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <CartSection
            cart={cart}
            getItemTotal={getItemTotal}
            onUpdateQuantity={handleClickUpdateQuantity}
            onRemove={handleClickRemoveFromCart}
          />

          {cart.length > 0 && (
            <>
              <CouponSelector
                coupons={coupons}
                selectedCoupon={selectedCoupon}
                onChangeCoupon={handleChangeCoupon}
              />
              <OrderSummary
                totals={totals}
                onCompleteOrder={handleClickCompleteOrder}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
