import Cart from "./Cart";
import Products from "./Products";

const ShoppingMallPage = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <Products />
      <Cart />
    </div>
  );
};

export default ShoppingMallPage;
