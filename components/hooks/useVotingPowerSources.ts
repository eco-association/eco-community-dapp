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
  fundsLockedUp: Lockup[];
}

const DEFAULT_VALUE: VotingPowerSources = {
  eco: Zero,
  sEcoX: Zero,
  ecoDelegatedToMe: [],
  sEcoXDelegatedToMe: [],
  fundsLockupDelegated: [],
  fundsLockedUp: [],
};

function formatSourceData(
  data: VotingPowerSourceQueryResult
): VotingPowerSources {
  if (!data?.account) return DEFAULT_VALUE;

  const {
    ECO,
    sECOx,
    fundsLockupDeposits,
    fundsLockupDepositsDelegatedToMe,
    ECODelegatedToMe,
    sECOxDelegatedToMe,
  } = data.account;

  const inflationMultiplier = data.inflationMultipliers.length
    ? BigNumber.from(data.inflationMultipliers[0].value)
    : WeiPerEther;

  const eco = BigNumber.from(ECO).div(inflationMultiplier).div(10);
  const sEcoX = BigNumber.from(sECOx);

  const ecoDelegatedToMe = ECODelegatedToMe.map((delegated) => ({
    address: delegated.id,
    amount: BigNumber.from(delegated.ECO).div(inflationMultiplier).div(10),
  }));

  const sEcoXDelegatedToMe = sECOxDelegatedToMe.map((delegated) => ({
    address: delegated.id,
    amount: BigNumber.from(delegated.sECOx),
  }));

  const fundsLockupDelegated = fundsLockupDepositsDelegatedToMe.map(
    (lockup) => ({
      id: lockup.id,
      amount: BigNumber.from(lockup.amount).div(inflationMultiplier).div(10),
      endsAt: convertDate(
        parseInt(lockup.depositWindowEndsAt) + parseInt(lockup.duration)
      ),
    })
  );

  const fundsLockedUp = fundsLockupDeposits.map((lockup) => ({
    id: lockup.id,
    amount: BigNumber.from(lockup.amount).div(inflationMultiplier).div(10),
    delegate: lockup.delegate?.id,
    endsAt: convertDate(
      parseInt(lockup.depositWindowEndsAt) + parseInt(lockup.duration)
    ),
  }));

  return {
    eco,
    sEcoX,
    ecoDelegatedToMe,
    sEcoXDelegatedToMe,
    fundsLockupDelegated,
    fundsLockedUp,
  };
}

export const useVotingPowerSources = () => {
  const [votingSources, setVotingSources] = useState(DEFAULT_VALUE);
  const { address } = useAccount();
  const {
    data: sources,
    startPolling,
    stopPolling,
  } = useQuery<VotingPowerSourceQueryResult, VotingPowerSourceQueryVariables>(
    VOTING_POWER_SOURCES,
    {
      variables: { address: address?.toLowerCase() },
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
