import { ReactNode } from 'react';

interface HeaderProps {
  nav: ReactNode;
  children?: ReactNode;
}

const Header = ({ nav, children }: HeaderProps) => {
  return (
    <header className='bg-white shadow-sm sticky top-0 z-40 border-b'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center flex-1'>
            <h1 className='text-xl font-semibold text-gray-800'>SHOP</h1>
            {children && <div className='ml-8 flex-1 max-w-md'>{children}</div>}
          </div>
          <nav className='flex items-center space-x-4'>{nav}</nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
