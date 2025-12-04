import { ProductList } from '../features/product/ProductList';
import { Cart } from '../features/cart/Cart';
import { Header } from '../shared/component/Header';
import { useProduct } from '../features/product/hook/useProduct';
import { useSearchProduct } from '../features/product/hook/useSearchProduct';
import { useCart } from '../features/cart/hook/useCart';
import { useManageCoupon } from '../features/admin/hooks/useManageCoupon';

interface ShopPageProps {
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  addNotification: (
    message: string,
    type: 'success' | 'error' | 'warning',
  ) => void;
}

export const ShopPage = ({
  isAdmin,
  setIsAdmin,
  addNotification,
}: ShopPageProps) => {
  const { products } = useProduct();
  const { debouncedSearchTerm, searchTerm, setSearchTerm } = useSearchProduct();
  const { coupons, applyCoupon, selectedCoupon, setSelectedCoupon } =
    useManageCoupon({ addNotification });

  const {
    cart,
    totalItemCount,
    cartTotalPrice,
    updateQuantity,
    removeFromCart,
    completeOrder,
    addToCart,
    getRemainingStock,
  } = useCart({
    products,
    addNotification,
    selectedCoupon,
    setSelectedCoupon,
  });

  return (
    <>
      <Header
        admin={{
          isAdmin,
          setIsAdmin,
        }}
        cart={{
          totalCartItemCount: totalItemCount,
        }}
        search={{
          searchInput: (
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <ProductList
            products={products}
            search={{
              debouncedSearchTerm,
            }}
            cartActions={{
              addToCart,
              getRemainingStock: (product) => getRemainingStock(cart, product),
            }}
            notification={{
              addNotification,
            }}
          />

          <Cart
            cart={{
              items: cart,
              totalPrice: cartTotalPrice,
              totalItemCount,
            }}
            cartActions={{
              updateQuantity,
              removeFromCart,
              completeOrder,
            }}
            coupon={{
              selectedCoupon,
              setSelectedCoupon,
              coupons,
              applyCoupon,
            }}
          />
        </div>
      </main>
    </>
  );
};
