import { ADMIN_TAB_CONFIGS } from "./constants/tabs";
import { Button } from "../../components/common/ui/Button";
import { useAtoms } from "../../hooks/useAtoms";

export const AdminNav = () => {
  const { activeTab, setActiveTab } = useAtoms();
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
