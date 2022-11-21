import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Column,
  formatNumber,
  ProgressBar,
  Row,
  styled,
  Typography,
} from "@ecoinc/ecomponents";
import moment from "moment";
import { css } from "@emotion/react";
import { BigNumber } from "ethers";
import { useCommunity } from "../../../../providers";
import { GenerationStage, Stage } from "../../../../types";
import { tokensToNumber } from "../../../../utilities";
import { Countdown } from "../../Countdown";
import SupportModal, { SupportModalAction } from "../VotingCard/SupportModal";
import {
  isSubmittingInProgress,
  Support,
} from "../../../../providers/CommunityProvider";
import { CommunityProposal } from "../../../../queries/PROPOSAL_QUERY";
import { useAccount } from "wagmi";
import { useConnectContext } from "../../../../providers/ConnectModalProvider";

interface SupportCardProps {
  proposal: CommunityProposal;
  votingPower: BigNumber;

  onSupport?(support: Support): void;
}

const greyBar = css({
  backgroundColor: "#F6F9FB",
  borderRadius: "6px",
  border: "solid 1px #dee6eb",
  width: "100%",
  padding: "16px",
});

const justifyBetween = css({ justifyContent: "space-between" });

const endedText = css({
  fontFamily: "IBM Plex Mono",
  fontSize: "10px",
  color: "#5f869f",
});

const RenderButtons = (
  isConnected: boolean,
  didUserSupport: boolean,
  stage: GenerationStage,
  setVoteDirection: (action: SupportModalAction) => void,
  onConnect: () => void
) => {
  if (!isSubmittingInProgress(stage) || stage === GenerationStage.Quorum) {
    return null;
  }
  return didUserSupport ? (
    <Button
      variant="outline"
      color="secondary"
      onClick={() => {
        if (isConnected) setVoteDirection(SupportModalAction.Change);
        else onConnect();
      }}
    >
      Undo Support
    </Button>
  ) : (
    <Button
      variant="fill"
      color="success"
      css={{ width: "107px", height: "38px" }}
      onClick={() => {
        if (isConnected) setVoteDirection(SupportModalAction.For);
        else onConnect();
      }}
    >
      Support
    </Button>
  );
};

const support = (votingPower, totalVotingPower) => {
  const percentage = (
    (tokensToNumber(votingPower) / tokensToNumber(totalVotingPower)) *
    100
  ).toFixed(2);
  return (
    <>
      <Typography variant="h5">Show support</Typography>
      <Typography variant="body2" color="secondary">
        Add your{" "}
        <Typography inline variant="body2" color="primary">
          {formatNumber(tokensToNumber(votingPower))}
        </Typography>{" "}
        votes ({percentage}% of total community voting power).
      </Typography>
    </>
  );
};

const supportNotConnected = () => {
  return (
    <>
      <Typography variant="h5">Show support</Typography>
      <Typography variant="body2" color="secondary">
        Support this proposal with your voting power.
      </Typography>
    </>
  );
};

const alreadySupported = (votingPower: BigNumber, supportedAt: Date) => {
  return (
    <>
      <Typography variant="h5" color="success">
        You Supported
      </Typography>
      <Typography variant="body2" color="secondary">
        You cast your{" "}
        <Typography inline variant="body2" color="secondary">
          {formatNumber(tokensToNumber(votingPower))}
        </Typography>{" "}
        votes to this proposal on {formatDate(supportedAt)}
      </Typography>
    </>
  );
};

const noVotingPower = () => {
  return (
    <>
      <Typography variant="h5" color="secondary">
        No voting power
      </Typography>
      <Typography variant="body2" color="secondary">
        It looks like you have no active voting power. You can learn more about
        active voting power{" "}
        <a
          href="https://docs.eco.org/core-concepts/community-governance#generational-voting-power"
          target="_blank"
          style={{ textDecoration: "underline" }}
          rel="noreferrer"
        >
          here
        </a>
      </Typography>
    </>
  );
};

const supportPhaseOver = () => {
  return (
    <>
      <Typography variant="h5" color="secondary">
        Voting will begin soon
      </Typography>
      <Typography variant="body2" color="secondary">
        This proposal has earned enough support from the community, and will now
        advance to a vote.
      </Typography>
    </>
  );
};

function formatDate(date: Date): string {
  return moment(date).format("MM.DD.YY");
}

function getCardContent(
  isConnected: boolean,
  stage: GenerationStage,
  didUserSupport: boolean,
  totalVotingPower: BigNumber,
  votingPower: BigNumber,
  supportDate: Date
) {
  if (stage === GenerationStage.Quorum) {
    return supportPhaseOver();
  }
  if (!isConnected) {
    return supportNotConnected();
  }
  if (votingPower.isZero()) {
    return noVotingPower();
  }
  if (didUserSupport) {
    return alreadySupported(votingPower, supportDate);
  }
  return support(votingPower, totalVotingPower);
}

const SupportCardCountdown: React.FC<{ stage: Stage }> = ({ stage }) => {
  const [ended, setEnded] = useState(stage.name === GenerationStage.Quorum);

  const date = new Date(stage.endsAt);
  const lessThanOneDay = date.getTime() <= Date.now();

  useEffect(() => {
    setEnded(stage.name === GenerationStage.Quorum);
  }, [stage.name]);

  if (ended) {
    return (
      <Typography variant="body3" css={endedText}>
        ENDED {formatDate(date)}
      </Typography>
    );
  }

  return (
    <Countdown
      date={date}
      onComplete={() => setEnded(true)}
      style={{
        fontSize: "10px",
        color: lessThanOneDay ? "#ED575F" : "#5F869F",
      }}
    />
  );
};

const ProgressContainer = styled.div({ position: "relative" });
const LimitBar = styled.div(({ theme }) => ({
  position: "absolute",
  left: "15%",
  top: 2,
  transform: "translate(0, -50%)",
  height: 14,
  zIndex: 1,
  width: 2,
  backgroundColor: theme.palette.secondary.main,
}));

const SupportCard: React.FC<SupportCardProps> = ({
  proposal,
  votingPower,
  onSupport,
}) => {
  const account = useAccount();
  const { totalVotingPower, stage } = useCommunity();
  const { preventUnauthenticatedActions } = useConnectContext();

  const [action, setAction] = useState(SupportModalAction.None);

  if (!isSubmittingInProgress(stage.name)) return null;

  const percentage =
    tokensToNumber(proposal.totalStake) / tokensToNumber(totalVotingPower);

  return (
    <Card css={{ position: "relative", width: "100%" }}>
      <SupportModal
        action={action}
        proposal={proposal}
        onRequestClose={() => setAction(SupportModalAction.None)}
        onSupport={onSupport}
      />
      <Column gap="lg">
        <Column gap="md">
          <Row css={justifyBetween}>
            {stage.name === GenerationStage.Quorum ? (
              <Typography variant="h3">
                Support phase <span style={{ color: "#5AE4BF" }}>complete</span>
              </Typography>
            ) : (
              <Typography variant="h3">
                {(percentage * 100).toFixed(2)}% Support
              </Typography>
            )}
            <SupportCardCountdown stage={stage} />
          </Row>
          <ProgressContainer>
            <LimitBar />
            <ProgressBar
              color="success"
              textRight
              text="15% needed"
              percentage={percentage}
              label={
                <Typography variant="body1">
                  {formatNumber(tokensToNumber(proposal.totalStake))} support
                  For{" "}
                  <Typography variant="body1" color="secondary">
                    (of {formatNumber(tokensToNumber(totalVotingPower) * 0.15)}{" "}
                    needed to reach threshold)
                  </Typography>
                </Typography>
              }
              BarContainerProps={{
                style: { borderTopRightRadius: 0, borderBottomRightRadius: 0 },
              }}
            />
          </ProgressContainer>
        </Column>
        <Row items="center" justify="space-between" css={greyBar} gap="lg">
          <Column>
            {getCardContent(
              account.isConnected,
              stage.name,
              proposal.supported,
              totalVotingPower,
              votingPower,
              proposal.supportedAt
            )}
          </Column>
          {RenderButtons(
            account.isConnected,
            proposal.supported,
            stage.name,
            setAction,
            preventUnauthenticatedActions
          )}
        </Row>
      </Column>
    </Card>
  );
};
export default SupportCard;
