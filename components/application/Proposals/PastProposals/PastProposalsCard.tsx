import {
  Button,
  Card,
  Column,
  Row,
  styled,
  Typography,
} from "@ecoinc/ecomponents";
import Image from "next/image";
import Link from "next/link";
import { ProgressCircle } from "../../commons/ProgressCircle";
import GreenCheckmark from "../../../../public/images/green-checkmark-circle.svg";
import RedCircle from "../../../../public/images/red-x-circle.svg";
import { useCommunity } from "../../../../providers";
import { tokensToNumber } from "../../../../utilities";
import React, { useEffect, useState } from "react";
import { PastProposal } from "../../../hooks/usePastProposals";
import { SubgraphVoteResult } from "../../../../queries/CURRENT_GENERATION";
import { isSubmittingInProgress } from "../../../../providers/CommunityProvider";
import DeployProposalModal, {
  ProposalAction,
} from "../CreateProposal/DeployProposalModal";
import { truncateText } from "../../../../utilities/truncateText";
import moment from "moment";
import { SeeMoreLink } from "../../commons/SeeMoreLink";
import { useConnectContext } from "../../../../providers/ConnectModalProvider";
import { useAccount } from "wagmi";

interface PastProposalsCardProps {
  proposal: PastProposal;
}

const TextBox = styled(Row)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: 8,
}));

const StyledCard = styled(Card)({
  width: "100%",
  maxWidth: 506,
  transition: "box-shadow ease .5s",
  "&:hover": {
    boxShadow: "0px 3px 8px 1px rgb(17 39 51 / 5%)",
  },
});

const PastProposalsCard: React.FC<PastProposalsCardProps> = ({ proposal }) => {
  const account = useAccount();
  const { totalVotingPower, stage } = useCommunity();
  const { preventUnauthenticatedActions } = useConnectContext();

  const [resubmit, setResubmit] = useState(false);
  const [percentage, setPercentage] = useState(0);

  const date = proposal?.createdAt
    ? "SUBMITTED " + moment(proposal.createdAt).format("MM/YY")
    : null;

  useEffect(() => {
    const total =
      tokensToNumber(proposal.totalStake) / tokensToNumber(totalVotingPower);
    setPercentage(Math.min(1, total));
  }, [proposal.totalStake, totalVotingPower]);

  const onResubmit = () => {
    if (!account.isConnected) return preventUnauthenticatedActions();
    setResubmit(true);
  };

  const newLines = proposal.description.split("\n");

  return (
    <StyledCard>
      {resubmit ? (
        <DeployProposalModal
          action={ProposalAction.Resubmit}
          address={proposal.address}
          onRequestClose={() => setResubmit(false)}
        />
      ) : null}
      <Column gap="xl">
        <Column gap="lg">
          <Row
            gap="lg"
            style={{
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Column gap="md">
              <Typography variant="body3" color="secondary">
                {date}
              </Typography>
              <Typography variant="h3" color="primary">
                {truncateText(proposal.name, 105)}
              </Typography>
            </Column>
            <Row gap="lg" items="center">
              <ProgressCircle
                stroke={3}
                radius={25}
                progress={percentage}
                textVariant={percentage >= 1 ? "h6" : "h5"}
                textColor={
                  proposal.reachedSupportThreshold ? "secondary" : "disabled"
                }
                strokeColor={
                  proposal.reachedSupportThreshold ? "secondary" : "disabled"
                }
                subtitle={{
                  text: "SUPPORT",
                  options: { color: "disabled" },
                }}
              />
              {proposal.result === SubgraphVoteResult.Accepted ? (
                <Image
                  src={GreenCheckmark}
                  layout="fixed"
                  alt="result accepted"
                  width={44}
                  height={44}
                />
              ) : proposal.result === SubgraphVoteResult.Rejected ? (
                <Image
                  src={RedCircle}
                  layout="fixed"
                  alt="result rejected"
                  width={44}
                  height={44}
                />
              ) : null}
            </Row>
          </Row>
          <Typography
            variant="body1"
            color="primary"
            style={{
              whiteSpace: "pre-wrap",
            }}
          >
            {truncateText(
              newLines.length > 3
                ? newLines.splice(0, 3).join("\n")
                : proposal.description,
              500
            )}
          </Typography>
        </Column>
        <TextBox items="center" justify="space-between" gap="md">
          <Row items="center" gap="sm">
            <Typography variant="body1" color="secondary">
              {proposal.supported ? "Supported" : "Didn't support"}
            </Typography>
            {proposal.voted ? (
              <Typography variant="body1" color="secondary">
                | Voted
              </Typography>
            ) : null}
          </Row>
          {proposal.result === SubgraphVoteResult.Accepted ? (
            <Typography color="active">Passed</Typography>
          ) : proposal.result === SubgraphVoteResult.Rejected ? (
            <Typography color="error">Failed</Typography>
          ) : null}
        </TextBox>
        <Row items="center" justify="space-between">
          <Link
            href={{
              pathname: "/proposal",
              query: { id: proposal?.id },
            }}
          >
            <SeeMoreLink />
          </Link>
          {canResubmitProposal(proposal) && isSubmittingInProgress(stage.name) && (
            <Button color="secondary" variant="outline" onClick={onResubmit}>
              Resubmit
            </Button>
          )}
        </Row>
      </Column>
    </StyledCard>
  );
};

function canResubmitProposal(proposal: PastProposal): boolean {
  return (
    !proposal.reachedVotingPhase ||
    proposal.result === SubgraphVoteResult.Rejected
  );
}

export default PastProposalsCard;
