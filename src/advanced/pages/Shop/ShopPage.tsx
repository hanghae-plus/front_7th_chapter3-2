import { useMemo } from "react";
import { useAtomValue } from "jotai";
import { ProductList } from "./components/ProductList";
import { CartSection } from "./components/CartSection";
import { filterProductsBySearchTerm } from "../../models/product";
import { useCart } from "../../hooks/useCart";
import { productsAtom } from "../../atoms";

interface ShopPageProps {
  searchTerm: string;
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void;
}

export function ShopPage({ searchTerm, addNotification }: ShopPageProps) {
  // Jotai atoms에서 products 가져오기
  const products = useAtomValue(productsAtom);

  // 파생 상태: 필터링된 상품 목록
  const filteredProducts = useMemo(
    () => filterProductsBySearchTerm(products, searchTerm),
    [products, searchTerm]
  );

  // Cart actions for ProductList
  const cart = useCart({
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
        <CartSection addNotification={addNotification} />
      </div>
    </div>
  );
}
