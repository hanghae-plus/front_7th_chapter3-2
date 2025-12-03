import { useState, useCallback } from 'react';
import { CartItem, Product } from '../types';
import { useNotification } from './shared/hooks/useNotification';
import { Admin } from './features/admin';
import { Header } from './shared/component/Header';
import { ProductList } from './features/product/ProductList';
import { Cart } from './features/cart/Cart';
import { Notification } from './features/notification';
import { ProductWithUI, useProduct } from './features/product/hook/useProduct';
import { useSearchProduct } from './features/product/hook/useSearchProduct';
import { useCart } from './features/cart/hook/useCart';
import { useManageCoupon } from './features/admin/hooks/useManageCoupon';

export const getRemainingStock = (
  cart: CartItem[],
  product: Product,
): number => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  const remaining = product.stock - (cartItem?.quantity || 0);

  return remaining;
};

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const { products, setProducts } = useProduct();
  const { notifications, addNotification, closeNotification } =
    useNotification();
  const { searchTerm, setSearchTerm, debouncedSearchTerm } = useSearchProduct();

  const { coupons, applyCoupon, selectedCoupon, setSelectedCoupon } =
    useManageCoupon();

  const {
    cart,
    setCart,
    totalItemCount,
    cartTotalPrice,
    updateQuantity,
    removeFromCart,
    completeOrder,
  } = useCart({
    products,
    addNotification,
    selectedCoupon,
    setSelectedCoupon,
  });

  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = getRemainingStock(cart, product);
      if (remainingStock <= 0) {
        addNotification('재고가 부족합니다!', 'error');
        return;
      }

      setCart((prevCart) => {
        const existingItem = prevCart.find(
          (item) => item.product.id === product.id,
        );

        if (existingItem) {
          const newQuantity = existingItem.quantity + 1;

          if (newQuantity > product.stock) {
            addNotification(
              `재고는 ${product.stock}개까지만 있습니다.`,
              'error',
            );
            return prevCart;
          }

          return prevCart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: newQuantity }
              : item,
          );
        }

        return [...prevCart, { product, quantity: 1 }];
      });

      addNotification('장바구니에 담았습니다', 'success');
    },
    [cart, addNotification, getRemainingStock],
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
          {notifications.map((notif) => (
            <Notification
              key={notif.id}
              notification={notif}
              closeNotification={closeNotification}
            />
          ))}
        </div>
      )}
      <Header
        admin={{
          isAdmin,
          setIsAdmin,
        }}
        cart={{
          totalCartItemCount: totalItemCount,
        }}
        search={{
          searchInput: !isAdmin && (
            <div className="ml-8 flex-1 max-w-md">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="상품 검색..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          ),
        }}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <Admin
            products={products}
            setProducts={setProducts}
            addNotification={addNotification}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <ProductList
              products={products}
              debouncedSearchTerm={debouncedSearchTerm}
              addToCart={addToCart}
              getRemainingStock={(product) => getRemainingStock(cart, product)}
            />

            <Cart
              cart={cart}
              setCart={setCart}
              cartTotalPrice={cartTotalPrice}
              totalItemCount={totalItemCount}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              completeOrder={completeOrder}
              selectedCoupon={selectedCoupon}
              setSelectedCoupon={setSelectedCoupon}
              coupons={coupons}
              applyCoupon={applyCoupon}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
