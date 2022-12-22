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
import { useCommunity, useTotalVotingPower } from "../../../../providers";
import ManageDelegationModal from "./ManageDelegationModal/ManageDelegationModal";
import { useVotingPower } from "../../../hooks/useVotingPower";
import { ManageDelegationProvider } from "./ManageDelegationModal/provider/ManageDelegationProvider";
import { useAccount } from "wagmi";
import { AccountCard } from "../AccountCard";
import { VotingState } from "./VotingState";
import { useVotingPowerSources } from "../../../hooks/useVotingPowerSources";

const VotingPowerCard = () => {
  const account = useAccount();
  const { currentGeneration } = useCommunity();
  const { votingPower } = useVotingPower(currentGeneration.blockNumber);
  const sources = useVotingPowerSources();
  const totalDelegated = votingPower.sub(sources.eco).sub(sources.sEcoX);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <ManageDelegationProvider>
      <AccountCard
        title={`${formatNumber(tokensToNumber(votingPower))} Voting Power`}
        right={<VotingState />}
      >
        <ManageDelegationModal
          key={account.address}
          open={modalOpen}
          onRequestClose={() => setModalOpen(false)}
          totalDelegated={totalDelegated}
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
    </ManageDelegationProvider>
  );
};

export default VotingPowerCard;
