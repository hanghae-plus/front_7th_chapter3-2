export const validateCoupon = (
  type: "percentage" | "amount",
  value: number
) => {
  if (type === "percentage") {
    if (value > 100) {
      return "DISCOUNT_RATE_OVER_100";
    } else if (value < 0) {
      return "DISCOUNT_RATE_UNDER_0";
    }
  } else {
    if (value > 100000) {
      return "DISCOUNT_AMOUNT_OVER_100000";
    } else if (value < 0) {
      return "DISCOUNT_AMOUNT_UNDER_0";
    }
  }

  return null;
};
