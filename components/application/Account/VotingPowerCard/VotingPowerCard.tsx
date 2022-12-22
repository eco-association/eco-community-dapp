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
import { useVotingPowerSources } from "../../../../providers/VotingPowerSourcesProvider";

const VotingPowerCard = () => {
  const account = useAccount();
  const sources = useVotingPowerSources();
  const { currentGeneration } = useCommunity();
  const { votingPower } = useVotingPower(currentGeneration.blockNumber);

  const [modalOpen, setModalOpen] = useState(false);

  const totalDelegated = votingPower.sub(sources.eco).sub(sources.sEcoX);

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
        <VotingPowerSources totalDelegated={totalDelegated} />
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
  );
};

export default VotingPowerCard;
