import { gql } from "@apollo/client";

type SubgraphContractAddresses = {
  policy: string;
  timedPolicies: string;
  trustedNodes: string;
  policyProposals: string;
  policyVotes: string;
  eco: string;
  ecox: string;
  weco: string;
  ecoxStaking: string;
};

export type ContractAddressQueryResult = {
  contractAddresses: SubgraphContractAddresses | null;
};

export const CONTRACT_ADDRESSES = gql`
  query contractAddresses {
    contractAddresses(id: "0") {
      policy
      timedPolicies
      trustedNodes
      policyProposals
      policyVotes
      eco
      ecox
      ecoxStaking
      weco
    }
  }
`;
