import { Column, Row, styled } from "@ecoinc/ecomponents";
import { MonoText } from "../commons/MonoText";
import { Countdown } from "../Countdown";
import { GenerationStage } from "../../../types";
import React from "react";
import {
  isSubmittingInProgress,
  isVotingInProgress,
  useCommunity,
} from "../../../providers/CommunityProvider";
import { useTimeFlag } from "../../hooks/useTimeFlag";
import { breakpoints, mq } from "../../../utilities";

interface HeaderInfoProps {
  subtitle?: boolean;
  home?: boolean;
  centralize?: boolean;
}

const styles = {
  spaceRight: { marginRight: "2px" },
};

const Container = styled(Column)(({ centralize }) => ({
  alignItems: centralize ? "center" : "flex-start",

  [mq(breakpoints.sm)]: {
    alignItems: "center",
  },
}));

const CountdownContainer = styled(Column)(({ centralize }) => ({
  alignItems: centralize ? "center" : "flex-start",

  [mq(breakpoints.sm)]: {
    alignItems: "center",
  },
}));

const StyleMonoText = styled(MonoText)<{ centralize?: boolean }>(
  ({ centralize }) => ({
    padding: centralize ? "0 20px" : "0",
    textAlign: centralize ? "center" : "left",
  })
);

export const HeaderInfo: React.FC<HeaderInfoProps> = ({
  home,
  subtitle,
  centralize,
}) => {
  const {
    stage: { name: stage, endsAt },
    nextGenerationStartsAt: nextGenStartsAt,
  } = useCommunity();
  const nextGenReached = useTimeFlag(nextGenStartsAt);

  if (stage === GenerationStage.Quorum) {
    return (
      <Row gap="sm" items="center">
        <MonoText inline variant="subtitle1" color="success">
          Voting stage starting soon...
        </MonoText>
      </Row>
    );
  }

  if (isVotingInProgress(stage)) {
    if (home) return null;
    return (
      <Row gap="sm" items="center">
        <MonoText inline variant="subtitle1" color="success">
          Vote in progress...
        </MonoText>
      </Row>
    );
  }

  if (isSubmittingInProgress(stage)) {
    return (
      <Container centralize={centralize} gap="sm" items="center">
        <CountdownContainer centralize={centralize} gap="sm">
          <Countdown date={endsAt} variant="subtitle1" color="success" />
          <Row align="center">
            <MonoText
              css={styles.spaceRight}
              inline
              variant="subtitle1"
              color="success"
            >
              •
            </MonoText>
            <MonoText inline variant="subtitle1" color="success">
              Remain to Submit & Support
            </MonoText>
          </Row>
        </CountdownContainer>

        {subtitle ? (
          <StyleMonoText
            centralize={centralize}
            variant="subtitle1"
            color="secondary"
          >
            First proposal to reach 15% support triggers the voting stage for
            that proposal
          </StyleMonoText>
        ) : null}
      </Container>
    );
  }

  if (nextGenReached) {
    return (
      <Row gap="sm" items="center">
        <MonoText inline variant="subtitle1" color="success">
          Starting new generation...
        </MonoText>
      </Row>
    );
  }

  return (
    <CountdownContainer gap="sm" items="center">
      <Countdown date={nextGenStartsAt} variant="subtitle1" color="success" />
      <Row align="center">
        <MonoText css={styles.spaceRight} variant="subtitle1" color="success">
          •
        </MonoText>
        <MonoText variant="subtitle1" color="success">
          Until next generation
        </MonoText>
      </Row>
    </CountdownContainer>
  );
};
