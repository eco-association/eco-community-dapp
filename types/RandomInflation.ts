import { BigNumber } from "ethers";
import { RandomInflationClaim } from ".";

export type RandomInflation = {
  address: string;
  numRecipients: BigNumber;
  reward: BigNumber;
  claimPeriodStarts: BigNumber;
  claimPeriodDuration: BigNumber;
  claims: RandomInflationClaim[];
  seedCommit: BigNumber;
  seedReveal: string; // bytes
  blockNumber: number;
  acceptedRootHash: string | null;
  inflationRootHashAccepted: boolean;
};
