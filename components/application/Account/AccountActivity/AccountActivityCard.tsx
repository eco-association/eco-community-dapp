import { Card, Column, Typography } from "@ecoinc/ecomponents";
import { useMemo, useState } from "react";
import { AccountActivityType } from "../../../../queries/ACCOUNT_ACTIVITY_QUERY";
import { useAccountActivity } from "../../../hooks/useAccountActivity";
import AccountActivityItem from "./AccountActivityItem";
import ActivityTotalsBar from "./ActivityTotalsBar";

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
    <Card>
      <Column gap="lg">
        <Typography variant="h2">Activity</Typography>
        <ActivityTotalsBar
          proposalsSubmitted={proposalsSubmitted}
          votesSubmitted={votesSubmitted}
          proposalsSupported={proposalsSupported}
        />
        {activities.map((activity) => (
          <AccountActivityItem
            key={activity.timestamp.toString()}
            activity={activity}
          />
        ))}
      </Column>
    </Card>
  );
};

export default AccountActivityCard;
