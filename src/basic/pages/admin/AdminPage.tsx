import { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useCoupons } from '../../hooks/useCoupons';
import { ProductTable } from './ProductTable';
import { ProductForm } from './ProductForm';
import { CouponList } from './CouponList';
import { CouponForm } from './CouponForm';
import { ProductWithUI, Coupon } from '../../../types';
import { Button } from '../../components/ui/Button';

interface AdminPageProps {
  productsHook: ReturnType<typeof useProducts>;
  couponsHook: ReturnType<typeof useCoupons>;
  addNotification?: (message: string, type: 'error' | 'success' | 'warning') => void;
}

export function AdminPage({
  productsHook,
  couponsHook,
  addNotification
}: AdminPageProps) {

  const { products, addProduct, updateProduct, deleteProduct } = productsHook;
  const { coupons, addCoupon, removeCoupon } = couponsHook;

  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>('products');
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  const [productForm, setProductForm] = useState<Omit<ProductWithUI, 'id'>>({
    name: "",
    price: 0,
    stock: 0,
    description: "",
    discounts: [],
  });

  const [couponForm, setCouponForm] = useState<Coupon>({
    name: "",
    code: "",
    discountType: "amount",
    discountValue: 0,
  });

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
              <Button
                onClick={() => {
                  setEditingProduct("new");
                  setProductForm({
                    name: "",
                    price: 0,
                    stock: 0,
                    description: "",
                    discounts: [],
                  });
                  setShowProductForm(true);
                }}
              >
                새 상품 추가
              </Button>
            </div>
          </div>

          <ProductTable
            products={products}
            onEdit={(product) => {
              setEditingProduct(product.id);
              setProductForm({
                name: product.name,
                price: product.price,
                stock: product.stock,
                description: product.description || "",
                discounts: product.discounts,
                isRecommended: product.isRecommended,
              });
              setShowProductForm(true);
            }}
            onDelete={deleteProduct}
          />
          {showProductForm && (
            <ProductForm
              productForm={productForm}
              setProductForm={setProductForm}
              editingProduct={editingProduct}
              addNotification={addNotification}
              onSave={() => {
                if (editingProduct === "new") {
                  addProduct(productForm);
                } else if (editingProduct) {
                  updateProduct(editingProduct, productForm);
                }
                setShowProductForm(false);
                setEditingProduct(null);
              }}
              onCancel={() => {
                setShowProductForm(false);
                setEditingProduct(null);
              }}
            />
          )}
        </section>
      ) : (
        <section className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">쿠폰 관리</h2>
              <Button
                onClick={() => {
                  setCouponForm({
                    name: "",
                    code: "",
                    discountType: "amount",
                    discountValue: 0,
                  });
                  setShowCouponForm(true);
                }}
              >
                새 쿠폰 추가
              </Button>
            </div>
          </div>
          <div className="p-6">
            <CouponList
              coupons={coupons}
              onDelete={removeCoupon}
            />

            {showCouponForm && (
              <CouponForm
                couponForm={couponForm}
                setCouponForm={setCouponForm}
                addNotification={addNotification}
                onSave={() => {
                  addCoupon(couponForm);
                  setShowCouponForm(false);
                }}
                onCancel={() => {
                  setShowCouponForm(false);
                }}
              />
            )}
          </div>
        </section>
      )}
    </div>
  );
}
