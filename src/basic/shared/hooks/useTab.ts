import { ComponentType, useState } from 'react';

export interface TabItem<T = unknown> {
  id: string;
  label: string;
  component: ComponentType<T>;
}

export const useTab = <T = unknown>(
  tabs: TabItem<T>[],
  initialTabId?: string
) => {
  const initialTab = initialTabId
    ? tabs.find((tab) => tab.id === initialTabId) || tabs[0]
    : tabs[0];

  const [activeTab, setActiveTab] = useState<TabItem<T>>(initialTab);

  const changeTab = (tabId: string) => {
    const targetTab = tabs.find((tab) => tab.id === tabId);
    if (targetTab) {
      setActiveTab(targetTab);
    }
  };

  return {
    activeTab,
    changeTab,
    ActiveComponent: activeTab.component,
  };
};
