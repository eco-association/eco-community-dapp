import React from "react";
import { Alert, Typography } from "@ecoinc/ecomponents";
import { LockupAlertContent } from "./LockupAlertContent";
import { useCommunity } from "../../../../../providers";
import { format } from "../BaseInflationAlert";

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
        <Typography variant="body1" color="primary">
          <b>Base Interest Rate</b>{" "}
          <Typography
            variant="body2"
            color={lockup.interest === 0 ? "secondary" : "active"}
          >
            <b>• {format(lockup.interest * 100)}%</b>
          </Typography>{" "}
        </Typography>
      }
    >
      <LockupAlertContent lockup={lockup} />
    </Alert>
  );
};
