import { Address } from ".";

export type RandomInflationClaim = {
  sequenceNumber: number;
  claimedFor: Address;
};
