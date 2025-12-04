import '@testing-library/jest-dom';

// localStorage mock for jsdom
const storage: Record<string, string> = {};

const localStorageMock = {
  getItem: (key: string): string | null => {
    return storage[key] || null;
  },
  setItem: (key: string, value: string): void => {
    storage[key] = value;
  },
  removeItem: (key: string): void => {
    delete storage[key];
  },
  clear: (): void => {
    Object.keys(storage).forEach(key => {
      delete storage[key];
    });
  },
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});
