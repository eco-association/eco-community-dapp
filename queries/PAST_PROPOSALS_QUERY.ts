import { gql } from "@apollo/client";
import { BigNumberish } from "ethers";
import { ActivityType } from "./PROPOSAL_QUERY";
import { SubgraphVoteResult } from "./CURRENT_GENERATION";

export type Activities = {
  timestamp: string;
  type: ActivityType;
  communityProposal: {
    reachedthresholdSupport: boolean;
  };
};

export type PastProposalsQuery = {
  id: string;
  url: string;
  name: string;
  address: string;
  description: string;
  proposer: string;
  refunded: boolean;
  supported: boolean;
  generationNumber: string;
  totalSupportAmount: string;
  reachedSupportThreshold: boolean;

  activities: Activities[];
  support: {
    createdAt: string;
    amount: BigNumberish | string;
  }[];
  createdAt?: string;

  policyVotes?: {
    id: string;
    result: SubgraphVoteResult;
    votes: {
      id: string;
      yesAmount: string;
    }[];
  }[];
};

export type PastProposalsQueryResults = {
  communityProposals: PastProposalsQuery[];
};

export type PastProposalsQueryVariables = {
  generation: string | number;
  account?: string;
  excludeId?: string;
  count: number;
  skip?: number;
};

export const PAST_PROPOSALS_QUERY = gql`
  query PAST_PROPOSALS_QUERY(
    $excludeId: String
    $generation: BigInt!
    $account: Bytes
    $count: Int!
    $skip: Int
  ) {
    communityProposals(
      where: { generationNumber_lt: $generation, id_not: $excludeId }
      orderBy: generationNumber
      orderDirection: desc
      skip: $skip
      first: $count
    ) {
      id
      name
      url
      address
      proposer
      refunded
      description
      generationNumber
      totalSupportAmount
      reachedSupportThreshold
      policyVotes {
        id
        result
        votes(where: { voter: $account }) {
          yesAmount
          id
        }
      }
      activities(
        orderBy: timestamp
        orderDirection: desc
        where: {
          type_not_in: [
            ProposalSupported
            ProposalUnsupported
            ProposalVoteFor
            ProposalVoteAgainst
          ]
        }
      ) {
        timestamp
        type
      }
      support(where: { supporter: $account }) {
        createdAt
        amount
      }
    }
  }
`;
