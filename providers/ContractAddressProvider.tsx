import React, { useContext, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { Address, ContractAddressesInterface } from "../types";
import { CONTRACT_ADDRESSES, ContractAddressQueryResult } from "../queries";

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
        eco: new Address(contracts.eco),
        ecoX: new Address(contracts.ecox),
        wEco: new Address(contracts.weco),
        sEcoX: new Address(contracts.ecoxStaking),
        trustedNodes: new Address(contracts.trustedNodes),
        policyVotes: new Address(contracts.policyVotes),
        timedPolicies: new Address(contracts.timedPolicies),
        policyProposals: new Address(contracts.policyProposals),
      }
    : null;

  return (
    <ContractAddressContext.Provider value={contractAddresses}>
      {contractAddresses ? children : null}
    </ContractAddressContext.Provider>
  );
};

export const useContractAddresses = () =>
  useContext<ContractAddressesInterface>(ContractAddressContext);
