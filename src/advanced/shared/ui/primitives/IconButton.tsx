import { cva, type VariantProps } from 'class-variance-authority';
import { ComponentProps, forwardRef, ReactNode } from 'react';

const iconButtonVariants = cva(
  'flex items-center justify-center transition-colors',
  {
    variants: {
      variant: {
        default: 'text-gray-400 hover:text-gray-600',
        danger: 'text-red-600 hover:text-red-800',
        ghost: 'text-white hover:text-gray-200',
        bordered:
          'border border-gray-300 hover:bg-gray-100 text-gray-700 rounded',
      },
      size: {
        sm: 'w-5 h-5',
        md: 'w-6 h-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface IconButtonProps
  extends ComponentProps<'button'>, VariantProps<typeof iconButtonVariants> {
  icon: ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant, size, icon, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={iconButtonVariants({ variant, size, className })}
        {...props}
      >
        {icon}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
