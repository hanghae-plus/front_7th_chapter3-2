import { create } from 'zustand';

interface SearchContext {
  searchTerm: string;
}

interface SearchActions {
  setSearchTerm: (term: string) => void;
  clearSearchTerm: () => void;
}

interface SearchStore {
  context: SearchContext;
  actions: SearchActions;
}

const initialContext: SearchContext = {
  searchTerm: ''
};

// NOTE: searchTerm을 전역 상태로 관리하는 이유
// - searchTerm은 Header의 검색 인풋, StorePage의 ProductList 처럼 서로 다른 서브트리에 위치한 컴포넌트들이 함께 사용하는 값이기 때문에,
//   props로 전달하려면 App까지 거슬러 올라가는 구조가 되는데, 검색 기능은 App의 책임이 아니므로 이러한 전달 방식은 적절하지 않다고 판단했습니다.
// - 검색 입력과 상품 목록은 한쪽이 다른 쪽의 내부 상태를 몰라도 되는 서로 독립적으로 동작하는 UI 모듈이지만 동일한 검색 상태를 참조해야 하므로,
//   전역 상태로 관리하는 편이 각 모듈이 필요한 시점에 직접 접근할 수 있어 더 일관되고 효율적인 구조를 만들 수 있다고 판단했습니다.
export const useSearch = create<SearchStore>(set => ({
  context: {
    ...initialContext
  },
  actions: {
    setSearchTerm: term => set({ context: { searchTerm: term } }),
    clearSearchTerm: () => set({ context: { ...initialContext } })
  }
}));

export const searchContext = () => useSearch(({ context }) => context);
export const searchActions = () => useSearch(({ actions }) => actions);
