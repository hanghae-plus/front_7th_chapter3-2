import { useMemo } from "react";
import { CartItem, Coupon, ProductWithUI } from "../../../types";
import { ProductList } from "./components/ProductList";
import { CartSection } from "./components/CartSection";
import { filterProductsBySearchTerm } from "../../models/product";

interface ShopPageProps {
  products: ProductWithUI[];
  searchTerm: string;
  cart: {
    value: CartItem[];
    add: (product: ProductWithUI) => void;
  };
  coupons: {
    value: Coupon[];
  };
  addNotification: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
}

export function ShopPage({
  products,
  searchTerm,
  cart,
  coupons,
  addNotification,
}: ShopPageProps) {
  // 파생 상태: 필터링된 상품 목록
  const filteredProducts = useMemo(
    () => filterProductsBySearchTerm(products, searchTerm),
    [products, searchTerm]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <ProductList
          productsLength={products.length}
          filteredProducts={filteredProducts}
          debouncedSearchTerm={searchTerm}
          cart={cart.value}
          addToCart={cart.add}
        />
      </div>

      <div className="lg:col-span-1">
        <CartSection coupons={coupons} addNotification={addNotification} />
      </div>
    </div>
  );
}
