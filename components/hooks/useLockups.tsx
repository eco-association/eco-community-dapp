import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { BigNumber, utils } from "ethers";

import {
  FUNDS_LOCKUPS_QUERY,
  FundsLockupQueryResult,
  FundsLockupQueryVariables,
} from "../../queries/FUNDS_LOCKUPS_QUERY";
import { Address, FundsLockup } from "../../types";
import { convertDate } from "../../utilities/convertDate";
import { useCommunity } from "../../providers";
import { WeiPerEther } from "@ethersproject/constants";

function getOpen(lockups: FundsLockup[]) {
  return lockups.find(
    (lockup) => lockup.depositWindowEndsAt.getTime() > Date.now()
  );
}

const useLockups = () => {
  const { currentGeneration } = useCommunity();
  const [lockups, setLockups] = useState<FundsLockup[]>([]);
  const [current, setCurrent] = useState<FundsLockup>();
  const [fetch, { data, loading, startPolling, stopPolling }] = useLazyQuery<
    FundsLockupQueryResult,
    FundsLockupQueryVariables
  >(FUNDS_LOCKUPS_QUERY, {
    variables: { timeNow: Math.round(Date.now() / 1000).toString() },
  });
  useEffect(() => {
    if (currentGeneration.number) {
      fetch({
        variables: { timeNow: Math.round(Date.now() / 1000).toString() },
      });
    }
  }, [currentGeneration.number, fetch]);
  useEffect(() => {
    if (currentGeneration.number) {
      startPolling(5_000);
      return () => stopPolling();
    }
  }, [currentGeneration.number, startPolling, stopPolling]);
  useEffect(() => {
    if (!loading && data) {
      // get latest inflation multiplier to determine inflation adjusted amount
      const inflationMultiplier = data.inflationMultipliers.length
        ? BigNumber.from(data.inflationMultipliers[0].value)
        : WeiPerEther;

      const lockups = data.fundsLockups.map(
        (lockup): FundsLockup => ({
          address: new Address(lockup.address),
          generation: parseInt(lockup.generation.id),
          depositWindowEndsAt: convertDate(lockup.depositWindowEndsAt),
          depositWindowDuration: parseInt(lockup.depositWindowDuration) * 1000,
          duration: parseInt(lockup.duration) * 1000,
          interest: parseFloat(utils.formatUnits(lockup.interest, 7)),
          totalLocked: BigNumber.from(lockup.totalLocked).div(
            inflationMultiplier
          ),
          deposits: [],
        })
      );

      setLockups(lockups);
    }
  }, [data, loading]);

  useEffect(() => {
    const _current = getOpen(lockups);
    if (_current) setCurrent(_current);
  }, [lockups]);

  useEffect(() => {
    if (current) {
      const diff = current.depositWindowEndsAt.getTime() - Date.now();
      const timeout = setTimeout(() => setCurrent(undefined), diff);
      return () => clearTimeout(timeout);
    }
  }, [current]);

  return {
    lockups,
    current,
    active: lockups
      .filter(
        (lockup) =>
          lockup.totalLocked.gt(0) ||
          lockup.depositWindowEndsAt.getTime() + lockup.duration > Date.now()
      )
      .sort(
        (a, b) =>
          a.depositWindowEndsAt.getTime() +
          a.duration -
          (b.depositWindowEndsAt.getTime() - b.duration)
      ),
  };
};

export default useLockups;
