import { useState } from 'react';

const useTabs = <T extends string>(initialTab: T) => {
  const [activeTab, setActiveTab] = useState<T>(initialTab);

  return {
    activeTab,
    setActiveTab
  };
};

export default useTabs;
