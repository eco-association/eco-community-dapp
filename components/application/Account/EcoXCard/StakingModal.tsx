import React, { useMemo, useState } from "react";
import {
  Button,
  Column,
  Dialog,
  Row,
  styled,
  Typography,
} from "@ecoinc/ecomponents";
import { useAccount } from "wagmi";
import { displayAddress } from "../../../../utilities";
import useStaking, {
  formatStakeAmount,
  StakingStatus,
} from "../../../hooks/useStaking";
import LoaderAnimation from "../../Loader";
import { useBlockExit } from "../../../hooks/useBlockExit";
import { WalletInterface } from "../../../../types";
import TextLoader from "../../commons/TextLoader";
import InputTokenAmount from "../../commons/InputTokenAmount";
import { useForm } from "react-hook-form";
import { BigNumber } from "ethers";
import { Zero } from "@ethersproject/constants";
import { GasFee } from "../../commons/GasFee";
import { Steps } from "../VotingPowerCard/ManageDelegationModal/Steps";
import useResponsiveDialog from "../../../hooks/useResponsiveDialog";

interface StakingModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  balances: WalletInterface;
}

const Container = styled(Column)(({ theme }) => ({
  padding: "24px 16px",
  borderRadius: 4,
  backgroundColor: theme.palette.background.paper,
}));

const Note = styled(Column)(({ theme, active, error }) => ({
  height: active ? 70 : 0,
  padding: active ? 8 : 0,
  opacity: active ? 1 : 0,
  marginTop: active ? 16 : 0,
  backgroundColor: error ? theme.palette.error.bg : theme.palette.active.bg,
  transitionDuration: "0.2s",
  transitionProperty: "marginTop,height opacity",
}));

const StakingModal: React.FC<StakingModalProps> = ({
  open,
  setOpen,
  balances,
}) => {
  const account = useAccount();
  const dialogStyles = useResponsiveDialog();

  const { increaseStake, decreaseStake, loading } = useStaking();

  const [txStatus, setTxStatus] = useState<{
    steps: number;
    status: StakingStatus;
  }>(null);

  const { watch, setValue, register, getFieldState } = useForm<{
    stake: BigNumber;
  }>({
    defaultValues: { stake: Zero },
    mode: "onChange",
  });

  const staked = watch("stake");
  const { isTouched } = getFieldState("stake");

  const amountDiff = useMemo(() => {
    if (staked.gt(balances.sEcoXBalance))
      return staked.sub(balances.sEcoXBalance);
    return balances.sEcoXBalance.sub(staked);
  }, [balances.sEcoXBalance, staked]);

  useBlockExit(loading);

  const stake = () => {
    const onComplete = () => {
      setOpen(false);
      setTxStatus(null);
    };
    if (staked.gt(balances.sEcoXBalance)) {
      const onUpdateState = (status, steps) => setTxStatus({ steps, status });
      return increaseStake(amountDiff, onComplete, onUpdateState);
    }
    return decreaseStake(amountDiff, onComplete);
  };

  const totalECOx = balances.ecoXBalance.add(balances.sEcoXBalance);
  const error = staked.gt(totalECOx);
  const hasChanged = isTouched && !amountDiff.isZero();
  const showStakeAlert = isTouched && balances.sEcoXBalance.lt(staked);
  const showUnstakeAlert = isTouched && balances.sEcoXBalance.gt(staked);

  const formattedStakedAmount = formatStakeAmount(balances.sEcoXBalance);

  return (
    <Dialog
      isOpen={open}
      style={dialogStyles}
      shouldCloseOnEsc={!loading}
      shouldShowCloseButton={!loading}
      shouldCloseOnOverlayClick={!loading}
      onRequestClose={() => setOpen(false)}
    >
      <Column gap="xl">
        <Column gap="lg" style={{ padding: "0 16px" }}>
          <Typography variant="h2">Manage your ECOx Staking</Typography>
          <Typography variant="body1">
            You can stake or unstake any amount at any time to change your
            voting power.{" "}
            <b>
              ECOx must be staked in order to count toward voting power. All
              changes take effect at the start of the next generation.
            </b>
          </Typography>
        </Column>
        <Container>
          <InputTokenAmount
            {...register("stake")}
            label="Staked"
            value={staked}
            disabled={loading}
            maxValue={totalECOx}
            onChange={(amount) =>
              setValue("stake", amount, {
                shouldTouch: true,
              })
            }
            color={error ? "error" : "secondary"}
            placeholder={`${formattedStakedAmount} currently staked`}
          />
          <Note gap="sm" active={error} error={error}>
            <Typography variant="body3" color="error">
              Error
            </Typography>
            <Typography variant="body2" color="error">
              You cannot stake an amount of ECOx greater than your balance.
            </Typography>
          </Note>
          <Note gap="sm" active={!error && showUnstakeAlert}>
            <Typography variant="body3" color="active">
              Note
            </Typography>
            <Typography variant="body2">
              You are about to unstake {formatStakeAmount(amountDiff)} ECOx to
              your wallet {displayAddress(account.address)}.
            </Typography>
          </Note>
          <Note gap="sm" active={!error && showStakeAlert}>
            <Typography variant="body3" color="active">
              Note
            </Typography>
            <Typography variant="body2">
              You are about to stake {formatStakeAmount(amountDiff)} ECOx.
            </Typography>
          </Note>
          <Column gap="md" style={{ marginTop: 16 }} items="start">
            <Row gap="md" items="center">
              <Button
                variant="fill"
                color="success"
                onClick={stake}
                disabled={!hasChanged || error}
              >
                {loading ? <LoaderAnimation /> : "Update"}
              </Button>
              {loading && (!showStakeAlert || txStatus) ? (
                showStakeAlert && txStatus.steps > 1 ? (
                  <Steps
                    totalSteps={txStatus.steps}
                    currentStep={
                      txStatus.status === StakingStatus.APPROVING ? 1 : 2
                    }
                    status={
                      txStatus.status === StakingStatus.APPROVING
                        ? "Approving Tokens..."
                        : "Staking tokens..."
                    }
                  />
                ) : (
                  <TextLoader />
                )
              ) : null}
            </Row>
            <GasFee gasLimit={230_000} />
          </Column>
        </Container>
      </Column>
    </Dialog>
  );
};

export default StakingModal;
