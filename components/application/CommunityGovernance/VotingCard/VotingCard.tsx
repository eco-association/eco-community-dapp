import React, { useEffect, useState } from "react";
import { Card, Column, Row, styled, Typography } from "@ecoinc/ecomponents";
import Image from "next/image";
import { css } from "@emotion/react";
import { useRouter } from "next/router";

import { VotingProgress } from "./VotingProgress";
import { useCommunity } from "../../../../providers";
import { VoteDate } from "./VoteDate";
import { CommunityInterface, GenerationStage } from "../../../../types";
import { VoteAlert } from "./VoteAlert";
import { VoteExecCountdown } from "./VoteExecCountdown";
import { ExternalButton } from "../../commons/ExternalButton";
import { isVotingInProgress } from "../../../../providers/CommunityProvider";
import { breakpoints, mq } from "../../../../utilities";
import ExternalIcon from "../../../../public/images/external-icon.svg";

const moreButtonStyle = css({
  position: "absolute",
  top: 16,
  right: 20,
  borderRadius: 21,
});

const StyledCard = styled(Card)({
  position: "relative",
  width: "100%",
  border: "1px solid #56D9B6 ",

  [mq(breakpoints.md)]: {
    border: "none",
  },
});

const Title = styled(Typography)({ maxWidth: 573, letterSpacing: "-0.015em" });

const ProposalDetails = styled(Title)({
  color: "#5F869F",
  display: " -webkit-box",
  "-webkit-box-orient": "vertical",
  overflow: "hidden",

  span: {
    "&.read-more": {
      fontWeight: 600,
      display: "inline",
      position: "relative",

      ".external-icon": {
        position: "absolute",
        bottom: 0,
        marginLeft: "2px",
        width: "16px",
        height: "16px",
      },
    },
  },

  [mq(breakpoints.md)]: {
    display: "none",
  },
});

interface VotingCardProps {
  small?: boolean;
}

function getEnactionDate(community: CommunityInterface) {
  return community.stage.name === GenerationStage.Accepted
    ? new Date(community.stage.endsAt.getTime() + community.enactionDelay)
    : null;
}

export const VotingCard: React.FC<VotingCardProps> = ({ small }) => {
  const community = useCommunity();
  const router = useRouter();

  const [enactionDate, setEnactionDate] = useState(() =>
    getEnactionDate(community)
  );

  const stage = community.stage.name;

  useEffect(() => {
    if (enactionDate && enactionDate.getTime() > Date.now()) {
      const timeout = setTimeout(
        () => setEnactionDate(null),
        enactionDate.getTime() - Date.now()
      );
      return () => clearTimeout(timeout);
    }
  }, [enactionDate]);

  useEffect(() => {
    setEnactionDate(getEnactionDate(community));
  }, [community]);

  if (
    !community.selectedProposal ||
    (!isVotingInProgress(stage) &&
      (!enactionDate || enactionDate.getTime() < Date.now()))
  )
    return null;

  const goToProposal = () =>
    router.push({
      pathname: `proposal`,
      query: { id: community.selectedProposal.id },
    });

  const top = !small ? (
    <Column gap="md">
      <VoteDate stage={stage} date={community.stage.endsAt} />
      <Title variant="h3">{community.selectedProposal.name}</Title>

      <ProposalDetails variant="body2">
        <span className="desc">
          {community.selectedProposal?.description?.slice(0, 69)}...{" "}
        </span>{" "}
        <span className="read-more">
          read more about it
          <span className="external-icon">
            <Image src={ExternalIcon} alt="external" layout="fill" />
          </span>
        </span>
      </ProposalDetails>
    </Column>
  ) : (
    <Column>
      <VoteDate stage={stage} date={community.stage.endsAt} />
    </Column>
  );

  return (
    <StyledCard>
      {!small ? (
        <ExternalButton css={moreButtonStyle} onClick={goToProposal}>
          MORE
        </ExternalButton>
      ) : null}
      <Column gap="lg">
        {top}
        <VotingProgress
          yesVotes={community.yesStake}
          noVotes={community.requiredStake.sub(community.yesStake)}
          total={community.totalVotingPower}
        />
        {enactionDate ? (
          <VoteExecCountdown date={enactionDate} />
        ) : (
          <VoteAlert
            block={community.currentGeneration.blockNumber}
            voted={community.voted}
          />
        )}
      </Column>
    </StyledCard>
  );
};
