import { gql } from "@apollo/client";

export type RefundProposal = {
  id: string;
  name: string;
  address: string;
  generation: {
    number: string;
    policyProposal: {
      address: string;
      refundIfLost: string;
    };
  };
  policyVotes: { id: string }[];
};

export type RefundProposalsQueryResult = {
  communityProposals: RefundProposal[];
};

export type RefundProposalsVariables = {
  address: string;
};

export const REFUND_PROPOSALS = gql`
  query REFUND_PROPOSALS($address: Bytes!) {
    communityProposals(where: { proposer: $address, refunded: false }) {
      id
      name
      address
      generation {
        number
        policyProposal {
          address: id
          refundIfLost
        }
      }
      policyVotes {
        id
      }
    }
  }
`;
