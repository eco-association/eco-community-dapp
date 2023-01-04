import React, { useState } from "react";
import ReactCountdown from "react-countdown";
import {
  Button,
  Checkbox,
  Column,
  Dialog,
  DialogProps,
  formatNumber,
  Row,
  styled,
  Typography,
} from "@ecoinc/ecomponents";
import {
  displayAddress,
  formatCountdown,
  formatDuration,
  getLockupClaimAmount,
  getLockupDates,
  lockupFormatDate,
  numberFormatter,
  tokensToNumber,
  txError,
} from "../../../../utilities";
import TextLoader from "../../commons/TextLoader";
import LoaderAnimation from "../../Loader";
import { GasFee } from "../../commons/GasFee";
import { useBlockExit } from "../../../hooks/useBlockExit";
import { useWallet } from "../../../../providers";
import { FundsLockupWithDeposit } from "../../../../types/FundsLockup";
import { ModalTextItem } from "./ModalTextItem";
import { useLockup } from "../../../hooks/contract/useLockup";
import { useTimeFlag } from "../../../hooks/useTimeFlag";
import { useAccount } from "wagmi";
import { WalletActionType } from "../../../../providers/WalletProvider";
import { toast as nativeToast } from "react-toastify";
import { toastOpts } from "../../../../utilities/toastUtils";

interface LockupClaimModalProps extends Pick<DialogProps, "isOpen"> {
  lockup: FundsLockupWithDeposit;

  onRequestClose(): void;
}

const Container = styled(Column)(({ theme }) => ({
  padding: "16px 24px",
  borderRadius: 4,
  backgroundColor: theme.palette.background.paper,
}));

interface ContentProps {
  loading?: boolean;
  lockup: FundsLockupWithDeposit;

  onClaim(): void;
}

const ClaimEarly: React.FC<ContentProps> = ({ lockup, onClaim, loading }) => {
  const wallet = useWallet();

  const [checked, setChecked] = useState(false);

  const penalty = lockup.reward;
  const dates = getLockupDates(lockup);
  const amount = lockup.amount.div(wallet.inflationMultiplier);

  return (
    <Column gap="xl">
      <Column gap="lg" style={{ padding: "0 24px" }}>
        <Typography variant="h2">
          Lockup{" "}
          <Typography inline variant="h2" color="active">
            • Active
          </Typography>
        </Typography>
        <Typography variant="body1">
          You have <b>{formatNumber(tokensToNumber(amount))} ECO</b> in this
          lockup, earning {numberFormatter(lockup.interest)}%.
        </Typography>

        <ModalTextItem
          title="DURATION"
          text={
            <ReactCountdown
              date={lockup.endsAt}
              renderer={(countdownData) => {
                const remaining = formatCountdown(countdownData);
                return `${remaining.amount} ${remaining.unit} remain`;
              }}
            />
          }
          subtitle={
            lockupFormatDate(dates.start) + " - " + lockupFormatDate(dates.end)
          }
        />

        <ModalTextItem
          title="EARLY WITHDRAWAL PENALTY"
          text={`${numberFormatter(lockup.interest)}% Principle`}
          subtitle={`(e.g., ${numberFormatter(
            lockup.interest
          )} ECO for every 100 staked)`}
        />
      </Column>
      <Container gap="lg">
        <Typography variant="h5" style={{ lineHeight: 1 }}>
          Withdraw from lockup
        </Typography>

        <Row gap="lg">
          <div style={{ marginTop: 4 }}>
            <Checkbox
              width={24}
              height={24}
              color="#5F869F"
              checkColor="#59C785"
              backgroundColor="white"
              checked={checked}
              disabled={loading}
              onChange={setChecked}
            />
          </div>
          <Typography>
            I understand that proceeding with this transaction suffers a{" "}
            {formatNumber(tokensToNumber(penalty))} ECO penalty
          </Typography>
        </Row>

        <Column gap="md" items="start">
          <Row gap="md" items="center">
            <Button
              color="error"
              variant="fill"
              onClick={onClaim}
              disabled={loading || !checked}
              style={{ backgroundColor: "#ED575F" }}
            >
              {loading ? <LoaderAnimation /> : "Withdraw"}
            </Button>
            {loading && <TextLoader />}
          </Row>
          <GasFee gasLimit={230_500} />
        </Column>
      </Container>
    </Column>
  );
};

const LockupEnded: React.FC<ContentProps> = ({ lockup, onClaim, loading }) => {
  const wallet = useWallet();
  const account = useAccount();

  const dates = getLockupDates(lockup);
  const duration = formatDuration(lockup.duration);
  const amount = getLockupClaimAmount(lockup, wallet.inflationMultiplier);

  return (
    <Column gap="xl">
      <Column gap="lg" style={{ padding: "0 24px" }}>
        <Typography variant="h2">
          Lockup{" "}
          <Typography inline variant="h2" color="active">
            • Completed
          </Typography>
        </Typography>
        <Typography variant="body1">
          You have <b>{formatNumber(tokensToNumber(amount))} ECO</b> ready to
          claim.
        </Typography>

        <ModalTextItem
          title="DURATION"
          text={`${duration.amount} ${duration.unit}`}
          subtitle={
            lockupFormatDate(dates.start) + " - " + lockupFormatDate(dates.end)
          }
        />

        <ModalTextItem
          title="EARNED REWARD"
          text={<b>{formatNumber(tokensToNumber(lockup.reward))} ECO</b>}
        />
      </Column>
      <Container gap="lg">
        <Row gap="md">
          <Typography variant="body2" style={{ lineHeight: 1 }}>
            Funds will be deposit to
          </Typography>
          <Typography
            variant="body2"
            color="secondary"
            style={{ lineHeight: 1 }}
          >
            Eth Address {displayAddress(account.address)}
          </Typography>
        </Row>

        <Column gap="md" items="start">
          <Row gap="md" items="center">
            <Button
              color="success"
              variant="fill"
              onClick={onClaim}
              disabled={loading}
            >
              {loading ? <LoaderAnimation /> : "Claim"}
            </Button>
            {loading && <TextLoader />}
          </Row>
          <GasFee gasLimit={230_500} />
        </Column>
      </Container>
    </Column>
  );
};

export const LockupClaimModal: React.FC<LockupClaimModalProps> = ({
  isOpen,
  lockup,
  onRequestClose,
}) => {
  const wallet = useWallet();
  const hasEnded = useTimeFlag(lockup.endsAt);
  const lockupContract = useLockup(lockup.address);

  const [loading, setLoading] = useState(false);

  useBlockExit(loading);

  const claim = async () => {
    setLoading(true);
    try {
      const tx = await lockupContract.withdraw();
      await tx.wait();

      wallet.dispatch({
        type: WalletActionType.LockupWithdrawal,
        lockup,
        early: !hasEnded,
        inflationMultiplier: wallet.inflationMultiplier,
      });

      nativeToast(
        hasEnded
          ? "Lockup claim successfully"
          : "Lockup withdrawn successfully",
        toastOpts("#5AE4BF", "#F7FEFC")
      );
      onRequestClose();
    } catch (error) {
      txError("Failed to claim", error);
    }
    setLoading(false);
  };

  return (
    <Dialog
      isOpen={isOpen}
      style={{ card: { maxWidth: 540 } }}
      shouldCloseOnEsc={!loading}
      shouldShowCloseButton={!loading}
      shouldCloseOnOverlayClick={!loading}
      onRequestClose={onRequestClose}
    >
      {!hasEnded ? (
        <ClaimEarly lockup={lockup} onClaim={claim} loading={loading} />
      ) : (
        <LockupEnded lockup={lockup} onClaim={claim} loading={loading} />
      )}
    </Dialog>
  );
};
