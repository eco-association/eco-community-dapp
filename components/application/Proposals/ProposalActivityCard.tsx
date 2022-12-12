import React, { useState } from "react";
import Image from "next/image";
import moment from "moment";
import { Card, Column, Grid, styled, Typography } from "@ecoinc/ecomponents";
import {
  ActivityType,
  CommunityProposal,
} from "../../../queries/PROPOSAL_QUERY";
import { displayAddress } from "../../../utilities";
import { ProposalFull } from "../../hooks/useProposal";
import Checkmark from "../../../public/images/green-checkmark-circle.svg";
import GrayCheckmark from "../../../public/images/gray-checkmark-circle.svg";
import ErrorIcon from "../../../public/images/red-x-circle.svg";
import WaitingIcon from "../../../public/images/waiting-icon.svg";
import {
  isSubmittingInProgress,
  useCommunity,
} from "../../../providers/CommunityProvider";
import { SubgraphVoteResult } from "../../../queries/CURRENT_GENERATION";
import Skeleton from "react-loading-skeleton";

interface ActivityIconProps
  extends Omit<React.HTMLProps<HTMLDivElement>, "as"> {
  icon: "checkmark" | "disabled" | "error" | "waiting";
}

interface ActivityItemProps {
  disable?: boolean;
  title: string;
  description: React.ReactNode;
  last?: boolean;
  icon?: ActivityIconProps["icon"];
}

const Box = styled.div<{ fill?: boolean }>(({ fill }) => ({
  width: 24,
  height: 24,
  padding: fill ? 3 : 4,
  borderRadius: 7,
  ...(fill
    ? {
        background: "#DAE4EE33",
        border: "1px solid #F1F7FA",
      }
    : {}),
}));

const Line = styled.div<{ disable?: boolean }>(({ theme, disable }) => ({
  width: 1,
  backgroundColor: disable ? "#BDCBD3" : theme.palette.active.main,
}));

interface ProposalActivityCardProps {
  proposal?: ProposalFull;
}

function formatDate(date?: Date | string) {
  let m;
  if (typeof date === "string") m = moment(parseInt(date) * 1000);
  else m = moment(date);
  return m.format("MM.DD.YY");
}

function getActivity(proposal: CommunityProposal, type: ActivityType) {
  return proposal.activities.find((act) => act.type === type);
}

const ActivityIcon = React.forwardRef<HTMLDivElement, ActivityIconProps>(
  ({ icon, disabled, ...props }, ref) => {
    const image =
      icon === "error"
        ? ErrorIcon
        : icon === "waiting"
        ? WaitingIcon
        : disabled
        ? GrayCheckmark
        : Checkmark;
    return (
      <Box fill={icon === "waiting"} ref={ref} {...props}>
        <Image
          src={image}
          layout="fixed"
          alt="activity icon"
          width={16}
          height={16}
        />
      </Box>
    );
  }
);

const ActivityItem: React.FC<ActivityItemProps> = ({
  title,
  description,
  icon = "checkmark",
  disable,
  last,
}) => {
  return (
    <React.Fragment>
      <Grid
        columns="24px 1fr"
        rows="24px 1fr"
        columnGap="8px"
        areas="'icon content' 'line content'"
      >
        <ActivityIcon
          disabled={disable}
          icon={icon}
          style={{ gridArea: "icon" }}
        />
        <Column
          gap="sm"
          style={{ gridArea: "content", paddingBottom: last ? 0 : 8 }}
        >
          <Typography variant="body2">{title}</Typography>
          {React.isValidElement(description) ? (
            description
          ) : (
            <Typography variant="body3" color="secondary">
              {description}
            </Typography>
          )}
        </Column>
        {!last ? (
          <Line
            disable={disable}
            style={{ gridArea: "line", justifySelf: "center" }}
          />
        ) : null}
      </Grid>
    </React.Fragment>
  );
};

const ActivitySkeleton: React.FC = () => {
  return (
    <Grid columns="30px 1fr" alignItems="center" columnGap="8px">
      <Skeleton circle width={30} height={30} />
      <Skeleton count={2} />
    </Grid>
  );
};

const VoteItem: React.FC<{
  proposal: ProposalFull;
  disable?: boolean;
}> = ({ proposal, disable }) => {
  const voting = getActivity(proposal, ActivityType.ProposalVoting);

  if (!voting || !proposal.policyVote) return null;

  const { majorityReachedAt, voteEnds } = proposal.policyVote;
  const endedAtDate = majorityReachedAt || voteEnds;
  const votingEnded = Date.now() > endedAtDate.getTime();

  return (
    <ActivityItem
      title="Vote phase started"
      last={!votingEnded}
      disable={disable}
      icon={votingEnded ? "checkmark" : "waiting"}
      description={`${formatDate(voting.timestamp)} - ${formatDate(
        endedAtDate
      )}`}
    />
  );
};

const SupportResultItem: React.FC<{
  proposal: CommunityProposal;
  disable?: boolean;
  onFail(): void;
}> = ({ proposal, disable, onFail }) => {
  const reachedThreshold = proposal.reachedSupportThreshold;
  const supportActivity = getActivity(proposal, ActivityType.ProposalSupported);

  if (!reachedThreshold) onFail();

  return (
    <ActivityItem
      disable={disable}
      last={!reachedThreshold}
      title={reachedThreshold ? "Support threshold reached" : "Support failed"}
      icon={reachedThreshold ? "checkmark" : "error"}
      description={
        supportActivity
          ? formatDate(supportActivity.timestamp)
          : formatDate(new Date())
      }
    />
  );
};

const VoteResultItem: React.FC<{
  proposal: CommunityProposal;
  onFail(): void;
}> = ({ proposal, onFail }) => {
  const activity = getActivity(proposal, ActivityType.ProposalResult);

  if (!proposal.policyVote) return null;

  const { result, majorityReachedAt, voteEnds } = proposal.policyVote;

  const passed = result === SubgraphVoteResult.Accepted || !!majorityReachedAt;
  const title = passed ? "Vote passed" : "Vote failed";
  const endedAtDate = majorityReachedAt || voteEnds;

  const votingEnded = Date.now() > endedAtDate.getTime();
  if (!votingEnded) return null;

  const description = activity
    ? formatDate(activity.timestamp)
    : formatDate(endedAtDate);

  if (!passed) onFail();

  return (
    <ActivityItem
      last
      icon={passed ? "checkmark" : "error"}
      title={title}
      description={description}
    />
  );
};

export const ProposalActivityCard: React.FC<ProposalActivityCardProps> = ({
  proposal,
}) => {
  const community = useCommunity();

  const [failed, setFailed] = useState(false);

  let content = (
    <Column gap="md">
      <ActivitySkeleton />
      <ActivitySkeleton />
      <ActivitySkeleton />
    </Column>
  );

  if (proposal) {
    const submitted = getActivity(proposal, ActivityType.ProposalSubmitted);
    const { number, createdAt, policyProposal } = proposal.generation;

    const genCreatedAt = formatDate(createdAt);
    const supportEndDate = formatDate(policyProposal.proposalEnds);

    const isSupportPhase =
      proposal.generation.number === community.currentGeneration.number &&
      isSubmittingInProgress(community.stage.name);

    content = (
      <Column>
        <ActivityItem
          disable={failed}
          title="Deployed"
          description={formatDate(submitted.timestamp)}
        />
        <ActivityItem
          disable={failed}
          title="Submitted"
          description={
            <Column>
              <Typography variant="body3" color="secondary">
                {formatDate(submitted.timestamp)} • GENERATION {number}
              </Typography>
              <Typography variant="body3" color="secondary">
                Submitted by {displayAddress(proposal.proposer)}
              </Typography>
            </Column>
          }
        />
        <ActivityItem
          disable={failed}
          last={isSupportPhase}
          icon={isSupportPhase ? "waiting" : "checkmark"}
          title="Support phase started"
          description={`${genCreatedAt} - ${supportEndDate}`}
        />
        {!isSupportPhase ? (
          <SupportResultItem
            disable={failed}
            proposal={proposal}
            onFail={() => setFailed(true)}
          />
        ) : null}
        <VoteItem disable={failed} proposal={proposal} />
        <VoteResultItem proposal={proposal} onFail={() => setFailed(true)} />
      </Column>
    );
  }

  return (
    <Card>
      <Column gap="md">
        <Typography variant="body3" color="secondary">
          HISTORY
        </Typography>
        {content}
      </Column>
    </Card>
  );
};
