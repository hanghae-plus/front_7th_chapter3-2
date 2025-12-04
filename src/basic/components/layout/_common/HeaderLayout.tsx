import { type FC, ReactNode } from "react";

interface IProps {
  left?: ReactNode;
  right?: ReactNode;
}

const HeaderLayout: FC<IProps> = ({ left, right }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center flex-1">
            <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
            {left}
          </div>
          <nav className="flex items-center space-x-4">{right}</nav>
        </div>
      </div>
    </header>
  );
};

export default HeaderLayout;
