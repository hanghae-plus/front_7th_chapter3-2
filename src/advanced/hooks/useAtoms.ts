import { atom, useAtom } from "jotai";
import { ADMIN_TABS, AdminTab } from "../pages/admin/constants/tabs";

const atomIsAdmin = atom<boolean>(false);
const atomActiveTab = atom<AdminTab>(ADMIN_TABS.PRODUCTS);
const atomSearchTerm = atom<string>("");
const atomShowProductForm = atom<boolean>(false);
const atomShowCouponForm = atom<boolean>(false);

export const useAtoms = () => {
  const [isAdmin, setIsAdmin] = useAtom(atomIsAdmin);
  const [activeTab, setActiveTab] = useAtom(atomActiveTab);
  const [searchTerm, setSearchTerm] = useAtom(atomSearchTerm);
  const [showProductForm, setShowProductForm] = useAtom(atomShowProductForm);
  const [showCouponForm, setShowCouponForm] = useAtom(atomShowCouponForm);

  return {
    isAdmin,
    setIsAdmin,
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    showProductForm,
    setShowProductForm,
    showCouponForm,
    setShowCouponForm,
  };
};
