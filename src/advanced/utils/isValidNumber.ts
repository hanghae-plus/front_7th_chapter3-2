export const isValidNumber = (value: string): boolean => {
  return value === "" || /^\d+$/.test(value);
};
