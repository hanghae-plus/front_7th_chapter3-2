import { useMemo } from "react";
import { Coupon, ProductWithUI } from "../../../types";
import { ProductList } from "./components/ProductList";
import { CartSection } from "./components/CartSection";
import { filterProductsBySearchTerm } from "../../models/product";
import { useCart } from "../../hooks/useCart";

interface ShopPageProps {
  products: ProductWithUI[];
  searchTerm: string;
  coupons: {
    value: Coupon[];
  };
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void;
}

export function ShopPage({
  products,
  searchTerm,
  coupons,
  addNotification,
}: ShopPageProps) {
  // 파생 상태: 필터링된 상품 목록
  const filteredProducts = useMemo(
    () => filterProductsBySearchTerm(products, searchTerm),
    [products, searchTerm]
  );

  // Cart actions for ProductList
  const cart = useCart({
    products: [], // TODO: products도 atom으로 변경 후 제거
    onMessage: addNotification,
  });

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
