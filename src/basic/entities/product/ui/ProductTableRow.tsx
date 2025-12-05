import { formatPrice } from '../../../shared/lib/formatters';
import { Badge } from '../../../shared/ui/Badge';
import { Product } from '../model/types';

interface Props {
  product: Product;
  actions?: React.ReactNode; // 수정/삭제 버튼 Slot
}

export const ProductTableRow = ({ product, actions }: Props) => {
  const getStockColorClass = (stock: number) => {
    if (stock <= 0) return 'bg-red-100 text-red-800';
    if (stock <= 10) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {product.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatPrice(product.price)}원
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <Badge variant="stock" className={getStockColorClass(product.stock)}>
          {product.stock}개
        </Badge>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
        {product.description || '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        {actions}
      </td>
    </tr>
  );
};
