import { ProductListSection } from "./ProductListSection/ProductListSection";
import { CartSection } from "./CartSection/CartSection";

export function ShopPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <ProductListSection />
      <CartSection />
    </div>
  );
}

