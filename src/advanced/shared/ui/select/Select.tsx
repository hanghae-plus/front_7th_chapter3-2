import { SelectProps, getSelectClassName } from './Select.types';

export function Select({ className = '', children, ...props }: SelectProps) {
  const selectClassName = getSelectClassName(className);

  return (
    <select className={selectClassName} {...props}>
      {children}
    </select>
  );
}
