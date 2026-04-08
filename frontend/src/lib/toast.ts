import { toast, type TypeOptions } from "react-toastify";

export const showToast = (message: string, type: TypeOptions = "default") => {
  toast(message, { type });
};
