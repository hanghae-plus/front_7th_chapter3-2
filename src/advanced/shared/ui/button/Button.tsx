import { ButtonProps, getButtonClassName } from './Button.types';

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  type = 'button',
  disabled = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const buttonClassName = getButtonClassName(
    variant,
    size,
    fullWidth,
    disabled,
    className
  );

  return (
    <button
      type={type}
      disabled={disabled}
      className={buttonClassName}
      {...props}
    >
      {children}
    </button>
  );
}
