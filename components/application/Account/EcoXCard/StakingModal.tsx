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
import { useGasFee } from "../../../hooks/useGasFee";
import useStaking, {
  formatStakeAmount,
  formatStakedAmount,
} from "../../../hooks/useStaking";
import LoaderAnimation from "../../Loader";
import { useBlockExit } from "../../../hooks/useBlockExit";
import { WalletInterface } from "../../../../types";
import TextLoader from "../../commons/TextLoader";
import InputTokenAmount from "../../commons/InputTokenAmount";

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
  const gasFee = useGasFee(500_000);
  const { increaseStake, decreaseStake, loading } = useStaking();

  const [staked, setStaked] = useState(balances.sEcoXBalance);

  const amountChange = useMemo(() => {
    if (staked.gt(balances.sEcoXBalance))
      return staked.sub(balances.sEcoXBalance);
    return balances.sEcoXBalance.sub(staked);
  }, [balances.sEcoXBalance, staked]);

  useBlockExit(loading);

  const stake = () => {
    const onComplete = () => setOpen(false);
    if (staked.gt(balances.sEcoXBalance)) {
      increaseStake(amountChange, onComplete);
    } else {
      decreaseStake(amountChange, onComplete);
    }
  };

  const totalECOx = balances.ecoXBalance.add(balances.sEcoXBalance);
  const error = staked.gt(totalECOx);
  const hasChanged = !amountChange.isZero();
  const showStakeAlert = balances.sEcoXBalance.lt(staked);
  const showUnstakeAlert = balances.sEcoXBalance.gt(staked);

  const formattedStakedAmount = formatStakeAmount(balances.sEcoXBalance);

  return (
    <Dialog
      isOpen={open}
      style={{ card: { maxWidth: 540 } }}
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
            <b>ECOx must be staked in order to count toward voting power.</b>
          </Typography>
        </Column>
        <Container>
          <InputTokenAmount
            label="Staked"
            value={staked}
            maxValue={totalECOx}
            onChange={setStaked}
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
              You are about to unstake {formatStakeAmount(amountChange)} ECOx to
              your wallet {displayAddress(account.address)}.
            </Typography>
          </Note>
          <Note gap="sm" active={!error && showStakeAlert}>
            <Typography variant="body3" color="active">
              Note
            </Typography>
            <Typography variant="body2">
              You are about to stake {formatStakeAmount(amountChange)} ECOx.
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
              {loading && <TextLoader />}
            </Row>
            <Typography variant="body3">
              Estimated Gas Fee:{" "}
              <Typography variant="body3" color="secondary">
                {gasFee} ETH
              </Typography>
            </Typography>
          </Column>
        </Container>
      </Column>
    </Dialog>
  );
};

export default StakingModal;
