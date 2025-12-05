import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { couponSchema, CouponFormData } from "../schemas/couponSchemas";
import { Input } from "../../../shared/components/ui/Input";
import { Select } from "../../../shared/components/ui/Select";
import { Button } from "../../../shared/components/ui/Button";

interface CouponFormProps {
  onSubmit: (data: CouponFormData) => void;
  onCancel: () => void;
}

export function CouponForm({ onSubmit, onCancel }: CouponFormProps) {
  const {
    register,
    watch,
    formState: { errors },
    getValues,
    setError,
  } = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      code: "",
      discountType: "amount",
      discountValue: 0,
    },
  });

  const discountType = watch("discountType");

  const handleSyncSubmit = () => {
    const values = getValues();
    const result = couponSchema.safeParse(values);

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
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSyncSubmit();
        }}
        className="space-y-4"
      >
        <h3 className="text-md font-medium text-gray-900">새 쿠폰 생성</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              쿠폰명
            </label>
            <Input
              {...register("name")}
              placeholder="신규 가입 쿠폰"
              error={errors.name?.message}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              쿠폰 코드
            </label>
            <Input
              {...register("code", {
                onChange: (e) => {
                  e.target.value = e.target.value.toUpperCase();
                },
              })}
              placeholder="WELCOME2024"
              className="font-mono"
              error={errors.code?.message}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              할인 타입
            </label>
            <Select
              {...register("discountType")}
              error={errors.discountType?.message}
            >
              <option value="amount">정액 할인</option>
              <option value="percentage">정률 할인</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {discountType === "amount" ? "할인 금액" : "할인율(%)"}
            </label>
            <Input
              type="number"
              {...register("discountValue", { valueAsNumber: true })}
              placeholder={discountType === "amount" ? "5000" : "10"}
              error={errors.discountValue?.message}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button type="button" onClick={onCancel} variant="secondary">
            취소
          </Button>
          <Button type="button" onClick={handleSyncSubmit} variant="indigo">
            쿠폰 생성
          </Button>
        </div>
      </form>
    </div>
  );
}
