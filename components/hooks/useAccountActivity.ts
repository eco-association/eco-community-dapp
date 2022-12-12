import {
  AccountActivity,
  AccountActivityQuery,
  AccountActivityQueryResults,
  ACCOUNT_ACTIVITY_QUERY,
} from "./../../queries/ACCOUNT_ACTIVITY_QUERY";
import { useEffect, useMemo } from "react";
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

function formatActivities(
  community: CommunityInterface,
  result: AccountActivityQuery
) {
  // const activities = result.account.activities.map((activity): AccountActivity => ({
  //     ...activity,
  //     timestamp: convertDate(activity.timestamp)
  // }))
  //   const activities = result.map(
  //     (act): Activity => ({
  //       ...act,
  //       timestamp: convertDate(act.timestamp),
  //       generation: act.generation
  //         ? { number: parseInt(act.generation.number) }
  //         : undefined,
  //     })
  //   );

  // Add result activity right after voting ends
  //   if (
  //     community.selectedProposal &&
  //     hasVotingStagePassed(community.stage.name)
  //   ) {
  //     const isResultShown = activities.some(
  //       (act) =>
  //         act.type === ActivityNotificationType.PROPOSAL_RESULT &&
  //         act.communityProposal?.id === community.selectedProposal.id
  //     );
  //     if (!isResultShown) {
  //       const proposal = community.proposals.find(
  //         (p) => p.id === community.selectedProposal.id
  //       );

  //       const result =
  //         community.stage.name === GenerationStage.Accepted ||
  //         community.stage.name === GenerationStage.Majority
  //           ? SubgraphVoteResult.Accepted
  //           : SubgraphVoteResult.Rejected;

  //       const communityProposal = {
  //         ...proposal,
  //         generationNumber: community.currentGeneration.number.toString(),
  //         policyVotes: [{ result }],
  //       };

  //       const resultActivity: Activity = {
  //         type: ActivityNotificationType.PROPOSAL_RESULT,
  //         timestamp: community.stage.endsAt,
  //         communityProposal,
  //       };

  //       return [resultActivity, ...activities];
  //     }
  //}

  return [];
}

export const useAccountActivity = (): AccountActivity[] => {
  const account = useAccount();

  const { data, startPolling, stopPolling, error } =
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
    console.log(data);
    console.log("Error", error);
    if (!data || !data.activityRecords.account.activities) return [];
    //return formatActivities(community, data.activityRecords);
  }, [data]);
};
