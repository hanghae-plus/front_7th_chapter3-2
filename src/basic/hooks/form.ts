import { useState } from 'react';

interface UseFormProps<T> {
  initialForm: T;
  onSubmit: (formData: T) => void;
}

const useForm = <T>({ initialForm, onSubmit }: UseFormProps<T>) => {
  const [form, setForm] = useState<T>({ ...initialForm });

  const resetForm = () => setForm({ ...initialForm });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    resetForm();
  };

  return {
    form,
    setForm,
    resetForm,
    handleSubmit
  };
};

export default useForm;
