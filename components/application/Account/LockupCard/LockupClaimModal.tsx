import React, { useState } from "react";
import {
  Button,
  Column,
  Dialog,
  DialogProps,
  formatNumber,
  Row,
  styled,
  Typography,
} from "@ecoinc/ecomponents";
import { useAccount } from "wagmi";
import {
  displayAddress,
  getLockupClaimAmount,
  tokensToNumber,
  txError,
} from "../../../../utilities";
import TextLoader from "../../commons/TextLoader";
import LoaderAnimation from "../../Loader";
import { GasFee } from "../../commons/GasFee";
import { useBlockExit } from "../../../hooks/useBlockExit";
import { useWallet } from "../../../../providers";
import { useLockup } from "../../../hooks/contract/useLockup";
import { FundsLockupWithDeposit } from "../../../../types/FundsLockup";

interface LockupClaimModalProps extends Pick<DialogProps, "isOpen"> {
  lockup: FundsLockupWithDeposit;
  onRequestClose(): void;
}

const Container = styled(Column)(({ theme }) => ({
  padding: "16px 24px",
  borderRadius: 4,
  backgroundColor: theme.palette.background.paper,
}));

export const LockupClaimModal: React.FC<LockupClaimModalProps> = ({
  isOpen,
  lockup,
  onRequestClose,
}) => {
  const account = useAccount();
  const wallet = useWallet();
  const lockupContract = useLockup(lockup.address);

  const [loading, setLoading] = useState(false);

  useBlockExit(loading);

  const claim = async () => {
    setLoading(true);
    try {
      const tx = await lockupContract.withdraw();
      await tx.wait();
      onRequestClose();
    } catch (error) {
      txError("Failed to claim", error);
    }
    setLoading(false);
  };

  const amount = getLockupClaimAmount(lockup, wallet.inflationMultiplier);

  return (
    <Dialog
      isOpen={isOpen}
      style={{ card: { maxWidth: 540 } }}
      shouldCloseOnEsc={!loading}
      shouldShowCloseButton={!loading}
      shouldCloseOnOverlayClick={!loading}
      onRequestClose={onRequestClose}
    >
      <Column gap="xl">
        <Column gap="lg" style={{ padding: "0 24px" }}>
          <Typography variant="h2">Claim your ECO</Typography>
          <Typography variant="body1">
            {formatNumber(tokensToNumber(amount))} ECO available to claim.
          </Typography>
        </Column>
        <Container gap="lg">
          <Row gap="md">
            <Typography variant="body1" style={{ lineHeight: 1 }}>
              Move to your wallet
            </Typography>
            <Typography
              variant="body1"
              color="secondary"
              style={{ lineHeight: 1 }}
            >
              Eth Address {displayAddress(account.address)}
            </Typography>
          </Row>

          <Column gap="md" items="start">
            <Row gap="md" items="center">
              <Button
                variant="fill"
                color="success"
                onClick={claim}
                disabled={loading}
              >
                {loading ? <LoaderAnimation /> : "Claim"}
              </Button>
              {loading && <TextLoader />}
            </Row>
            <GasFee gasLimit={100_000} />
          </Column>
        </Container>
      </Column>
    </Dialog>
  );
};
