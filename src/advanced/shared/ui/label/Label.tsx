import { LabelProps, getLabelClassName } from './Label.types';

export function Label({
  size = 'sm',
  className = '',
  children,
  ...props
}: LabelProps) {
  const labelClassName = getLabelClassName(size, className);

  return (
    <label className={labelClassName} {...props}>
      {children}
    </label>
  );
}
