import clsx from 'clsx';
import { ComponentProps } from 'react';

export const Input = ({
  className,
  type,
  ...props
}: ComponentProps<'input'>) => {
  return (
    <input
      type={type}
      className={clsx(
        className,
        'w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm'
      )}
      {...props}
    />
  );
};
