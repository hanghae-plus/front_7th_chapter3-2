import { ProductListSection } from "./ProductListSection/ProductListSection";
import { CartSection } from "./CartSection/CartSection";
import { CartService } from "../../domains/cart/hooks/useCart";
import { ProductsService } from "../../domains/products/hooks/useProducts";
import { CouponsService } from "../../domains/coupon/hooks/useCoupon";

type ShopPageProps = {
  products: ProductsService;
  cart: CartService;
  coupons: CouponsService;
};

export function ShopPage({ products, cart, coupons }: ShopPageProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <ProductListSection products={products} cart={cart} />
      <CartSection cart={cart} coupons={coupons} />
    </div>
  );
}
