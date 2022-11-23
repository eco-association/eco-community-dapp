import { GenerationStage, ProposalType, Stage } from "./";
import { BigNumber } from "ethers";
import { Generation } from "../queries/CURRENT_GENERATION";
import { Vote } from "../providers/CommunityProvider";

export interface PolicyVote {
  yesStake: BigNumber;
  requiredStake: BigNumber;
  totalVotingPower: BigNumber;
  enactionDelay?: number;
  policyId?: string;
  selectedProposal?: ProposalType;
  majorityReachedAt?: Date;
  voteEnds?: Date;
  voted?: Vote;
  result?: GenerationStage;
}

interface CommunityInterface extends PolicyVote {
  generation: Generation;
  proposals: ProposalType[];
  stage: Stage;
  nextGenerationStartsAt: Date | null;
  currentGeneration: {
    number: number;
    blockNumber: number;
    createdAt: Date;
  };
}

export type { CommunityInterface };
