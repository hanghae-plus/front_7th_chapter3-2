import { type FC } from "react";
import ProductCards from "./ProductCards";
import CartSummary from "./CartSummary";
import { useCart } from "../../hooks/useCart";
import { Notification } from "../../models/notificiation";
import { useProducts } from "../../hooks/useProducts";
import { useCoupons } from "../../hooks/useCoupons";
import CartHeader from "../../components/layout/CartHeader";
import { useSearch } from "../../hooks/useSearch";

interface IProps {
  onChange: () => void;
  addNotification: (message: string, type: Notification["type"]) => void;
}

const CartPage: FC<IProps> = ({ addNotification, onChange }) => {
  const {
    cart,
    selectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    emptyCart,
    getStock,
    applyCoupon,
  } = useCart(addNotification);

  const { products } = useProducts(addNotification);
  const { coupons } = useCoupons(addNotification);
  const { searchTerm, setSearchTerm } = useSearch();
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <>
      <CartHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        totalCount={totalCartCount}
        onChange={onChange}
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <ProductCards
              searchTerm={searchTerm}
              products={products}
              addToCart={addToCart}
              getStock={getStock}
            />
          </div>

          <div className="lg:col-span-1">
            <CartSummary
              cart={cart}
              coupons={coupons}
              selectedCoupon={selectedCoupon}
              applyCoupon={applyCoupon}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
              emptyCart={emptyCart}
              addNotification={addNotification}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default CartPage;
