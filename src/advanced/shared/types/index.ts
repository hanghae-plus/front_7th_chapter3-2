export type Validation<T> =
  | { valid: true; error: null; message: string }
  | { valid: false; error: T; message: string };
