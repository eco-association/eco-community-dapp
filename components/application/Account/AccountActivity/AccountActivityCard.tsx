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
  /**
   * For testing, comment out const activities ... above.
   * Un-comment activities (below)
   * You will need to remove activities from the useMemo dependency array in order to prevent an
   * infinite re-render loop
   *
   */
  // const activities = [
  //   {
  //     type: AccountActivityType.PROPOSAL_SUBMITTED,
  //     timestamp: new Date(),
  //     communityProposal: {
  //       id: 1,
  //       name: "Test One",
  //       generationNumber: 333,
  //     },
  //   },
  //   {
  //     type: AccountActivityType.PROPOSAL_SUPPORTED,
  //     timestamp: new Date(),
  //     communityProposal: {
  //       id: 1,
  //       name: "Test One",
  //       generationNumber: 333,
  //     },
  //   },
  //   {
  //     type: AccountActivityType.PROPOSAL_VOTED_AGAINST,
  //     timestamp: new Date(),
  //     communityProposal: {
  //       id: 2,
  //       name: "Test Two",
  //       generationNumber: 334,
  //     },
  //   },
  //   {
  //     type: AccountActivityType.PROPOSAL_REFUNDED,
  //     timestamp: new Date(),
  //     communityProposal: {
  //       id: 3,
  //       name: "Refunded proposal",
  //       generationNumber: 332,
  //     },
  //   },
  //   {
  //     type: AccountActivityType.PROPOSAL_UNSUPPORTED,
  //     timestamp: new Date(),
  //     communityProposal: {
  //       id: 4,
  //       name: "Did not support",
  //       generationNumber: 3345,
  //     },
  //   },
  //   {
  //     type: AccountActivityType.LOCKUP_DEPOSIT,
  //     timestamp: new Date(),
  //     lockupDeposit: {
  //       amount: 55,
  //     },
  //   },
  // ];
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
        {activities.length === 0 && (
          <Typography variant="body1" color="secondary">
            You do not have any activities yet!
          </Typography>
        )}
        {activities?.map((activity) => (
          <AccountActivityItem key={activity.type} activity={activity} />
        ))}
      </Column>
    </Card>
  );
};

export default AccountActivityCard;
