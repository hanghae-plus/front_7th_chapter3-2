import { type FC } from "react";
import TabButton from "../../components/_common/TabButton";

interface IProps {
  activeTab: "products" | "coupons";
  onChange: (prev: "products" | "coupons") => void;
}

const NaviTab: FC<IProps> = ({ activeTab, onChange }) => {
  const TABS = [
    { id: "products" as const, label: "상품 관리" },
    { id: "coupons" as const, label: "쿠폰 관리" },
  ];

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        {TABS.map((tab) => (
          <TabButton
            key={tab.id}
            label={tab.label}
            isActive={activeTab === tab.id}
            onClick={() => onChange(tab.id)}
          />
        ))}
      </nav>
    </div>
  );
};

export default NaviTab;
