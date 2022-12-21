import { Card, Column, styled, Typography } from "@ecoinc/ecomponents";
import { css } from "@emotion/react";
import { useMemo, useState } from "react";
import { AccountActivityType } from "../../../../queries/ACCOUNT_ACTIVITY_QUERY";
import { useAccountActivity } from "../../../hooks/useAccountActivity";
import AccountActivityItem from "./AccountActivityItem";
import ActivityTotalsBar from "./ActivityTotalsBar";

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

const AccountActivityCard = () => {
  const activities = useAccountActivity();
  const [proposalsSubmitted, setProposalsSubmitted] = useState<number>();
  const [votesSubmitted, setVotesSubmitted] = useState<number>();
  const [proposalsSupported, setProposalsSupported] = useState<number>();

  useMemo(() => {
    setProposalsSubmitted(
      activities.filter(
        (a) => a.type === AccountActivityType.PROPOSAL_SUBMITTED
      ).length
    );
    setVotesSubmitted(
      activities.filter(
        (a) => a.type === AccountActivityType.PROPOSAL_VOTED_AGAINST
      ).length +
        activities.filter(
          (a) => a.type === AccountActivityType.PROPOSAL_VOTED_FOR
        ).length
    );
    setProposalsSupported(
      activities.filter(
        (a) => a.type === AccountActivityType.PROPOSAL_SUPPORTED
      ).length
    );
  }, [activities]);
  return (
    <Card css={setMaxHeight}>
      <Column gap="lg">
        <Typography variant="h2">Activity</Typography>
        <ActivityTotalsBar
          proposalsSubmitted={proposalsSubmitted}
          votesSubmitted={votesSubmitted}
          proposalsSupported={proposalsSupported}
        />
        {activities.length > 0 ? (
          <Sticky>
            <Column gap="lg">
              {activities.map((activity) => (
                <AccountActivityItem key={activity.type} activity={activity} />
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
