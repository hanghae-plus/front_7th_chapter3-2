import { useAtomValue } from "jotai";
import { ProductWithUI } from "../../../../types";
import { ProductTable } from "./ProductTable";
import { productsAtom } from "../../../atoms";

interface ProductListProps {
  onEdit: (product: ProductWithUI) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export const ProductList = ({ onEdit, onDelete, onAdd }: ProductListProps) => {
  // productsAtom에서 직접 구독
  const products = useAtomValue(productsAtom);

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
