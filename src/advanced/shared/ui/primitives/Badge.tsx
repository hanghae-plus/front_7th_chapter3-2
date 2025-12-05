import { cva, type VariantProps } from 'class-variance-authority';
import { ComponentProps } from 'react';

const badgeVariants = cva('inline-block rounded font-medium', {
  variants: {
    variant: {
      red: 'bg-red-500 text-white',
      orange: 'bg-orange-500 text-white',
      green: 'bg-green-500 text-white',
      blue: 'bg-blue-500 text-white',
      gray: 'bg-gray-500 text-white',
      yellow: 'bg-yellow-500 text-white',
    },
    size: {
      sm: 'text-xs px-2 py-1',
      md: 'text-sm px-2.5 py-1.5',
    },
  },
  defaultVariants: {
    variant: 'gray',
    size: 'sm',
  },
});

export interface BadgeProps
  extends ComponentProps<'span'>, VariantProps<typeof badgeVariants> {}

export const Badge = ({
  variant,
  size,
  className,
  children,
  ...props
}: BadgeProps) => {
  return (
    <span className={badgeVariants({ variant, size, className })} {...props}>
      {children}
    </span>
  );
};
