import { useEffect, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { convertDate } from "../../utilities/convertDate";
import { ACTIVITY_QUERY, ActivityQueryResults } from "../../queries";
import {
  Activity,
  ActivityNotificationType,
  ActivityQuery,
} from "../../queries/ACTIVITY_QUERY";
import { useCommunity } from "../../providers";
import { CommunityInterface, GenerationStage } from "../../types";
import { hasVotingStagePassed } from "../../providers/CommunityProvider";
import { SubgraphVoteResult } from "../../queries/CURRENT_GENERATION";

function formatActivities(
  community: CommunityInterface,
  result: ActivityQuery[]
) {
  const activities = result.map(
    (act): Activity => ({
      ...act,
      timestamp: convertDate(act.timestamp),
      generation: act.generation
        ? { number: parseInt(act.generation.number) }
        : undefined,
    })
  );

  // Add result activity right after voting ends
  if (
    community.selectedProposal &&
    hasVotingStagePassed(community.stage.name)
  ) {
    const isResultShown = activities.some(
      (act) =>
        act.type === ActivityNotificationType.PROPOSAL_RESULT &&
        act.communityProposal?.id === community.selectedProposal.id
    );
    if (!isResultShown) {
      const proposal = community.proposals.find(
        (p) => p.id === community.selectedProposal.id
      );

      const result =
        community.stage.name === GenerationStage.Accepted ||
        community.stage.name === GenerationStage.Majority
          ? SubgraphVoteResult.Accepted
          : SubgraphVoteResult.Rejected;

      const communityProposal = {
        ...proposal,
        generationNumber: community.currentGeneration.number.toString(),
        policyVotes: [{ result }],
      };

      const resultActivity: Activity = {
        type: ActivityNotificationType.PROPOSAL_RESULT,
        timestamp: community.stage.endsAt,
        communityProposal,
      };

      return [resultActivity, ...activities];
    }
  }

  return activities;
}

export const useActivities = (): Activity[] => {
  const community = useCommunity();

  const { data, startPolling, stopPolling } =
    useQuery<ActivityQueryResults>(ACTIVITY_QUERY);

  useEffect(() => {
    startPolling(5_000);
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  return useMemo(() => {
    if (!data || !data.activityRecords) return [];
    return formatActivities(community, data.activityRecords);
  }, [community, data]);
};
