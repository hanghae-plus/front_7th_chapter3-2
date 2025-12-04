import { useEffect, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductFormData } from "../schemas/productSchemas";
import { ProductWithUI } from "../../../lib/constants";
import { Input } from "../../../shared/components/ui/Input";
import { Button } from "../../../shared/components/ui/Button";

interface ProductFormProps {
  editingProduct: ProductWithUI | null;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
}

export function ProductForm({
  editingProduct,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const {
    register,
    control,
    formState: { errors },
    getValues,
    setError,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    mode: "onChange",
    defaultValues: editingProduct || {
      name: "",
      price: 0,
      stock: 0,
      description: "",
      discounts: [],
    },
  });

  const priceRef = useRef<string>(String(editingProduct?.price || "0"));

  useEffect(() => {
    if (editingProduct) {
      priceRef.current = String(editingProduct.price);
    }
  }, [editingProduct]);

  const { onChange: onPriceChange, ...priceRest } = register("price", {
    valueAsNumber: true,
  });

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Allow only numbers
    if (newValue !== "" && !/^\d+$/.test(newValue)) {
      e.target.value = priceRef.current;
      return;
    }
    priceRef.current = newValue;
    onPriceChange(e);
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "discounts",
  });

  const handleSyncSubmit = () => {
    const values = getValues();
    const result = productSchema.safeParse(values);

    if (result.success) {
      onSubmit(result.data);
    } else {
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".") as any;
        setError(path, { message: issue.message });
      });
    }
  };

  return (
    <div className="p-6 border-t border-gray-200 bg-gray-50">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSyncSubmit();
        }}
        className="space-y-4"
      >
        <h3 className="text-lg font-medium text-gray-900">
          {editingProduct ? "상품 수정" : "새 상품 추가"}
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상품명
            </label>
            <Input
              {...register("name")}
              error={errors.name?.message}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              설명
            </label>
            <Input
              {...register("description")}
              error={errors.description?.message}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              가격
            </label>
            <Input
              type="text"
              inputMode="numeric"
              {...priceRest}
              onChange={handlePriceChange}
              placeholder="숫자만 입력"
              error={errors.price?.message}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              재고
            </label>
            <Input
              type="number"
              {...register("stock", { valueAsNumber: true })}
              placeholder="숫자만 입력"
              error={errors.stock?.message}
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            할인 정책
          </label>
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center gap-2 bg-gray-50 p-2 rounded"
              >
                <input
                  type="number"
                  {...register(`discounts.${index}.quantity`, {
                    valueAsNumber: true,
                  })}
                  className="w-20 px-2 py-1 border rounded"
                  min="1"
                  placeholder="수량"
                />
                <span className="text-sm">개 이상 구매 시</span>
                <input
                  type="number"
                  {...register(`discounts.${index}.rate`, {
                    valueAsNumber: true,
                    setValueAs: (v) => v / 100,
                  })}
                  defaultValue={field.rate * 100}
                  className="w-16 px-2 py-1 border rounded"
                  min="0"
                  max="100"
                  placeholder="%"
                />
                <span className="text-sm">% 할인</span>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => append({ quantity: 10, rate: 0.1 })}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              + 할인 추가
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" onClick={onCancel} variant="secondary">
            취소
          </Button>
          <Button type="button" onClick={handleSyncSubmit} variant="indigo">
            {editingProduct ? "수정" : "추가"}
          </Button>
        </div>
      </form>
    </div>
  );
}
