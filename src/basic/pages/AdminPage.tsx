import { useState, useCallback } from "react";
import { Coupon, AdminTab } from "../../types";
import { ProductWithUI } from "../hooks/useProducts";
import { useCoupons } from "../hooks/useCoupons";
import { useProductForm } from "../hooks/useProductForm";
import { Tabs, ProductTable, ProductForm, CouponList } from "../features";

interface AdminPageProps {
  products: ProductWithUI[];
  addProduct: (product: Omit<ProductWithUI, "id">) => void;
  updateProduct: (id: string, updates: Partial<ProductWithUI>) => void;
  deleteProduct: (id: string) => void;
  addNotification: (message: string, type: "success" | "error") => void;
}

export const AdminPage = ({
  products,
  addProduct,
  updateProduct,
  deleteProduct,
  addNotification,
}: AdminPageProps) => {
  const {
    coupons,
    addCoupon: addCouponToList,
    deleteCoupon: deleteCouponFromList,
  } = useCoupons();

  const [activeTab, setActiveTab] = useState<AdminTab>("products");

  const productForm = useProductForm({
    addProduct,
    updateProduct,
    addNotification,
  });

  // useCoupons의 함수를 래핑하여 notification 처리
  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      const result = addCouponToList(newCoupon);
      addNotification(result.message, result.success ? "success" : "error");
    },
    [addCouponToList, addNotification]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      const result = deleteCouponFromList(couponCode);
      addNotification(result.message, "success");
    },
    [deleteCouponFromList, addNotification]
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>

      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "products" && (
        <>
          <ProductTable
            products={products}
            onEdit={productForm.startEdit}
            onDelete={deleteProduct}
            onAddNew={productForm.openNewForm}
          />
          {productForm.showForm && (
            <ProductForm.Root
              formData={productForm.formData}
              setFormData={productForm.setFormData}
              onSubmit={productForm.handleSubmit}
              addNotification={addNotification}
            >
              <ProductForm.Title>
                {productForm.mode === "create" ? "새 상품 추가" : "상품 수정"}
              </ProductForm.Title>
              <ProductForm.Fields />
              <ProductForm.Discounts />
              <ProductForm.Actions>
                <ProductForm.CancelButton onClick={productForm.resetForm} />
                <ProductForm.SubmitButton>
                  {productForm.mode === "create" ? "추가" : "수정"}
                </ProductForm.SubmitButton>
              </ProductForm.Actions>
            </ProductForm.Root>
          )}
        </>
      )}

      {activeTab === "coupons" && (
        <CouponList
          coupons={coupons}
          onAddCoupon={addCoupon}
          onDeleteCoupon={deleteCoupon}
          addNotification={addNotification}
        />
      )}
    </div>
  );
};
