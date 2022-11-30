import { Alert, Button, Typography } from "@ecoinc/ecomponents";
import React, { useState } from "react";
import { css } from "@emotion/react";
import { FundsLockup } from "../../../../../types";
import { LockupDescription } from "./LockupDescription";
import ReactCountdown from "react-countdown";
import { CountdownRenderProps } from "react-countdown/dist/Countdown";
import LockupDepositModal from "./LockupDepositModal";

const fontWeight = css({ fontSize: 13, fontWeight: "bold", lineHeight: 1 });

interface StakeVaultAlertProps {
  lockup: FundsLockup;
}

function getCountdown(countdown: CountdownRenderProps): {
  amount: number;
  unit: string;
} {
  if (countdown.days > 0) return { amount: countdown.days + 1, unit: "days" };
  if (countdown.hours > 0)
    return { amount: countdown.hours + 1, unit: "hours" };
  if (countdown.minutes > 0)
    return { amount: countdown.minutes + 1, unit: "minutes" };
  return { amount: countdown.seconds, unit: "seconds" };
}

export const LockupDepositAlert = ({ lockup }: StakeVaultAlertProps) => {
  const { depositWindowEndsAt: endsAt } = lockup;

  const [open, setOpen] = useState(false);

  return (
    <Alert
      color="active"
      title={
        <ReactCountdown
          date={endsAt}
          renderer={(countdownData) => {
            if (countdownData.completed)
              return (
                <Typography variant="h5" color="active" css={fontWeight}>
                  You can&apos;t participate now
                </Typography>
              );
            const remaining = getCountdown(countdownData);
            return (
              <Typography variant="h5" color="active" css={fontWeight}>
                {remaining.amount} {remaining.unit} remain to participate
              </Typography>
            );
          }}
        />
      }
      button={
        <Button
          size="sm"
          color="active"
          variant="outline"
          onClick={() => setOpen(true)}
        >
          Deposit
        </Button>
      }
    >
      <LockupDepositModal
        isOpen={open}
        lockup={lockup}
        onRequestClose={() => setOpen(false)}
      />
      <LockupDescription lockup={lockup} />
    </Alert>
  );
};
