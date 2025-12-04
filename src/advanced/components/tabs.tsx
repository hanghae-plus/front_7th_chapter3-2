import { createContext, ReactNode, useContext } from 'react';

interface TabsContextValue<T extends string> {
  activeTab: T;
  setActiveTab: (tab: T) => void;
}

interface TabsProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  children: ReactNode;
}

interface TabListProps {
  children: ReactNode;
}

interface TabProps<T extends string> {
  value: T;
  children: ReactNode;
}

interface TabPanelProps<T extends string> {
  value: T;
  children: ReactNode;
}

// NOTE: Compound Component 패턴에서 Context는 컴포넌트 간 내부 통신용 private 구현입니다.
// 외부에서 직접 사용하지 않으므로 컴포넌트와 함께 두어 응집도를 높였습니다.
// 재사용 가능한 로직(useTabs)은 별도 hooks로 분리하여 관심사를 분리했습니다.
const TabsContext = createContext<TabsContextValue<any> | null>(null);

const useTabsContext = <T extends string>() => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tab components must be used within Tabs');
  }

  // NOTE: Tabs 컴포넌트가 제네릭 타입 T를 Provider에 전달하도록 Context 생성 시점에 any를 사용했습니다.
  return context as TabsContextValue<T>;
};

export const Tabs = <T extends string>({ value, onChange, children }: TabsProps<T>) => {
  return <TabsContext.Provider value={{ activeTab: value, setActiveTab: onChange }}>{children}</TabsContext.Provider>;
};

export const TabList = ({ children }: TabListProps) => {
  return (
    <div className='border-b border-gray-200 mb-6'>
      <nav className='-mb-px flex space-x-8'>{children}</nav>
    </div>
  );
};

export const Tab = <T extends string>({ value, children }: TabProps<T>) => {
  const { activeTab, setActiveTab } = useTabsContext<T>();
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
        isActive ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      {children}
    </button>
  );
};

export const TabPanel = <T extends string>({ value, children }: TabPanelProps<T>) => {
  const { activeTab } = useTabsContext<T>();

  if (activeTab !== value) return null;

  return <>{children}</>;
};
