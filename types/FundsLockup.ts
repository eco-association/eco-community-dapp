import { BigNumber } from "ethers";

export interface FundsLockup {
  address: string;
  depositWindowDuration: number;
  depositWindowEndsAt: Date;
  duration: number; // in days
  generation: number;
  interest: number; // 0 - 100 percent
}

export interface FundsLockupWithDeposit extends FundsLockup {
  id: string;
  delegate: string;
  amount: BigNumber;
  reward: BigNumber;
  lockupEndsAt: Date;
  withdrawnAt: Date | null;
}
