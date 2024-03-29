import React from "react";
import { Alert, Typography } from "@ecoinc/ecomponents";
import { LockupAlertContent } from "./LockupAlertContent";
import { useCommunity } from "../../../../../providers";
import { getLockupAPR } from "../../../../../utilities";

const { format } = new Intl.NumberFormat("en-EN", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 1,
});

export const LockupAlert = () => {
  const { lockup } = useCommunity();

  if (!lockup)
    return (
      <Alert
        css={{ border: 0 }}
        color="secondary"
        title={
          <Typography variant="body2" color="secondary">
            <b>Base Interest Rate • Inactive</b>
          </Typography>
        }
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
        <Typography variant="body2" color="primary">
          <b>Base Interest Rate</b>{" "}
          <Typography
            variant="body2"
            color={lockup.interest === 0 ? "secondary" : "active"}
          >
            <b>• {format(getLockupAPR(lockup))}% APR</b>
          </Typography>{" "}
        </Typography>
      }
    >
      <LockupAlertContent lockup={lockup} />
    </Alert>
  );
};
