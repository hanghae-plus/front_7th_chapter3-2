import { useState } from "react";

// Shared
import { formatCurrency } from "../../../shared/lib/format";

// Entities (Model)
import { ProductWithUI } from "../../../entities/product/model/types";
import { Coupon } from "../../../entities/coupon/model/types";

// Features (UI)
import { ProductManagementForm } from "../../../features/product/model/ui/ProductManagementForm";
import { CouponManagementForm } from "../../../features/coupon/ui/CouponManagementForm";

interface Props {
  products: ProductWithUI[];
  coupons: Coupon[];
  onAddProduct: (product: Omit<ProductWithUI, "id">) => void;
  onUpdateProduct: (id: string, product: Partial<ProductWithUI>) => void;
  onDeleteProduct: (id: string) => void;
  onAddCoupon: (coupon: Coupon) => void;
  onDeleteCoupon: (id: string) => void;
  onNotification: (message: string, type?: "error" | "success" | "warning") => void;
}

/**
 * 관리자 대시보드 위젯
 * 상품 및 쿠폰 관리 기능을 제공하며, 하위 폼 컴포넌트의 표시 여부(Visibility)를 관리합니다.
 */
export const AdminDashboard = ({
  products,
  coupons,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAddCoupon,
  onDeleteCoupon,
  onNotification,
}: Props) => {
  const [activeTab, setActiveTab] = useState<"products" | "coupons">("products");

  // --------------------------------------------------------------------------
  // Local State (Visibility & Editing Target)
  // --------------------------------------------------------------------------
  
  // 상품 관리: 폼 표시 여부 및 수정할 상품 데이터
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithUI | null>(null);

  // 쿠폰 관리: 폼 표시 여부
  const [showCouponForm, setShowCouponForm] = useState(false);

  // --------------------------------------------------------------------------
  // Event Handlers
  // --------------------------------------------------------------------------

  /**
   * 상품 추가/수정 완료 핸들러
   * ProductManagementForm에서 전달받은 데이터를 기반으로
   * 신규 추가(onAddProduct) 또는 수정(onUpdateProduct) 액션을 호출합니다.
   */
  const handleProductSubmit = (productData: ProductWithUI) => {
    if (editingProduct) {
      onUpdateProduct(editingProduct.id, productData);
    } else {
      // 신규 생성 시 id는 제외하고 전달 (서버/훅에서 생성)
      const { id, ...newProduct } = productData;
      onAddProduct(newProduct);
    }
    // 폼 닫기 및 상태 초기화
    setEditingProduct(null);
    setShowProductForm(false);
  };

  /**
   * 상품 수정 버튼 클릭 핸들러
   * 수정할 상품 데이터를 상태에 설정하고 폼을 엽니다.
   */
  const handleEditClick = (product: ProductWithUI) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  /**
   * 쿠폰 추가 완료 핸들러
   * CouponManagementForm에서 전달받은 데이터를 기반으로 추가 액션을 호출합니다.
   */
  const handleCouponSubmit = (newCoupon: Coupon) => {
    onAddCoupon(newCoupon);
    setShowCouponForm(false);
  };

  // --------------------------------------------------------------------------
  // Render
  // --------------------------------------------------------------------------
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("products")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "products"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            상품 관리
          </button>
          <button
            onClick={() => setActiveTab("coupons")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "coupons"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            쿠폰 관리
          </button>
        </nav>
      </div>

      {activeTab === "products" ? (
        <section className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">상품 목록</h2>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setShowProductForm(true);
                }}
                className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
              >
                새 상품 추가
              </button>
            </div>
          </div>

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
                      {product.isRecommended && <span className="ml-2 text-red-500 text-xs">(BEST)</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(product.price)}
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
                      <button
                        onClick={() => handleEditClick(product)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => onDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 상품 폼 컴포넌트 */}
          {showProductForm && (
            <ProductManagementForm
              initialData={editingProduct}
              onSubmit={handleProductSubmit}
              onCancel={() => {
                setShowProductForm(false);
                setEditingProduct(null);
              }}
              onNotification={onNotification}
            />
          )}
        </section>
      ) : (
        <section className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold">쿠폰 관리</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {coupons.map((coupon) => (
                <div
                  key={coupon.code}
                  className="relative bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {coupon.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 font-mono">
                        {coupon.code}
                      </p>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-indigo-700">
                          {coupon.discountType === "amount"
                            ? `${coupon.discountValue.toLocaleString()}원 할인`
                            : `${coupon.discountValue}% 할인`}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteCoupon(coupon.code)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
                <button
                  onClick={() => setShowCouponForm(!showCouponForm)}
                  className="text-gray-400 hover:text-gray-600 flex flex-col items-center"
                >
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
                </button>
              </div>
            </div>

            {/* 쿠폰 폼 컴포넌트 */}
            {showCouponForm && (
              <CouponManagementForm
                onAddCoupon={handleCouponSubmit}
                onCancel={() => setShowCouponForm(false)}
                onNotification={onNotification}
              />
            )}
          </div>
        </section>
      )}
    </div>
  );
};