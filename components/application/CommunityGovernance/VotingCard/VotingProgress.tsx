import { ProgressBar, styled, Typography } from "@ecoinc/ecomponents";
import React, { CSSProperties } from "react";
import { BigNumber } from "ethers";
import { breakpoints, mq, tokensToNumber } from "../../../../utilities";
import { numberFormatter } from "../../../../utilities/numberFormatter";

const Container = styled.div({
  position: "relative",
  [mq(breakpoints.md)]: {
    marginBottom: 8,
  },
});

const Division = styled.div(({ theme }) => ({
  display: "none",
  [mq(breakpoints.sm)]: {
    display: "block",
    position: "absolute",
    top: 0,
    left: "50%",
    zIndex: 1,
    height: 13,
    width: 2,
    transform: "translate(-1px, -4px)",
    backgroundColor: theme.palette.secondary.main,
  },
}));

interface VotingProgressProps {
  yesVotes: BigNumber;
  noVotes: BigNumber;
  total: BigNumber;
}

const transitionStyle: CSSProperties = {
  transition: "width ease 1s",
};

export const VotingProgress: React.FC<VotingProgressProps> = ({
  yesVotes: yesVotesBig,
  noVotes: noVotesBig,
  total: totalBig,
}) => {
  const yesVotes = tokensToNumber(yesVotesBig);
  const noVotes = tokensToNumber(noVotesBig);
  const total = tokensToNumber(totalBig);
  const yesPercentage = yesVotes / total;
  const noPercentage = noVotes / total;

  return (
    <Container>
      <Division />
      <ProgressBar
        position={["left", "right"]}
        color={["success", "primary"]}
        label={[
          <Typography key={1} variant="body1">
            {numberFormatter(yesVotes)} votes For
          </Typography>,
          <Typography key={2} variant="body1">
            {numberFormatter(noVotes)} votes Against
          </Typography>,
        ]}
        percentage={[yesPercentage, noPercentage]}
        BarStyle={[
          {
            ...transitionStyle,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          },
          {
            ...transitionStyle,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          },
        ]}
      />
    </Container>
  );
};
