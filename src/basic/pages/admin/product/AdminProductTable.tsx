import { CartItem, Discount, ProductWithUI } from "../../../../types";
import { Button } from "../../../components/common/ui/Button";
import { formatPriceText } from "../../../utils/formatters";

interface AdminProductTableProps {
  cart: CartItem[];
  products: ProductWithUI[];
  setProducts: React.Dispatch<React.SetStateAction<ProductWithUI[]>>;
  setEditingProduct: (productId: string) => void;
  setProductForm: (product: {
    name: string;
    price: number;
    stock: number;
    description: string;
    discounts: Discount[];
  }) => void;
  setShowProductForm: (show: boolean) => void;
  handleNotificationAdd: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
}

export const AdminProductTable = ({
  cart,
  products,
  setProducts,
  setEditingProduct,
  setProductForm,
  setShowProductForm,
  handleNotificationAdd,
}: AdminProductTableProps) => {
  const handleEditProduct = (product: ProductWithUI) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      discounts: product.discounts || [],
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = (product: ProductWithUI) => {
    setProducts((prev) => prev.filter((p) => p.id !== product.id));

    handleNotificationAdd("상품이 삭제되었습니다.", "success");
  };

  return (
    <div className="overflow-x-auto">
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
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {product.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatPriceText(product.price, cart, products, product.id)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.stock > 10
                      ? "bg-green-100 text-green-800"
                      : product.stock > 0
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.stock}개
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                {product.description || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button
                  type="button"
                  onClick={() => handleEditProduct(product)}
                  variant="text"
                  size="sm"
                  className="mr-3"
                >
                  수정
                </Button>
                <Button
                  type="button"
                  onClick={() => handleDeleteProduct(product)}
                  variant="danger"
                  size="sm"
                >
                  삭제
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
