import { AdminTabs } from "../../../domains/admin/components/AdminTabs";
import { ProductTable } from "../../../domains/admin/components/ProductTable";
import { ProductForm } from "../../../domains/admin/components/ProductForm";
import { CouponGrid } from "../../../domains/admin/components/CouponGrid";
import { useProducts } from "../../../domains/product/hooks/useProducts";
import { useCoupons } from "../../../domains/coupon/hooks/useCoupons";
import { useProductManagement } from "../../../domains/admin/hooks/useProductManagement";
import { useCouponManagement } from "../../../domains/admin/hooks/useCouponManagement";

interface AdminPageProps {
  activeTab: "products" | "coupons";
  onTabChange: (tab: "products" | "coupons") => void;
}

export function AdminPage({ activeTab, onTabChange }: AdminPageProps) {
  const { products } = useProducts();
  const { coupons } = useCoupons();

  const {
    editingProduct,
    showProductForm,
    deleteProduct,
    startEditProduct,
    startNewProduct,
    cancelEdit,
    handleSubmit: handleProductSubmit,
  } = useProductManagement();

  const {
    showCouponForm,
    toggleCouponForm,
    handleAddCoupon,
    handleDeleteCoupon,
    closeCouponForm,
  } = useCouponManagement();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>

      <AdminTabs activeTab={activeTab} onTabChange={onTabChange} />

      {activeTab === "products" ? (
        <>
          <ProductTable
            products={products}
            onEdit={startEditProduct}
            onDelete={deleteProduct}
            onAddNew={startNewProduct}
          />
          {showProductForm && (
            <ProductForm
              editingProduct={
                editingProduct
                  ? products.find((p) => p.id === editingProduct) || null
                  : null
              }
              onSubmit={handleProductSubmit}
              onCancel={cancelEdit}
            />
          )}
        </>
      ) : (
        <CouponGrid
          coupons={coupons}
          showForm={showCouponForm}
          onToggleForm={toggleCouponForm}
          onDelete={handleDeleteCoupon}
          onAdd={handleAddCoupon}
          onCancelForm={closeCouponForm}
        />
      )}
    </div>
  );
}
