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
import { ManagementCoupon, AdminHeader, ManagementProduct } from "../admin";

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<"products" | "coupons">("products");

  return (
    <div className='max-w-6xl mx-auto'>
      <AdminHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "products" ? <ManagementProduct /> : <ManagementCoupon />}
    </div>
  );
}
