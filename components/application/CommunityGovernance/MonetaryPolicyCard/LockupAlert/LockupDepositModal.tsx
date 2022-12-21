import React, { useState } from "react";
import {
  Alert,
  Button,
  Column,
  Dialog,
  DialogProps,
  formatNumber,
  Input,
  Row,
  styled,
  Typography,
} from "@ecoinc/ecomponents";
import { Zero } from "@ethersproject/constants";
import { ethers } from "ethers";
import { FundsLockup } from "../../../../../types";
import { GasFee } from "../../../commons/GasFee";
import { useBlockExit } from "../../../../hooks/useBlockExit";
import {
  formatDuration,
  getLockupDates,
  lockupFormatDate,
  numberFormatter,
  tokensToNumber,
  txError,
} from "../../../../../utilities";
import LoaderAnimation from "../../../Loader";
import TextLoader from "../../../commons/TextLoader";
import { useWallet } from "../../../../../providers";
import EcoLogoMedGray from "../../../../../public/images/eco-logo/eco-logo-gray-med.svg";
import Image from "next/image";
import { useLockup } from "../../../../hooks/contract/useLockup";
import { useAccount } from "wagmi";
import { useECO } from "../../../../hooks/contract/useECO";
import { WalletActionType } from "../../../../../providers/WalletProvider";
import { ModalTextItem } from "../../../Account/EcoCard/ModalTextItem";

interface LockupModalProps extends Pick<DialogProps, "isOpen"> {
  lockup: FundsLockup;

  onRequestClose(): void;
}

const Container = styled(Column)(({ theme }) => ({
  padding: "16px 24px",
  borderRadius: 4,
  backgroundColor: theme.palette.background.paper,
}));

const MaxButton = styled(Button)({
  height: 24,
  fontSize: 13,
  lineHeight: 1,
  padding: "4px 8px",
  alignSelf: "center",
  minWidth: "initial",
  fontWeight: "initial",
});

const LockupDepositModal: React.FC<LockupModalProps> = ({
  isOpen,
  lockup,
  onRequestClose,
}) => {
  const account = useAccount();
  const wallet = useWallet();
  const eco = useECO();

  const lockupContract = useLockup(lockup.address);

  const [loading, setLoading] = useState(false);
  const [depositAmount, setDepositAmount] = useState(Zero);

  useBlockExit(loading);

  const deposit = async () => {
    setLoading(true);
    try {
      const allowance = await eco.allowance(account.address, lockup.address);
      if (allowance.lt(depositAmount)) {
        const approveTx = await eco.approve(lockup.address, depositAmount);
        await approveTx.wait();
      }
      const tx = await lockupContract.deposit(depositAmount);
      await tx.wait();

      const reward = depositAmount.mul(lockup.interest * 1e7).div(1e9);
      wallet.dispatch({
        type: WalletActionType.LockupDeposit,
        lockup,
        reward,
        amount: depositAmount,
        address: account.address,
        inflationMultiplier: wallet.inflationMultiplier,
      });

      setDepositAmount(Zero);
      onRequestClose();
    } catch (error) {
      txError("Failed to deposit", error);
    }
    setLoading(false);
  };

  const setAmount = (e) => {
    e.preventDefault();
    try {
      const _amount =
        e.target.value === "" ? Zero : ethers.utils.parseEther(e.target.value);
      setDepositAmount(_amount);
    } catch (e) {}
  };

  const error = depositAmount.gt(wallet.ecoBalance);

  const { start: startDate, end: endDate } = getLockupDates(lockup);
  const duration = formatDuration(lockup.duration);

  const disabled = loading || wallet.ecoBalance.isZero();

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
          <Typography variant="h2">Lockup</Typography>
          <Typography variant="body1">
            Deposit some or all of your ECO for a defined period of time to earn
            interest.{" "}
            <Typography variant="body1" color="info">
              Note: removing your ECO from the contract early will result in a
              penalty of {numberFormatter(lockup.interest * 100)}% of your
              deposited amount.
            </Typography>
          </Typography>

          <ModalTextItem
            title="LOCKUP RATE"
            text={`${numberFormatter(lockup.interest * 100)}%`}
          />
          <ModalTextItem
            title="DURATION"
            text={`${duration.amount} ${duration.unit}`}
            subtitle={
              lockupFormatDate(startDate) + " - " + lockupFormatDate(endDate)
            }
          />
        </Column>
        <Container gap="lg">
          <Column gap="sm">
            <Row items="center">
              <Typography style={{ marginRight: 4 }}>
                Deposit your ECO
              </Typography>
              <Image
                src={EcoLogoMedGray}
                alt="eco token"
                layout="fixed"
                width={15}
                height={15}
              />
              <Typography color="secondary">
                {formatNumber(tokensToNumber(wallet.ecoBalance))} Available
              </Typography>
            </Row>
            <Input
              type="number"
              min="0"
              disabled={disabled || error}
              value={tokensToNumber(depositAmount)}
              color={error ? "error" : "secondary"}
              onChange={(e) => setAmount(e)}
              placeholder="0.000 ECO"
              append={
                <MaxButton
                  disabled={disabled}
                  variant="outline"
                  color={error ? "primary" : "active"}
                  onClick={() => setDepositAmount(wallet.ecoBalance)}
                >
                  Max
                </MaxButton>
              }
            />
          </Column>
          <Column gap="md" items="start">
            <Row gap="md" items="center">
              <Button
                variant="fill"
                color="success"
                onClick={deposit}
                disabled={disabled || depositAmount.isZero() || error}
              >
                {loading ? <LoaderAnimation /> : "Deposit"}
              </Button>
              {loading && <TextLoader />}
            </Row>
            <GasFee gasLimit={500_000} />
          </Column>
        </Container>
        {wallet.ecoBalance.isZero() ? (
          <Alert
            color="error"
            title="😭 You have 0.000 ECO"
            style={{ backgroundColor: "white" }}
          >
            <Typography color="secondary">
              Alas, you need Eco in order to participate in benefits like
              earning interest from Lockups, you need to have ECO to stake. Have
              you thought about buying some? Or, you can unbank with Eco and
              earn ECO for free! Check it out.
            </Typography>
          </Alert>
        ) : null}
      </Column>
    </Dialog>
  );
};

export default LockupDepositModal;
