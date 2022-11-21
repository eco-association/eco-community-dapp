import { styled } from "@ecoinc/ecomponents";
import React from "react";

const StyledSelect = styled.select({
  width: "100%",
  padding: "8px 12px 8px 12px",
  borderRadius: 4,
  border: "1px solid #DCE9F0 !important",
  backgroundColor: "white",
  appearance: "none",
  outline: "none",

  backgroundRepeat: "no-repeat",
  backgroundImage: `url("data:image/svg+xml;utf8,<svg width='16' height='10' viewBox='0 0 16 10' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M1 1.5L8 8.5L15 1.5' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>")`,
  backgroundSize: "16px 10px",
  backgroundPositionY: "50%",
  backgroundPositionX: "calc(100% - 16px)",
});

type SelectProps = Omit<React.HTMLProps<HTMLSelectElement>, "as" | "ref">;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (props, ref) => {
    return <StyledSelect ref={ref} {...props} />;
  }
);
