import { useEffect } from "react";

const preventClose = function (e) {
  e.preventDefault();
  e.returnValue = "";
};

export const useBlockExit = (block: boolean) => {
  useEffect(() => {
    if (window && block) {
      window.addEventListener("beforeunload", preventClose, true);
      return () => {
        window.removeEventListener("beforeunload", preventClose, true);
      };
    }
  }, [block]);
};
