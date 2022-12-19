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
import { ManageDelegationProvider } from "./ManageDelegationModal/provider/ManageDelegationProvider";
import { useAccount } from "wagmi";
import { AccountCard } from "../AccountCard";
import { VotingState } from "./VotingState";

const VotingPowerCard = () => {
  const community = useCommunity();
  const account = useAccount();
  const { votingPower } = useVotingPower();
  const { votingPower: currentGenVotingPower } = useVotingPower(
    community.currentGeneration.blockNumber
  );

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <ManageDelegationProvider>
      <AccountCard
        title={`${formatNumber(
          tokensToNumber(currentGenVotingPower)
        )} Voting Power`}
        right={<VotingState />}
      >
        <ManageDelegationModal
          key={account.address}
          open={modalOpen}
          votingPower={votingPower}
          currentGenVotingPower={currentGenVotingPower}
          onRequestClose={() => setModalOpen(false)}
        />
        <Column gap="xl">
          <VotingPowerSources />
          <Grid columns="1fr auto" gap="24px" alignItems="center">
            <Typography variant="body2" color="secondary">
              Manage delegating your votes to others, or become a delegate
              yourself.
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
    </ManageDelegationProvider>
  );
};

export default VotingPowerCard;
