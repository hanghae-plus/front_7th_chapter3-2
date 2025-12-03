import { Dispatch, SetStateAction } from "react";
import { AdminTab, ADMIN_TAB_CONFIGS } from "./constants/tabs";
import { Button } from "../../components/common/ui/Button";

interface AdminNavProps {
  activeTab: AdminTab;
  setActiveTab: Dispatch<SetStateAction<AdminTab>>;
}

export const AdminNav = ({ activeTab, setActiveTab }: AdminNavProps) => {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        {ADMIN_TAB_CONFIGS.map((tab) => (
          <Button
            key={tab.id}
            variant="tab"
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </nav>
    </div>
  );
};
