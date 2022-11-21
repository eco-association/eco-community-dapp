import { BigNumber } from "ethers";
import { Address } from ".";

type FundsLockupDeposit = {
  depositer: Address;
  amount: BigNumber;
  reward: BigNumber;
  lockupEndsAt: number;
  delegate: Address;
};

export type { FundsLockupDeposit };
