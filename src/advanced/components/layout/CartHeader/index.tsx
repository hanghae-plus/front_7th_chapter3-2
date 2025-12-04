import { type FC } from "react";
import CartBadge from "./CartBadge";
import SearchBar from "./SearchBar";
import HeaderLayout from "../_common/HeaderLayout";
import Button from "../../_common/Button";

interface IProps {
  searchTerm: string;
  totalCount: number;
  onChange: () => void;
  setSearchTerm: (searchTerm: string) => void;
}

const CartHeader: FC<IProps> = ({
  searchTerm,
  totalCount,
  onChange,
  setSearchTerm,
}) => {
  return (
    <HeaderLayout
      left={<SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}
      right={
        <>
          <Button variant="ghost" color="gray" size="sm" onClick={onChange}>
            관리자 페이지로
          </Button>
          <CartBadge count={totalCount} />
        </>
      }
    />
  );
};

export default CartHeader;
