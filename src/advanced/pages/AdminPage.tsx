import { useState } from "react";
import { AdminTab } from "../../types";
import { useProductForm } from "../hooks/useProductForm";
import { Tabs, ProductTable, ProductForm, CouponList } from "../features";

export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>("products");
  const productForm = useProductForm();

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
            onEdit={productForm.startEdit}
            onAddNew={productForm.openNewForm}
          />
          {productForm.showForm && (
            <ProductForm.Root
              formData={productForm.formData}
              setFormData={productForm.setFormData}
              onSubmit={productForm.handleSubmit}
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

      {activeTab === "coupons" && <CouponList />}
    </div>
  );
};
