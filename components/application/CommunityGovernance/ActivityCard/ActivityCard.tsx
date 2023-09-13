import { Card, Column, Typography } from "@ecoinc/ecomponents";
import { SupportPhaseAlert } from "./SupportPhaseAlert";
import { css } from "@emotion/react";

import { useCommunity } from "../../../../providers";
import { isSubmittingInProgress } from "../../../../providers/CommunityProvider";
import { useActivities } from "../../../hooks/useActivities";
import ActivityItem from "../../Account/AccountActivity/ActivityItem";
import { Scrollable } from "../../commons/Scrollable";
import { breakpoints, mq } from "../../../../utilities";

const setMaxHeight = css({
  margin: "0 -16px",
  height: "max-content",

  [mq(breakpoints.md)]: {
    maxHeight: 600,
    margin: 0,

    overflow: "hidden",
  },
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
