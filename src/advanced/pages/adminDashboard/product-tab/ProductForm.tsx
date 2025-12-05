import {
  type ProductFormState,
  type ProductWithUI,
  getNewProducts,
  getUpdatedProducts,
  INITIAL_PRODUCT_FORM_STATE,
} from '../../../entities/product';
import DiscountForm from './DiscountForm';
import { Dispatch, SetStateAction } from 'react';

interface ProductFormProps {
  editingProduct: string | null;
  productForm: ProductFormState;
  products: ProductWithUI[];
  setProducts: Dispatch<SetStateAction<ProductWithUI[]>>;
  setProductForm: Dispatch<SetStateAction<ProductFormState>>;
  setEditingProduct: Dispatch<SetStateAction<string | null>>;
  setShowProductForm: Dispatch<SetStateAction<boolean>>;
  addNotification: (message: string, type?: 'error' | 'success' | 'warning') => void;
}

export default function ProductForm({
  editingProduct,
  productForm,
  products,
  setProducts,
  setProductForm,
  setEditingProduct,
  setShowProductForm,
  addNotification,
}: ProductFormProps) {
  // Form event handlers
  const handleChangeFormInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.id;
    const value = e.target.value;
    if (id === 'price' || id === 'stock') {
      if (value === '' || /^\d+$/.test(value)) {
        setProductForm({ ...productForm, [id]: value === '' ? 0 : parseInt(value) });
      }
    } else {
      setProductForm({ ...productForm, [id]: value });
    }
  };
  const handleBlurFormPrice = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setProductForm({ ...productForm, price: 0 });
    } else if (parseInt(value) < 0) {
      addNotification('가격은 0보다 커야 합니다', 'error');
      setProductForm({ ...productForm, price: 0 });
    }
  };
  const handleBlurFormStock = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setProductForm({ ...productForm, stock: 0 });
    } else if (parseInt(value) < 0) {
      addNotification('재고는 0보다 커야 합니다', 'error');
      setProductForm({ ...productForm, stock: 0 });
    } else if (parseInt(value) > 9999) {
      addNotification('재고는 9999개를 초과할 수 없습니다', 'error');
      setProductForm({ ...productForm, stock: 9999 });
    }
  };

  // Product event handlers
  const addProduct = (newProduct: Omit<ProductWithUI, 'id'>) => {
    setProducts(getNewProducts(products, newProduct));
    addNotification('상품이 추가되었습니다.', 'success');
  };

  const updateProduct = (productId: string, updates: Partial<ProductWithUI>) => {
    setProducts(getUpdatedProducts(products, productId, updates));
    addNotification('상품이 수정되었습니다.', 'success');
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== 'new') {
      updateProduct(editingProduct, productForm);
      setEditingProduct(null);
    } else {
      addProduct({
        ...productForm,
        discounts: productForm.discounts,
      });
    }
    setProductForm({ name: '', price: 0, stock: 0, description: '', discounts: [] });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleAddDiscount = () => {
    setProductForm({
      ...productForm,
      discounts: [...productForm.discounts, { quantity: 10, rate: 0.1 }],
    });
  };

  const handleCancelProduct = () => {
    setEditingProduct(null);
    setProductForm(INITIAL_PRODUCT_FORM_STATE);
    setShowProductForm(false);
  };

  return (
    <div className="p-6 border-t border-gray-200 bg-gray-50">
      <form onSubmit={handleProductSubmit} className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          {editingProduct === 'new' ? '새 상품 추가' : '상품 수정'}
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              상품명
            </label>
            <input
              id="name"
              type="text"
              value={productForm.name}
              onChange={handleChangeFormInputValue}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              설명
            </label>
            <input
              id="description"
              type="text"
              value={productForm.description}
              onChange={handleChangeFormInputValue}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              가격
            </label>
            <input
              id="price"
              type="text"
              value={productForm.price === 0 ? '' : productForm.price}
              onChange={handleChangeFormInputValue}
              onBlur={handleBlurFormPrice}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
              placeholder="숫자만 입력"
              required
            />
          </div>
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
              재고
            </label>
            <input
              id="stock"
              type="text"
              value={productForm.stock === 0 ? '' : productForm.stock}
              onChange={handleChangeFormInputValue}
              onBlur={handleBlurFormStock}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
              placeholder="숫자만 입력"
              required
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">할인 정책</label>
          <div className="space-y-2">
            {productForm.discounts.map((discount, index) => (
              <DiscountForm
                key={index}
                index={index}
                productForm={productForm}
                discount={discount}
                setProductForm={setProductForm}
              />
            ))}
            <button
              type="button"
              onClick={handleAddDiscount}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              + 할인 추가
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancelProduct}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            {editingProduct === 'new' ? '추가' : '수정'}
          </button>
        </div>
      </form>
    </div>
  );
}
