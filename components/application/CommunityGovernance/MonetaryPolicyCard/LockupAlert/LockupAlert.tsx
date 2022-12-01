import React from "react";
import { Alert, Typography } from "@ecoinc/ecomponents";
import { LockupAlertContent } from "./LockupAlertContent";
import { useCommunity } from "../../../../../providers";

const formatter = new Intl.NumberFormat("en-US", {
  minimumSignificantDigits: 1,
  maximumSignificantDigits: 3,
});

export const LockupAlert = () => {
  const { lockup } = useCommunity();

  if (!lockup)
    return (
      <Alert
        css={{ border: 0 }}
        color="secondary"
        title="Base Interest Rate • Inactive"
      >
        <Typography variant="body2" color="secondary">
          Deposit your ECO into a lockup to earn interest.
        </Typography>
      </Alert>
    );

  return (
    <Alert
      color="transparent"
      title={
        <Typography variant="body1" color="active">
          <b>Base Interest Rate * {formatter.format(lockup.interest)}%</b>
        </Typography>
      }
    >
      <LockupAlertContent lockup={lockup} />
    </Alert>
  );
};
