import { BigNumber } from "ethers";
import { Address } from ".";

export type RandomInflationRecipient = {
  sequenceNumber: number;
  recipient: string;
  proof: string[];
  leafSum: BigNumber;
  index: number;
  claimed: boolean;
};
