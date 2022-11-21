import { gql } from "@apollo/client";

export type CommunityProposalFragmentResult = {
  id: string;
  url: string;
  name: string;
  description: string;
  address: string;
  proposer: string;
  refunded: boolean;
  totalStake: string;
  reachedSupportThreshold: boolean;
  generation: {
    number: string;
    policyProposal: {
      proposalEnds: string;
    };
  };
};

export const CommunityProposalFragment = gql`
  fragment CommunityProposalFragment on CommunityProposal {
    id
    url
    name
    description
    address
    proposer
    refunded
    reachedSupportThreshold
    totalStake: totalSupportAmount
    generation {
      number
      policyProposal {
        proposalEnds
      }
    }
  }
`;
