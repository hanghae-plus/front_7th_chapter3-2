import { ProductWithUI } from "../../../lib/constants";
import { Coupon } from "../../../../types";
import { AdminTabs } from "../../../domains/admin/components/AdminTabs";
import { ProductTable } from "../../../domains/admin/components/ProductTable";
import { ProductForm } from "../../../domains/admin/components/ProductForm";
import { CouponGrid } from "../../../domains/admin/components/CouponGrid";
import { ProductFormData } from "../../../domains/admin/schemas/productSchemas";
import { CouponFormData } from "../../../domains/coupon/schemas/couponSchemas";

interface AdminPageProps {
  // Tab state
  activeTab: "products" | "coupons";
  onTabChange: (tab: "products" | "coupons") => void;

  // Product management
  products: ProductWithUI[];
  showProductForm: boolean;
  editingProduct: ProductWithUI | null;
  onEditProduct: (product: ProductWithUI) => void;
  onDeleteProduct: (productId: string) => void;
  onAddNewProduct: () => void;
  onProductSubmit: (data: ProductFormData) => void;
  onCancelProductEdit: () => void;

  // Coupon management
  coupons: Coupon[];
  showCouponForm: boolean;
  onToggleCouponForm: () => void;
  onDeleteCoupon: (code: string) => void;
  onAddCoupon: (data: CouponFormData) => void;
  onCancelCouponForm: () => void;
}

export function AdminPage({
  activeTab,
  onTabChange,
  products,
  showProductForm,
  editingProduct,
  onEditProduct,
  onDeleteProduct,
  onAddNewProduct,
  onProductSubmit,
  onCancelProductEdit,
  coupons,
  showCouponForm,
  onToggleCouponForm,
  onDeleteCoupon,
  onAddCoupon,
  onCancelCouponForm,
}: AdminPageProps) {
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
            onEdit={onEditProduct}
            onDelete={onDeleteProduct}
            onAddNew={onAddNewProduct}
          />
          {showProductForm && (
            <ProductForm
              editingProduct={editingProduct}
              onSubmit={onProductSubmit}
              onCancel={onCancelProductEdit}
            />
          )}
        </>
      ) : (
        <CouponGrid
          coupons={coupons}
          showForm={showCouponForm}
          onToggleForm={onToggleCouponForm}
          onDelete={onDeleteCoupon}
          onAdd={onAddCoupon}
          onCancelForm={onCancelCouponForm}
        />
      )}
    </div>
  );
}
