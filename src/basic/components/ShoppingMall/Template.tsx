import { CartItem, Product } from "../../../types";
import Cart from "./Cart";
import Products from "./Products";

type Props = {
  products: any[];
  cart: any[];
  coupons: any[];
  filteredProducts: any[];
  debouncedSearchTerm: string;
  getRemainingStock: (product: any) => number;
  addToCart: (product: any) => void;
  calculateItemTotal: (product: any) => number;
  removeFromCart: (productId: string) => void;
  updateQuantity: (products: Product[], productId: string, quantity: number) => void;
  selectedCoupon: any;
  applyCoupon: (couponId: number) => void;
  setSelectedCoupon: (couponId: number) => void;
  totals: {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
  addNotification: (message: string) => void;
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
};

const ShoppingMallTemplate = ({
  products,
  cart,
  coupons,
  filteredProducts,
  debouncedSearchTerm,
  getRemainingStock,
  addToCart,
  calculateItemTotal,
  removeFromCart,
  updateQuantity,
  selectedCoupon,
  applyCoupon,
  setSelectedCoupon,
  totals,
  addNotification,
  setCart,
}: Props) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        {/* 상품 목록 */}
        <Products
          products={products}
          filteredProducts={filteredProducts}
          debouncedSearchTerm={debouncedSearchTerm}
          getRemainingStock={getRemainingStock}
          addToCart={addToCart}
        />
      </div>

      <Cart
        products={products}
        cart={cart}
        setCart={setCart}
        coupons={coupons}
        selectedCoupon={selectedCoupon}
        totals={totals}
        applyCoupon={applyCoupon}
        setSelectedCoupon={setSelectedCoupon}
        calculateItemTotal={calculateItemTotal}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
        addNotification={addNotification}
      />
    </div>
  );
};

export default ShoppingMallTemplate;
