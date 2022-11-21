import { BigNumber } from "ethers";
import { Address } from ".";

export type ProposalVote = {
  voter: Address;
  yesAmount: BigNumber;
  totalAmount: BigNumber;
};
