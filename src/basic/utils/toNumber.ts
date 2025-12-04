export const toNumber = (value: string): number => {
  return value === "" ? 0 : parseInt(value);
};
