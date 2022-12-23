import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { useAccount } from "wagmi";
import {
  VOTING_POWER_SOURCES,
  VotingPowerSourceQueryResult,
  VotingPowerSourceQueryVariables,
} from "../queries/VOTING_POWER_SOURCES";
import { BigNumber } from "ethers";
import { convertDate } from "../utilities/convertDate";
import { WeiPerEther, Zero } from "@ethersproject/constants";
import { adjustVotingPower } from "../utilities/adjustVotingPower";
import { useCommunity } from "./index";

interface Lockup {
  id: string;
  endsAt: Date;
  amount: BigNumber;
  delegate?: string;
}

export interface TokenDelegate {
  address: string;
  amount: BigNumber;
}

export interface VotingPowerSources {
  eco: BigNumber;
  sEcoX: BigNumber;
  ecoDelegatedToMe: TokenDelegate[];
  sEcoXDelegatedToMe: TokenDelegate[];
  fundsLockupDelegated: Lockup[];
}

const DEFAULT_VALUE: VotingPowerSources = {
  eco: Zero,
  sEcoX: Zero,
  ecoDelegatedToMe: [],
  sEcoXDelegatedToMe: [],
  fundsLockupDelegated: [],
};

function formatSourceData(
  data: VotingPowerSourceQueryResult
): VotingPowerSources {
  if (!data?.account) return DEFAULT_VALUE;

  const {
    historicalECOBalances,
    historicalsECOxBalances,
    sEcoXVotingPower: sEcoXVotingPowerRaw,
    ecoVotingPower: ecoVotingPowerRaw,
    fundsLockupDepositsDelegatedToMe,
    ECODelegatedToMe,
    sECOxDelegatedToMe,
  } = data.account;

  const inflationMultiplier = data.inflationMultipliers.length
    ? BigNumber.from(data.inflationMultipliers[0].value)
    : WeiPerEther;

  const sEcoXVotingPower = sEcoXVotingPowerRaw.length
    ? BigNumber.from(sEcoXVotingPowerRaw[0].value)
    : Zero;

  const ecoVotingPower = ecoVotingPowerRaw.length
    ? adjustVotingPower(BigNumber.from(ecoVotingPowerRaw[0].value))
    : Zero;

  const eco = historicalECOBalances.length
    ? adjustVotingPower(
        BigNumber.from(historicalECOBalances[0].value).div(inflationMultiplier)
      )
    : Zero;

  const sEcoX = historicalsECOxBalances.length
    ? BigNumber.from(historicalsECOxBalances[0].value)
    : Zero;

  const ecoDelegatedToMe = ECODelegatedToMe.map((delegated) => ({
    address: delegated.id,
    amount: adjustVotingPower(
      BigNumber.from(delegated.ECO).div(inflationMultiplier)
    ),
  }));

  const sEcoXDelegatedToMe = sECOxDelegatedToMe.map((delegated) => ({
    address: delegated.id,
    amount: BigNumber.from(delegated.sECOx),
  }));

  const fundsLockupDelegated = fundsLockupDepositsDelegatedToMe.map(
    (delegate) => ({
      id: delegate.lockup.id,
      amount: adjustVotingPower(
        BigNumber.from(delegate.amount).div(inflationMultiplier)
      ),
      endsAt: convertDate(
        parseInt(delegate.lockup.depositWindowEndsAt) +
          parseInt(delegate.lockup.duration)
      ),
    })
  );

  return {
    eco: ecoVotingPower.gt(eco) ? eco : ecoVotingPower,
    sEcoX: sEcoXVotingPower.gt(sEcoX) ? sEcoX : sEcoXVotingPower,
    ecoDelegatedToMe,
    sEcoXDelegatedToMe,
    fundsLockupDelegated,
  };
}

const VotingPowerSourcesContext = React.createContext(DEFAULT_VALUE);

export const VotingPowerSourcesProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { address } = useAccount();
  const { currentGeneration } = useCommunity();

  const [votingSources, setVotingSources] = useState(DEFAULT_VALUE);

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

  useEffect(() => {
    if (sources) setVotingSources(formatSourceData(sources));
  }, [sources]);

  return (
    <VotingPowerSourcesContext.Provider value={votingSources}>
      {children}
    </VotingPowerSourcesContext.Provider>
  );
};

export const useVotingPowerSources = () =>
  React.useContext(VotingPowerSourcesContext);
