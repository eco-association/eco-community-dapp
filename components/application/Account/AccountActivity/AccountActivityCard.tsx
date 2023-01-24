import { Card, Column, Typography } from "@ecoinc/ecomponents";
import { css } from "@emotion/react";
import { AccountActivityType } from "../../../../queries/ACCOUNT_ACTIVITY_QUERY";
import { useAccountActivity } from "../../../hooks/useAccountActivity";
import ActivityItem from "./ActivityItem";
import ActivityTotalsBar from "./ActivityTotalsBar";
import { Scrollable } from "../../commons/Scrollable";

const setMaxHeight = css({
  overflow: "hidden",
  paddingBottom: 24,
});

const AccountActivityCard = () => {
  const activities = useAccountActivity();

  const { length: proposalsSubmitted } = activities.filter(
    (a) => a.type === AccountActivityType.PROPOSAL_SUBMITTED
  );

  const { length: proposalsVotedAgainst } = activities.filter(
    (a) => a.type === AccountActivityType.PROPOSAL_VOTED_AGAINST
  );

  const { length: proposalsVotedFor } = activities.filter(
    (a) => a.type === AccountActivityType.PROPOSAL_VOTED_FOR
  );

  const { length: proposalsSupported } = activities.filter(
    (a) => a.type === AccountActivityType.PROPOSAL_SUPPORTED
  );

  const votesSubmitted = proposalsVotedFor + proposalsVotedAgainst;

  return (
    <Card css={setMaxHeight}>
      <Column gap="lg">
        <Typography variant="h2">Activity</Typography>
        <ActivityTotalsBar
          votesSubmitted={votesSubmitted}
          proposalsSubmitted={proposalsSubmitted}
          proposalsSupported={proposalsSupported}
        />
        {activities.length > 0 ? (
          <Scrollable>
            <Column gap="lg">
              {activities.map((activity) => (
                <ActivityItem account key={activity.id} activity={activity} />
              ))}
            </Column>
          </Scrollable>
        ) : (
          <Typography variant="body1" color="secondary">
            You do not have any account activity yet
          </Typography>
        )}
      </Column>
    </Card>
  );
};

export default AccountActivityCard;
