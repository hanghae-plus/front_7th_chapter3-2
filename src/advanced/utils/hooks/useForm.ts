import { useState } from "react";

export function useForm<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = <K extends keyof T>(
    field: K,
    value: T[K],
    transform?: (v: any) => T[K]
  ) => {
    setValues((prev) => ({
      ...prev,
      [field]: transform ? transform(value) : value,
    }));
  };

  const resetForm = () => setValues(initialValues);

  return { values, handleChange, resetForm, setValues };
}
