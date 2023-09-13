import React from "react";
import { Card, Column, Typography, styled } from "@ecoinc/ecomponents";
import { LockupAlert } from "./LockupAlert/LockupAlert";
import { RandomInflationAlert } from "./RandomInflationAlert";
import { BaseInflationAlert } from "./BaseInflationAlert";
import { breakpoints, mq } from "../../../../utilities";

const StyledCard = styled(Card)({
  margin: "0 -16px",
  height: "max-content",
  borderRadius: 0,

  [mq(breakpoints.md)]: {
    borderRadius: 8,
    margin: 0,
  },
});

export const MonetaryPolicyCard = () => {
  return (
    <StyledCard>
      <Column gap="lg">
        <Typography variant="h3">Current Monetary Policy</Typography>
        <Column gap="md">
          <BaseInflationAlert />
          <RandomInflationAlert />
          <LockupAlert />
        </Column>
      </Column>
    </StyledCard>
  );
};
