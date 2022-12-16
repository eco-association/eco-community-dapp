import React, { useState } from "react";
import {
  Button,
  Card,
  Column,
  formatNumber,
  Row,
  Typography,
} from "@ecoinc/ecomponents";
import chevronDown from "../../../public/images/chevron-down.svg";
import chevronUp from "../../../public/images/chevron-up.svg";
import informationI from "../../../public/images/information-i.svg";
import Image from "next/image";
import { css } from "@emotion/react";
import VotingSources from "./VotingSources";
import { tokensToNumber } from "../../../utilities";
import { useCommunity } from "../../../providers";
import ManageDelegationModal from "./ManageDelegationModal/ManageDelegationModal";
import { useVotingPower } from "../../hooks/useVotingPower";
import { ManageDelegationProvider } from "./ManageDelegationModal/provider/ManageDelegationProvider";
import { useAccount } from "wagmi";
import Tooltip from "rc-tooltip";
import { useVotingPowerSources } from "../../hooks/useVotingPowerSources";

const chevron = css({ cursor: "pointer" });

const customRow = css({
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
});

const Sources = () => {
  return (
    <Row gap="xl" style={{ justifyContent: "space-between" }}>
      <Typography variant="body1">2,500,000 ECO</Typography>
      <Typography variant="body1" color="secondary">
        From your wallet 911
      </Typography>
    </Row>
  );
};

const ManageDelegationCard = () => {
  const votingSources = useVotingPowerSources();
  const community = useCommunity();
  const account = useAccount();
  const { votingPower } = useVotingPower();
  const { votingPower: currentGenVotingPower } = useVotingPower(
    community.currentGeneration.blockNumber
  );
  console.log(votingSources);
  const [extendedDisplay, setExtendedDisplay] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <Card>
      <ManageDelegationProvider>
        <ManageDelegationModal
          key={account.address}
          open={modalOpen}
          votingPower={votingPower}
          currentGenVotingPower={currentGenVotingPower}
          onRequestClose={() => setModalOpen(false)}
        />
      </ManageDelegationProvider>
      <Column gap="xl">
        <Typography variant="h4">
          {formatNumber(tokensToNumber(votingPower))} Voting power
        </Typography>
        <hr />
        <Typography variant="body2" color="secondary">
          SOURCES OF VOTING POWER
        </Typography>
        <Sources />
        <Row gap="md">
          <Typography variant="body2" color="secondary" css={{ width: "60%" }}>
            manage delegating your votes to others, or become a delegate
            yourself.
          </Typography>
          <Button
            variant="outline"
            color="secondary"
            onClick={() => setModalOpen(true)}
            style={{ width: 169, height: 38, padding: 0 }}
          >
            Manage Delegation
          </Button>
        </Row>
      </Column>
    </Card>
  );
};

export default ManageDelegationCard;
