import { CartItem, ProductWithUI } from "../../../types";
import { useDebounce } from "../../utils/hooks/useDebounce";
import { filterProductsBySearchTerm } from "../../utils/filters";
import { ProductItem } from "../../components/entity";

interface ShoppingListProps {
  cart: CartItem[];
  searchTerm: string;
  products: ProductWithUI[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  handleNotificationAdd: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
}

export const ShoppingList = ({
  cart,
  setCart,
  products,
  searchTerm,
  handleNotificationAdd,
}: ShoppingListProps) => {
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const filteredProducts = filterProductsBySearchTerm(
    products,
    debouncedSearchTerm
  );

  return (
    <section>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
        <div className="text-sm text-gray-600">총 {products.length}개 상품</div>
      </div>
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            "{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              products={products}
              cart={cart}
              setCart={setCart}
              handleNotificationAdd={handleNotificationAdd}
            />
          ))}
        </div>
      )}
    </section>
  );
};
