import React, { useState } from "react";
import {
  Alert,
  Button,
  Column,
  Dialog,
  DialogProps,
  formatNumber,
  Row,
  styled,
  Typography,
} from "@ecoinc/ecomponents";
import { Zero } from "@ethersproject/constants";
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
import { useWallet } from "../../../../../providers";
import EcoLogoMedGray from "../../../../../public/images/eco-logo/eco-logo-gray-med.svg";
import Image from "next/image";
import { useLockup } from "../../../../hooks/contract/useLockup";
import { useAccount } from "wagmi";
import { useECO } from "../../../../hooks/contract/useECO";
import { WalletActionType } from "../../../../../providers/WalletProvider";
import { ModalTextItem } from "../../../Account/EcoCard/ModalTextItem";
import InputTokenAmount from "../../../commons/InputTokenAmount";
import { toast as nativeToast } from "react-toastify";
import { toastOpts } from "../../../../../utilities/toastUtils";
import { Steps } from "../../../Account/VotingPowerCard/ManageDelegationModal/Steps";

interface LockupModalProps extends Pick<DialogProps, "isOpen"> {
  lockup: FundsLockup;

  onRequestClose(): void;
}

const Container = styled(Column)(({ theme }) => ({
  padding: "16px 24px",
  borderRadius: 4,
  backgroundColor: theme.palette.background.paper,
}));

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
  const [stepState, setStep] = useState<{
    step: number;
    status: string;
    totalSteps: number;
  }>(null);

  useBlockExit(loading);

  const deposit = async () => {
    setLoading(true);
    try {
      const allowance = await eco.allowance(account.address, lockup.address);
      if (allowance.lt(depositAmount)) {
        setStep({ step: 1, totalSteps: 2, status: "Approving tokens..." });
        const approveTx = await eco.approve(lockup.address, depositAmount);
        await approveTx.wait();
        setStep((state) => ({
          ...state,
          step: 2,
          status: "Depositing tokens...",
        }));
      } else {
        setStep({ step: 1, totalSteps: 1, status: "Depositing tokens..." });
      }

      const previousDeposit = wallet.lockups.find(
        (_lockup) => lockup.address === _lockup.address
      );

      const tx = await lockupContract.deposit(depositAmount);
      await tx.wait();

      const reward = depositAmount
        .mul((lockup.interest * 1e7).toFixed(0))
        .div(1e9);

      wallet.dispatch({
        type: WalletActionType.LockupDeposit,
        lockup,
        reward,
        amount: depositAmount,
        address: account.address,
        inflationMultiplier: wallet.inflationMultiplier,
        previousDeposit,
      });

      nativeToast(
        "Successfully deposited to the Lockup",
        toastOpts("#5AE4BF", "#F7FEFC")
      );
      setDepositAmount(Zero);
      onRequestClose();
    } catch (error) {
      txError("Failed to deposit", error);
    }
    setStep(null);
    setLoading(false);
  };

  const error = depositAmount.gt(wallet.ecoBalance);

  const { start: startDate, end: endDate } = getLockupDates(lockup);
  const duration = formatDuration(lockup.duration);

  const disabled = loading || wallet.ecoBalance.isZero();

  const penalty = depositAmount
    .mul((lockup.interest * 1e7).toFixed(0))
    .div(1e9);

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
            <b>
              Note: removing your ECO from the contract early will result in a
              penalty of {numberFormatter(tokensToNumber(penalty))} ECO.
            </b>
          </Typography>
          <ModalTextItem
            title="LOCKUP RATE"
            text={`${numberFormatter(lockup.interest)}%`}
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
            <InputTokenAmount
              placeholder="0.000 ECO"
              value={depositAmount}
              maxValue={wallet.ecoBalance}
              onChange={setDepositAmount}
              disabled={disabled}
              color={error ? "error" : "secondary"}
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
              {loading && stepState && (
                <Steps
                  status={stepState.status}
                  currentStep={stepState.step}
                  totalSteps={stepState.totalSteps}
                />
              )}
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
