import React from "react";
import {
  Alert,
  Column,
  Dialog,
  formatNumber,
  styled,
  Typography,
} from "@ecoinc/ecomponents";
import { useCommunity } from "../../../../providers";
import VotingButton from "./VotingButton";
import { tokensToNumber } from "../../../../utilities";
import { useVotingPower } from "../../../hooks/useVotingPower";
import {
  CommunityActionType,
  Vote,
} from "../../../../providers/CommunityProvider";

interface VotingModalProps {
  action: VotingModalAction;
  prevVote?: Vote;

  onRequestClose(): void;
}

const Box = styled(Alert)({
  border: 0,
  borderRadius: 0,
  paddingLeft: 24,
  paddingRight: 24,
});

export enum VotingModalAction {
  None,
  For,
  Against,
  Change,
}

const getTitle = (action: VotingModalAction) => {
  if (action === VotingModalAction.For) return "Vote for this proposal";
  if (action === VotingModalAction.Change) return "Change your vote";
  return "Vote against this proposal";
};

const Top = styled(Column)({
  paddingLeft: 24,
  paddingRight: 24,
});

const VotingModal: React.FC<VotingModalProps> = ({
  action,
  prevVote,
  onRequestClose,
}) => {
  const community = useCommunity();
  const { votingPower } = useVotingPower(
    community.currentGeneration.blockNumber
  );

  const onComplete = (vote: Vote) => {
    onRequestClose();
    const type =
      vote === Vote.YES ? CommunityActionType.Vote : CommunityActionType.Unvote;
    community.dispatch({ type, votingPower });
  };

  return (
    <Dialog
      isOpen={action !== VotingModalAction.None}
      onRequestClose={onRequestClose}
      style={{ card: { maxWidth: 500 } }}
    >
      <Column gap="xl">
        <Top gap="lg">
          <Typography variant="h3">{getTitle(action)}</Typography>
          <Typography variant="body1">
            {prevVote ? (
              <React.Fragment>
                You previously voted to{" "}
                <b>{prevVote === Vote.YES ? "accept" : "reject"}</b> this
                proposal. Note: all transactions cost market rate gas.
              </React.Fragment>
            ) : (
              <React.Fragment>
                In order for a proposal to pass, more than 50% of votes cast by
                the end of the voting period must be in favor of the proposal.
              </React.Fragment>
            )}
          </Typography>
        </Top>
        <Box color="disabled">
          <Column gap="lg" items="start">
            <Typography variant="body1">
              Your current voting power:{" "}
              <Typography inline color="secondary" variant="body1">
                {formatNumber(tokensToNumber(votingPower))}
              </Typography>
            </Typography>
            <VotingButton
              type={action}
              prevVote={prevVote}
              onComplete={onComplete}
            />
          </Column>
        </Box>
      </Column>
    </Dialog>
  );
};

export default VotingModal;
