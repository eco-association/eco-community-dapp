import { gql } from "@apollo/client";
import {
  CommunityProposalFragment,
  CommunityProposalFragmentResult,
} from "./fragments/CommunityProposalFragment";
import { BigNumber } from "ethers";
import { SubgraphVoteResult } from "./CURRENT_GENERATION";

export enum ActivityType {
  ProposalSubmitted = "ProposalSubmitted",
  ProposalSupported = "ProposalSupported",
  ProposalUnsupported = "ProposalUnsupported",
  ProposalQuorum = "ProposalQuorum",
  ProposalVoting = "ProposalVoting",
  ProposalVoteFor = "ProposalVoteFor",
  ProposalVoteAgainst = "ProposalVoteAgainst",
  ProposalResult = "ProposalResult",
  ProposalExecuted = "ProposalExecuted",
  RandomInflation = "RandomInflation",
  Lockup = "Lockup",
}

interface Activity {
  type: ActivityType;
  timestamp: Date;
}

export interface CommunityProposal {
  id: string;
  url: string;
  name: string;
  address: string;
  description: string;
  proposer: string;
  supported: boolean;
  supportedAt: Date;
  totalStake: BigNumber;
  reachedSupportThreshold: boolean;

  generation: {
    number: number;
    policyProposal: {
      proposalEnds: string;
    };
  };
  activities: Activity[];
  policyVote?: {
    id: string;
    result: SubgraphVoteResult;
    voteEnds: string;
    majorityReachedAt: string;
  };
}

export type ProposalQueryResult = {
  communityProposal: CommunityProposalFragmentResult & {
    generationNumber: string;
    generation: {
      number: string;
      createdAt: string;
      policyProposal: {
        proposalEnds: string;
      };
    };
    policyVotes: {
      id: string;
      result: SubgraphVoteResult;
      voteEnds: string;
      majorityReachedAt: string;
    }[];
    activities: {
      type: ActivityType;
      timestamp: string;
    }[];
    support: { createdAt: string }[];
  };
};

export type ProposalQueryVariables = {
  id: string;
  supporter?: string;
};

export const PROPOSAL_QUERY = gql`
  query PROPOSAL_QUERY($id: ID!, $supporter: Bytes) {
    communityProposal(id: $id) {
      ...CommunityProposalFragment
      generationNumber
      generation {
        number
        createdAt
        policyProposal {
          proposalEnds
        }
      }
      policyVotes {
        id
        result
        voteEnds
        majorityReachedAt
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
        type
        timestamp
      }
      support(where: { supporter: $supporter }) {
        createdAt
      }
    }
  }
  ${CommunityProposalFragment}
`;
