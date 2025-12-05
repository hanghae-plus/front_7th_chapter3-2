import { Coupon } from "../../../types";
import { CouponCard } from "../../coupon/components/CouponCard";
import { CouponForm } from "../../coupon/components/CouponForm";
import { CouponFormData } from "../../coupon/schemas/couponSchemas";
import {
  Card,
  CardHeader,
  CardContent,
} from "../../../shared/components/ui/Card";

interface CouponGridProps {
  coupons: Coupon[];
  showForm: boolean;
  onToggleForm: () => void;
  onDelete: (code: string) => void;
  onAdd: (data: CouponFormData) => void;
  onCancelForm: () => void;
}

export function CouponGrid({
  coupons,
  showForm,
  onToggleForm,
  onDelete,
  onAdd,
  onCancelForm,
}: CouponGridProps) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map((coupon) => (
            <CouponCard key={coupon.code} coupon={coupon} onDelete={onDelete} />
          ))}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
            <button
              onClick={onToggleForm}
              className="text-gray-400 hover:text-gray-600 flex flex-col items-center"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
            </button>
          </div>
        </div>

        {showForm && <CouponForm onSubmit={onAdd} onCancel={onCancelForm} />}
      </CardContent>
    </Card>
  );
}
