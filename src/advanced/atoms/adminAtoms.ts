import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { ProductWithUI } from '../constants';
import { ProductFormData, CouponFormData, EMPTY_PRODUCT_FORM, EMPTY_COUPON_FORM } from '../components/features/admin/types';
import { Coupon } from '../../types';
import { initialCoupons } from '../constants';

// 기본 Atoms
export const isAdminAtom = atom<boolean>(false); //유저가 누구인지 체크

export const activeTabAtom = atom<'products' | 'coupons'>('products'); //모드가 두개 인 탭

export const showProductFormAtom = atom<boolean>(false); //상품 폼 보여주기

export const showCouponFormAtom = atom<boolean>(false); // 쿠폰 폼 보여주기

export const editingProductAtom = atom<string | 'new' | null>(null); //수정중일때 모드가 3개이다.

export const productFormAtom = atom<ProductFormData>(EMPTY_PRODUCT_FORM); // 빈폼 초기값

export const couponFormAtom = atom<CouponFormData>(EMPTY_COUPON_FORM); //빈폼 초기값

// localStorage와 자동 동기화되는 atom
export const couponsAtom = atomWithStorage<Coupon[]>('coupons', initialCoupons);

// Write-only Atoms (액션)
export const toggleAdminAtom = atom( //관리자로 전환 토글
  null,
  (get, set) => {
    const isAdmin = get(isAdminAtom);
    set(isAdminAtom, !isAdmin);
  }
);
// 토글이니깐 얻은 값의 반댓 값을 셋팅 하는 것
export const setActiveTabAtom = atom( // 활성 탭 설정
  null,
  (get, set, tab: 'products' | 'coupons') => {
    set(activeTabAtom, tab);
  }
);
// tab의 값에 따른 현재활성화 탭 설정 변경
export const startEditProductAtom = atom( // 상품 수정 모드 시작
  null,
  (get, set, product: ProductWithUI) => {
    set(editingProductAtom, product.id);
    set(productFormAtom, {
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      discounts: product.discounts || []
    });
    set(showProductFormAtom, true);
  }
);
// 1. 수정중인 상품 추적
// 2.상품의 폼을 채우기
// 3. 상품 폼을 화면에 보여주기 
export const resetProductFormAtom = atom( //상품 데이터 초기화 폼
  null,
  (get, set) => {
    set(productFormAtom, EMPTY_PRODUCT_FORM);
    set(editingProductAtom, null);
    set(showProductFormAtom, false);
  }
);
// 1. 상품의 폼을 빈 값으로 초기화
// 2. 수정 중인 상품를 null로 설정
// 3. 상품폼을 화면에서 가리기
export const resetCouponFormAtom = atom( // 쿠폰 데이터 초기화 폼
  null,
  (get, set) => {
    set(couponFormAtom, EMPTY_COUPON_FORM);
    set(showCouponFormAtom, false);
  }
);
// 1. 쿠폰의 폼을 빈 값으로 초기화
// 2. 쿠폰의 폼 가리기
export const handleAddProductAtom = atom( //상품 추가 핸들러
  null,
  (get, set) => {
    set(editingProductAtom, 'new');
    set(productFormAtom, EMPTY_PRODUCT_FORM);
    set(showProductFormAtom, true);
  }
);
// 1. 새 상품 추가 모드"를 활성화
// 2. 상품의 폼을 빈 값으로 초기화
// 3. 상품의 폼을 보여주기
export const handleUpdateProductAtom = atom( //상품 업데이트 핸들러
  null,
  (get, set, productId: string, updates: Partial<ProductWithUI>) => {
    // productAtoms의 updateProductAtom을 직접 import해서 사용
    // 이건 컴포넌트에서 조합해서 사용할 예정
  }
);

export const handleDeleteProductAtom = atom( //상품 삭제 핸들러
  null,
  (get, set, productId: string) => {
    // productAtoms의 deleteProductAtom을 직접 import해서 사용
    // 이건 컴포넌트에서 조합해서 사용할 예정
  }
);

export const handleAddCouponAtom = atom( //쿠폰 추가 핸들러
  null,
  (get, set) => {
    set(couponFormAtom, EMPTY_COUPON_FORM);
    set(showCouponFormAtom, true);
  }
);

export const handleDeleteCouponAtom = atom( //쿠폰 삭제 핸들러
  null,
  (get, set, couponCode: string) => {
    const coupons = get(couponsAtom);
    const existingCoupon = coupons.find(c => c.code === couponCode);
    if (!existingCoupon) {
      return { success: false, message: '존재하지 않는 쿠폰입니다.' };
    }
    const newCoupons = coupons.filter(c => c.code !== couponCode);
    set(couponsAtom, newCoupons);
    return { success: true, message: '쿠폰이 삭제되었습니다.' };
  }
);
// 1. couponsAtom에서 전체 쿠폰 목록을 읽어옴
// 2. 삭제하려는 couponCode와 일치하는 쿠폰을 찾음
// 3. 쿠폰이 존재하지 않으면 { success: false, message: '존재하지 않는 쿠폰입니다.' } 반환
// 4. filter를 사용하여 삭제할 쿠폰(c.code === couponCode)을 제외한 새 배열 생성
// 5. couponsAtom을 삭제된 쿠폰이 제외된 새 목록으로 업데이트
// 6. { success: true, message: '쿠폰이 삭제되었습니다.' } 반환
