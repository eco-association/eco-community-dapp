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
  tokensToNumber,
  getLockupDates,
  formatDuration,
  numberFormatter,
  txError,
} from "../../../../../utilities";
import LoaderAnimation from "../../../Loader";
import TextLoader from "../../../commons/TextLoader";
import { useWallet } from "../../../../../providers";
import EcoLogoMedGray from "../../../../../public/images/eco-logo/eco-logo-gray-med.svg";
import Image from "next/image";
import { useLockup } from "../../../../hooks/contract/useLockup";
import moment from "moment";
import { useAccount } from "wagmi";
import { useECO } from "../../../../hooks/contract/useECO";

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

const formatDate = (date: Date) => moment(date).format("MMM DD, YYYY");

const LockupDepositModal: React.FC<LockupModalProps> = ({
  isOpen,
  lockup,
  onRequestClose,
}) => {
  const account = useAccount();
  const wallet = useWallet();
  const eco = useECO();
  const lockupContract = useLockup(lockup.address);

  const [depositAmount, setDepositAmount] = useState(Zero);
  const [loading, setLoading] = useState(false);

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
            {/*TODO: Add penalty*/}
            Stake some or all of your ECO for a defined period of time to earn
            interest. Note: removing your ECO from the contract early will
            result in a penalty of xyz.
          </Typography>

          <Column>
            <Typography variant="subtitle1" color="secondary">
              DURATION
            </Typography>
            <Row gap="sm">
              <Typography>
                {duration.amount} {duration.unit}
              </Typography>
              <Typography color="secondary">
                {formatDate(startDate)} - {formatDate(endDate)}
              </Typography>
            </Row>
          </Column>
        </Column>
        <Container gap="lg">
          <Typography variant="h5" style={{ lineHeight: 1 }}>
            Earn {numberFormatter(lockup.interest)}% Reward
          </Typography>
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
