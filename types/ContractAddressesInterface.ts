import { Address } from ".";

interface ContractAddressesInterface {
  policyProposals: Address;
  policyVotes: Address;
  eco: Address;
  timedPolicies: Address;
  trustedNodes: Address;
  ecoX: Address;
  sEcoX: Address;
  wEco: Address;
}

export type { ContractAddressesInterface };
