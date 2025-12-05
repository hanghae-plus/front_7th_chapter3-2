import { ProductWithUI } from '../../../entities/product';
import { mapProductToViewModel } from '../../../entities/product/model/product-view-mapper';
import { useDeleteProduct } from '../../../features/product/delete-product';
import { ToastProps } from '../../../shared/ui/toast';

interface ProductsTableProps {
  products: ProductWithUI[];
  deleteProduct: (productId: string) => void;
  onOpenProductForm: (product: ProductWithUI) => void;
  toast: (notification: ToastProps) => void;
}

export function ProductsTable({
  products,
  deleteProduct,
  onOpenProductForm,
  toast,
}: ProductsTableProps) {
  const { onDeleteProduct } = useDeleteProduct({ deleteProduct, toast });
  return (
    <table className="w-full">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            상품명
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            가격
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            재고
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            설명
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            작업
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {products.map((product) => {
          const viewModel = mapProductToViewModel(product, product.stock);

          return (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {viewModel.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {viewModel.displayPrice}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${viewModel.stockStatus.badgeClass}`}
                >
                  {viewModel.stockStatus.count}개
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                {viewModel.description || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onOpenProductForm(product)}
                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  수정
                </button>
                <button
                  onClick={() => onDeleteProduct(product.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  삭제
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
