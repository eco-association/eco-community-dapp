import {
  Alert,
  Button,
  formatNumber,
  Row,
  styled,
  Typography,
} from "@ecoinc/ecomponents";
import React, { useState } from "react";
import { useAccount } from "wagmi";
import { tokensToNumber } from "../../../../utilities";
import { useConnectContext } from "../../../../providers/ConnectModalProvider";
import VotingModal, { VotingModalAction } from "./VotingModal";
import { useVotingPower } from "../../../hooks/useVotingPower";
import {
  isVotingInProgress,
  useCommunity,
  Vote,
} from "../../../../providers/CommunityProvider";
import { GenerationStage } from "../../../../types";

interface VoteAlertProps {
  block: number;
  voted?: Vote;
}

const ButtonGrid = styled(Row)`
  @media screen and (min-width: 576px) {
    display: flex;
    justify-content: end;
    gap: 8px;
  }
`;

export const VoteAlert: React.FC<VoteAlertProps> = ({ block, voted }) => {
  const { isConnected } = useAccount();
  const { setDisplay } = useConnectContext();
  const { stage } = useCommunity();

  const { votingPower } = useVotingPower(block);

  const [action, setAction] = useState(VotingModalAction.None);

  const getTitle = () => {
    if (voted === Vote.NO)
      return <Typography variant="h5">You voted NO</Typography>;
    if (voted === Vote.YES)
      return (
        <Typography variant="h5">
          You voted{" "}
          <Typography inline variant="h5" color="success">
            YES
          </Typography>
        </Typography>
      );
    return <Typography variant="h5">Cast your vote</Typography>;
  };

  const getContent = () => {
    if (!isConnected)
      return (
        <Typography variant="body1" color="secondary">
          Use your voting power to vote for or against this proposal.
        </Typography>
      );

    if (votingPower.isZero()) {
      return (
        <Typography variant="body1" color="secondary">
          It looks like you have no active voting power.
        </Typography>
      );
    }
    if (voted) {
      return (
        <Typography variant="body1" color="secondary">
          Your {formatNumber(tokensToNumber(votingPower))} votes have been added{" "}
          {voted === Vote.YES
            ? "in favor of this proposal."
            : "against this proposal."}
        </Typography>
      );
    }
    return (
      <Typography variant="body1" color="secondary">
        Use your{" "}
        <Typography inline variant="h5" color="secondary">
          {formatNumber(tokensToNumber(votingPower))}
        </Typography>{" "}
        votes to vote for or against this proposal.
      </Typography>
    );
  };

  const getButtons = (voted?: Vote) => {
    if (
      !isVotingInProgress(stage.name) ||
      stage.name === GenerationStage.Majority
    ) {
      return null;
    }
    if (!isConnected)
      return (
        <ButtonGrid gap="md">
          <Button color="success" onClick={() => setDisplay(true)}>
            Yes
          </Button>
          <Button color="primary" onClick={() => setDisplay(true)}>
            No
          </Button>
        </ButtonGrid>
      );

    if (votingPower.isZero()) return null;

    if (voted) {
      return (
        <ButtonGrid gap="md">
          <Button
            color="secondary"
            variant="outline"
            onClick={() => setAction(VotingModalAction.Change)}
          >
            Change Vote
          </Button>
        </ButtonGrid>
      );
    }

    return (
      <ButtonGrid gap="md">
        <Button
          color="success"
          onClick={() => setAction(VotingModalAction.For)}
        >
          Accept
        </Button>
        <Button
          color="primary"
          onClick={() => setAction(VotingModalAction.Against)}
        >
          Reject
        </Button>
      </ButtonGrid>
    );
  };

  return (
    <Alert color="disabled" title={getTitle()} button={getButtons(voted)}>
      <VotingModal
        action={action}
        prevVote={voted}
        onRequestClose={() => setAction(VotingModalAction.None)}
      />
      {getContent()}
    </Alert>
  );
};
