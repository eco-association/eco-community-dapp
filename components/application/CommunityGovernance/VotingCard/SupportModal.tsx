import React, { useState } from "react";
import {
  Alert,
  Button,
  Column,
  Dialog,
  formatNumber,
  styled,
  Typography,
} from "@ecoinc/ecomponents";
import { useCommunity } from "../../../../providers";
import { tokensToNumber } from "../../../../utilities";
import { CommunityProposal } from "../../../../queries/PROPOSAL_QUERY";
import SupportButton from "./SupportButton";
import {
  CommunityActionType,
  Support,
} from "../../../../providers/CommunityProvider";
import { ProposalType } from "../../../../types";
import { useVotingPower } from "../../../hooks/useVotingPower";
import useResponsiveDialog from "../../../hooks/useResponsiveDialog";

interface SupportModalProps {
  action: SupportModalAction;
  proposal: ProposalType | CommunityProposal;

  onRequestClose(): void;
  onSupport?(support: Support): void;
}

export enum SupportModalAction {
  None,
  For,
  Against,
  Change,
}

const Box = styled(Alert)({
  border: 0,
  borderRadius: 0,
  paddingLeft: 24,
  paddingRight: 24,
});

const Top = styled(Column)({
  paddingLeft: 24,
  paddingRight: 24,
});

const GreyButton = styled(Button)({
  backgroundColor: "#BDCBD3",
  color: "#0B331B",
});

function getBoxText(
  proposal: SupportModalProps["proposal"],
  action?: SupportModalAction
) {
  if (action === SupportModalAction.For) return "Support this proposal";
  if (action === SupportModalAction.Change) {
    if (proposal.supported) return "Undo Support";
    return "Change your vote";
  }
  return "Cast your lack of support for this proposal";
}

function getDescription(
  proposal: SupportModalProps["proposal"],
  action: SupportModalAction
) {
  if (action === SupportModalAction.Change && proposal.supported)
    return "Your voting power will not be used to support this proposal.";
  return "The first proposal to reach 15% of the total voting power in support will advance to voting.";
}

const SupportModal: React.FC<SupportModalProps> = ({
  action,
  proposal,
  onRequestClose,
  onSupport,
}) => {
  const community = useCommunity();
  const dialogStyles = useResponsiveDialog(500);

  const { votingPower } = useVotingPower(
    community.currentGeneration.blockNumber
  );

  const [loading, setLoading] = useState(false);

  const onComplete = () => {
    const type: CommunityActionType =
      action === SupportModalAction.For
        ? CommunityActionType.Support
        : CommunityActionType.Unsupport;

    community.dispatch({
      type,
      proposal: proposal.id,
      votingPower: votingPower,
    });

    onRequestClose();
    onSupport &&
      onSupport(
        type === CommunityActionType.Support ? Support.YES : Support.NO
      );
  };

  return (
    <Dialog
      isOpen={action !== SupportModalAction.None}
      onRequestClose={onRequestClose}
      shouldCloseOnEsc={!loading}
      shouldShowCloseButton={!loading}
      shouldCloseOnOverlayClick={!loading}
      style={dialogStyles}
    >
      <Column gap="xl">
        <Top gap="lg">
          <Typography variant="h3" style={{ lineHeight: 1 }}>
            {getBoxText(proposal, action)}
          </Typography>
          <Typography variant="body1">
            {getDescription(proposal, action)}
          </Typography>
        </Top>
        <Box color="disabled">
          {!votingPower.isZero() ? (
            <Column gap="lg">
              <Typography variant="body1">
                Your current voting power:{" "}
                <Typography color="secondary" variant="body1">
                  {formatNumber(tokensToNumber(votingPower))}
                </Typography>
              </Typography>
              <SupportButton
                loading={loading}
                onLoading={setLoading}
                action={action}
                proposal={proposal}
                onComplete={onComplete}
              />
            </Column>
          ) : (
            <Column gap="lg" items="start">
              <Column gap="md">
                <Typography
                  color="secondary"
                  variant="body1"
                  style={{ lineHeight: 1 }}
                >
                  0.000 Votes
                </Typography>
                <Typography variant="body1">
                  Unfortunately, you have no active voting power this
                  generation. Your voting power for next generation will be
                  determined by your ECO balance, staked ECOx, and any other
                  voting power that’s been delegated to your wallet.
                </Typography>
              </Column>
              <GreyButton onClick={onRequestClose}>OK</GreyButton>
            </Column>
          )}
        </Box>
      </Column>
    </Dialog>
  );
};

export default SupportModal;
