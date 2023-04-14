import React, { useState } from "react";
import { css } from "@emotion/react";
import ReactCountdown from "react-countdown";
import { Alert, Button, Row, Typography } from "@ecoinc/ecomponents";
import { FundsLockup } from "../../../../types";
import { LockupDescription } from "../../CommunityGovernance/MonetaryPolicyCard/LockupAlert/LockupDescription";
import LockupDepositModal from "../../CommunityGovernance/MonetaryPolicyCard/LockupAlert/LockupDepositModal";
import { formatCountdown } from "../../../../utilities";

const lineHeight = css({ lineHeight: 1 });

interface LockupDepositAlertProps {
  lockup: FundsLockup;
}

export const LockupDepositAlert = ({ lockup }: LockupDepositAlertProps) => {
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
                <Typography variant="h5" color="active" css={lineHeight}>
                  <b>You can&apos;t participate now</b>
                </Typography>
              );
            const remaining = formatCountdown(countdownData);
            return (
              <Typography variant="body2" color="info" css={lineHeight}>
                <b>
                  New Lockup • {remaining.amount} {remaining.unit} remain
                </b>
              </Typography>
            );
          }}
        />
      }
      button={
        <Row justify="end">
          <Button
            size="sm"
            color="info"
            variant="outline"
            onClick={() => setOpen(true)}
          >
            Deposit
          </Button>
        </Row>
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
