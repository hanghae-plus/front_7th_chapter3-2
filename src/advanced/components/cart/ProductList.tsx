import { useCallback } from "react";
import { formatPrice } from "../../utils/formatters";
import { ProductItem } from "./ProductItem";
import { useAtomValue } from "jotai";
import { debouncedSearchTermAtom } from "../../stores/atoms/uiAtoms";
import { getRemainingStock } from "../../models/cart";
import { cartAtom } from "../../stores/atoms/cartAtoms";
import { productAtom } from "../../stores/atoms/productAtoms";

export const ProductList = () => {
  const cart = useAtomValue(cartAtom);
  const products = useAtomValue(productAtom);
  const searchTerm = useAtomValue(debouncedSearchTermAtom);

  const filteredProducts = searchTerm
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.description &&
            product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : products;

  const productPrice = useCallback(
    (price: number, productId?: string) => {
      if (productId) {
        const product = filteredProducts.find((p) => p.id === productId);
        if (product && getRemainingStock(product, cart) <= 0) {
          return "SOLD OUT";
        }
      }
      return formatPrice(price, "₩");
    },
    [filteredProducts, cart]
  );

  return (
    <section>
      <div className='mb-6 flex justify-between items-center'>
        <h2 className='text-2xl font-semibold text-gray-800'>전체 상품</h2>
        <div className='text-sm text-gray-600'>총 {filteredProducts.length}개 상품</div>
      </div>
      {filteredProducts.length === 0 ? (
        <div className='text-center py-12'>
          <p className='text-gray-500'>"{searchTerm}"에 대한 검색 결과가 없습니다.</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {filteredProducts.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              stock={getRemainingStock(product, cart)}
              productPrice={productPrice}
            />
          ))}
        </div>
      )}
    </section>
  );
};
