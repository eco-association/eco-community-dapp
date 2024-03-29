import { BigNumber } from "ethers";
import { useState } from "react";
import { toast as nativeToast } from "react-toastify";
import { useContractAddresses, useWallet } from "../../providers";
import { tokensToNumber, txError } from "../../utilities";
import { useECOx } from "./contract/useECOx";
import { useECOxStaking } from "./contract/useECOxStaking";
import { ToastOptions } from "react-toastify/dist/types";
import { useAccount } from "wagmi";
import { WalletActionType } from "../../providers/WalletProvider";

const successfulToastStyle: ToastOptions = {
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: true,
  theme: "colored",
  style: {
    backgroundColor: "#F7FEFC",
    border: "solid 1px #5AE4BF",
    color: "#22313A",
    top: "7.19em",
  },
};

const formatterMax6Decimals = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 6,
});

export function formatStakeAmount(staked: BigNumber) {
  return formatterMax6Decimals.format(tokensToNumber(staked));
}

export enum StakingStatus {
  APPROVING,
  STAKING,
}

const useStaking = () => {
  const wallet = useWallet();
  const account = useAccount();

  const ecoX = useECOx();
  const staking = useECOxStaking();
  const { sEcoX } = useContractAddresses();

  const [loading, setLoading] = useState(false);

  const increaseStake = async (
    amount: BigNumber,
    onComplete: () => void,
    onState: (status: StakingStatus, steps: number) => void
  ) => {
    setLoading(true);
    let steps = 2;
    try {
      const allowance = await ecoX.allowance(account.address, sEcoX);
      if (allowance.lt(amount)) {
        onState(StakingStatus.APPROVING, steps);
        const approveTx = await ecoX.approve(sEcoX, amount);
        await approveTx.wait();
      } else {
        steps = 1;
      }
      onState(StakingStatus.STAKING, steps);
      const tx = await staking.deposit(amount);
      await tx.wait();

      wallet.dispatch({ type: WalletActionType.Stake, amount });

      onComplete();
      nativeToast(
        `🚀 Staked ${formatStakeAmount(amount)} ECOx successfully`,
        successfulToastStyle
      );
    } catch (err) {
      txError("Failed to increase stake", err);
    }
    setLoading(false);
  };

  const decreaseStake = async (amount: BigNumber, onComplete: () => void) => {
    try {
      setLoading(true);
      const tx = await staking.withdraw(amount);
      await tx.wait();

      wallet.dispatch({ type: WalletActionType.Unstake, amount });

      onComplete();
      nativeToast(
        `🚀 Unstaked ${formatStakeAmount(amount)} ECOx successfully`,
        successfulToastStyle
      );
    } catch (err) {
      txError("Failed to decrease stake", err);
    }
    setLoading(false);
  };
  return { increaseStake, decreaseStake, loading };
};

export default useStaking;
