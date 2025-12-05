import { Coupon } from "../../../../types";
import { Card } from "../../../components/ui/Card";

interface CouponCardProps {
  coupon: Coupon;
  onRemove: (code: string) => void;
}

export const CouponCard = ({ coupon, onRemove }: CouponCardProps) => {
  const { name, code } = coupon;

  const tagName =
    coupon.discountType === "amount"
      ? `${coupon.discountValue.toLocaleString()}원 할인`
      : `${coupon.discountValue}% 할인`;

  return (
    <Card
      cardId={code}
      title={name}
      subTitle={code}
      tagName={tagName}
      onClick={onRemove}
    />
  );
};
