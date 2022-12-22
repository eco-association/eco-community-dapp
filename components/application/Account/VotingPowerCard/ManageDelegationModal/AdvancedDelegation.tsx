import { Column, formatNumber, Typography } from "@ecoinc/ecomponents";
import React from "react";
import { useDelegationState } from "./provider/ManageDelegationProvider";
import { ManageToken } from "./ManageToken";
import AdvancedOptionsVotingSources from "./AdvancedOptionsVotingSources";
import { useVotingPower } from "../../../../hooks/useVotingPower";
import { useCommunity } from "../../../../../providers";
import { tokensToNumber } from "../../../../../utilities";
import Image from "next/image";
import ChevronLeft from "../../../../../public/images/chevron-left.svg";
import { isAdvancedDelegation } from "../../../../../utilities/votingPower";

interface AdvancedDelegationProps {
  onClose(): void;
}

const AdvancedDelegation: React.FC<AdvancedDelegationProps> = ({ onClose }) => {
  const { state } = useDelegationState();
  const community = useCommunity();

  const { votingPower } = useVotingPower();
  const { votingPower: currentGenVotingPower } = useVotingPower(
    community.currentGeneration.blockNumber
  );

  const loading = state.eco.loading || state.secox.loading;

  return (
    <Column gap="xl">
      <Column gap="lg" style={{ padding: "0 16px" }}>
        <div style={{ position: "relative" }}>
          {!loading && !isAdvancedDelegation(state) ? (
            <div style={{ position: "absolute", left: -20, top: 8 }}>
              <Image
                alt="back"
                layout="fixed"
                width={10}
                height={16}
                src={ChevronLeft}
                onClick={onClose}
                style={{ cursor: "pointer" }}
              />
            </div>
          ) : null}
          <Typography variant="h2">Advanced Delegation Settings</Typography>
        </div>
        <Typography variant="body1">
          You have {formatNumber(tokensToNumber(votingPower))} Total Voting
          Power.{" "}
          <b>
            {formatNumber(tokensToNumber(currentGenVotingPower))} is active this
            generation
          </b>
        </Typography>
      </Column>
      <AdvancedOptionsVotingSources />
      <hr />
      <ManageToken token="eco" loading={state.eco.loading} />
      <ManageToken token="secox" loading={state.secox.loading} />
    </Column>
  );
};

export default AdvancedDelegation;
