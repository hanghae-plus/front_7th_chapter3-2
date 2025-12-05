import { InputProps, getInputClassName } from './Input.types';

export function Input({
  size = 'full',
  type = 'text',
  className = '',
  ...props
}: InputProps) {
  const inputClassName = getInputClassName(size, className);

  return <input type={type} className={inputClassName} {...props} />;
}
