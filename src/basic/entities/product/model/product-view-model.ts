import { StockStatus } from './product-utils';

/** UI 표시용 상품 ViewModel */
export interface ProductViewModel {
  id: string;
  name: string;
  description?: string;
  isRecommended?: boolean;

  /** 표시용 가격 ("₩10,000" or "SOLD OUT") */
  displayPrice: string;

  /** 최대 할인율 배지 텍스트 ("~10%" or null) */
  maxDiscountBadge: string | null;

  /** 첫 번째 할인 안내 메시지 */
  firstDiscountMessage: string | null;

  /** 재고 상태 UI 데이터 */
  stockStatus: {
    /** 재고 상태 ('sufficient' | 'low' | 'out') */
    status: StockStatus;
    /** 배지 스타일 CSS 클래스 */
    badgeClass: string;
    /** 재고 표시 텍스트 ("재고 20개" or "품절임박! 3개 남음") */
    displayText: string;
    /** 재고 수량 */
    count: number;
  };

  /** 장바구니 버튼 활성화 여부 */
  isAddToCartDisabled: boolean;

  /** 버튼 텍스트 ("장바구니 담기" or "품절") */
  buttonText: string;
}
