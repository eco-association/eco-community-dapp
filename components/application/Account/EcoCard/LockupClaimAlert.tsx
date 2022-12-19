import React, { useState } from "react";
import {
  Alert,
  Button,
  formatNumber,
  Row,
  styled,
  Typography,
} from "@ecoinc/ecomponents";
import { FundsLockupWithDeposit } from "../../../../types/FundsLockup";
import { useWallet } from "../../../../providers";
import { getLockupClaimAmount, tokensToNumber } from "../../../../utilities";
import { LockupClaimModal } from "./LockupClaimModal";

interface LockupClaimAlertProps {
  lockup: FundsLockupWithDeposit;
}

const StyledAlert = styled(Alert)({
  "& span": {
    lineHeight: 1,
  },
});

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
      <StyledAlert
        color="active"
        title="Lockup Claim Complete"
        button={
          <Row justify="end">
            <Button
              color="active"
              variant="outline"
              onClick={() => setOpen(true)}
              style={{ padding: "10px 16px", minWidth: "initial" }}
            >
              Claim
            </Button>
          </Row>
        }
      >
        You have{" "}
        <Typography color="primary" variant="body2">
          <b>{formatNumber(tokensToNumber(amount))} ECO</b>
        </Typography>{" "}
        to claim
      </StyledAlert>
    </React.Fragment>
  );
};
