import React, { useMemo, useState } from "react";
import {
  Button,
  ButtonGroup,
  Column,
  Dialog,
  Input,
  Row,
  styled,
  Typography,
} from "@ecoinc/ecomponents";
import { useAccount } from "wagmi";
import { displayAddress, tokensToNumber } from "../../../../utilities";
import { useGasFee } from "../../../hooks/useGasFee";
import useStaking, {
  formatStakeAmount,
  formatStakedAmount,
} from "../../../hooks/useStaking";
import LoaderAnimation from "../../Loader";
import { useBlockExit } from "../../../hooks/useBlockExit";
import { WalletInterface } from "../../../../types";
import { css } from "@emotion/react";
import TextLoader from "../../commons/TextLoader";
import { Zero } from "@ethersproject/constants";
import { ethers } from "ethers";

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

const inputStyle = css({
  "&::placeholder": {
    opacity: 0.7,
    color: "#5F869F",
  },
});

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
  const setStake = (e) => {
    e.preventDefault();
    try {
      const _staked =
        e.target.value === "" ? Zero : ethers.utils.parseEther(e.target.value);
      setStaked(_staked);
    } catch (e) {}
  };

  const totalECOx = balances.ecoXBalance.add(balances.sEcoXBalance);
  const error = staked.gt(totalECOx);
  const hasChanged = !amountChange.isZero();
  const showStakeAlert = balances.sEcoXBalance.lt(staked);
  const showUnstakeAlert = balances.sEcoXBalance.gt(staked);

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
            You have <b>{formatStakedAmount(totalECOx)} ECOx</b>. You can stake
            or unstake any amount at any time to change your voting power.{" "}
            <b>ECOx must be staked in order to count toward voting power.</b>
          </Typography>
        </Column>
        <Container>
          <Input
            type="number"
            label="Staked"
            css={inputStyle}
            value={staked.isZero() ? "" : tokensToNumber(staked)}
            color={error ? "error" : "secondary"}
            onChange={(e) => setStake(e)}
            placeholder={`${formatStakeAmount(
              balances.sEcoXBalance
            )} currently staked`}
            append={
              <ButtonGroup>
                <Button
                  variant="outline"
                  color={error ? "primary" : "active"}
                  onClick={() => setStaked(totalECOx)}
                >
                  All
                </Button>
                <Button
                  variant="outline"
                  color={error ? "primary" : "active"}
                  onClick={() => setStaked(Zero)}
                >
                  None
                </Button>
              </ButtonGroup>
            }
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
