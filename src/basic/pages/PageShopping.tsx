import { CartItem, Coupon, ProductWithUI } from "../../types";
import { ShoppingCart } from "./shopping/ShoppingCart";
import { ShoppingList } from "./shopping/ShoppingList";

interface PageShoppingProps {
  cart: CartItem[];
  coupons: Coupon[];
  searchTerm: string;
  selectedCoupon: Coupon | null;
  products: ProductWithUI[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  setSelectedCoupon: React.Dispatch<React.SetStateAction<Coupon | null>>;
  handleNotificationAdd: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
}

export const PageShopping = ({
  cart,
  coupons,
  searchTerm,
  selectedCoupon,
  products,
  setCart,
  setSelectedCoupon,
  handleNotificationAdd,
}: PageShoppingProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <ShoppingList
          cart={cart}
          searchTerm={searchTerm}
          products={products}
          setCart={setCart}
          handleNotificationAdd={handleNotificationAdd}
        />
      </div>
      <ShoppingCart
        cart={cart}
        products={products}
        coupons={coupons}
        selectedCoupon={selectedCoupon}
        setCart={setCart}
        setSelectedCoupon={setSelectedCoupon}
        handleNotificationAdd={handleNotificationAdd}
      />
    </div>
  );
};
