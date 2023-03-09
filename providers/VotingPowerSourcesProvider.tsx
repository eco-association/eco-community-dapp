import React, { useEffect, useMemo } from "react";
import { BigNumber } from "ethers";
import { useAccount } from "wagmi";
import { useQuery } from "@apollo/client";
import { WeiPerEther, Zero } from "@ethersproject/constants";
import { useCommunity } from "./index";
import { convertDate, adjustVotingPower } from "../utilities";
import {
  TokenDelegateFragment,
  VOTING_POWER_SOURCES,
  VotingPowerSourceQueryResult,
  VotingPowerSourceQueryVariables,
} from "../queries/VOTING_POWER_SOURCES";

export interface TokenDelegate {
  address: string;
  amount: BigNumber;
}

export interface VotingPowerSources {
  eco: BigNumber;
  sEcoX: BigNumber;

  ecoVotingPower: BigNumber;
  sEcoXVotingPower: BigNumber;

  lockupsDelegatedToMe: TokenDelegate[];
  ecoDelegatedToMe: TokenDelegate[];
  stakedEcoXDelegatedToMe: TokenDelegate[];
  ecoDelegated: TokenDelegate[];
  stakedEcoXDelegated: TokenDelegate[];
}

const DEFAULT_VALUE: VotingPowerSources = {
  eco: Zero,
  sEcoX: Zero,
  ecoVotingPower: Zero,
  sEcoXVotingPower: Zero,

  lockupsDelegatedToMe: [],
  ecoDelegatedToMe: [],
  stakedEcoXDelegatedToMe: [],
  ecoDelegated: [],
  stakedEcoXDelegated: [],
};

function formatSourceData(
  data: VotingPowerSourceQueryResult
): VotingPowerSources {
  if (!data?.account) return DEFAULT_VALUE;

  const {
    ecoVotingPower: [ecoVotingPowerRaw],
    sEcoXVotingPower: [sEcoXVotingPowerRaw],
    historicalECOBalances: [historicalECOBalances],
    historicalsECOxBalances: [historicalsECOxBalances],
    lockupsDelegatedToMe: lockups,

    currentDelegatees,
    historicalDelegatees,
    currentDelegations,
    historicalDelegations,
  } = data.account;

  const inflationMultiplier = data.inflationMultipliers.length
    ? BigNumber.from(data.inflationMultipliers[0].value)
    : WeiPerEther;

  const sEcoX = BigNumber.from(historicalsECOxBalances?.value || 0);
  const sEcoXVotingPower = BigNumber.from(sEcoXVotingPowerRaw?.value || Zero);

  const eco = adjustVotingPower(
    BigNumber.from(historicalECOBalances?.value || 0).div(inflationMultiplier)
  );
  const ecoVotingPower = adjustVotingPower(
    BigNumber.from(ecoVotingPowerRaw?.value || 0)
  );

  const receivedDelegations = [...currentDelegatees, ...historicalDelegatees];
  const delegations = [...currentDelegations, ...historicalDelegations];

  // Token filters
  const filterEco = (item: TokenDelegateFragment) => item.token.id === "eco";
  const filterSEcoX = (item: TokenDelegateFragment) =>
    item.token.id === "sEcox";

  const ecoReceivedDelegations = receivedDelegations.filter(filterEco);
  const stakedEcoXReceivedDelegations = receivedDelegations.filter(filterSEcoX);

  const ecoDelegations = delegations.filter(filterEco);
  const stakedEcoXDelegations = delegations.filter(filterSEcoX);

  const lockupIds = lockups.map(({ lockup }) => lockup.id);

  const walletAndLockupsReceivedDelegations = ecoReceivedDelegations.map(
    (delegation) => {
      let endsAt;
      const address = delegation.delegator.id;
      const isLockup = lockupIds.includes(address);
      const amount = adjustVotingPower(
        BigNumber.from(delegation.amount).div(inflationMultiplier)
      );

      if (isLockup) {
        const lockup = lockups.find(
          ({ lockup }) => lockup.id === address
        )?.lockup;
        if (lockup) {
          endsAt = convertDate(
            parseInt(lockup.depositWindowEndsAt) + parseInt(lockup.duration)
          );
        }
      }

      return {
        isLockup,
        address,
        endsAt,
        amount,
      };
    }
  );

  const ecoDelegatedToMe = walletAndLockupsReceivedDelegations.filter(
    (delegation) => !delegation.isLockup
  );
  const lockupsDelegatedToMe = walletAndLockupsReceivedDelegations.filter(
    (delegation) => delegation.isLockup
  );

  const stakedEcoXDelegatedToMe = stakedEcoXReceivedDelegations.map(
    (delegation) => ({
      address: delegation.delegator.id,
      amount: BigNumber.from(delegation.amount),
    })
  );

  const ecoDelegated = ecoDelegations.map((delegation) => ({
    address: delegation.delegatee.id,
    amount: adjustVotingPower(
      BigNumber.from(delegation.amount).div(inflationMultiplier)
    ),
  }));

  const stakedEcoXDelegated = stakedEcoXDelegations.map((delegation) => ({
    address: delegation.delegatee.id,
    amount: BigNumber.from(delegation.amount),
  }));

  return {
    eco,
    sEcoX,
    ecoVotingPower,
    sEcoXVotingPower,

    lockupsDelegatedToMe,
    ecoDelegatedToMe,
    stakedEcoXDelegatedToMe,
    ecoDelegated,
    stakedEcoXDelegated,
  };
}

const VotingPowerSourcesContext = React.createContext(DEFAULT_VALUE);

export const VotingPowerSourcesProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { address } = useAccount();
  const { currentGeneration } = useCommunity();

  const {
    data: sources,
    startPolling,
    stopPolling,
  } = useQuery<VotingPowerSourceQueryResult, VotingPowerSourceQueryVariables>(
    VOTING_POWER_SOURCES,
    {
      variables: {
        address: address?.toLowerCase(),
        blocknumber: currentGeneration.blockNumber,
      },
    }
  );

  useEffect(() => {
    startPolling(5_000);
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  const votingSources = useMemo(() => {
    if (!sources) return DEFAULT_VALUE;
    return formatSourceData(sources);
  }, [sources]);

  return (
    <VotingPowerSourcesContext.Provider value={votingSources}>
      {children}
    </VotingPowerSourcesContext.Provider>
  );
};

export const useVotingPowerSources = () =>
  React.useContext(VotingPowerSourcesContext);
