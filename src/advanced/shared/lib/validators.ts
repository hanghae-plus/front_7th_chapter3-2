export const extractNumbers = (value: string): string => {
  return value.replace(/[^0-9]/g, '');
};

export const isOnlyNumber = (value: string): boolean => {
  return /^\d+$/.test(value);
};
