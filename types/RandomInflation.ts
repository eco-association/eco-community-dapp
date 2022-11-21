import { BigNumber } from "ethers";
import { Address, RandomInflationClaim } from ".";

export type RandomInflation = {
  address: Address;
  numRecipients: BigNumber;
  reward: BigNumber;
  claimPeriodStarts: BigNumber;
  claimPeriodDuration: BigNumber;
  claims: RandomInflationClaim[];
  seedCommit: BigNumber;
  seedReveal: string; // bytes
  blockNumber: BigNumber;
  acceptedRootHash: string | null;
  inflationRootHashAccepted: boolean;
};
