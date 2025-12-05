import { useCartStore, CartItemList, PaymentSummary } from '@/features/cart';
import { useProductStore, ProductList, Product } from '@/features/product';
import { CouponSelector } from '@/features/coupon';
import { useFilter } from '@/shared/hooks';
import { ProductHeader } from '@/shared/ui';

export const ProductsPage = () => {
  const { cart } = useCartStore();
  const { products } = useProductStore();

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
      <ProductHeader query={query} setQuery={setQuery} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <ProductList
              products={filteredList}
              isLoading={isFiltering}
              query={query}
            />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <CartItemList />
              {cart.length > 0 && (
                <>
                  <CouponSelector />
                  <PaymentSummary />
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
