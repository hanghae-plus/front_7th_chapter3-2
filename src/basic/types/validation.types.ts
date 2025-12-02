export type Validation<T> =
  | { valid: true; error: null }
  | { valid: false; error: T };
