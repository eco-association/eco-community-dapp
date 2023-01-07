import React, { useState } from "react";
import {
  Button,
  Column,
  formatNumber,
  Grid,
  Typography,
} from "@ecoinc/ecomponents";
import VotingPowerSources from "./VotingPowerSources";
import { tokensToNumber } from "../../../../utilities";
import { useCommunity } from "../../../../providers";
import ManageDelegationModal from "./ManageDelegationModal/ManageDelegationModal";
import { useVotingPower } from "../../../hooks/useVotingPower";
import { useAccount } from "wagmi";
import { AccountCard } from "../AccountCard";
import { VotingState } from "./VotingState";

const VotingPowerCard = () => {
  const account = useAccount();
  const { currentGeneration } = useCommunity();
  const { votingPower } = useVotingPower(currentGeneration.blockNumber);

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <AccountCard
      title={`${formatNumber(tokensToNumber(votingPower))} Voting Power`}
      right={<VotingState />}
    >
      <ManageDelegationModal
        key={account.address}
        open={modalOpen}
        onRequestClose={() => setModalOpen(false)}
      />
      <Column gap="xl">
        <VotingPowerSources />
        <Grid columns="1fr auto" gap="24px" alignItems="center">
          <Typography variant="body2" color="secondary">
            Manage your delegates and delegation permissions.
          </Typography>
          <Button
            variant="outline"
            color="secondary"
            style={{ padding: "10px 16px", maxWidth: "initial" }}
            onClick={() => setModalOpen(true)}
          >
            Manage Delegation
          </Button>
        </Grid>
      </Column>
    </AccountCard>
  );
};

export default VotingPowerCard;
