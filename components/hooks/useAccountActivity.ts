import {
  ACCOUNT_ACTIVITY_QUERY,
  AccountActivityQueryResults,
  Activity,
} from "../../queries/ACCOUNT_ACTIVITY_QUERY";
import { useEffect, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { convertDate } from "../../utilities/convertDate";
import { useAccount } from "wagmi";
import { formatLockup } from "../../utilities";
import { BigNumber } from "ethers";

function formatData(result: AccountActivityQueryResults): Activity[] {
  return result.activityRecords?.map(
    (activity): Activity => ({
      ...activity,
      amount: BigNumber.from(activity.amount),
      timestamp: convertDate(activity.timestamp),
      lockupDeposit: activity.lockupDeposit && {
        ...formatLockup(
          parseInt(activity.lockupDeposit.lockup.generation.number),
          activity.lockupDeposit.lockup
        ),
        id: activity.lockupDeposit.id,
        delegate: activity.lockupDeposit.delegate.id,
        amount: BigNumber.from(activity.lockupDeposit.amount),
        reward: BigNumber.from(activity.lockupDeposit.reward),
        withdrawnAt:
          activity.lockupDeposit.withdrawnAt &&
          convertDate(activity.lockupDeposit.withdrawnAt),
      },
    })
  );
}

export const useAccountActivity = (): Activity[] => {
  const account = useAccount();

  const { data, startPolling, stopPolling } =
    useQuery<AccountActivityQueryResults>(ACCOUNT_ACTIVITY_QUERY, {
      variables: {
        address: account.address?.toLowerCase(),
      },
    });

  useEffect(() => {
    startPolling(5_000);
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  return useMemo(() => {
    if (!data || data.activityRecords.length === 0) return [];
    return formatData(data);
  }, [data]);
};
