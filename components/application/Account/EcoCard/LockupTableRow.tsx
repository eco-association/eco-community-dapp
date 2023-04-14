import { styled } from "@ecoinc/ecomponents";

export const LockupTableRow = styled.tr<{
  clickable?: boolean;
  showBg?: boolean;
}>(({ theme, showBg, clickable }) => ({
  ...(showBg
    ? {
        backgroundColor: theme.palette.active.bg,
      }
    : {}),
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
}));
