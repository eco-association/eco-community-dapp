import { gql } from "@apollo/client";

type SubgraphProposalSupport = {
  proposal: { address: string };
};

export type ProposalsSupportedQueryResult = {
  communityProposalSupports: SubgraphProposalSupport[];
};

export type ProposalsSupportedQueryVariables = {
  supporter: string;
  proposal: string;
};

export const PROPOSALS_SUPPORTED = gql`
  query proposalsSupported($supporter: Bytes!, $proposal: String!) {
    communityProposalSupports(
      where: { supporter: $supporter, policyProposal: $proposal }
    ) {
      proposal {
        address
      }
    }
  }
`;
