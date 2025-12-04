import { create } from "zustand";

interface SearchStoreState {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
}

export const useSearchStore = create<SearchStoreState>((set) => ({
  searchTerm: "",
  setSearchTerm: (searchTerm) => set({ searchTerm }),
}));
