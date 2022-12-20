import { gql } from "@apollo/client";
import {
  CommunityProposalFragment,
  CommunityProposalFragmentResult,
} from "./fragments/CommunityProposalFragment";
import { BigNumber } from "ethers";
import {
  PolicyVotesFragment,
  PolicyVotesFragmentResult,
} from "./fragments/PolicyVotesFragment";
import { BasicPolicyVote } from "../types/CommunityInterface";

export enum ActivityType {
  ProposalSubmitted = "ProposalSubmitted",
  ProposalSupported = "ProposalSupported",
  ProposalUnsupported = "ProposalUnsupported",
  ProposalQuorum = "ProposalQuorum",
  ProposalVoting = "ProposalVoting",
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
  policyVote?: BasicPolicyVote;
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
    policyVotes: PolicyVotesFragmentResult[];
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
        ...PolicyVotesFragment
      }
      activities(orderBy: timestamp, orderDirection: desc) {
        type
        timestamp
      }
      support(where: { supporter: $supporter }) {
        createdAt
      }
    }
  }
  ${PolicyVotesFragment}
  ${CommunityProposalFragment}
`;
