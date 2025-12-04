import { useState } from "react";
import { AdminProductForm } from "./AdminProductForm";
import { AdminProductTable } from "./AdminProductTable";
import { CartItem, ProductWithUI } from "../../../../types";
import { Button } from "../../../components/common/ui/Button";

interface AdminProductsProps {
  cart: CartItem[];
  products: ProductWithUI[];
  setProducts: React.Dispatch<React.SetStateAction<ProductWithUI[]>>;
  handleNotificationAdd: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
}

export const AdminProducts = ({
  cart,
  products,
  setProducts,
  handleNotificationAdd,
}: AdminProductsProps) => {
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    price: 0,
    stock: 0,
    description: "",
    discounts: [] as Array<{ quantity: number; rate: number }>,
    isRecommended: false,
  });

  const handleAddProduct = () => {
    setEditingProduct("new");
    setProductForm({
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

      {products.length > 0 && (
        <AdminProductTable
          cart={cart}
          products={products}
          setProducts={setProducts}
          setProductForm={setProductForm}
          setEditingProduct={setEditingProduct}
          setShowProductForm={setShowProductForm}
          handleNotificationAdd={handleNotificationAdd}
        />
      )}
      {showProductForm && (
        <AdminProductForm
          editingProduct={editingProduct}
          productForm={productForm}
          setProducts={setProducts}
          setEditingProduct={setEditingProduct}
          handleNotificationAdd={handleNotificationAdd}
          setProductForm={setProductForm}
          setShowProductForm={setShowProductForm}
        />
      )}
    </section>
  );
};
