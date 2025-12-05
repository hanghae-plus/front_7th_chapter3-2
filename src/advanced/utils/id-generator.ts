export const generateId = (prefix: string) =>
  `${prefix ? `${prefix}-` : ''}${Date.now().toString()}`;
