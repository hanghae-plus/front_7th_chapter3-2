export const ADMIN_TABS = {
  PRODUCTS: "products",
  COUPONS: "coupons",
} as const;

export type AdminTab = (typeof ADMIN_TABS)[keyof typeof ADMIN_TABS];

export interface AdminTabConfig {
  id: AdminTab;
  label: string;
}

export const ADMIN_TAB_CONFIGS: AdminTabConfig[] = [
  { id: ADMIN_TABS.PRODUCTS, label: "상품 관리" },
  { id: ADMIN_TABS.COUPONS, label: "쿠폰 관리" },
];
