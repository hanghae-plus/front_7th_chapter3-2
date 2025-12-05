import { useState } from "react";
import { Header } from "./shared/components/layout/Header";
import { Notification } from "./shared/components/Notification";
import { HomePage } from "./shared/components/pages/HomePage";
import { AdminPage } from "./shared/components/pages/AdminPage";
import { useNotification } from "./shared/hooks/useNotification";
import { useProducts } from "./domains/product/hooks/useProducts";
import { useProductSearch } from "./domains/product/hooks/useProductSearch";
import { ProductSearch } from "./domains/product/components/ProductSearch";
import { useCart } from "./domains/cart/hooks/useCart";
import { useCartCalculations } from "./domains/cart/hooks/useCartCalculations";
import { useCheckout } from "./domains/cart/hooks/useCheckout";
import { useCoupons } from "./domains/coupon/hooks/useCoupons";
import { useCouponApplication } from "./domains/coupon/hooks/useCouponApplication";
import { useProductManagement } from "./domains/admin/hooks/useProductManagement";
import { useCouponManagement } from "./domains/admin/hooks/useCouponManagement";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "coupons">(
    "products"
  );

  // Notification system
  const { notifications, addNotification, removeNotification } =
    useNotification();

  // Product domain
  const { products, setProducts } = useProducts();
  const { searchTerm, setSearchTerm, filteredProducts } =
    useProductSearch(products);

  // Cart domain
  const {
    cart,
    totalItemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart(products, addNotification);

  // Coupon domain
  const { coupons, addCoupon, deleteCoupon } = useCoupons();
  const { selectedCoupon, clearCoupon, setSelectedCoupon, handleApplyCoupon } =
    useCouponApplication(addNotification);

  // Cart calculations
  const { calculateItemTotal, totals } = useCartCalculations(
    cart,
    selectedCoupon
  );

  // Checkout
  const { handleCheckout } = useCheckout(
    clearCart,
    clearCoupon,
    addNotification
  );

  // Admin - Product management
  const {
    editingProduct,
    showProductForm,
    deleteProduct,
    startEditProduct,
    startNewProduct,
    cancelEdit,
    getEditingProductData,
    handleSubmit: handleProductSubmit,
  } = useProductManagement(products, setProducts, addNotification);

  // Admin - Coupon management
  const {
    showCouponForm,
    toggleCouponForm,
    closeCouponForm,
    handleAddCoupon,
    handleDeleteCoupon,
  } = useCouponManagement(
    addCoupon,
    deleteCoupon,
    selectedCoupon,
    clearCoupon,
    addNotification
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Notification
        notifications={notifications}
        onClose={removeNotification}
      />

      <Header
        isAdmin={isAdmin}
        onToggleAdmin={() => setIsAdmin(!isAdmin)}
        cartItemCount={totalItemCount}
        searchSlot={
          !isAdmin ? (
            <ProductSearch value={searchTerm} onChange={setSearchTerm} />
          ) : undefined
        }
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            activeTab={activeTab}
            onTabChange={setActiveTab}
            products={products}
            showProductForm={showProductForm}
            editingProduct={getEditingProductData()}
            onEditProduct={startEditProduct}
            onDeleteProduct={deleteProduct}
            onAddNewProduct={startNewProduct}
            onProductSubmit={handleProductSubmit}
            onCancelProductEdit={cancelEdit}
            coupons={coupons}
            showCouponForm={showCouponForm}
            onToggleCouponForm={toggleCouponForm}
            onDeleteCoupon={handleDeleteCoupon}
            onAddCoupon={handleAddCoupon}
            onCancelCouponForm={closeCouponForm}
          />
        ) : (
          <HomePage
            filteredProducts={filteredProducts}
            cart={cart}
            searchTerm={searchTerm}
            onAddToCart={addToCart}
            calculateItemTotal={calculateItemTotal}
            onRemoveFromCart={removeFromCart}
            onUpdateQuantity={updateQuantity}
            totalBeforeDiscount={totals.totalBeforeDiscount}
            totalAfterDiscount={totals.totalAfterDiscount}
            onCheckout={handleCheckout}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            onApplyCoupon={(coupon) =>
              handleApplyCoupon(coupon, totals.totalAfterDiscount)
            }
            onClearCoupon={() => setSelectedCoupon(null)}
          />
        )}
      </main>
    </div>
  );
}

export default App;
