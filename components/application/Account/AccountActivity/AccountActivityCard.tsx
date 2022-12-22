import { Card, Column, styled, Typography } from "@ecoinc/ecomponents";
import { css } from "@emotion/react";
import { useMemo, useState } from "react";
import { AccountActivityType } from "../../../../queries/ACCOUNT_ACTIVITY_QUERY";
import { useAccountActivity } from "../../../hooks/useAccountActivity";
import AccountActivityItem from "./AccountActivityItem";
import ActivityTotalsBar from "./ActivityTotalsBar";

const setMaxHeight = css({
  overflow: "hidden",
  paddingBottom: 24,
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
          <Sticky>
            <Column gap="lg">
              {activities.map((activity) => (
                <AccountActivityItem key={activity.id} activity={activity} />
              ))}
            </Column>
          </Sticky>
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
