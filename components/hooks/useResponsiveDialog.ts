const dialogStyleSm = {
  card: {
    width: "90vw",
  },
};

import { useMemo } from "react";
import { useMediaQuery } from "../../utilities";

const useResponsiveDialog = (maxWidth?: number) => {
  const isTabletUp = useMediaQuery("(min-width: 786px)");

  const dialogStyles = useMemo(() => {
    const dialogStyleMd = {
      card: {
        maxWidth: maxWidth || 540,
      },
    };

    if (isTabletUp) {
      return dialogStyleMd;
    }

    return dialogStyleSm;
  }, [isTabletUp, maxWidth]);

  return dialogStyles;
};

export default useResponsiveDialog;
