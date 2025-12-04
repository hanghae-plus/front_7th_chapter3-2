import { create } from "zustand";

type SearchState = {
  searchTerm: string;
};

type SearchActions = {
  setSearchTerm: (term: string) => void;
  clearSearch: () => void;
  reset: () => void;
};

export type SearchStore = SearchState & SearchActions;

const initialState: SearchState = {
  searchTerm: "",
};

export const useSearchStore = create<SearchStore>((set) => ({
  ...initialState,
  setSearchTerm: (term: string) => set({ searchTerm: term }),
  clearSearch: () => set({ searchTerm: "" }),
  reset: () => set(initialState),
}));
