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

const chevron = css({ cursor: "pointer" });

const customRow = css({
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
});

const ManageDelegationCard = () => {
  const community = useCommunity();
  const account = useAccount();
  const { votingPower } = useVotingPower();
  const { votingPower: currentGenVotingPower } = useVotingPower(
    community.currentGeneration.blockNumber
  );

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
        <Column gap="lg">
          <Row items="start" justify="space-between">
            <Column gap="md">
              <Typography variant="subtitle1" color="secondary">
                YOUR VOTING POWER NEXT GENERATION
              </Typography>
              <Typography variant="h2" style={{ lineHeight: 1 }}>
                {formatNumber(tokensToNumber(votingPower), false)}
              </Typography>
            </Column>

            <Tooltip
              placement="left"
              trigger="hover"
              overlayStyle={{
                padding: "3px 6px",
                width: "220px",
              }}
              overlay={
                <Typography variant="subtitle1" color="white">
                  This number includes delegation and staking changes you make
                  now and becomes active next generation. Your current active
                  voting power is fixed.
                </Typography>
              }
            >
              <Image src={informationI} alt="" />
            </Tooltip>
          </Row>
          {extendedDisplay && <hr />}
        </Column>
        {extendedDisplay ? <VotingSources /> : null}
        <Row items="center" css={customRow}>
          <Button
            variant="outline"
            color="secondary"
            onClick={() => setModalOpen(true)}
          >
            Manage Delegation
          </Button>
          <Image
            css={chevron}
            onClick={() => setExtendedDisplay(!extendedDisplay)}
            src={!extendedDisplay ? chevronDown : chevronUp}
            alt=""
          />
        </Row>
      </Column>
    </Card>
  );
};

export default ManageDelegationCard;
