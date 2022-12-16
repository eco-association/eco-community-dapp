import { Card, Column, styled, Typography } from "@ecoinc/ecomponents";
import { SupportPhaseAlert } from "./SupportPhaseAlert";
import { ActivityNotification } from "./ActivityNotification";
import { useCommunity } from "../../../../providers";
import { isSubmittingInProgress } from "../../../../providers/CommunityProvider";
import { css } from "@emotion/react";
import { useActivities } from "../../../hooks/useActivities";

const setMaxHeight = css({
  maxHeight: 600,
  overflow: "hidden",
});

const Sticky = styled.div`
  overflow: scroll;
  max-height: 500px;

  ::-webkit-scrollbar {
    background: white;
    width: 9px;
    height: 0px;
  }

  ::-webkit-scrollbar-thumb {
    background: #dce9f0;
    border-radius: 43px;
  }

  scrollbar-color: #dce9f0 white;
`;

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
        <Sticky>
          {activities.map((activity, index) => (
            <ActivityNotification
              key={index}
              activity={activity}
              proposalId={activity.communityProposal?.id}
            />
          ))}
        </Sticky>
      </Column>
    </Card>
  );
};
