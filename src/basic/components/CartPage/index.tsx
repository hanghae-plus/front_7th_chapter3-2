import { useState } from "react";
import { Product, CartItem, Coupon } from "../../../types";
import { ProductWithUI, TIMING } from "../../constants";
import { filterProductsBySearch } from "../../models/product";
import { useDebounce } from "../../utils/hooks/useDebounce";
import { SearchBar } from "./SearchBar";
import { ProductList } from "./ProductList";
import { Cart } from "./Cart";

interface CartPageProps {
  products: Product[];
  cart: CartItem[];
  totalItemCount: number;
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  addToCart: (product: ProductWithUI) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  applyCoupon: (coupon: Coupon) => void;
  clearSelectedCoupon: () => void;
  completeOrder: () => void;
}

export const CartPage = ({
  products,
  cart,
  coupons,
  selectedCoupon,
  addToCart,
  removeFromCart,
  updateQuantity,
  applyCoupon,
  clearSelectedCoupon,
  completeOrder,
}: CartPageProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(
    searchTerm,
    TIMING.SEARCH_DEBOUNCE_MS
  );

  const filteredProducts = filterProductsBySearch(
    products,
    debouncedSearchTerm
  ) as ProductWithUI[];

  return (
    <>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <ProductList
            products={filteredProducts}
            cart={cart}
            debouncedSearchTerm={debouncedSearchTerm}
            addToCart={addToCart}
          />
        </div>

        <div className="lg:col-span-1">
          <Cart
            cart={cart}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            applyCoupon={applyCoupon}
            clearSelectedCoupon={clearSelectedCoupon}
            completeOrder={completeOrder}
          />
        </div>
      </div>
    </>
  );
};
