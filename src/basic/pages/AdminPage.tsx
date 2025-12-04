import { useState } from "react";
import { Product, ProductWithUI } from "../models/product";
import { Coupon } from "../../types";
import { formatProceAdmin } from "../utils/formatters";
import { useCart } from "../hooks/useCart";
import { isValidCouponCode } from "../utils/validators";
import { PlusIcon, TrashIcon } from "../components/icons";
import ProductForm, { ProductFormData } from "../components/ProductForm";
import CouponForm from "../components/CouponForm";
import { useProducts } from "../hooks/useProducts";

type Props = {
  addNotification: (message: string, type: "error" | "success" | "warning") => void;
  products: ProductWithUI[];
  productActions: Omit<ReturnType<typeof useProducts>, "products">;
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (couponId: string) => void;
};

export const AdminPage = ({ addNotification, products, productActions, coupons, addCoupon, deleteCoupon }: Props) => {
  const { cart } = useCart();
  const [activeTab, setActiveTab] = useState<"products" | "coupons">("products");
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);

  // Admin
  const [editingProduct, setEditingProduct] = useState<ProductWithUI | null>(null);

  const handleCouponSubmit = (coupon: Coupon) => {
    if (!isValidCouponCode(coupon.code)) {
      addNotification("쿠폰 코드는 4-12자의 영문 대문자와 숫자여야 합니다.", "error");
    }
    addCoupon(coupon);

    const existingCoupon = coupons.find((c) => c.code === coupon.code);
    if (existingCoupon) {
      addNotification("이미 존재하는 쿠폰 코드입니다.", "error");
      return;
    }
    addNotification("쿠폰이 추가되었습니다.", "success");
    setShowCouponForm(false);
  };

  const startEditProduct = (product: ProductWithUI) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleProductSubmit = (product: ProductFormData) => {
    if (editingProduct) {
      productActions.updateProduct(editingProduct.id, product);
      addNotification("상품이 수정되었습니다.", "success");
      setEditingProduct(null);
    } else {
      productActions.addProduct({
        ...product,
        discounts: product.discounts,
      });
      addNotification("상품이 추가되었습니다.", "success");
    }
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const formatPrice = (price: number, productId?: string): string => {
    if (productId) {
      const product = products.find((p) => p.id === productId);
      if (product && getRemainingStock(product) <= 0) {
        return "SOLD OUT";
      }
    }

    return formatProceAdmin(price);
  };

  const getRemainingStock = (product: Product): number => {
    const cartItem = cart.find((item) => item.product.id === product.id);
    const remaining = product.stock - (cartItem?.quantity || 0);

    return remaining;
  };

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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatPrice(product.price, product.id)}
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
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{product.description || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => startEditProduct(product)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => {
                          productActions.deleteProduct(product.id);
                          addNotification("상품이 삭제되었습니다.", "success");
                        }}
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
          {showProductForm && (
            <ProductForm
              editingProduct={editingProduct}
              onSubmit={handleProductSubmit}
              onCancel={() => {
                setEditingProduct(null);
                setShowProductForm(false);
              }}
              addNotification={addNotification}
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
                      <h3 className="font-semibold text-gray-900">{coupon.name}</h3>
                      <p className="text-sm text-gray-600 mt-1 font-mono">{coupon.code}</p>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-indigo-700">
                          {coupon.discountType === "amount"
                            ? `${coupon.discountValue.toLocaleString()}원 할인`
                            : `${coupon.discountValue}% 할인`}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        deleteCoupon(coupon.code);
                        addNotification("쿠폰이 삭제되었습니다.", "success");
                      }}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ))}

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
                <button
                  onClick={() => setShowCouponForm(!showCouponForm)}
                  className="text-gray-400 hover:text-gray-600 flex flex-col items-center"
                >
                  <PlusIcon />
                  <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
                </button>
              </div>
            </div>
            {showCouponForm && (
              <CouponForm
                onSubmit={handleCouponSubmit}
                onCancel={() => setShowCouponForm(false)}
                addNotification={addNotification}
              />
            )}
          </div>
        </section>
      )}
    </div>
  );
};
