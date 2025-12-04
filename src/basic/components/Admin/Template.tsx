import { formatPrice } from "../../utils/formatters";
import { Coupon, ProductWithUI } from "../../../types";
import ProductManagement from "./ProductManagement";
import CouponManagement from "./CouponManagement";
import AdminTabBar from "./AdminTabBar";
import { useProductForm } from "../../hooks/useProductForm";
import { useCouponForm } from "../../hooks/useCouponForm";

type Props = {
  products: ProductWithUI[];
  coupons: Coupon[];
  deleteCoupon: (id: string) => void;
  activeTab: "products" | "coupons";
  getRemainingStock: (product: ProductWithUI) => number;
  setActiveTab: React.Dispatch<React.SetStateAction<"products" | "coupons">>;
  deleteProduct: (id: string) => void;
  addNotification: (message: string, type?: "error" | "success" | "warning") => void;
  addProduct: (newProduct: Omit<ProductWithUI, "id">) => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  addCoupon: (newCoupon: Coupon) => void;
};

const Template = ({
  products,
  coupons,
  getRemainingStock,
  deleteCoupon,
  activeTab,
  setActiveTab,
  deleteProduct,
  addNotification,
  addProduct,
  updateProduct,
  addCoupon,
}: Props) => {
  const {
    showProductForm,
    setShowProductForm,
    editingProduct,
    setEditingProduct,
    productForm,
    setProductForm,
    startEditProduct,
    startAddProduct,
    handleProductSubmit,
    handlePriceChange,
    handlePriceBlur,
    handleStockChange,
    handleStockBlur,
  } = useProductForm({ addProduct, updateProduct, addNotification });

  const {
    showCouponForm,
    setShowCouponForm,
    couponForm,
    setCouponForm,
    handleCouponSubmit,
    handleDiscountValueChange,
    handleDiscountValueBlur,
  } = useCouponForm({
    addCoupon,
    addNotification,
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>

      <AdminTabBar activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "products" ? (
        <ProductManagement
          products={products}
          activeTab={activeTab}
          formatPrice={formatPrice}
          getRemainingStock={getRemainingStock}
          startEditProduct={startEditProduct}
          startAddProduct={startAddProduct}
          deleteProduct={deleteProduct}
          showProductForm={showProductForm}
          setShowProductForm={setShowProductForm}
          handleProductSubmit={handleProductSubmit}
          productForm={productForm}
          setProductForm={setProductForm}
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
          addNotification={addNotification}
          handlePriceChange={handlePriceChange}
          handlePriceBlur={handlePriceBlur}
          handleStockChange={handleStockChange}
          handleStockBlur={handleStockBlur}
        />
      ) : (
        <CouponManagement
          coupons={coupons}
          deleteCoupon={deleteCoupon}
          showCouponForm={showCouponForm}
          setShowCouponForm={setShowCouponForm}
          handleCouponSubmit={handleCouponSubmit}
          couponForm={couponForm}
          setCouponForm={setCouponForm}
          addNotification={addNotification}
          handleDiscountValueChange={handleDiscountValueChange}
          handleDiscountValueBlur={handleDiscountValueBlur}
        />
      )}
    </div>
  );
};

export default Template;
