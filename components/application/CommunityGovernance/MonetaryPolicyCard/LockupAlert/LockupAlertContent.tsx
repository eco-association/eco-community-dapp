import React, { useState } from "react";
import { Alert, Button, Column, Row, Typography } from "@ecoinc/ecomponents";
import { FundsLockup } from "../../../../../types";
import { LockupDescription } from "./LockupDescription";
import { useTimeFlag } from "../../../../hooks/useTimeFlag";
import { css } from "@emotion/react";
import ReactCountdown from "react-countdown";
import { formatCountdown } from "../../../../../utilities";
import LockupDepositModal from "./LockupDepositModal";

interface LockupAlertContentProps {
  lockup: FundsLockup;
}

const lineHeight = css({ lineHeight: 1 });

interface LockupDepositAlertProps {
  lockup: FundsLockup;
}

const DepositAlert = ({ lockup }: LockupDepositAlertProps) => {
  const { depositWindowEndsAt: endsAt } = lockup;

  const [active, setActive] = useState(endsAt.getTime() > Date.now());
  const [open, setOpen] = useState(false);

  if (!active) return null;

  return (
    <Alert
      color="active"
      button={
        <Row justify="end">
          <Button
            size="sm"
            color="active"
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
            <Typography variant="body2" color="active" css={lineHeight}>
              <b>
                {remaining.amount} {remaining.unit} remain to participate
              </b>
            </Typography>
          );
        }}
      />
    </Alert>
  );
};

export const LockupAlertContent: React.FC<LockupAlertContentProps> = ({
  lockup,
}) => {
  const isDepositOpen = !useTimeFlag(lockup.depositWindowEndsAt);

  return (
    <Column style={{ gap: 12 }}>
      <LockupDescription lockup={lockup} />
      {isDepositOpen ? <DepositAlert lockup={lockup} /> : null}
    </Column>
  );
};
