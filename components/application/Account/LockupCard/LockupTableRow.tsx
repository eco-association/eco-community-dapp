import { styled } from "@ecoinc/ecomponents";

export const LockupTableRow = styled.div<{ clickable?: boolean }>(
  ({ theme, clickable }) => ({
    display: "grid",
    padding: 4,
    gridColumnGap: 8,
    alignItems: "center",
    gridTemplateColumns: "80px 60px 80px auto 10px",
    ...(clickable
      ? {
          cursor: "pointer",
          transition: ".3s ease background-color",
          "&:hover": {
            borderRadius: 4,
            backgroundColor: theme.palette.background.paper,
          },
        }
      : {}),
  })
);
