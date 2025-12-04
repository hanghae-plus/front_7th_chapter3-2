import { useState } from "react";
import { Product, CartItem, Coupon } from "../../../types";
import { EMPTY_PRODUCT_FORM, EMPTY_COUPON_FORM } from "../../constants";
import { Tabs } from "../ui";
import { ProductForm } from "./ProductForm";
import { ProductAccordion } from "./ProductAccordion";
import { CouponForm } from "./CouponForm";
import { CouponList } from "./CouponList";

interface ProductFormData {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Array<{ quantity: number; rate: number }>;
}

interface CouponFormData {
  name: string;
  code: string;
  discountType: "amount" | "percentage";
  discountValue: number;
}

interface AdminPageProps {
  products: Product[];
  coupons: Coupon[];
  addProduct: (product: ProductFormData) => void;
  updateProduct: (id: string, product: ProductFormData) => void;
  deleteProduct: (id: string) => void;
  addCoupon: (coupon: CouponFormData) => void;
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

  // Product form states
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT_FORM);

  // Coupon form states
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
        <>
          <ProductAccordion
            products={products}
            cart={cart}
            setEditingProduct={setEditingProduct}
            setProductForm={setProductForm}
            setShowProductForm={setShowProductForm}
            deleteProduct={deleteProduct}
          />
          {showProductForm && (
            <ProductForm
              productForm={productForm}
              setProductForm={setProductForm}
              editingProduct={editingProduct}
              setEditingProduct={setEditingProduct}
              setShowProductForm={setShowProductForm}
              onSubmit={handleProductSubmit}
              addNotification={addNotification}
            />
          )}
        </>
      ) : (
        <>
          <CouponList
            coupons={coupons}
            deleteCoupon={deleteCoupon}
            showCouponForm={showCouponForm}
            setShowCouponForm={setShowCouponForm}
          />
          {showCouponForm && (
            <CouponForm
              couponForm={couponForm}
              setCouponForm={setCouponForm}
              setShowCouponForm={setShowCouponForm}
              onSubmit={handleCouponSubmit}
              addNotification={addNotification}
            />
          )}
        </>
      )}
    </div>
  );
};
