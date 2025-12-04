/**
 * 편집 모드에 따른 폼 제목을 반환합니다.
 */
export const getProductFormTitle = (editingProduct: string | null): string => {
  return editingProduct === 'new' ? '새 상품 추가' : '상품 수정';
};

/**
 * 편집 모드에 따른 제출 버튼 텍스트를 반환합니다.
 */
export const getProductFormSubmitText = (editingProduct: string | null): string => {
  return editingProduct === 'new' ? '추가' : '수정';
};

/**
 * 편집 모드인지 확인합니다.
 */
export const isNewProduct = (editingProduct: string | null): boolean => {
  return editingProduct === 'new';
};

/**
 * 편집 중인 상품인지 확인합니다.
 */
export const isEditingProduct = (editingProduct: string | null): boolean => {
  return editingProduct !== null && editingProduct !== 'new';
};

