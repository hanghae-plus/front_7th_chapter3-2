import { useState, useCallback } from "react";

/**
 * 폼 검증을 위한 커스텀 훅
 * @param initialValues 초기 값들
 * @param validators 검증 함수들
 * @returns 검증 상태와 함수들
 */
export function useValidate<T extends Record<string, any>>(
  initialValues: T,
  validators?: Partial<Record<keyof T, (value: any) => string | null>>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const setValue = useCallback(
    (name: keyof T, value: any) => {
      setValues((prev) => ({ ...prev, [name]: value }));
      
      // 값이 변경되면 해당 필드의 에러 제거
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const setFieldTouched = useCallback((name: keyof T) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const validateField = useCallback(
    (name: keyof T): string | null => {
      if (!validators || !validators[name]) {
        return null;
      }

      const validator = validators[name];
      if (!validator) {
        return null;
      }

      return validator(values[name]);
    },
    [values, validators]
  );

  const validateAll = useCallback((): boolean => {
    if (!validators) {
      return true;
    }

    const newErrors: Partial<Record<keyof T, string>> = {};

    Object.keys(validators).forEach((key) => {
      const fieldName = key as keyof T;
      const error = validateField(fieldName);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [validators, validateField]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    validateField,
    validateAll,
    reset,
    isValid: Object.keys(errors).length === 0,
  };
}

