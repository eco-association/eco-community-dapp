import { gql } from "@apollo/client";
import {
  CommunityProposalFragment,
  CommunityProposalFragmentResult,
} from "./fragments/CommunityProposalFragment";
import {
  LockupFragment,
  LockupFragmentResult,
} from "./fragments/LockupFragment";

export type SubgraphPolicyProposal = {
  id: string;
  totalVotingPower: string;
  proposalEnds: string;
  blockNumber: string;
};

export enum SubgraphVoteResult {
  Failed = "Failed",
  Accepted = "Accepted",
  Rejected = "Rejected",
}

export type SubgraphProposal = CommunityProposalFragmentResult & {
  support: { createdAt: string }[];
};

export type SubgraphPolicyVote = {
  id: string;
  totalVotingPower: string;
  majorityReachedAt: string;
  ENACTION_DELAY: string;
  voteEnds: string;
  blockNumber: string;
  proposal: SubgraphProposal;
  yesVoteAmount: string;
  totalVoteAmount: string;
  result: SubgraphVoteResult | null;
  votes: {
    totalAmount: string;
    yesAmount: string;
    id: string;
  }[];
};

export type Generation = {
  id: string;
  number: string;
  blockNumber: string;
  policyProposal: SubgraphPolicyProposal;
  policyVote: SubgraphPolicyVote | null;
  communityProposals: SubgraphProposal[];
  nextGenerationStart: string | null;
  lockup?: LockupFragmentResult;
};

export type CurrentGenerationQueryResult = {
  generations: Generation[];
};

export type CurrentGenerationQueryVariables = {
  supporter?: string;
};

export const CURRENT_GENERATION = gql`
  query CURRENT_GENERATION($supporter: Bytes) {
    generations(orderBy: number, orderDirection: desc, first: 1) {
      id
      number
      blockNumber
      nextGenerationStart
      policyProposal {
        id
        totalVotingPower
        proposalEnds
        blockNumber
      }
      policyVote {
        id
        result
        voteEnds
        blockNumber
        yesVoteAmount
        totalVoteAmount
        totalVotingPower
        majorityReachedAt
        ENACTION_DELAY
        proposal {
          ...CommunityProposalFragment
          support(where: { supporter: $supporter }) {
            createdAt
          }
        }
        votes(first: 1, where: { voter: $supporter }) {
          id
          yesAmount
          totalAmount
        }
      }
      communityProposals {
        ...CommunityProposalFragment
        support(where: { supporter: $supporter }) {
          createdAt
        }
      }
      lockup {
        ...LockupFragment
      }
    }
  }
  ${CommunityProposalFragment}
  ${LockupFragment}
`;
