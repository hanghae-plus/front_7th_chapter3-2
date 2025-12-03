import { useState, useEffect } from "react";

// Shared
import { ProductWithUI } from "../../../entities/product/model/types";

// 초기값 상수
const INITIAL_FORM_STATE: ProductWithUI = {
  id: "", // 폼에서는 사용 안 함
  name: "",
  price: 0,
  stock: 0,
  description: "",
  discounts: [],
  isRecommended: false,
};

interface UseProductFormProps {
  initialData?: ProductWithUI | null;
  onNotification: (message: string, type?: "error" | "success" | "warning") => void;
}

/**
 * 상품 입력 폼의 상태와 로직을 관리하는 커스텀 훅 (Feature Model)
 * @param initialData 수정 시 채워넣을 초기 데이터
 * @param onNotification 유효성 검사 실패 시 알림
 */
export const useProductForm = ({ initialData, onNotification }: UseProductFormProps) => {
  const [productForm, setProductForm] = useState<ProductWithUI>(INITIAL_FORM_STATE);

  // 수정 모드일 때 초기 데이터 주입
  useEffect(() => {
    if (initialData) {
      setProductForm(initialData);
    } else {
      setProductForm(INITIAL_FORM_STATE);
    }
  }, [initialData]);

  const resetForm = () => {
    setProductForm(INITIAL_FORM_STATE);
  };

  /**
   * 텍스트 입력 핸들러
   */
  const handleChange = (field: keyof ProductWithUI, value: any) => {
    setProductForm((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * 숫자 입력 핸들러 (유효성 검사 포함)
   */
  const handleNumberChange = (field: keyof ProductWithUI, value: string) => {
    if (value === "" || /^\d+$/.test(value)) {
      const parsedValue = value === "" ? 0 : parseInt(value);
      setProductForm((prev) => ({ ...prev, [field]: parsedValue }));
    }
  };

  /**
   * 숫자 필드 Blur 핸들러 (값 보정 및 알림)
   */
  const handleNumberBlur = (field: keyof ProductWithUI, value: number, label: string) => {
    if (Number.isNaN(value) || value === 0) { // 빈 값 처리
       // 0 허용 여부에 따라 로직이 다를 수 있음. 여기선 0으로 리셋
       setProductForm((prev) => ({ ...prev, [field]: 0 }));
       return;
    }

    if (value < 0) {
      onNotification(`${label}은 0보다 커야 합니다`, "error");
      setProductForm((prev) => ({ ...prev, [field]: 0 }));
    } 
    
    // 재고 9999 제한 (비즈니스 규칙)
    if (field === "stock" && value > 9999) {
       onNotification("재고는 9999개를 초과할 수 없습니다", "error");
       setProductForm((prev) => ({ ...prev, stock: 9999 }));
    }
  };

  /**
   * 할인 추가 핸들러
   */
  const addDiscount = () => {
    setProductForm((prev) => ({
      ...prev,
      discounts: [...prev.discounts, { quantity: 10, rate: 0.1 }],
    }));
  };

  /**
   * 할인 제거 핸들러
   */
  const removeDiscount = (index: number) => {
    setProductForm((prev) => ({
      ...prev,
      discounts: prev.discounts.filter((_, i) => i !== index),
    }));
  };

  /**
   * 할인 아이템 변경 핸들러
   */
  const updateDiscount = (index: number, field: "quantity" | "rate", value: number) => {
    setProductForm((prev) => {
      const newDiscounts = [...prev.discounts];
      newDiscounts[index][field] = value;
      return { ...prev, discounts: newDiscounts };
    });
  };

  return {
    productForm,
    handleChange,
    handleNumberChange,
    handleNumberBlur,
    addDiscount,
    removeDiscount,
    updateDiscount,
    resetForm,
  };
};