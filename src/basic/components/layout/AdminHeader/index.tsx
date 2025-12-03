import { type FC } from "react";
import HeaderLayout from "../_common/HeaderLayout";
import Button from "../../_common/Button";

interface IProps {
  onChange: () => void;
}

const AdminHeader: FC<IProps> = ({ onChange }) => {
  return (
    <HeaderLayout
      right={
        <Button variant="solid" color="secondary" size="sm" onClick={onChange}>
          쇼핑몰로 돌아가기
        </Button>
      }
    />
  );
};

export default AdminHeader;
