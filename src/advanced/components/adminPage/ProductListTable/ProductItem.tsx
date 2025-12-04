import { type FC } from "react";
import Button from "../../_common/Button";
import { ProductWithUI } from "../../../../types";
import { formatPriceKr } from "../../../utils/formatters";

interface IProps {
  product: ProductWithUI;
  onEdit: (product: ProductWithUI) => void;
  onDelete: (productId: string) => void;
}

const ProductItem: FC<IProps> = ({ product, onEdit, onDelete }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {product.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatPriceKr(product.price)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            product.stock > 10
              ? "bg-green-100 text-green-800"
              : product.stock > 0
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}>
          {product.stock}개
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
        {product.description || "-"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <Button
          variant="ghost"
          color="indigo"
          size="sm"
          className="mr-3"
          onClick={() => onEdit(product)}>
          수정
        </Button>
        <Button
          variant="ghost"
          color="danger"
          size="sm"
          onClick={() => onDelete(product.id)}>
          삭제
        </Button>
      </td>
    </tr>
  );
};

export default ProductItem;
