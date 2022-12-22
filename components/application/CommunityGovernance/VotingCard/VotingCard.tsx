import { Card, Column, styled, Typography } from "@ecoinc/ecomponents";
import { VotingProgress } from "./VotingProgress";
import { useCommunity } from "../../../../providers";
import { VoteDate } from "./VoteDate";
import { CommunityInterface, GenerationStage } from "../../../../types";
import { VoteAlert } from "./VoteAlert";
import { VoteExecCountdown } from "./VoteExecCountdown";
import { css } from "@emotion/react";
import { ExternalButton } from "../../commons/ExternalButton";
import React, { useEffect, useState } from "react";
import { Countdown } from "../../Countdown";
import { useRouter } from "next/router";
import { MonoText } from "../../commons/MonoText";
import { isVotingInProgress } from "../../../../providers/CommunityProvider";

const Title = styled(Typography)({ maxWidth: 573, letterSpacing: "-0.015em" });

const moreButtonStyle = css({
  position: "absolute",
  top: 16,
  right: 20,
  borderRadius: 21,
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
      <Title variant="h3" css={{ textAlign: "center", alignSelf: "center" }}>
        {community.selectedProposal.name}
      </Title>
    </Column>
  ) : (
    <Column>
      {stage === GenerationStage.Majority ? (
        <MonoText variant="body3" color="active" style={{ alignSelf: "end" }}>
          VOTE MAJORITY REACHED
        </MonoText>
      ) : (
        <Countdown
          date={community.stage.endsAt}
          variant="body3"
          color="secondary"
          style={{ alignSelf: "end" }}
        />
      )}
      <Title variant="h3" style={{ lineHeight: 1 }}>
        Vote
      </Title>
    </Column>
  );

  return (
    <Card css={{ position: "relative", width: "100%" }}>
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
    </Card>
  );
};
