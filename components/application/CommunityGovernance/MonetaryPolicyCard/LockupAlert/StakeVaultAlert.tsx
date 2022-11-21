import { Alert, Button, Typography } from "@ecoinc/ecomponents";
import React from "react";
import { css } from "@emotion/react";
import { FundsLockup } from "../../../../../types";
import { LockupDescription } from "./LockupDescription";
import ReactCountdown from "react-countdown";
import { CountdownRenderProps } from "react-countdown/dist/Countdown";

const fontWeight = css({ fontSize: 13, fontWeight: "bold" });

interface StakeVaultAlertProps {
  lockup: FundsLockup;
}

function getCountdown(countdown: CountdownRenderProps): {
  amount: number;
  unit: string;
} {
  if (countdown.days > 0) return { amount: countdown.days, unit: "days" };
  if (countdown.hours > 0) return { amount: countdown.hours, unit: "hours" };
  if (countdown.minutes > 0)
    return { amount: countdown.minutes, unit: "minutes" };
  return { amount: countdown.seconds, unit: "seconds" };
}

export const StakeVaultAlert = ({ lockup }: StakeVaultAlertProps) => {
  const { depositWindowEndsAt: endsAt } = lockup;
  return (
    <Alert
      color="success"
      title={
        <ReactCountdown
          date={endsAt}
          renderer={(countdownData) => {
            if (countdownData.completed)
              return (
                <Typography variant="h5" color="success" css={fontWeight}>
                  You can&apos;t participate now
                </Typography>
              );
            const remaining = getCountdown(countdownData);
            return (
              <Typography variant="h5" color="success" css={fontWeight}>
                {remaining.amount} {remaining.unit} remain to participate
              </Typography>
            );
          }}
        />
      }
      button={
        <Button size="sm" color="success" variant="outline">
          Stake
        </Button>
      }
    >
      <LockupDescription lockup={lockup} />
    </Alert>
  );
};
