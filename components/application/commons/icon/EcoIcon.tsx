import React from "react";
import { Color, useTheme } from "@ecoinc/ecomponents";

interface EcoIconProps extends React.SVGProps<SVGSVGElement> {
  color?: Color;
}

export const EcoIcon: React.FC<EcoIconProps> = ({
  color = "primary",
  ...props
}): JSX.Element => {
  const theme = useTheme();
  const { main } = theme.palette[color];

  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.52161 8.8754C7.52217 8.91686 7.52245 8.95838 7.52245 8.99998C7.52245 12.0204 6.04201 14.6932 3.77061 16.3257C1.48785 14.6932 0 12.0204 0 8.99998C0 7.31219 0.464589 5.73291 1.27286 4.38306C1.25886 4.40643 1.24498 4.42987 1.23119 4.45337C2.53758 6.75466 4.82527 8.4205 7.52161 8.8754Z"
        fill={main}
      />
      <path
        opacity="0.5"
        d="M1.23096 4.45342C1.87349 3.35788 2.74113 2.41034 3.77037 1.67432C6.0105 3.28428 7.48129 5.90622 7.52138 8.87544C4.82503 8.42055 2.53735 6.75471 1.23096 4.45342Z"
        fill={main}
      />
      <path
        d="M3.77051 1.67429C5.24442 0.620269 7.04973 0 8.9999 0C12.3227 0 15.2249 1.80065 16.7839 4.47939C15.2384 7.18086 12.3381 9 9.0149 9C8.50608 9 8.00717 8.95735 7.52151 8.87542C7.48143 5.90619 6.01063 3.28425 3.77051 1.67429Z"
        fill={main}
      />
      <path
        d="M7.52295 17.8794C8.00346 17.9587 8.49682 18 8.99981 18C13.9272 18 17.9297 14.0403 17.9989 9.12937C17.5044 9.04431 16.996 9 16.4774 9C11.5716 9 7.58717 12.9644 7.52295 17.8794Z"
        fill={main}
      />
    </svg>
  );
};
