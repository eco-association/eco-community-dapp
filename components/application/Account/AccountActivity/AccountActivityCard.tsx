import { Card, Column, Typography } from "@ecoinc/ecomponents";
import { useMemo, useState } from "react";
import { AccountActivityType } from "../../../../queries/ACCOUNT_ACTIVITY_QUERY";
import { useAccountActivity } from "../../../hooks/useAccountActivity";
import AccountActivityItem from "./AccountActivityItem";
import ActivityTotalsBar from "./ActivityTotalsBar";

const AccountActivityCard = () => {
  //const activities = useAccountActivity();
  const [proposalsSubmitted, setProposalsSubmitted] = useState<number>();
  const [votesSubmitted, setVotesSubmitted] = useState<number>();
  const [proposalsSupported, setProposalsSupported] = useState<number>();

  const activities = {
    account: {
      id: "0x0r5r",
      activities: [
        {
          type: AccountActivityType.PROPOSAL_SUBMITTED,
          timestamp: new Date(),
          communityProposal: {
            id: 1,
            name: "Test One",
            generationNumber: 333,
          },
        },
        {
          type: AccountActivityType.PROPOSAL_SUPPORTED,
          timestamp: new Date(),
          communityProposal: {
            id: 1,
            name: "Test One",
            generationNumber: 333,
          },
        },
        {
          type: AccountActivityType.PROPOSAL_VOTED_AGAINST,
          timestamp: new Date(),
          communityProposal: {
            id: 2,
            name: "Test Two",
            generationNumber: 334,
          },
        },
        {
          type: AccountActivityType.PROPOSAL_REFUNDED,
          timestamp: new Date(),
          communityProposal: {
            id: 3,
            name: "Refunded proposal",
            generationNumber: 332,
          },
        },
        {
          type: AccountActivityType.PROPOSAL_UNSUPPORTED,
          timestamp: new Date(),
          communityProposal: {
            id: 4,
            name: "Did not support",
            generationNumber: 3345,
          },
        },
        {
          type: AccountActivityType.LOCKUP_DEPOSIT,
          timestamp: new Date(),
          lockupDeposit: {
            amount: 55,
          },
        },
      ],
    },
  };

  // useMemo(() => {
  //   setProposalsSubmitted(
  //     activities.account.activities.filter(
  //       (a) => a.type === AccountActivityType.PROPOSAL_SUBMITTED
  //     ).length
  //   );
  //   setVotesSubmitted(
  //     activities.account.activities.filter(
  //       (a) => a.type === AccountActivityType.PROPOSAL_VOTED_AGAINST
  //     ).length +
  //       activities.account.activities.filter(
  //         (a) => a.type === AccountActivityType.PROPOSAL_VOTED_FOR
  //       ).length
  //   );
  //   setProposalsSupported(
  //     activities.account.activities.filter(
  //       (a) => a.type === AccountActivityType.PROPOSAL_SUPPORTED
  //     ).length
  //   );
  // }, [activities]);
  return (
    <Card>
      <Column gap="lg">
        <Typography variant="h2">Activity</Typography>
        <ActivityTotalsBar
          proposalsSubmitted={proposalsSubmitted}
          votesSubmitted={votesSubmitted}
          proposalsSupported={proposalsSupported}
        />
        {activities.account.activities.map((activity) => (
          <AccountActivityItem key={activity.type} activity={activity as any} />
        ))}
      </Column>
    </Card>
  );
};

export default AccountActivityCard;