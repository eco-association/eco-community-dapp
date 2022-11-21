import { BigNumber } from "ethers";
import { Address, FundsLockupDeposit } from ".";

type FundsLockup = {
  address: Address;
  depositWindowDuration: number;
  depositWindowEndsAt: Date;
  duration: number; // in days
  generation: number;
  interest: number; // 0 - 100 percent
  totalLocked: BigNumber;
  deposits: FundsLockupDeposit[];
};

export type { FundsLockup };
