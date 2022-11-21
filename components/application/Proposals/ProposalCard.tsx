import {
  Button,
  Card,
  Column,
  Grid,
  Row,
  styled,
  Typography,
} from "@ecoinc/ecomponents";
import React, { useState } from "react";
import { ProgressCircle } from "../commons/ProgressCircle";
import { ProposalType } from "../../../types";
import { BigNumber } from "ethers";
import { tokensToNumber } from "../../../utilities";
import Link from "next/link";
import SupportModal, {
  SupportModalAction,
} from "../CommunityGovernance/VotingCard/SupportModal";
import { useConnectContext } from "../../../providers/ConnectModalProvider";
import { useAccount } from "wagmi";
import { truncateText } from "../../../utilities/truncateText";
import { SeeMoreLink } from "../commons/SeeMoreLink";

const StyledCard = styled(Card)({
  width: "100%",
  maxWidth: 506,
  transition: "box-shadow ease .5s",
  "&:hover": {
    boxShadow: "0px 3px 8px 1px rgb(17 39 51 / 5%)",
  },
});
const Grow = styled.div({ flexGrow: 1 });

interface ProposalCardProps {
  proposal: ProposalType;
  totalVotingPower: BigNumber;
}

function getProgress(
  totalStake: BigNumber,
  totalVotingPower: BigNumber
): number {
  if (totalVotingPower.isZero()) return 0;
  return tokensToNumber(totalStake) / tokensToNumber(totalVotingPower);
}

export const ProposalCard: React.FC<ProposalCardProps> = ({
  proposal,
  totalVotingPower,
}) => {
  const { isConnected } = useAccount();
  const { preventUnauthenticatedActions } = useConnectContext();
  const [action, setAction] = useState(SupportModalAction.None);
  const progress = getProgress(proposal.totalStake, totalVotingPower);
  return (
    <StyledCard>
      <SupportModal
        action={action}
        proposal={proposal}
        onRequestClose={() => setAction(SupportModalAction.None)}
      />
      <Column gap="lg">
        <Grid columns="1fr 48px" gap="16px">
          <Typography variant="h2">
            {truncateText(proposal.name, 105)}
          </Typography>
          <ProgressCircle
            progress={progress}
            radius={24}
            stroke={3}
            textColor="primary"
            strokeColor="success"
          />
        </Grid>
        <Typography variant="body1">{proposal.description}</Typography>
        <Row items="center" gap="sm">
          <Link
            href={{
              pathname: "/proposal/[id]",
              query: { id: proposal.id },
            }}
          >
            <SeeMoreLink />
          </Link>
          <Grow />
          {proposal.supported ? (
            <Button
              color="secondary"
              variant="outline"
              onClick={() =>
                isConnected
                  ? setAction(SupportModalAction.Change)
                  : preventUnauthenticatedActions()
              }
            >
              Undo Support
            </Button>
          ) : (
            <Button
              color="success"
              onClick={() =>
                isConnected
                  ? setAction(SupportModalAction.For)
                  : preventUnauthenticatedActions()
              }
            >
              Support
            </Button>
          )}
        </Row>
      </Column>
    </StyledCard>
  );
};
