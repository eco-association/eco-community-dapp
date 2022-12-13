import { FundsLockup, ProposalType, Stage } from "./";
import { BigNumber } from "ethers";
import { Generation, SubgraphVoteResult } from "../queries/CURRENT_GENERATION";
import { Vote } from "../providers/CommunityProvider";
import { RandomInflation } from "./RandomInflation";

export interface BasicPolicyVote {
  policyId?: string;
  voteEnds?: Date;
  result?: SubgraphVoteResult;
  yesStake: BigNumber;
  requiredStake: BigNumber;
  majorityReachedAt?: Date;
}

export interface PolicyVote extends BasicPolicyVote {
  enactionDelay?: number;
  selectedProposal?: ProposalType;
  totalVotingPower: BigNumber;
  voted?: Vote;
}

interface CommunityInterface extends PolicyVote {
  generation: Generation;
  proposals: ProposalType[];
  stage: Stage;
  nextGenerationStartsAt: Date | null;
  lockup?: FundsLockup;
  randomInflation?: RandomInflation;
  currentGeneration: {
    number: number;
    blockNumber: number;
    createdAt: Date;
  };
}

export type { CommunityInterface };
