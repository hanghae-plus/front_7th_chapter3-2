import { useCallback, useState } from 'react';
import { PAGES } from '../constants/pages';

type PageType = keyof typeof PAGES;

// NOTE: 확장성과 유지보수성을 위해 개별 boolean 플래그 대신 PageType 기반으로 관리하도록 설계했습니다.
// - 기존: isAdmin (boolean) -> 페이지가 늘어날 때마다 새로운 플래그나 분기 로직을 추가 필요
// - 개선: PageType 기반으로 설계 -> PAGES만 확장하면 되므로 로직 변경 없이 대응 가능
const usePage = (initialPage: PageType = PAGES.store) => {
  const [currentPage, setCurrentPage] = useState<PageType>(initialPage);

  const switchPage = useCallback((page: PageType) => {
    setCurrentPage(page);
  }, []);

  const isCurrentPage = useCallback((page: PageType) => currentPage === page, [currentPage]);

  return {
    currentPage,
    setCurrentPage,
    switchPage,
    isCurrentPage
  };
};

export default usePage;
