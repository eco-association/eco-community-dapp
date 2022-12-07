import React, { createContext, useContext, useEffect, useReducer } from "react";

import { BigNumber } from "ethers";

import { useQuery } from "@apollo/client";
import { CURRENT_GENERATION, CurrentGenerationQueryResult } from "../queries";

import {
  CommunityInterface,
  GenerationStage,
  ProposalType,
  Stage,
} from "../types";
import {
  CurrentGenerationQueryVariables,
  Generation,
  SubgraphPolicyVote,
  SubgraphProposal,
  SubgraphVoteResult,
} from "../queries/CURRENT_GENERATION";
import { Zero } from "@ethersproject/constants";
import { useAccount } from "wagmi";
import { PolicyVote } from "../types/CommunityInterface";
import { toast as nativeToast } from "react-toastify";
import { adjustVotingPower } from "../utilities/adjustVotingPower";
import { convertDate } from "../utilities/convertDate";
import { PastProposalsQuery } from "../queries/PAST_PROPOSALS_QUERY";
import { ProposalQueryResult } from "../queries/PROPOSAL_QUERY";
import { formatLockup } from "../utilities";
import { formatRandomInflation } from "../utilities/randomInflationTools";

const defaultValue: CommunityInterface = {
  generation: null,
  proposals: [],

  yesStake: BigNumber.from(0),
  requiredStake: BigNumber.from(0),
  totalVotingPower: BigNumber.from(0),

  enactionDelay: null,
  selectedProposal: null,
  majorityReachedAt: null,
  nextGenerationStartsAt: new Date(Number.MAX_SAFE_INTEGER),

  currentGeneration: { blockNumber: 0, number: 0 },
  stage: { name: null, endsAt: null },
};

interface CommunityContextData extends CommunityInterface {
  dispatch: React.Dispatch<CommunityAction>;
}

/**
 * keeps track of all attributes in the ICommunityContext interface
 * through continuous polling of the subgraph
 */
export const CommunityContext = createContext<CommunityContextData>({
  ...defaultValue,
  generation: null,
  dispatch: () => ({}),
});

/**
 * Get Proposals
 *
 * Set proposals and filter out ones that have
 * been refunded or reached the support threshold.
 * @returns {Array} list of proposals (or refundables if enactment vote has started)
 */
function getProposals(generation: Generation) {
  return generation.communityProposals.map(Community.formatProposal);
}

export enum Vote {
  YES = "yes",
  NO = "no",
}

export enum Support {
  YES = "yes",
  NO = "no",
}

class Community {
  public readonly policyVote?: PolicyVote;

  private readonly generation: Generation;
  private proposals: ProposalType[];

  constructor(generation: Generation) {
    this.generation = generation;
    this.policyVote = this.getPolicyVote(generation.policyVote);
    this.proposals = getProposals(this.generation);
  }

  static formatDate(date?: string): Date {
    if (!date) return null;
    return new Date(parseInt(date) * 1000);
  }

  static getData(generation: Generation) {
    return new Community(generation).getData();
  }

  static formatProposal(proposal?: SubgraphProposal): ProposalType {
    if (!proposal) return null;
    const supportedAt = proposal.support.length
      ? convertDate(proposal.support[0].createdAt)
      : undefined;

    return {
      ...proposal,
      supportedAt,
      address: proposal.address,
      proposer: proposal.proposer,
      supported: !!proposal.support?.length,
      totalStake: adjustVotingPower(proposal.totalStake),
    };
  }

  private static hasReachedQuorum(proposals: ProposalType[]): boolean {
    return proposals.some((proposal) => proposal.reachedSupportThreshold);
  }

  setProposals(proposals: ProposalType[]) {
    this.proposals = proposals;
  }

  vote(voteFor: boolean, votingPower: BigNumber) {
    if (this.policyVote.policyId) {
      const prevVote = this.policyVote.voted;
      this.policyVote.voted = voteFor ? Vote.YES : Vote.NO;

      if (prevVote) {
        if (prevVote === Vote.YES) {
          this.policyVote.yesStake = this.policyVote.yesStake.sub(votingPower);
        }
      } else {
        this.policyVote.requiredStake =
          this.policyVote.requiredStake.add(votingPower);
      }

      if (voteFor) {
        this.policyVote.yesStake = this.policyVote.yesStake.add(votingPower);
      }
    }
  }

  getPolicyVote(policyVote: SubgraphPolicyVote): PolicyVote {
    if (policyVote) {
      let voted;

      if (policyVote.votes.length) {
        const { yesAmount } = policyVote.votes[0];
        voted = BigNumber.from(yesAmount).isZero() ? Vote.NO : Vote.YES;
      }

      return {
        voted,
        policyId: policyVote.id,
        yesStake: adjustVotingPower(policyVote.yesVoteAmount),
        requiredStake: adjustVotingPower(policyVote.totalVoteAmount),
        totalVotingPower: adjustVotingPower(policyVote.totalVotingPower),
        enactionDelay: parseInt(policyVote.ENACTION_DELAY) * 1000,
        selectedProposal: Community.formatProposal(policyVote.proposal),
        majorityReachedAt: Community.formatDate(policyVote.majorityReachedAt),
        voteEnds: Community.formatDate(policyVote.voteEnds),
        result: policyVote.result
          ? GenerationStage[policyVote.result]
          : undefined,
      };
    }
    return {
      yesStake: Zero,
      requiredStake: Zero,
      totalVotingPower: Zero,
    };
  }

  getData(): Omit<
    CommunityInterface,
    "generation" | "pastProposals" | "proposals"
  > {
    return {
      ...this.policyVote,
      totalVotingPower: adjustVotingPower(
        this.generation.policyProposal.totalVotingPower
      ),
      nextGenerationStartsAt: Community.formatDate(
        this.generation.nextGenerationStart
      ),
      stage: this.getStage(),
      currentGeneration: {
        blockNumber: parseInt(this.generation.blockNumber),
        number: parseInt(this.generation.number),
      },
    };
  }

  getStage(): Stage {
    return {
      name: this.getName(),
      endsAt: this.getEndsAt(),
    };
  }

  getEndsAt() {
    if (this.policyVote.voteEnds) return this.policyVote.voteEnds;
    return Community.formatDate(this.generation.policyProposal.proposalEnds);
  }

  getName(): GenerationStage {
    if (this.policyVote && this.policyVote.policyId) {
      const { result, voteEnds, yesStake, requiredStake, totalVotingPower } =
        this.policyVote;

      // Return the result
      if (result) return result;

      if (voteEnds.getTime() > Date.now()) {
        // vote still in progress, check for early majority
        if (yesStake.gte(totalVotingPower.div(2)))
          return GenerationStage.Majority;

        return GenerationStage.Vote;
      }

      // vote time is over, check result before enaction
      if (requiredStake.eq(0)) return GenerationStage.Failed;
      if (yesStake.gte(requiredStake.div(2))) return GenerationStage.Accepted;
      return GenerationStage.Rejected;
    }

    // Submit/Support phase

    if (Community.hasReachedQuorum(this.proposals))
      return GenerationStage.Quorum;

    const proposalEnds = Community.formatDate(
      this.generation.policyProposal.proposalEnds
    );
    if (proposalEnds.getTime() < Date.now()) return GenerationStage.Over;

    return GenerationStage.Submit;
  }
}

function getCommunityData(
  data?: CurrentGenerationQueryResult
): CommunityInterface {
  if (!data) return defaultValue;

  const generation = data.generations[0];
  const pastGeneration = data.pastGeneration[0];

  return {
    generation,
    proposals: getProposals(generation),
    lockup: formatLockup(
      parseInt(pastGeneration?.number),
      pastGeneration?.lockup
    ),
    randomInflation:
      pastGeneration?.randomInflation &&
      formatRandomInflation(pastGeneration.randomInflation),
    ...Community.getData(generation),
  };
}

const THREE_HOUR = 3 * 60 * 60 * 1000;

export enum CommunityActionType {
  SetState,
  Support,
  Unsupport,
  Vote,
  Unvote,
  NewProposal,
}

type CommunityAction =
  | {
      type: CommunityActionType.SetState;
      state: CommunityInterface;
    }
  | {
      type: CommunityActionType.Support | CommunityActionType.Unsupport;
      proposal: ProposalType["id"];
      votingPower: BigNumber;
    }
  | {
      type: CommunityActionType.Vote | CommunityActionType.Unvote;
      votingPower: BigNumber;
    }
  | {
      type: CommunityActionType.NewProposal;
      proposal: ProposalType;
    };

const communityReducer: React.Reducer<CommunityInterface, CommunityAction> = (
  state,
  action
) => {
  let community;
  switch (action.type) {
    case CommunityActionType.SetState:
      return action.state;
    case CommunityActionType.Support:
    case CommunityActionType.Unsupport:
      const proposals = state.proposals.map((proposal) => {
        if (proposal.id !== action.proposal) return proposal;

        const supported = action.type === CommunityActionType.Support;
        const totalStake = supported
          ? proposal.totalStake.add(action.votingPower)
          : proposal.supported
          ? proposal.totalStake.sub(action.votingPower)
          : proposal.totalStake;

        return {
          ...proposal,
          supported,
          totalStake,
        };
      });

      community = new Community(state.generation);
      community.setProposals(proposals);
      const newStage = community.getStage();

      if (
        state.stage.name === GenerationStage.Submit &&
        newStage.name === GenerationStage.Quorum
      ) {
        nativeToast("Proposal has passed support! The vote shall begin soon.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          theme: "colored",
          style: {
            backgroundColor: "#F7FEFC",
            border: "solid 1px #5AE4BF",
            color: "#22313A",
            top: "115px",
          },
        });
      }

      return {
        ...state,
        proposals,
        stage: newStage,
      };
    case CommunityActionType.Unvote:
    case CommunityActionType.Vote:
      const voteFor = action.type === CommunityActionType.Vote;
      community = new Community(state.generation);
      community.vote(voteFor, action.votingPower);
      return {
        ...state,
        ...community.policyVote,
        stage: community.getStage(),
      };
    case CommunityActionType.NewProposal:
      const found = state.proposals.some(
        (proposal) => proposal.id.toLowerCase() === action.proposal.id
      );
      if (found) return state;
      return {
        ...state,
        proposals: [action.proposal, ...state.proposals],
      };
    default:
      throw new Error("Invalid Community Provider Action");
  }
};

export const CommunityProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [communityData, dispatch] = useReducer(communityReducer, defaultValue);

  const { address } = useAccount();
  const { data, startPolling, stopPolling, refetch } = useQuery<
    CurrentGenerationQueryResult,
    CurrentGenerationQueryVariables
  >(CURRENT_GENERATION, {
    variables: { supporter: address?.toLowerCase() },
  });

  useEffect(() => {
    startPolling(5_000);
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  useEffect(() => {
    dispatch({
      type: CommunityActionType.SetState,
      state: getCommunityData(data),
    });
  }, [data]);

  const { name, endsAt } = communityData.stage;

  useEffect(() => {
    const inProgress = isVotingInProgress(name) || isSubmittingInProgress(name);
    const timeDiff = endsAt?.getTime() - Date.now();
    if (inProgress && timeDiff > 0 && timeDiff < THREE_HOUR) {
      const timeout = setTimeout(() => {
        refetch();
        dispatch({
          type: CommunityActionType.SetState,
          state: getCommunityData(data),
        });
      }, timeDiff + 1000);
      return () => clearTimeout(timeout);
    }
  }, [name, endsAt, refetch, data]);

  return (
    <CommunityContext.Provider value={{ ...communityData, dispatch }}>
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = () =>
  useContext<CommunityContextData>(CommunityContext);

export function isVotingInProgress(stage: GenerationStage) {
  return stage === GenerationStage.Vote || stage === GenerationStage.Majority;
}

export function isSubmittingInProgress(stage: GenerationStage) {
  return stage === GenerationStage.Submit || stage === GenerationStage.Quorum;
}

export function hasVotingStagePassed(stage: GenerationStage) {
  return !isSubmittingInProgress(stage) && stage !== GenerationStage.Submit;
}

export function getProposalResult(
  community: CommunityInterface,
  proposal: PastProposalsQuery | ProposalQueryResult["communityProposal"]
): SubgraphVoteResult {
  const proposalGen = parseInt(proposal.generationNumber);
  if (
    proposalGen === community.currentGeneration.number &&
    community.selectedProposal?.id === proposal.id &&
    proposal.policyVotes.length &&
    hasVotingStagePassed(community.stage.name)
  ) {
    if (community.stage.name === GenerationStage.Majority)
      return SubgraphVoteResult.Accepted;

    const { yesStake, requiredStake } = community;

    if (yesStake.gte(requiredStake.div(2))) return SubgraphVoteResult.Accepted;
    return SubgraphVoteResult.Rejected;
  }
  if (!proposal.policyVotes.length) return undefined;
  return proposal.policyVotes[0]?.result || SubgraphVoteResult.Rejected;
}
