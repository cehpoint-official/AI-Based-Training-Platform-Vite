import { toast } from "react-toastify";

export const showToast = async (msg) => {
  // setProcessing(false);
  toast(msg, {
    position: "bottom-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
