import React, { useContext, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { ContractAddressesInterface } from "../types";
import { CONTRACT_ADDRESSES, ContractAddressQueryResult } from "../queries";
import { AddressZero } from "@ethersproject/constants";

/**
 * @name ContractAddressContext
 *
 * Fetches most recent contract addresses pointed to by the registry through the subgraph.
 */
export const ContractAddressContext =
  React.createContext<ContractAddressesInterface>(null);

export const ContractAddressProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { data, startPolling, stopPolling } =
    useQuery<ContractAddressQueryResult>(CONTRACT_ADDRESSES);

  useEffect(() => {
    startPolling(5_000);
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  const contracts = data?.contractAddresses;

  const contractAddresses = contracts
    ? {
        eco: contracts.eco,
        ecoX: contracts.ecox,
        wEco: contracts.weco,
        sEcoX: contracts.ecoxStaking,
        trustedNodes: contracts.trustedNodes,
        policyVotes: contracts.policyVotes,
        timedPolicies: contracts.timedPolicies,
        policyProposals: contracts.policyProposals,
      }
    : {
        eco: AddressZero,
        ecoX: AddressZero,
        wEco: AddressZero,
        sEcoX: AddressZero,
        trustedNodes: AddressZero,
        policyVotes: AddressZero,
        timedPolicies: AddressZero,
        policyProposals: AddressZero,
      };

  return (
    <ContractAddressContext.Provider value={contractAddresses}>
      {children}
    </ContractAddressContext.Provider>
  );
};

export const useContractAddresses = () =>
  useContext<ContractAddressesInterface>(ContractAddressContext);
