import { CartItemList, PaymentSummary, useCart } from '@/features/cart';
import { CouponSelector, useCoupons } from '@/features/coupon';
import { Product, ProductList, useProducts } from '@/features/product';
import { Notification, useFilter } from '@/shared/hooks';
import { ProductHeader } from '@/shared/ui';

export const ProductsPage = ({
  goPage,
  addNotification,
}: {
  goPage: (id: string) => void;
  addNotification: (message: string, type: Notification['type']) => void;
}) => {
  const {
    cart,
    selectedCoupon,
    applyCoupon,
    totals,
    totalItemCount,
    clearCart,
    addToCart,
    removeFromCart,
    updateQuantity,
  } = useCart();
  const { coupons } = useCoupons();
  const { products } = useProducts();

  const productFilterFn = (list: Product[], query: string) => {
    return list.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        (product.description &&
          product.description.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const { filteredList, query, setQuery, isFiltering } = useFilter<Product>(
    products,
    productFilterFn,
    { debounceDelay: 500 }
  );

  return (
    <>
      <ProductHeader
        cart={cart}
        query={query}
        setQuery={setQuery}
        totalItemCount={totalItemCount}
        goPage={goPage}
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <ProductList
              cart={cart}
              products={filteredList}
              addToCart={addToCart}
              addNotification={addNotification}
              isLoading={isFiltering}
              query={query}
            />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <CartItemList
                cart={cart}
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
                addNotification={addNotification}
              />
              {cart.length > 0 && (
                <>
                  <CouponSelector
                    coupons={coupons}
                    selectedCoupon={selectedCoupon}
                    applyCoupon={applyCoupon}
                    addNotification={addNotification}
                  />
                  <PaymentSummary
                    totals={totals}
                    addNotification={addNotification}
                    clearCart={clearCart}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
