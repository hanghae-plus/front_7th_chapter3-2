import { ComponentType, useCallback, useState } from 'react';

export interface PageItem<T = Record<string, unknown>> {
  id: string;
  name: string;
  component: ComponentType<T>;
}

export const usePage = <T = Record<string, unknown>>(
  pages: PageItem<T>[],
  initialPageId?: string
) => {
  const initialPage = initialPageId
    ? pages.find((page) => page.id === initialPageId) || pages[0]
    : pages[0];

  const [currentPage, setCurrentPage] = useState<PageItem<T>>(initialPage);

  const goPage = useCallback(
    (id: string) => {
      const targetPage = pages.find((page) => page.id === id);
      if (targetPage) {
        setCurrentPage(targetPage);
      }
    },
    [pages]
  );

  return {
    currentPage,
    goPage,
    PageComponent: currentPage.component,
  };
};
