import { BigNumber } from "ethers";

type ProposalType = {
  id: string;
  url: string;
  name: string;
  address: string;
  description: string;
  proposer: string;
  refunded: boolean;
  supported: boolean;
  supportedAt?: Date;
  totalStake: BigNumber;
  reachedSupportThreshold: boolean;
};

export type { ProposalType };
