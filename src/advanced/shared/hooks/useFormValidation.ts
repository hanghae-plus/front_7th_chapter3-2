/**
 * Shared Hook - useFormValidation
 * 
 * 폼 전체 유효성 검증 + 에러 상태 관리
 */

import { useState, useCallback } from 'react';
import { ValidationResult } from '../utils/validators';

interface FormErrors {
  [key: string]: string | undefined;
}

export const useFormValidation = () => {
  const [errors, setErrors] = useState<FormErrors>({});

  /**
   * 특정 필드 검증
   */
  const validateField = useCallback(
    (fieldName: string, validator: () => ValidationResult) => {
      const result = validator();
      
      setErrors(prev => ({
        ...prev,
        [fieldName]: result.isValid ? undefined : result.errorMessage
      }));
      
      return result.isValid;
    },
    []
  );

  /**
   * 여러 필드 동시 검증
   */
  const validateFields = useCallback(
    (validations: Array<{ fieldName: string; validator: () => ValidationResult }>) => {
      const newErrors: FormErrors = {};
      let isValid = true;

      validations.forEach(({ fieldName, validator }) => {
        const result = validator();
        if (!result.isValid) {
          newErrors[fieldName] = result.errorMessage;
          isValid = false;
        }
      });

      setErrors(newErrors);
      return isValid;
    },
    []
  );

  /**
   * 에러 초기화
   */
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * 특정 필드 에러 제거
   */
  const clearFieldError = useCallback((fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  /**
   * 폼이 유효한지 확인
   */
  const hasErrors = Object.values(errors).some(error => error !== undefined);

  return {
    errors,
    validateField,
    validateFields,
    clearErrors,
    clearFieldError,
    hasErrors,
  };
};
