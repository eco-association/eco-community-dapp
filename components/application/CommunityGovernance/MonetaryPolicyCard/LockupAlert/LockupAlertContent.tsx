import React, { useEffect, useState } from "react";
import { Column, Typography } from "@ecoinc/ecomponents";
import { LockupDepositAlert } from "./LockupDepositAlert";
import { FundsLockup } from "../../../../../types";
import { LockupDescription } from "./LockupDescription";

interface LockupAlertContentProps {
  lockup: FundsLockup;
}

export const LockupAlertContent: React.FC<LockupAlertContentProps> = ({
  lockup,
}) => {
  const [isDepositOpen, setDepositOpen] = useState(
    lockup.depositWindowEndsAt.getTime() > Date.now()
  );

  useEffect(() => {
    if (isDepositOpen) {
      const remaining = lockup.depositWindowEndsAt.getTime() - Date.now();
      const timeout = setTimeout(() => setDepositOpen(false), remaining);
      return () => clearTimeout(timeout);
    }
  }, [isDepositOpen, lockup.depositWindowEndsAt]);

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
