import { type FC } from "react";
import ProductCards from "./ProductCards";
import CartSummary from "./CartSummary";
import { useCart } from "../../hooks/useCart";

interface IProps {
  searchTerm?: string;
}

const CartPage: FC<IProps> = ({ searchTerm }) => {
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    emptyCart,
    getStock,
  } = useCart();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <ProductCards
          searchTerm={searchTerm}
          addToCart={addToCart}
          getStock={getStock}
        />
      </div>

      <div className="lg:col-span-1">
        <CartSummary
          cart={cart}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
          emptyCart={emptyCart}
        />
      </div>
    </div>
  );
};

export default CartPage;
