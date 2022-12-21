import {
  Activity,
  AccountActivityQueryResults,
  ACCOUNT_ACTIVITY_QUERY,
} from "./../../queries/ACCOUNT_ACTIVITY_QUERY";
import { useEffect, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { convertDate } from "../../utilities/convertDate";
import { useAccount } from "wagmi";

export const useAccountActivity = (): Activity[] => {
  const account = useAccount();

  function formatData(result: AccountActivityQueryResults): Activity[] {
    const activities = result.activityRecords?.map(
      (activity): Activity => ({
        ...activity,
        timestamp: convertDate(activity.timestamp),
      })
    );
    return activities;
  }

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
