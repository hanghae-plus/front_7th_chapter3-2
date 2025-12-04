import { type FC } from "react";
import ProductCard from "../../components/cartPage/ProductCard";
import { ProductWithUI } from "../../../types";

interface IProps {
  searchTerm?: string;
  products: ProductWithUI[];
  addToCart: (product: ProductWithUI) => void;
  getStock: (product: ProductWithUI) => number;
}

const ProductCards: FC<IProps> = ({
  searchTerm,
  products,
  addToCart,
  getStock,
}) => {
  const filteredProducts = searchTerm
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.description &&
            product.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      )
    : products;

  return (
    <section>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
        <div className="text-sm text-gray-600">총 {products.length}개 상품</div>
      </div>
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            "{searchTerm}"에 대한 검색 결과가 없습니다.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              remainingStock={getStock(product)}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductCards;
