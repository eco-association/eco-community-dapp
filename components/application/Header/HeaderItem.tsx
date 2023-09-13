import { MenuItem, pxToRem, styled } from "@ecoinc/ecomponents";
import { breakpoints, mq } from "../../../utilities";

export const HeaderItem = styled(MenuItem)<{ active?: boolean }>(
  ({ active }) => ({
    cursor: "pointer",
    color: active ? "#FFFFFF" : "#FFFFFF99",
    fontSize: pxToRem(24),
    letterSpacing: "-0.84px",

    [mq(breakpoints.lg)]: {
      letterSpacing: "unset",
      fontSize: pxToRem(15),
    },
  })
);
