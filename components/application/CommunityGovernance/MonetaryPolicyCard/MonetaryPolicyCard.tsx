import React from "react";
import { Card, Column, Typography } from "@ecoinc/ecomponents";
import { LockupAlert } from "./LockupAlert/LockupAlert";
import { RandomInflationAlert } from "./RandomInflationAlert";
import { BaseInflationAlert } from "./BaseInflationAlert";

export const MonetaryPolicyCard = () => {
  const cardStyle = function () {
    if (window.innerWidth < 500) {
      return {
        borderRadius: "0",
      };
    } else {
      return { height: "max-content" };
    }
  };
  return (
    <Card style={cardStyle()}>
      <Column gap="lg">
        <Typography variant="h3">Current Monetary Policy</Typography>
        <Column gap="md">
          <BaseInflationAlert />
          <RandomInflationAlert />
          <LockupAlert />
        </Column>
      </Column>
    </Card>
  );
};
