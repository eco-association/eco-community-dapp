import { gql } from "@apollo/client";
import {
  CommunityProposalFragment,
  CommunityProposalFragmentResult,
} from "./fragments/CommunityProposalFragment";
import {
  LockupFragment,
  LockupFragmentResult,
} from "./fragments/LockupFragment";
import {
  PolicyVotesFragment,
  PolicyVotesFragmentResult,
} from "./fragments/PolicyVotesFragment";
import {
  RandomInflationFragment,
  RandomInflationFragmentResult,
} from "./fragments/RandomInflationFragment";

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

export type SubgraphPolicyVote = PolicyVotesFragmentResult & {
  blockNumber: string;
  ENACTION_DELAY: string;
  totalVotingPower: string;
  proposal: SubgraphProposal;
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
  nextGenerationStart: string | null;
  policyProposal: SubgraphPolicyProposal;
  policyVote: SubgraphPolicyVote | null;
  communityProposals: SubgraphProposal[];
  createdAt: string;
};

export type PastGeneration = {
  id: string;
  number: string;
  lockup?: LockupFragmentResult;
  randomInflation?: RandomInflationFragmentResult;
};

export type CurrentGenerationQueryResult = {
  generations: Generation[];
  pastGeneration: PastGeneration[];
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
      createdAt
      policyProposal {
        id
        totalVotingPower
        proposalEnds
        blockNumber
      }
      policyVote {
        ...PolicyVotesFragment
        blockNumber
        ENACTION_DELAY
        totalVotingPower
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
    }
    pastGeneration: generations(
      orderBy: number
      orderDirection: desc
      first: 1
      skip: 1
    ) {
      id
      number
      lockup {
        ...LockupFragment
      }
      randomInflation {
        ...RandomInflationFragment
      }
    }
  }
  ${PolicyVotesFragment}
  ${LockupFragment}
  ${RandomInflationFragment}
  ${CommunityProposalFragment}
`;
