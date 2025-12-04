import { useState, useCallback } from "react";
import { AdminTab } from "../../types";
import { useProductForm } from "../hooks/useProductForm";
import { Tabs, ProductTable, ProductForm, CouponList } from "../features";
import { useProductStore } from "../store/useProductStore";
import { useCouponStore } from "../store/useCouponStore";
import { useNotificationStore } from "../store/useNotificationStore";

export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>("products");

  // Store에서 상태 및 액션 가져오기
  const { products, addProduct, updateProduct, deleteProduct } =
    useProductStore();
  const { coupons, addCoupon: addCouponAction, deleteCoupon: deleteCouponAction } =
    useCouponStore();
  const { addNotification } = useNotificationStore();

  const productForm = useProductForm();

  // 쿠폰 관련 핸들러 (notification 처리 포함)
  const handleAddCoupon = useCallback(
    (newCoupon: typeof coupons[0]) => {
      const result = addCouponAction(newCoupon);
      addNotification(result.message, result.success ? "success" : "error");
    },
    [addCouponAction, addNotification, coupons]
  );

  const handleDeleteCoupon = useCallback(
    (couponCode: string) => {
      const result = deleteCouponAction(couponCode);
      addNotification(result.message, "success");
    },
    [deleteCouponAction, addNotification]
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
          onAddCoupon={handleAddCoupon}
          onDeleteCoupon={handleDeleteCoupon}
          addNotification={addNotification}
        />
      )}
    </div>
  );
};
