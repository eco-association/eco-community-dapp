import { Card, Column, Typography } from "@ecoinc/ecomponents";
import { SupportPhaseAlert } from "./SupportPhaseAlert";
import { useCommunity } from "../../../../providers";
import { isSubmittingInProgress } from "../../../../providers/CommunityProvider";
import { css } from "@emotion/react";
import { useActivities } from "../../../hooks/useActivities";
import ActivityItem from "../../Account/AccountActivity/ActivityItem";
import { Scrollable } from "../../commons/Scrollable";

const setMaxHeight = css({
  maxHeight: 600,
  overflow: "hidden",
});

export const ActivityCard = () => {
  const community = useCommunity();
  const activities = useActivities();

  return (
    <Card css={setMaxHeight}>
      <Column gap="lg">
        <Typography variant="h3">Activity Feed</Typography>
        {isSubmittingInProgress(community.stage.name) ? (
          <SupportPhaseAlert />
        ) : null}
        <Scrollable>
          <Column gap="lg">
            {activities.map((activity, index) => (
              <ActivityItem
                key={index}
                activity={activity}
                proposalId={activity.communityProposal?.id}
              />
            ))}
          </Column>
        </Scrollable>
      </Column>
    </Card>
  );
};
