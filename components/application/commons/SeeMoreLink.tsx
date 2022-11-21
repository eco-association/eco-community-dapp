import React from "react";
import { Row, styled, Typography, TypographyProps } from "@ecoinc/ecomponents";
import { Arrow } from "./Arrow";

const MoreDetailsContainer = styled(Row)({
  transition: "gap linear .1s",
  gap: "4px",
  "&:hover": {
    gap: "8px",
  },
});

export const SeeMoreLink = React.forwardRef<HTMLSpanElement, TypographyProps>(
  (props, ref) => {
    return (
      <Typography ref={ref} link variant="body1" color="active" {...props}>
        <MoreDetailsContainer items="center">
          See more details
          <Arrow color="active" />
        </MoreDetailsContainer>
      </Typography>
    );
  }
);
