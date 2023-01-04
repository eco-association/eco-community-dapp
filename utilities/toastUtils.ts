import { ToastOptions } from "react-toastify";

export const toastOpts = (
  borderColor: string,
  backgroundColor: string
): ToastOptions => ({
  style: {
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor,
    backgroundColor,
    color: "#22313A",
    top: "150px",
  },
  position: "top-center",
  hideProgressBar: true,
  theme: "colored",
});
