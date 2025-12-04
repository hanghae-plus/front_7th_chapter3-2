import { ShoppingCart } from "./shopping/ShoppingCart";
import { ShoppingList } from "./shopping/ShoppingList";

export const PageShopping = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <ShoppingList />
      </div>
      <ShoppingCart />
    </div>
  );
};
