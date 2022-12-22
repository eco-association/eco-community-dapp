import React from "react";
import { Card, Column, Typography } from "@ecoinc/ecomponents";
import { LockupAlert } from "./LockupAlert/LockupAlert";
import { RandomInflationAlert } from "./RandomInflationAlert";
import { BaseInflationAlert } from "./BaseInflationAlert";

export const MonetaryPolicyCard = () => {
  return (
    <Card style={{ height: "max-content" }}>
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
