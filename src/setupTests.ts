import '@testing-library/jest-dom';
import { beforeEach } from 'vitest';
import { resetAllStores } from './advanced/stores';

beforeEach(() => {
  resetAllStores();
});
