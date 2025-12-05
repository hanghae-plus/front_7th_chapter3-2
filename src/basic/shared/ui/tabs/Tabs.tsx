import React, { useState } from 'react';

// TabsList 컴포넌트
interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

const TabsList: React.FC<TabsListProps> = ({ children, className = '' }) => {
  return (
    <div className={`border-b border-gray-200 ${className}`}>
      <nav className="-mb-px flex space-x-8">{children}</nav>
    </div>
  );
};

// TabsTrigger 컴포넌트
interface TabsTriggerProps {
  value: string;
  activeTab?: string;
  onTabChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  activeTab = '',
  onTabChange = () => {},
  children,
  className = '',
}) => {
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => onTabChange(value)}
      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
        isActive
          ? 'border-gray-900 text-gray-900'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      } ${className}`}
    >
      {children}
    </button>
  );
};

// TabsContent 컴포넌트
interface TabsContentProps {
  value: string;
  activeTab?: string;
  children: React.ReactNode;
  className?: string;
}

const TabsContent: React.FC<TabsContentProps> = ({
  value,
  activeTab = '',
  children,
  className = '',
}) => {
  if (activeTab !== value) return null;

  return <div className={className}>{children}</div>;
};

// 메인 Tabs 컴포넌트
interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ defaultValue, children, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  // children을 순회하면서 props 전달
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === Tabs.List) {
        // TabsList의 children에도 props 전달
        const listChildren = React.Children.map(
          (child as any).props.children,
          (listChild) => {
            if (
              React.isValidElement(listChild) &&
              listChild.type === Tabs.Trigger
            ) {
              return React.cloneElement(
                listChild as React.ReactElement<TabsTriggerProps>,
                {
                  activeTab,
                  onTabChange: setActiveTab,
                }
              );
            }
            return listChild;
          }
        );
        return React.cloneElement(child, {}, listChildren);
      }

      if (child.type === Tabs.Content) {
        return React.cloneElement(
          child as React.ReactElement<TabsContentProps>,
          { activeTab }
        );
      }
    }
    return child;
  });

  return <div className={className}>{childrenWithProps}</div>;
}

// Compound components로 export
Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;
