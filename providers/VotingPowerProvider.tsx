import React, { createContext, useContext, useEffect } from "react";

import { BigNumber } from "ethers";

import { useQuery } from "@apollo/client";
import { TOTAL_VOTING_POWER, TotalVotingPowerQueryResult } from "../queries";

import { VotingPowerInterface } from "../types";
import { Zero } from "@ethersproject/constants";
import { adjustVotingPower } from "../utilities/adjustVotingPower";

/**
 * VotingPowerProvider
 *
 * Keeps track of most recent total voting power and block number
 */
export const VotingPowerContext = createContext<VotingPowerInterface>({
  totalVotingPower: BigNumber.from(0),
  blockNumber: BigNumber.from(0),
});

function getVotingValues(data?: TotalVotingPowerQueryResult): {
  blockNumber: BigNumber;
  totalVotingPower: BigNumber;
} {
  if (!data || !data.generations.length)
    return { blockNumber: Zero, totalVotingPower: Zero };

  const { policyVote, policyProposal } = data.generations[0];

  if (policyVote) {
    return {
      blockNumber: BigNumber.from(policyVote.blockNumber),
      totalVotingPower: adjustVotingPower(policyVote.totalVotingPower),
    };
  }
  return {
    blockNumber: BigNumber.from(policyProposal.blockNumber),
    totalVotingPower: adjustVotingPower(policyProposal.totalVotingPower),
  };
}

export const VotingPowerProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { data, startPolling, stopPolling } =
    useQuery<TotalVotingPowerQueryResult>(TOTAL_VOTING_POWER);

  useEffect(() => {
    startPolling(5_000);
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  return (
    <VotingPowerContext.Provider value={getVotingValues(data)}>
      {children}
    </VotingPowerContext.Provider>
  );
};

export const useTotalVotingPower = () =>
  useContext<VotingPowerInterface>(VotingPowerContext);
