import React from "react";
import { Column, Typography } from "@ecoinc/ecomponents";
import { LockupDepositAlert } from "../../../Account/LockupCard/LockupDepositAlert";
import { FundsLockup } from "../../../../../types";
import { LockupDescription } from "./LockupDescription";
import { useTimeFlag } from "../../../../hooks/useTimeFlag";

interface LockupAlertContentProps {
  lockup: FundsLockup;
}

export const LockupAlertContent: React.FC<LockupAlertContentProps> = ({
  lockup,
}) => {
  const isDepositOpen = !useTimeFlag(lockup.depositWindowEndsAt);

  if (!isDepositOpen) {
    return <LockupDescription lockup={lockup} />;
  }

  return (
    <Column style={{ gap: 12 }}>
      <Typography variant="body2" color="secondary">
        Stake your ECO to earn rewards from this lockup.
      </Typography>
      <LockupDepositAlert lockup={lockup} />
    </Column>
  );
};
