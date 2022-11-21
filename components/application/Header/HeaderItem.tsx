import { MenuItem, styled } from "@ecoinc/ecomponents";

export const HeaderItem = styled(MenuItem)<{ active?: boolean }>(
  ({ active }) => ({
    cursor: "pointer",
    color: active ? "#FFFFFF" : "#FFFFFF99",
  })
);
