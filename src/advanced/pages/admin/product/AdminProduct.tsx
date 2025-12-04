import { AdminProductForm } from "./AdminProductForm";
import { AdminProductTable } from "./AdminProductTable";
import { Button } from "../../../components/common/ui/Button";
import { useProducts } from "../../../hooks/useProducts";
import { useAtoms } from "../../../hooks/useAtoms";

export const AdminProducts = () => {
  const { products, setProductForm, setEditingProduct } = useProducts();
  const { showProductForm, setShowProductForm } = useAtoms();

  const handleAddProduct = () => {
    setEditingProduct("new");
    setProductForm({
      id: "new",
      name: "",
      price: 0,
      stock: 0,
      description: "",
      discounts: [],
      isRecommended: false,
    });
    setShowProductForm(true);
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <Button onClick={handleAddProduct} children="새 상품 추가" />
        </div>
      </div>

      {products.length > 0 && <AdminProductTable />}
      {showProductForm && <AdminProductForm />}
    </section>
  );
};
