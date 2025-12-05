import { ReactNode } from 'react';

interface TableProps {
  children: ReactNode;
}

interface TableHeaderProps {
  children: ReactNode;
}

interface TableBodyProps {
  children: ReactNode;
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

interface TableHeadProps {
  children: ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

interface TableCellProps {
  children: ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const Table = ({ children }: TableProps) => {
  return (
    <div className='overflow-x-auto'>
      <table className='w-full'>{children}</table>
    </div>
  );
};

export const TableHeader = ({ children }: TableHeaderProps) => {
  return <thead className='bg-gray-50 border-b border-gray-200'>{children}</thead>;
};

export const TableBody = ({ children }: TableBodyProps) => {
  return <tbody className='bg-white divide-y divide-gray-200'>{children}</tbody>;
};

export const TableRow = ({ children, className = '', onClick }: TableRowProps) => {
  const baseClass = 'hover:bg-gray-50';
  const combinedClass = `${baseClass} ${className}`.trim();

  return (
    <tr className={combinedClass} onClick={onClick}>
      {children}
    </tr>
  );
};

export const TableHead = ({ children, align = 'left', className = '' }: TableHeadProps) => {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }[align];

  const baseClass = 'px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider';
  const combinedClass = `${baseClass} ${alignClass} ${className}`.trim();

  return <th className={combinedClass}>{children}</th>;
};

export const TableCell = ({ children, align = 'left', className = '' }: TableCellProps) => {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }[align];

  const baseClass = 'px-6 py-4 whitespace-nowrap text-sm';
  const combinedClass = `${baseClass} ${alignClass} ${className}`.trim();

  return <td className={combinedClass}>{children}</td>;
};
