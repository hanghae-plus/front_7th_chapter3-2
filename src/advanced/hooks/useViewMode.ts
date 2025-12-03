import { useState } from 'react';

export type ViewMode = 'cart' | 'admin';

export function useViewMode(initialMode: ViewMode = 'cart') {
  const [viewMode, setViewMode] = useState<ViewMode>(initialMode);

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === 'cart' ? 'admin' : 'cart'));
  };

  const isCartView = viewMode === 'cart';
  const isAdminView = viewMode === 'admin';

  return {
    viewMode,
    setViewMode,
    toggleViewMode,
    isCartView,
    isAdminView,
  };
}
