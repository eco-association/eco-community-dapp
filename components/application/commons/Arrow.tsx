import React from "react";
import { Color, useTheme } from "@ecoinc/ecomponents";

interface GreenArrowProps extends React.SVGProps<SVGSVGElement> {
  color: Color;
}

export const Arrow: React.FC<GreenArrowProps> = ({ color, ...props }) => {
  const theme = useTheme();
  const stroke = theme.palette[color].main;
  return (
    <svg
      width="8"
      height="14"
      viewBox="0 0 8 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1.5 1.375L7.125 7L1.5 12.625"
        stroke={stroke}
        strokeWidth="1.125"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
