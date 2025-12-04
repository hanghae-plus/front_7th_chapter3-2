import { create } from 'zustand';

interface UIStore {
  isAdmin: boolean;
  searchTerm: string;
  debouncedSearchTerm: string;
  toggleAdmin: () => void;
  setSearchTerm: (term: string) => void;
  setDebouncedSearchTerm: (term: string) => void;
  _reset: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isAdmin: false,
  searchTerm: '',
  debouncedSearchTerm: '',

  toggleAdmin: () => set((state) => ({ isAdmin: !state.isAdmin })),

  setSearchTerm: (term) => set({ searchTerm: term }),

  setDebouncedSearchTerm: (term) => set({ debouncedSearchTerm: term }),

  _reset: () => set({ isAdmin: false, searchTerm: '', debouncedSearchTerm: '' }),
}));
