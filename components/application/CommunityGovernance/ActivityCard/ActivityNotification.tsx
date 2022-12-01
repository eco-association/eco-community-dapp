import { Column, Typography } from "@ecoinc/ecomponents";
import { css } from "@emotion/react";
import React from "react";
import { formatTime, truncateText } from "../../../../utilities";
import {
  Activity,
  ActivityNotificationType,
} from "../../../../queries/ACTIVITY_QUERY";
import Link from "next/link";
import { SubgraphVoteResult } from "../../../../queries/CURRENT_GENERATION";

interface ActivityNotificationProps {
  activity: Activity;
  proposalId?: string;
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

const dateTime = css({
  fontSize: "10px",
  lineHeight: "12px",
});

export const ActivityNotification: React.FC<ActivityNotificationProps> = ({
  activity,
  proposalId,
}) => {
  if (activity.type === ActivityNotificationType.RANDOM_INFLATION) {
    return (
      <CardBase time={activity.timestamp}>
        <Typography variant="body1">New monetary policy enacted.</Typography>
      </CardBase>
    );
  }
  if (activity.type === ActivityNotificationType.PROPOSAL_VOTING) {
    return (
      <CardBase time={activity.timestamp}>
        <Typography variant="body1">
          Proposal{" "}
          <ProposalName
            id={proposalId}
            name={activity.communityProposal.name}
          />{" "}
          advanced to voting stage.
        </Typography>
      </CardBase>
    );
  }
  if (activity.type === ActivityNotificationType.PROPOSAL_SUBMITTED) {
    return (
      <CardBase time={activity.timestamp}>
        <Typography variant="body1">
          Proposal{" "}
          <ProposalName
            id={proposalId}
            name={activity.communityProposal.name}
          />{" "}
          submitted.
        </Typography>
      </CardBase>
    );
  }
  if (activity.type === ActivityNotificationType.PROPOSAL_QUORUM) {
    return (
      <CardBase time={activity.timestamp}>
        <Typography variant="body1">
          Proposal{" "}
          <ProposalName
            id={proposalId}
            name={activity.communityProposal.name}
          />{" "}
          reached the voting threshold.
        </Typography>
      </CardBase>
    );
  }
  if (activity.type === ActivityNotificationType.PROPOSAL_RESULT) {
    const { result } = activity.communityProposal.policyVotes[0];
    if (result === SubgraphVoteResult.Accepted) {
      return (
        <CardBase time={activity.timestamp}>
          <Typography variant="body1">
            Proposal{" "}
            <ProposalName
              id={proposalId}
              name={activity.communityProposal.name}
            />{" "}
            passed.
          </Typography>
        </CardBase>
      );
    }

    return (
      <CardBase time={activity.timestamp}>
        <Typography variant="body1">
          Proposal{" "}
          <ProposalName
            id={proposalId}
            name={activity.communityProposal.name}
          />{" "}
          failed.
        </Typography>
      </CardBase>
    );
  }

  if (activity.type === ActivityNotificationType.PROPOSAL_EXECUTED) {
    return (
      <CardBase time={activity.timestamp}>
        Proposal{" "}
        <ProposalName id={proposalId} name={activity.communityProposal.name} />{" "}
        was executed.
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
