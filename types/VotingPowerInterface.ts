import { BigNumber } from "ethers";

interface VotingPowerInterface {
  totalVotingPower: BigNumber;
  blockNumber: BigNumber;
}

export type { VotingPowerInterface };
