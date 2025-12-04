// TODO: 관리자 페이지 컴포넌트
// 힌트:
// 1. 탭 UI로 상품 관리와 쿠폰 관리 분리
// 2. 상품 추가/수정/삭제 기능
// 3. 쿠폰 생성 기능
// 4. 할인 규칙 설정
//
// 필요한 hooks:
// - useProducts: 상품 CRUD
// - useCoupons: 쿠폰 CRUD
//

import { useState } from "react";
import { Coupon } from "../../../types";
import { ManagementCoupon, AdminHeader, ManagementProduct } from "../admin";
import type { ProductWithUI } from "../../hooks/useProducts";

interface AdminPageProps {
  products: ProductWithUI[];
  coupons: Coupon[];
  addProduct: (newProduct: Omit<ProductWithUI, "id">) => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  deleteProduct: (productId: string) => void;
  addCoupon: (newCoupon: Omit<Coupon, "id">) => void;
  deleteCoupon: (couponCode: string) => void;
  // selectedCoupon: Coupon | null;
  // setSelectedCoupon: (coupon: Coupon | null) => void;
  remainingStock: (product: ProductWithUI) => number;
}

export function AdminPage({
  products,
  addProduct,
  updateProduct,
  deleteProduct,
  coupons,
  addCoupon,
  deleteCoupon,
  remainingStock,
}: // selectedCoupon,
// setSelectedCoupon,
AdminPageProps) {
  const [activeTab, setActiveTab] = useState<"products" | "coupons">("products");

  return (
    <div className='max-w-6xl mx-auto'>
      <AdminHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "products" ? (
        <ManagementProduct
          products={products}
          addProduct={addProduct}
          updateProduct={updateProduct}
          deleteProduct={deleteProduct}
          remainingStock={remainingStock}
        />
      ) : (
        <ManagementCoupon
          coupons={coupons}
          addCoupon={addCoupon}
          deleteCoupon={deleteCoupon}
          // selectedCoupon={selectedCoupon}
          // setSelectedCoupon={setSelectedCoupon}
        />
      )}
    </div>
  );
}
