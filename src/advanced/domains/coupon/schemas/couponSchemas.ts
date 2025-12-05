import { z } from "zod";

export const couponSchema = z
  .object({
    name: z.string().min(1, "쿠폰명을 입력해주세요"),
    code: z.string().min(1, "쿠폰 코드를 입력해주세요"),
    discountType: z.enum(["amount", "percentage"]),
    discountValue: z.number().min(0, "할인 값은 0 이상이어야 합니다"),
  })
  .refine(
    (data) => data.discountType !== "percentage" || data.discountValue <= 100,
    {
      message: "할인율은 100%를 초과할 수 없습니다",
      path: ["discountValue"],
    }
  )
  .refine(
    (data) => data.discountType !== "amount" || data.discountValue <= 100000,
    {
      message: "할인 금액은 100,000원을 초과할 수 없습니다",
      path: ["discountValue"],
    }
  );

export type CouponFormData = z.infer<typeof couponSchema>;
