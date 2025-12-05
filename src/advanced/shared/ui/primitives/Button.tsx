import { cva, type VariantProps } from 'class-variance-authority';
import { ComponentProps, forwardRef } from 'react';

const buttonVariants = cva(
  'rounded-md font-medium transition-colors disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary:
          'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-100 disabled:text-gray-400',
        secondary:
          'border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200',
        danger:
          'bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-100 disabled:text-gray-400',
        ghost:
          'text-gray-700 hover:bg-gray-100 disabled:text-gray-400 disabled:bg-transparent',
        dark: 'bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-100 disabled:text-gray-400',
      },
      size: {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends ComponentProps<'button'>, VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, className })}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
