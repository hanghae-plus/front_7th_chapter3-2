import { useCallback } from "react";
import { formatPrice } from "../../utils/formatters";
import type { ProductWithUI } from "../../hooks/useProducts";
import { ProductInfo } from "./ProductInfo";
import { productAtom } from "../../stores/atoms/productAtoms";
import { useAtomValue } from "jotai";
import { cartAtom } from "../../stores/atoms/cartAtoms";
import { getRemainingStock } from "../../models/cart";

//상품 정보 표시 및 수정
export const ProductAccordion = ({
  setEditingProduct,
  setProductForm,
  setShow,
}: {
  setEditingProduct: (productId: string) => void;
  setProductForm: (productForm: Omit<ProductWithUI, "id">) => void;
  setShow: (show: boolean) => void;
}) => {
  const products = useAtomValue(productAtom);
  const cart = useAtomValue(cartAtom);

  const handleEditProduct = (product: ProductWithUI) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      discounts: product.discounts || [],
    });
    setShow(true);
  };

  const productPrice = useCallback(
    (price: number, productId?: string) => {
      if (productId) {
        const product = products.find((p) => p.id === productId);
        if (product && getRemainingStock(product, cart) <= 0) {
          return "SOLD OUT";
        }
      }
      return formatPrice(price);
    },
    [products, cart]
  );

  return (
    <div className='overflow-x-auto'>
      <table className='w-full'>
        <thead className='bg-gray-50 border-b border-gray-200'>
          <tr>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              상품명
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              가격
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              재고
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              설명
            </th>
            <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
              작업
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {products.map((product) => (
            <ProductInfo
              key={product.id}
              product={product}
              productPrice={productPrice}
              handleEditProduct={handleEditProduct}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
