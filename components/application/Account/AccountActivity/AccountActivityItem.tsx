import { Column, Typography } from "@ecoinc/ecomponents";
import { css } from "@emotion/react";
import {
  AccountActivity,
  AccountActivityType,
} from "../../../../queries/ACCOUNT_ACTIVITY_QUERY";
import { formatTime } from "../../../../utilities";

const dateTime = css({
  fontSize: "10px",
  lineHeight: "12px",
});

interface AccountActivityItemProps {
  activity: AccountActivity;
}

interface CardBaseProps {
  time: Date;
}

const CardBase: React.FC<React.PropsWithChildren<CardBaseProps>> = ({
  time,
  children,
}) => {
  return (
    <Column css={{ marginBottom: "24px" }}>
      <Typography variant="body3" color="secondary" css={dateTime}>
        {time ? formatTime(time).toUpperCase() : null}
      </Typography>
      <Typography variant="body1">{children}</Typography>
    </Column>
  );
};
const AccountActivityItem: React.FC<AccountActivityItemProps> = ({
  activity,
}) => {
  if (activity.type === AccountActivityType.SECOX_UNDELEGATE) {
    return <CardBase time={activity.timestamp}>sECOx undelegated</CardBase>;
  }
  if (activity.type === AccountActivityType.SECOX_DELEGATE) {
    return <CardBase time={activity.timestamp}>sEcox delegated</CardBase>;
  }
  if (activity.type === AccountActivityType.ECO_UNDELEGATE) {
    return <CardBase time={activity.timestamp}>Eco Undelegated</CardBase>;
  }
  if (activity.type === AccountActivityType.ECO_DELEGATE) {
    return <CardBase time={activity.timestamp}>Eco Delegated</CardBase>;
  }
  if (activity.type === AccountActivityType.LOCKUP_DEPOSIT) {
    return <CardBase time={activity.timestamp}>Lockup Deposit</CardBase>;
  }
  if (activity.type === AccountActivityType.PROPOSAL_VOTED_AGAINST) {
    return <CardBase time={activity.timestamp}>Voted Against</CardBase>;
  }
  if (activity.type === AccountActivityType.PROPOSAL_VOTED_FOR) {
    return <CardBase time={activity.timestamp}>voted for</CardBase>;
  }
  if (activity.type === AccountActivityType.PROPOSAL_UNSUPPORTED) {
    return <CardBase time={activity.timestamp}>proposal unsupported</CardBase>;
  }
  if (activity.type === AccountActivityType.PROPOSAL_SUPPORTED) {
    return <CardBase time={activity.timestamp}>Proposal supported</CardBase>;
  }
  if (activity.type === AccountActivityType.PROPOSAL_REFUNDED) {
    return <CardBase time={activity.timestamp}>proposal refunded</CardBase>;
  }
  if (activity.type === AccountActivityType.PROPOSAL_SUBMITTED) {
    return <CardBase time={activity.timestamp}>proposal submitted</CardBase>;
  }
};

export default AccountActivityItem;
