import React from "react";
import { css } from "@emotion/react";
import { Column, formatNumber, Typography } from "@ecoinc/ecomponents";
import Link from "next/link";
import {
  formatTime,
  numberFormatter,
  tokensToNumber,
  truncateText,
} from "../../../../utilities";

import {
  AccountActivityType,
  Activity as AccountActivity,
} from "../../../../queries/ACCOUNT_ACTIVITY_QUERY";
import {
  Activity as GeneralActivity,
  ActivityNotificationType,
} from "../../../../queries/ACTIVITY_QUERY";
import { SubgraphVoteResult } from "../../../../queries/CURRENT_GENERATION";

const dateTime = css({
  fontSize: "10px",
  lineHeight: "12px",
});

interface AccountActivityItemProps {
  account?: boolean;
  activity: AccountActivity | GeneralActivity;
  proposalId?: string;
}

interface CardBaseProps {
  time: Date;
}

interface ProposalActivityProps {
  action: string;
  proposalName: string;
  bridge?: string;
  proposalId?: string;
}

const CardBase: React.FC<React.PropsWithChildren<CardBaseProps>> = ({
  time,
  children,
}) => {
  return (
    <Column>
      <Typography variant="body3" color="secondary" css={dateTime}>
        {time ? formatTime(time).toUpperCase() : null}
      </Typography>
      <Typography variant="body1">{children}</Typography>
    </Column>
  );
};

const ProposalName: React.FC<{ id: string; name: string }> = ({ id, name }) => {
  return (
    <Link
      href={{
        pathname: "/proposal",
        query: { id },
      }}
    >
      <Typography link color="active" css={{ fontWeight: 600 }}>
        &quot;{truncateText(name, 105)}&quot;
      </Typography>
    </Link>
  );
};

const ProposalActivity: React.FC<ProposalActivityProps> = ({
  action,
  proposalName,
  bridge,
  proposalId,
}) => {
  return (
    <React.Fragment>
      You {action} {bridge} <ProposalName id={proposalId} name={proposalName} />
    </React.Fragment>
  );
};

const AccountActivityItem: React.FC<AccountActivityItemProps> = ({
  activity,
}) => {
  if (activity.type === AccountActivityType.SECOX_UNDELEGATE) {
    return (
      <CardBase time={activity.timestamp}>You undelegated staked ECOx</CardBase>
    );
  }
  if (activity.type === AccountActivityType.SECOX_DELEGATE) {
    return (
      <CardBase time={activity.timestamp}>You delegated staked ECOx</CardBase>
    );
  }
  if (activity.type === AccountActivityType.ECO_UNDELEGATE) {
    return <CardBase time={activity.timestamp}>You undelegated ECO</CardBase>;
  }
  if (activity.type === AccountActivityType.ECO_DELEGATE) {
    return <CardBase time={activity.timestamp}>You delegated ECO</CardBase>;
  }
  if (activity.type === AccountActivityType.LOCKUP_DEPOSIT) {
    return (
      <CardBase time={activity.timestamp}>
        You deposited <b>{formatNumber(tokensToNumber(activity.amount))} ECO</b>{" "}
        into a lockup, earning{" "}
        {numberFormatter(activity.lockupDeposit.interest)}% interest.
      </CardBase>
    );
  }
  if (activity.type === AccountActivityType.PROPOSAL_VOTED_AGAINST) {
    return (
      <CardBase time={activity.timestamp}>
        <ProposalActivity
          action="voted against"
          proposalId={activity.communityProposal.id}
          proposalName={activity.communityProposal.name}
        />
      </CardBase>
    );
  }
  if (activity.type === AccountActivityType.PROPOSAL_VOTED_FOR) {
    return (
      <CardBase time={activity.timestamp}>
        <ProposalActivity
          action="voted yes"
          bridge="on"
          proposalId={activity.communityProposal.id}
          proposalName={activity.communityProposal.name}
        />
      </CardBase>
    );
  }
  if (activity.type === AccountActivityType.PROPOSAL_UNSUPPORTED) {
    return (
      <CardBase time={activity.timestamp}>
        <ProposalActivity
          action="revoked support"
          bridge="for"
          proposalId={activity.communityProposal.id}
          proposalName={activity.communityProposal.name}
        />
      </CardBase>
    );
  }
  if (activity.type === AccountActivityType.PROPOSAL_SUPPORTED) {
    return (
      <CardBase time={activity.timestamp}>
        <ProposalActivity
          action="supported proposal"
          proposalId={activity.communityProposal.id}
          proposalName={activity.communityProposal.name}
        />
      </CardBase>
    );
  }
  if (activity.type === AccountActivityType.PROPOSAL_REFUNDED) {
    return (
      <CardBase time={activity.timestamp}>
        <ProposalActivity
          action="received a refund"
          bridge="for"
          proposalId={activity.communityProposal.id}
          proposalName={activity.communityProposal.name}
        />
      </CardBase>
    );
  }
  if (activity.type === AccountActivityType.PROPOSAL_SUBMITTED) {
    return (
      <CardBase time={activity.timestamp}>
        <ProposalActivity
          action="deployed"
          bridge="a proposal"
          proposalId={activity.communityProposal.id}
          proposalName={activity.communityProposal.name}
        />
      </CardBase>
    );
  }
};

const GeneralActivityItem: React.FC<AccountActivityItemProps> = ({
  activity,
  proposalId,
}) => {
  if (activity.type === ActivityNotificationType.RANDOM_INFLATION) {
    return (
      <CardBase time={activity.timestamp}>
        New monetary policy enacted.
      </CardBase>
    );
  }
  if (activity.type === ActivityNotificationType.PROPOSAL_VOTING) {
    return (
      <CardBase time={activity.timestamp}>
        Proposal{" "}
        <ProposalName id={proposalId} name={activity.communityProposal.name} />{" "}
        advanced to voting stage.
      </CardBase>
    );
  }
  if (activity.type === ActivityNotificationType.PROPOSAL_SUBMITTED) {
    return (
      <CardBase time={activity.timestamp}>
        Proposal{" "}
        <ProposalName id={proposalId} name={activity.communityProposal.name} />{" "}
        submitted.
      </CardBase>
    );
  }
  if (activity.type === ActivityNotificationType.PROPOSAL_QUORUM) {
    return (
      <CardBase time={activity.timestamp}>
        Proposal{" "}
        <ProposalName id={proposalId} name={activity.communityProposal.name} />{" "}
        reached the voting threshold.
      </CardBase>
    );
  }
  if (activity.type === ActivityNotificationType.PROPOSAL_RESULT) {
    const { result } = activity.communityProposal.policyVotes[0];
    if (result === SubgraphVoteResult.Accepted) {
      return (
        <CardBase time={activity.timestamp}>
          Proposal{" "}
          <ProposalName
            id={proposalId}
            name={activity.communityProposal.name}
          />{" "}
          passed.
        </CardBase>
      );
    }
    if (result === SubgraphVoteResult.Failed) {
      return (
        <CardBase time={activity.timestamp}>
          Proposal{" "}
          <ProposalName
            id={proposalId}
            name={activity.communityProposal.name}
          />{" "}
          failed.
        </CardBase>
      );
    }
  }
  if (activity.type === ActivityNotificationType.PROPOSAL_EXECUTED) {
    return (
      <CardBase time={activity.timestamp}>
        <ProposalName id={proposalId} name={activity.communityProposal.name} />{" "}
        proposal was successfully enacted.
      </CardBase>
    );
  }
  if (activity.type === ActivityNotificationType.GENERATION_INCREMENTED) {
    return (
      <CardBase time={activity.timestamp}>
        Generation <b>{activity.generation.number}</b> started.
      </CardBase>
    );
  }
};

const ActivityItem: React.FC<AccountActivityItemProps> = ({
  account,
  ...props
}) => {
  if (account) return <AccountActivityItem {...props} />;
  return <GeneralActivityItem {...props} />;
};

export default ActivityItem;
