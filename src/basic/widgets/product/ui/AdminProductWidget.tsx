import { useState } from 'react';
import { useProductList } from '../../../entities/product/model/useProductList';
import { ProductTableRow } from '../../../entities/product/ui/ProductTableRow';
import { Product } from '../../../entities/product/model/types';
import { ProductForm } from '../../../features/product/ui/ProductForm';
import { ToastMessage } from '../../../shared/hooks/useToast';
import { Button } from '../../../shared/ui/Button';

interface AdminProductWidgetProps {
  onShowToast?: (message: string, type: ToastMessage['type']) => void;
}

export const AdminProductWidget = ({
  onShowToast,
}: AdminProductWidgetProps) => {
  const { products, deleteProduct } = useProductList();

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleAddClick = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteClick = (productId: string) => {
    deleteProduct(productId);
    onShowToast?.('상품이 삭제되었습니다.', 'success');
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      {/* 헤더 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <Button variant="dark" size="sm" onClick={handleAddClick}>
            새 상품 추가
          </Button>
        </div>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                상품명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                가격
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                재고
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                설명
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <ProductTableRow
                key={product.id}
                product={product}
                actions={
                  <>
                    <Button
                      variant="subtle"
                      onClick={() => handleEditClick(product)}
                      className="mr-3"
                    >
                      수정
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteClick(product.id)}
                    >
                      삭제
                    </Button>
                  </>
                }
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* 폼 */}
      {showForm && (
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <ProductForm
            initialData={editingProduct ?? undefined}
            onShowToast={onShowToast}
            onClose={handleFormClose}
          />
        </div>
      )}
    </section>
  );
};
