import React from 'react';

interface TabsProps {
  children: React.ReactNode;
  value: string;
  onChange: (value: any) => void;
}

interface TabsSubComponents {
  List: React.FC<{ children: React.ReactNode }>;
  Tab: React.FC<{ value: string; children: React.ReactNode }>;
}

interface TabsContextValue {
  activeValue: string;
  onChange: (value: any) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

const useTabsContext = () => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs compound components must be used within Tabs');
  }
  return context;
};

export const Tabs: React.FC<TabsProps> & TabsSubComponents = ({
  children,
  value,
  onChange,
}) => {
  return (
    <TabsContext.Provider value={{ activeValue: value, onChange }}>
      {children}
    </TabsContext.Provider>
  );
};

Tabs.List = ({ children }) => {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">{children}</nav>
    </div>
  );
};

Tabs.Tab = ({ value, children }) => {
  const { activeValue, onChange } = useTabsContext();
  const isActive = activeValue === value;

  return (
    <button
      onClick={() => onChange(value)}
      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
        isActive
          ? 'border-gray-900 text-gray-900'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      {children}
    </button>
  );
};
