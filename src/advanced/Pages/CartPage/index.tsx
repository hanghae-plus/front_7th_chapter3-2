import { type FC } from "react";
import ProductCards from "./ProductCards";
import CartSummary from "./CartSummary";
import { useCart } from "../../hooks/useCart";
import { useProducts } from "../../hooks/useProducts";
import CartHeader from "../../components/layout/CartHeader";
import { useSearch } from "../../hooks/useSearch";

interface IProps {
  onChange: () => void;
}

const CartPage: FC<IProps> = ({ onChange }) => {
  const { cart, addToCart, getStock } = useCart();
  const { products } = useProducts();
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
            <CartSummary />
          </div>
        </div>
      </main>
    </>
  );
};

export default CartPage;
