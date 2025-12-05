import { z } from "zod";

export const discountSchema = z.object({
  quantity: z.number().min(1, "수량은 1 이상이어야 합니다"),
  rate: z.number().min(0).max(1, "할인율은 0~1 사이여야 합니다"),
});

export const productSchema = z.object({
  name: z.string().min(1, "상품명을 입력해주세요"),
  price: z.number().min(0, "가격은 0 이상이어야 합니다"),
  stock: z
    .number()
    .min(0, "재고는 0 이상이어야 합니다")
    .max(9999, "재고는 9999개를 초과할 수 없습니다"),
  description: z.string().optional(),
  discounts: z.array(discountSchema),
});

export type ProductFormData = z.infer<typeof productSchema>;
export type DiscountFormData = z.infer<typeof discountSchema>;
