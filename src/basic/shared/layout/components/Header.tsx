import { ReactNode } from "react";

type HeaderProps = {
  title: string;
  middleAccessory: ReactNode;
  rightAccessory: ReactNode;
};

export function Header({
  title,
  middleAccessory,
  rightAccessory,
}: HeaderProps) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center flex-1">
            <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
            {middleAccessory}
          </div>
          <nav className="flex items-center space-x-4">{rightAccessory}</nav>
        </div>
      </div>
    </header>
  );
}
