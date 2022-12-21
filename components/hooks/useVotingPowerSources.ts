import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { useAccount } from "wagmi";
import {
  VOTING_POWER_SOURCES,
  VotingPowerSourceQueryResult,
  VotingPowerSourceQueryVariables,
} from "../../queries/VOTING_POWER_SOURCES";
import { BigNumber } from "ethers";
import { convertDate } from "../../utilities/convertDate";
import { WeiPerEther, Zero } from "@ethersproject/constants";
import { adjustVotingPower } from "../../utilities/adjustVotingPower";
import { useCommunity } from "../../providers";

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
    fundsLockupDepositsDelegatedToMe,
    ECODelegatedToMe,
    sECOxDelegatedToMe,
  } = data.account;

  const inflationMultiplier = data.inflationMultipliers.length
    ? BigNumber.from(data.inflationMultipliers[0].value)
    : WeiPerEther;

  const eco = historicalECOBalances.length
    ? BigNumber.from(historicalECOBalances[0].value)
        .div(inflationMultiplier)
        .div(10)
    : Zero;

  const sEcoX = historicalsECOxBalances.length
    ? BigNumber.from(historicalsECOxBalances[0].value)
        .div(inflationMultiplier)
        .div(10)
    : Zero;

  const ecoDelegatedToMe = ECODelegatedToMe.map((delegated) => ({
    address: delegated.id,
    amount: BigNumber.from(delegated.ECO).div(inflationMultiplier).div(10),
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
    eco,
    sEcoX,
    ecoDelegatedToMe,
    sEcoXDelegatedToMe,
    fundsLockupDelegated,
  };
}

export const useVotingPowerSources = () => {
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

  return votingSources;
};
