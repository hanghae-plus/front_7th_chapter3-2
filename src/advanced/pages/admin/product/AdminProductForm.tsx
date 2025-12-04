import { Discount, ProductWithUI } from "../../../../types";
import { Button } from "../../../components/common/ui/Button";
import { InputField } from "../../../components/common/ui/InputField";
import { AdminProductDiscount } from "./AdminProductDiscount";
import { isValidPrice, isValidStock, extractNumbers } from "../../../utils/validators";

interface AdminProductFormProps {
  editingProduct: string | null;
  productForm: {
    name: string;
    price: number;
    stock: number;
    description: string;
    discounts: Discount[];
    isRecommended: boolean;
  };
  setProducts: React.Dispatch<React.SetStateAction<ProductWithUI[]>>;
  setProductForm: (product: {
    name: string;
    price: number;
    stock: number;
    description: string;
    discounts: Discount[];
    isRecommended: boolean;
  }) => void;
  setShowProductForm: (show: boolean) => void;
  setEditingProduct: (productId: string | null) => void;
  handleNotificationAdd: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
}

export const AdminProductForm = ({
  editingProduct,
  productForm,
  setProducts,
  setProductForm,
  setShowProductForm,
  setEditingProduct,
  handleNotificationAdd,
}: AdminProductFormProps) => {
  const addProduct = (newProduct: Omit<ProductWithUI, "id">) => {
    const product: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}`,
    };
    setProducts((prev) => [...prev, product]);
    handleNotificationAdd("상품이 추가되었습니다.", "success");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductForm({
      ...productForm,
      name: e.target.value,
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductForm({
      ...productForm,
      description: e.target.value,
    });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 숫자만 입력 허용 (utils 함수 사용)
    const numbersOnly = extractNumbers(value);
    if (value === "" || numbersOnly === value) {
      setProductForm({
        ...productForm,
        price: value === "" ? 0 : parseInt(value, 10),
      });
    }
  };

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 숫자만 입력 허용 (utils 함수 사용)
    const numbersOnly = extractNumbers(value);
    if (value === "" || numbersOnly === value) {
      setProductForm({
        ...productForm,
        stock: value === "" ? 0 : parseInt(value, 10),
      });
    }
  };

  // 가격 유효성 검사 (utils 함수 사용)
  const handlePriceBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 0;
    if (!isValidPrice(value)) {
      handleNotificationAdd("가격은 0보다 커야 합니다", "error");
      setProductForm({ ...productForm, price: 0 });
    } else {
      setProductForm({ ...productForm, price: value });
    }
  };

  // 재고 유효성 검사 (utils 함수 사용)
  const handleStockBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 0;
    if (!isValidStock(value)) {
      handleNotificationAdd("재고는 0 이상이어야 합니다", "error");
      setProductForm({ ...productForm, stock: 0 });
    } else if (value > 9999) {
      handleNotificationAdd("재고는 9999개를 초과할 수 없습니다", "error");
      setProductForm({ ...productForm, stock: 9999 });
    } else {
      setProductForm({ ...productForm, stock: value });
    }
  };

  const handleAddDiscount = () => {
    setProductForm({
      ...productForm,
      discounts: [...productForm.discounts, { quantity: 10, rate: 0.1 }],
    });
  };

  const updateProduct = (
    productId: string,
    updates: Partial<ProductWithUI>
  ) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId ? { ...product, ...updates } : product
      )
    );
    handleNotificationAdd("상품이 수정되었습니다.", "success");
  };

  const handleRecommendedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductForm({
      ...productForm,
      isRecommended: e.target.checked,
    });
  };

  const handleCancelForm = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      price: 0,
      stock: 0,
      description: "",
      discounts: [],
      isRecommended: false,
    });
    setShowProductForm(false);
  };

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
    setProductForm({
      name: "",
      price: 0,
      stock: 0,
      description: "",
      discounts: [],
      isRecommended: false,
    });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  return (
    <div className="p-6 border-t border-gray-200 bg-gray-50">
      <form onSubmit={handleProductSubmit} className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          {editingProduct === "new" ? "새 상품 추가" : "상품 수정"}
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField
            label="상품명"
            type="text"
            value={productForm.name}
            onChange={handleNameChange}
            required
          />
          <InputField
            label="설명"
            type="text"
            value={productForm.description}
            onChange={handleDescriptionChange}
          />
          <InputField
            label="가격"
            type="text"
            value={productForm.price === 0 ? "" : productForm.price}
            onChange={handlePriceChange}
            onBlur={handlePriceBlur}
            placeholder="숫자만 입력"
            required
          />
          <InputField
            label="재고"
            type="text"
            value={productForm.stock === 0 ? "" : productForm.stock}
            onChange={handleStockChange}
            onBlur={handleStockBlur}
            placeholder="숫자만 입력"
            required
          />
        </div>
        <InputField
          type="checkbox"
          id="isRecommended"
          label="추천 상품으로 설정"
          value={productForm.isRecommended}
          onChange={handleRecommendedChange}
        />
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            할인 정책
          </label>
          <div className="space-y-2">
            {productForm.discounts.map((discount, index) => (
              <AdminProductDiscount
                key={`${discount.quantity}-${discount.rate}-${index}`}
                discount={discount}
                index={index}
                productForm={productForm}
                setProductForm={setProductForm}
              />
            ))}
            <Button
              type="button"
              onClick={handleAddDiscount}
              variant="text_update"
              size="sm"
            >
              + 할인 추가
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            onClick={handleCancelForm}
            variant="secondary"
            size="md"
          >
            취소
          </Button>
          <Button type="submit" variant="success" size="md">
            {editingProduct === "new" ? "추가" : "수정"}
          </Button>
        </div>
      </form>
    </div>
  );
};
