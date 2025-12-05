import { ComponentType, createContext, useContext, ReactNode } from 'react';
import { usePage, PageItem } from '@/shared/hooks';

interface PageContextValue {
  currentPage: PageItem;
  goPage: (id: string) => void;
  PageComponent: ComponentType;
}

const PageContext = createContext<PageContextValue | null>(null);

export const PageProvider = ({
  pages,
  initialPageId,
  children,
}: {
  pages: PageItem[];
  initialPageId?: string;
  children: ReactNode;
}) => {
  const pageState = usePage(pages, initialPageId);

  return (
    <PageContext.Provider value={pageState}>{children}</PageContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error('useRouter must be used within PageProvider');
  }
  return context;
};
