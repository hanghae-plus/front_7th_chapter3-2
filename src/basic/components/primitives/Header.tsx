import React from 'react';

interface HeaderProps {
  children: React.ReactNode;
}

interface HeaderSubComponents {
  Left: React.FC<{ children: React.ReactNode }>;
  Right: React.FC<{ children: React.ReactNode }>;
}

export const Header: React.FC<HeaderProps> & HeaderSubComponents = ({
  children,
}) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">{children}</div>
      </div>
    </header>
  );
};

Header.Left = ({ children }) => {
  return <div className="flex items-center flex-1">{children}</div>;
};

Header.Right = ({ children }) => {
  return <nav className="flex items-center space-x-4">{children}</nav>;
};
