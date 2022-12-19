import React, { useState } from "react";
import { css } from "@emotion/react";
import ReactCountdown from "react-countdown";
import { Alert, Button, Typography } from "@ecoinc/ecomponents";
import { FundsLockup } from "../../../../types";
import { LockupDescription } from "../../CommunityGovernance/MonetaryPolicyCard/LockupAlert/LockupDescription";
import LockupDepositModal from "../../CommunityGovernance/MonetaryPolicyCard/LockupAlert/LockupDepositModal";
import { formatCountdown } from "../../../../utilities";

const fontWeight = css({ fontSize: 13, fontWeight: "bold", lineHeight: 1 });

interface StakeVaultAlertProps {
  lockup: FundsLockup;
}

export const LockupDepositAlert = ({ lockup }: StakeVaultAlertProps) => {
  const { depositWindowEndsAt: endsAt } = lockup;

  const [active, setActive] = useState(endsAt.getTime() > Date.now());
  const [open, setOpen] = useState(false);

  if (!active) return null;

  return (
    <Alert
      color="info"
      title={
        <ReactCountdown
          date={endsAt}
          onComplete={() => setActive(false)}
          renderer={(countdownData) => {
            if (countdownData.completed)
              return (
                <Typography variant="h5" color="active" css={fontWeight}>
                  You can&apos;t participate now
                </Typography>
              );
            const remaining = formatCountdown(countdownData);
            return (
              <Typography variant="h5" color="info" css={fontWeight}>
                New Lockup • {remaining.amount} {remaining.unit} remain
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
