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
// 하위 컴포넌트:
// - ProductForm: 새 상품 추가 폼
// - ProductAccordion: 상품 정보 표시 및 수정
// - CouponForm: 새 쿠폰 추가 폼
// - CouponList: 쿠폰 목록 표시
import { useState } from "react";
import { Product, CartItem, Coupon } from "../../../types";
import {
  ProductWithUI,
  EMPTY_PRODUCT_FORM,
  EMPTY_COUPON_FORM,
} from "../../constants";
import { isSoldOut } from "../../models/cart";
import {
  getStockBadgeClass,
  validateProductPrice,
  validateProductStock,
} from "../../models/product";
import {
  validateCouponPercentage,
  validateCouponAmount,
  formatCouponValue,
} from "../../models/coupon";
import { formatPriceKor } from "../../utils/formatters";
import { isNumericInput } from "../../utils/validators";
import { Button, Card, FormInput, FormSelect, Tabs } from "../ui";
import { CloseIcon, PlusIcon, TrashIcon } from "../icons";

interface ProductForm {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Array<{ quantity: number; rate: number }>;
}

interface CouponForm {
  name: string;
  code: string;
  discountType: "amount" | "percentage";
  discountValue: number;
}

interface AdminPageProps {
  products: Product[];
  coupons: Coupon[];
  addProduct: (product: ProductForm) => void;
  updateProduct: (id: string, product: ProductForm) => void;
  deleteProduct: (id: string) => void;
  addCoupon: (coupon: CouponForm) => void;
  deleteCoupon: (code: string) => void;
  addNotification: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
  cart: CartItem[];
}

export const AdminPage = ({
  products,
  coupons,
  addProduct,
  updateProduct,
  deleteProduct,
  addCoupon,
  deleteCoupon,
  addNotification,
  cart,
}: AdminPageProps) => {
  const [activeTab, setActiveTab] = useState<"products" | "coupons">(
    "products"
  );
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT_FORM);

  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] = useState(EMPTY_COUPON_FORM);

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== "new") {
      updateProduct(editingProduct, productForm);
      setEditingProduct(null);
    } else {
      addProduct({
        ...productForm,
        discounts: productForm.discounts,
      });
    }
    setProductForm(EMPTY_PRODUCT_FORM);
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCoupon(couponForm);
    setCouponForm(EMPTY_COUPON_FORM);
    setShowCouponForm(false);
  };

  const startEditProduct = (product: ProductWithUI) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      discounts: product.discounts || [],
    });
    setShowProductForm(true);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>
      <Tabs
        tabs={[
          { id: "products", label: "상품 관리" },
          { id: "coupons", label: "쿠폰 관리" },
        ]}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as "products" | "coupons")}
      />

      {activeTab === "products" ? (
        <Card>
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">상품 목록</h2>
              <Button
                variant="primary"
                onClick={() => {
                  setEditingProduct("new");
                  setProductForm(EMPTY_PRODUCT_FORM);
                  setShowProductForm(true);
                }}
                className="bg-gray-900 hover:bg-gray-800"
              >
                새 상품 추가
              </Button>
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {isSoldOut(products, cart, product.id)
                        ? "SOLD OUT"
                        : formatPriceKor(product.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStockBadgeClass(
                          product.stock
                        )}`}
                      >
                        {product.stock}개
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {product.description || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => startEditProduct(product)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
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
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <form onSubmit={handleProductSubmit} className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingProduct === "new" ? "새 상품 추가" : "상품 수정"}
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormInput
                    label="상품명"
                    type="text"
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        name: e.target.value,
                      })
                    }
                    required
                  />
                  <FormInput
                    label="설명"
                    type="text"
                    value={productForm.description}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        description: e.target.value,
                      })
                    }
                  />
                  <FormInput
                    label="가격"
                    type="text"
                    value={productForm.price === 0 ? "" : productForm.price}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (isNumericInput(value)) {
                        setProductForm({
                          ...productForm,
                          price: value === "" ? 0 : parseInt(value),
                        });
                      }
                    }}
                    onBlur={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      const result = validateProductPrice(value);

                      if (!result.isValid) {
                        if (result.error) {
                          addNotification(result.error, "error");
                        }
                        if (result.correctedValue !== undefined) {
                          setProductForm({
                            ...productForm,
                            price: result.correctedValue,
                          });
                        }
                      }
                    }}
                    placeholder="숫자만 입력"
                    required
                  />
                  <FormInput
                    label="재고"
                    type="text"
                    value={productForm.stock === 0 ? "" : productForm.stock}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (isNumericInput(value)) {
                        setProductForm({
                          ...productForm,
                          stock: value === "" ? 0 : parseInt(value),
                        });
                      }
                    }}
                    onBlur={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      const result = validateProductStock(value);

                      if (!result.isValid) {
                        if (result.error) {
                          addNotification(result.error, "error");
                        }
                        if (result.correctedValue !== undefined) {
                          setProductForm({
                            ...productForm,
                            stock: result.correctedValue,
                          });
                        }
                      }
                    }}
                    placeholder="숫자만 입력"
                    required
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    할인 정책
                  </label>
                  <div className="space-y-2">
                    {productForm.discounts.map((discount, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-gray-50 p-2 rounded"
                      >
                        <input
                          type="number"
                          value={discount.quantity}
                          onChange={(e) => {
                            const newDiscounts = [...productForm.discounts];
                            newDiscounts[index].quantity =
                              parseInt(e.target.value) || 0;
                            setProductForm({
                              ...productForm,
                              discounts: newDiscounts,
                            });
                          }}
                          className="w-20 px-2 py-1 border rounded"
                          min="1"
                          placeholder="수량"
                        />
                        <span className="text-sm">개 이상 구매 시</span>
                        <input
                          type="number"
                          value={discount.rate * 100}
                          onChange={(e) => {
                            const newDiscounts = [...productForm.discounts];
                            newDiscounts[index].rate =
                              (parseInt(e.target.value) || 0) / 100;
                            setProductForm({
                              ...productForm,
                              discounts: newDiscounts,
                            });
                          }}
                          className="w-16 px-2 py-1 border rounded"
                          min="0"
                          max="100"
                          placeholder="%"
                        />
                        <span className="text-sm">% 할인</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newDiscounts = productForm.discounts.filter(
                              (_, i) => i !== index
                            );
                            setProductForm({
                              ...productForm,
                              discounts: newDiscounts,
                            });
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <CloseIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setProductForm({
                          ...productForm,
                          discounts: [
                            ...productForm.discounts,
                            { quantity: 10, rate: 0.1 },
                          ],
                        });
                      }}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      + 할인 추가
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      setProductForm(EMPTY_PRODUCT_FORM);
                      setShowProductForm(false);
                    }}
                  >
                    취소
                  </Button>
                  <Button variant="primary" type="submit">
                    {editingProduct === "new" ? "추가" : "수정"}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </Card>
      ) : (
        <Card>
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
                          {formatCouponValue(
                            coupon.discountType,
                            coupon.discountValue
                          )}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteCoupon(coupon.code)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
                <button
                  onClick={() => setShowCouponForm(!showCouponForm)}
                  className="text-gray-400 hover:text-gray-600 flex flex-col items-center"
                >
                  <PlusIcon className="w-8 h-8" />
                  <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
                </button>
              </div>
            </div>

            {showCouponForm && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <form onSubmit={handleCouponSubmit} className="space-y-4">
                  <h3 className="text-md font-medium text-gray-900">
                    새 쿠폰 생성
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <FormInput
                      label="쿠폰명"
                      type="text"
                      value={couponForm.name}
                      onChange={(e) =>
                        setCouponForm({
                          ...couponForm,
                          name: e.target.value,
                        })
                      }
                      placeholder="신규 가입 쿠폰"
                      required
                      className="text-sm"
                    />
                    <FormInput
                      label="쿠폰 코드"
                      type="text"
                      value={couponForm.code}
                      onChange={(e) =>
                        setCouponForm({
                          ...couponForm,
                          code: e.target.value.toUpperCase(),
                        })
                      }
                      placeholder="WELCOME2024"
                      required
                      className="text-sm font-mono"
                    />
                    <FormSelect
                      label="할인 타입"
                      value={couponForm.discountType}
                      onChange={(e) =>
                        setCouponForm({
                          ...couponForm,
                          discountType: e.target.value as
                            | "amount"
                            | "percentage",
                        })
                      }
                    >
                      <option value="amount">정액 할인</option>
                      <option value="percentage">정률 할인</option>
                    </FormSelect>
                    <FormInput
                      label={
                        couponForm.discountType === "amount"
                          ? "할인 금액"
                          : "할인율(%)"
                      }
                      type="text"
                      value={
                        couponForm.discountValue === 0
                          ? ""
                          : couponForm.discountValue
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        if (isNumericInput(value)) {
                          setCouponForm({
                            ...couponForm,
                            discountValue: value === "" ? 0 : parseInt(value),
                          });
                        }
                      }}
                      onBlur={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        const result =
                          couponForm.discountType === "percentage"
                            ? validateCouponPercentage(value)
                            : validateCouponAmount(value);

                        if (!result.isValid) {
                          if (result.error) {
                            addNotification(result.error, "error");
                          }
                          if (result.correctedValue !== undefined) {
                            setCouponForm({
                              ...couponForm,
                              discountValue: result.correctedValue,
                            });
                          }
                        }
                      }}
                      placeholder={
                        couponForm.discountType === "amount" ? "5000" : "10"
                      }
                      required
                      className="text-sm"
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={() => setShowCouponForm(false)}
                    >
                      취소
                    </Button>
                    <Button variant="primary" type="submit">
                      쿠폰 생성
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
