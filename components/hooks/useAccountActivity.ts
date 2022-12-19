import {
  AccountActivity,
  AccountActivityQuery,
  AccountActivityQueryResults,
  ACCOUNT_ACTIVITY_QUERY,
} from "./../../queries/ACCOUNT_ACTIVITY_QUERY";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { convertDate } from "../../utilities/convertDate";
import {
  Activity,
  ActivityNotificationType,
} from "../../queries/ACTIVITY_QUERY";
import { useCommunity } from "../../providers";
import { CommunityInterface, GenerationStage } from "../../types";
import { hasVotingStagePassed } from "../../providers/CommunityProvider";
import { SubgraphVoteResult } from "../../queries/CURRENT_GENERATION";
import { useAccount } from "wagmi";

export const useAccountActivity = (): AccountActivity[] => {
  const account = useAccount();

  function formatData(result: AccountActivityQuery): AccountActivity[] {
    const activities = result.account.activities?.map(
      (activity): AccountActivity => ({
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
    if (!data || !data.activityRecords.account.activities) return [];
    return formatData(data.activityRecords);
  }, [data]);
};
