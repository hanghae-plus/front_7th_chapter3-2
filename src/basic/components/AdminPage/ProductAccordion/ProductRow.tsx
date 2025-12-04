import { Product, CartItem } from "../../../../types";
import { ProductWithUI } from "../../../constants";
import { isSoldOut } from "../../../models/cart";
import { getStockBadgeClass } from "../../../models/product";
import { formatPriceKor } from "../../../utils/formatters";

interface ProductRowProps {
  product: Product;
  products: Product[];
  cart: CartItem[];
  onEdit: (product: ProductWithUI) => void;
  onDelete: (id: string) => void;
}

export const ProductRow = ({
  product,
  products,
  cart,
  onEdit,
  onDelete,
}: ProductRowProps) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {product.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {isSoldOut(products, cart, product.id)
          ? "SOLD OUT"
          : formatPriceKor(product.price)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStockBadgeClass(
            product.stock
          )}`}
        >
          {product.stock}개
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
        {(product as ProductWithUI).description || "-"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => onEdit(product as ProductWithUI)}
          className="text-indigo-600 hover:text-indigo-900 mr-3"
        >
          수정
        </button>
        <button
          onClick={() => onDelete(product.id)}
          className="text-red-600 hover:text-red-900"
        >
          삭제
        </button>
      </td>
    </tr>
  );
};

export default ProductRow;
