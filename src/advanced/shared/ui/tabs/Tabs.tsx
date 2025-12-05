import React, { createContext, useContext, useState } from 'react';

// Context 생성
interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (context === undefined) {
    throw new Error('Tabs compound components must be used within Tabs');
  }
  return context;
}

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
  children: React.ReactNode;
  className?: string;
}

const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  children,
  className = '',
}) => {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
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
  children: React.ReactNode;
  className?: string;
}

const TabsContent: React.FC<TabsContentProps> = ({
  value,
  children,
  className = '',
}) => {
  const { activeTab } = useTabsContext();

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

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

// Compound components로 export
Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;
