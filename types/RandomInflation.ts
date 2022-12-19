import { BigNumber } from "ethers";
import { RandomInflationRecipient } from "./RandomInflationRecipient";

export interface RandomInflation {
  address: string;
  reward: BigNumber;
  numRecipients: number;
  claimPeriodStarts: Date;
  claimPeriodDuration: number;
  seedCommit: BigNumber;
  seedReveal: string; // bytes
  blockNumber: number;
}

export interface RandomInflationWithClaims extends RandomInflation {
  isClaimPeriod: boolean;
  acceptedRootHash: string | null;
  inflationRootHashAccepted: boolean;
  claims: RandomInflationClaim[];
  recipients: RandomInflationRecipient[];
}

export type RandomInflationClaim = {
  sequenceNumber: number;
  claimedFor: string;
};
