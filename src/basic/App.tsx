import { useState, useCallback, useEffect } from "react";
import { Notification, ProductWithUI } from "../types";
import Header from "./components/Header";
import ShoppingMallTemplate from "./components/ShoppingMall/Template";
import AdminTemplate from "./components/Admin/Template";
import Noti from "./components/Notification";
import { useCart } from "./hooks/useCart";
import useCoupon from "./hooks/useCoupons";
import useProduct from "./hooks/useProducts";

const App = () => {
  const addNotification = useCallback((message: string, type: "error" | "success" | "warning" = "success") => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  }, []);

  const {
    cart,
    totalItemCount,
    setCart,
    addToCart,
    calculateCartTotal,
    calculateItemTotal,
    getRemainingStock,
    removeFromCart,
    updateQuantity,
  } = useCart({
    addNotification,
  });
  const { products, addProduct, updateProduct, deleteProduct } = useProduct({ addNotification });
  const { coupons, selectedCoupon, applyCoupon, setSelectedCoupon, addCoupon, deleteCoupon } = useCoupon({
    addNotification,
    calculateCartTotal,
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "coupons">("products");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Admin
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    price: 0,
    stock: 0,
    description: "",
    discounts: [] as Array<{ quantity: number; rate: number }>,
  });

  const [couponForm, setCouponForm] = useState({
    name: "",
    code: "",
    discountType: "amount" as "amount" | "percentage",
    discountValue: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, "success");
    setCart([]);
    setSelectedCoupon(null);
  }, [addNotification]);

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
    setProductForm({ name: "", price: 0, stock: 0, description: "", discounts: [] });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCoupon(couponForm);
    setCouponForm({
      name: "",
      code: "",
      discountType: "amount",
      discountValue: 0,
    });
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

  const totals = calculateCartTotal(selectedCoupon);

  const filteredProducts = debouncedSearchTerm
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          (product.description && product.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
      )
    : products;

  return (
    <div className="min-hx-screen bg-gray-50">
      <Noti notifications={notifications} setNotifications={setNotifications} />
      <Header
        isAdmin={isAdmin}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setIsAdmin={setIsAdmin}
        totalItemCount={totalItemCount}
        cart={cart}
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminTemplate
            products={products}
            coupons={coupons}
            showCouponForm={showCouponForm}
            couponForm={couponForm}
            activeTab={activeTab}
            showProductForm={showProductForm}
            editingProduct={editingProduct}
            productForm={productForm}
            getRemainingStock={getRemainingStock}
            setShowCouponForm={setShowCouponForm}
            setCouponForm={setCouponForm}
            deleteCoupon={deleteCoupon}
            handleCouponSubmit={handleCouponSubmit}
            setActiveTab={setActiveTab}
            setEditingProduct={setEditingProduct}
            setProductForm={setProductForm}
            setShowProductForm={setShowProductForm}
            startEditProduct={startEditProduct}
            deleteProduct={deleteProduct}
            handleProductSubmit={handleProductSubmit}
            addNotification={addNotification}
          />
        ) : (
          <ShoppingMallTemplate
            products={products}
            coupons={coupons}
            cart={cart}
            filteredProducts={filteredProducts}
            debouncedSearchTerm={debouncedSearchTerm}
            selectedCoupon={selectedCoupon}
            totals={totals}
            getRemainingStock={getRemainingStock}
            addToCart={addToCart}
            calculateItemTotal={calculateItemTotal}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            applyCoupon={applyCoupon}
            setSelectedCoupon={setSelectedCoupon}
            completeOrder={completeOrder}
          />
        )}
      </main>
    </div>
  );
};

export default App;
