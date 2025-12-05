import { ProductWithUI } from "../../../../types";
import { ProductTable } from "./ProductTable";

interface ProductListProps {
  products: ProductWithUI[];
  onEdit: (product: ProductWithUI) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export const ProductList = ({
  products,
  onEdit,
  onDelete,
  onAdd,
}: ProductListProps) => {
  return (
    <>
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <button
            onClick={onAdd}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
          >
            새 상품 추가
          </button>
        </div>
      </div>
      <ProductTable products={products} onEdit={onEdit} onDelete={onDelete} />
    </>
  );
};
