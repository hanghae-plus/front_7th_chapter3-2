import { ProductList } from "../components/CartPage/products/ProductList";
import { Cart } from "../components/CartPage/carts/Cart";

const CartPage = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <ProductList />
      <Cart />
    </div>
  );
};

export default CartPage;
