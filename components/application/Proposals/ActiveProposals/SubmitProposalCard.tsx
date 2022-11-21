import React from "react";
import {
  Button,
  Card,
  Column,
  Grid,
  Row,
  styled,
  Typography,
} from "@ecoinc/ecomponents";
import { useCommunity } from "../../../../providers";

const StyledCard = styled(Card)({ width: "100%", maxWidth: 506 });

interface SubmitProposalCardProps {
  onCreateProposal(): void;
}

export const SubmitProposalCard: React.FC<SubmitProposalCardProps> = ({
  onCreateProposal,
}) => {
  const { proposals } = useCommunity();
  return (
    <StyledCard>
      <Column gap="lg">
        <Grid columns="1fr 24ox" gap="8px">
          <Row items="center" gap="md">
            <Typography variant="h3">{proposals.length} </Typography>
            <Typography variant="h3" color="secondary">
              proposals submitted so far...{" "}
            </Typography>
          </Row>
        </Grid>
        <hr />
        <div>
          <Typography variant="body3" color="secondary">
            SUBMIT YOUR OWN
          </Typography>
          <Grid columns="1fr auto" gap="8px" alignItems="center">
            <Typography variant="body1" color="secondary">
              Write a proposal to upgrade the ECOsystem.
            </Typography>
            <Button variant="outline" color="active" onClick={onCreateProposal}>
              Submit a proposal
            </Button>
          </Grid>
        </div>
      </Column>
    </StyledCard>
  );
};
