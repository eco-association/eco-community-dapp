import { BigNumber } from "ethers";
import { RandomInflationWithClaims } from "./RandomInflation";

export type RandomInflationRecipient = {
  index: number;
  proof: string[];
  claimed: boolean;
  recipient: string;
  sequenceNumber: number;
  leafSum: BigNumber;
  claimableAt: Date;
  randomInflation: RandomInflationWithClaims;
};
