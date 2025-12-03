import { useState } from 'react';

const useTabs = <T extends string>(initialTab: T) => {
  const [activeTab, setActiveTab] = useState<T>(initialTab);

  const isActiveTab = (tab: T) => activeTab === tab;

  return {
    activeTab,
    setActiveTab,
    isActiveTab
  };
};

export default useTabs;
