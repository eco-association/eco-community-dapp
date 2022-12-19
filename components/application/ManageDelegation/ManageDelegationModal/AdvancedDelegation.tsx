import { Column, formatNumber, Row, Typography } from "@ecoinc/ecomponents";
import React from "react";
import { useDelegationState } from "./provider/ManageDelegationProvider";
import { ManageToken } from "./ManageToken";
import AdvancedOptionsVotingSources from "./AdvancedOptionsVotingSources";
import { useVotingPower } from "../../../hooks/useVotingPower";
import { useCommunity } from "../../../../providers";
import { tokensToNumber } from "../../../../utilities";

const AdvancedDelegation: React.FC = ({}) => {
  const { state } = useDelegationState();
  const community = useCommunity();

  const { votingPower } = useVotingPower();
  const { votingPower: currentGenVotingPower } = useVotingPower(
    community.currentGeneration.blockNumber
  );
  return (
    <Column gap="xl">
      <Row justify="space-between" gap="md">
        <Column gap="sm">
          <Typography variant="h2">Advanced Delegation Settings</Typography>
          <Typography variant="body1">
            You have {formatNumber(tokensToNumber(votingPower))} Total Voting
            Power,{" "}
            <b>
              {formatNumber(tokensToNumber(currentGenVotingPower))} is active
              this generation
            </b>
          </Typography>
          <AdvancedOptionsVotingSources />
        </Column>
      </Row>
      <ManageToken token="eco" loading={state.eco.loading} />
      <ManageToken token="secox" loading={state.secox.loading} />
    </Column>
  );
};

export default AdvancedDelegation;
