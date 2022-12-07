import { BigNumber } from "ethers";

export interface FundsLockup {
  address: string;
  duration: number; // in days
  generation: number;
  interest: number; // 0 - 100 percent
  depositWindowDuration: number;
  depositWindowEndsAt: Date;
  endsAt: Date;
}

export interface FundsLockupWithDeposit extends FundsLockup {
  id: string;
  delegate: string;
  amount: BigNumber;
  reward: BigNumber;
  withdrawnAt: Date | null;
}
