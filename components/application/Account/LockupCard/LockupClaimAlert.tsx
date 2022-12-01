import React, { useState } from "react";
import { Alert, Button, formatNumber, Typography } from "@ecoinc/ecomponents";
import { FundsLockupWithDeposit } from "../../../../types/FundsLockup";
import { useWallet } from "../../../../providers";
import { getLockupClaimAmount, tokensToNumber } from "../../../../utilities";
import { LockupClaimModal } from "./LockupClaimModal";

interface LockupClaimAlertProps {
  lockup: FundsLockupWithDeposit;
}

export const LockupClaimAlert: React.FC<LockupClaimAlertProps> = ({
  lockup,
}) => {
  const { inflationMultiplier } = useWallet();
  const [open, setOpen] = useState(false);
  const amount = getLockupClaimAmount(lockup, inflationMultiplier);

  return (
    <React.Fragment>
      <LockupClaimModal
        isOpen={open}
        lockup={lockup}
        onRequestClose={() => setOpen(false)}
      />
      <Alert
        color="success"
        title="Lockup claimable"
        button={
          <Button color="success" onClick={() => setOpen(true)}>
            Claim
          </Button>
        }
      >
        You have{" "}
        <Typography color="primary" variant="body2">
          <b>{formatNumber(tokensToNumber(amount))} ECO</b>
        </Typography>{" "}
        ready to claim!
      </Alert>
    </React.Fragment>
  );
};
