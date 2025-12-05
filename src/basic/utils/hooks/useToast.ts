import { useContext } from "react";
import { ToastContext, ToastContextType } from "../../context/ToastProvider";

export const useToast = (): ToastContextType => {
  return useContext(ToastContext);
};
