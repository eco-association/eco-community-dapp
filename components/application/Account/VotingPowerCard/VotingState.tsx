import React from "react";
import { useDelegationState } from "./ManageDelegationModal/provider/ManageDelegationProvider";
import { isAdvancedDelegation } from "../../../../utilities/votingPower";
import { displayAddress } from "../../../../utilities";
import { Column, Typography } from "@ecoinc/ecomponents";

export const VotingState: React.FC = () => {
  const { state } = useDelegationState();

  let content: { title: string; text: string };
  if (isAdvancedDelegation(state)) {
    content = { title: "SETTINGS", text: "Advanced" };
  } else if (state.eco.enabled) {
    content = { title: "YOUR STATUS", text: "Delegate" };
  } else if (state.eco.delegate) {
    content = {
      title: "DELEGATED TO",
      text: displayAddress(state.eco.delegate),
    };
  }

  if (!content) return null;

  return (
    <Column gap="md">
      <Typography
        variant="subtitle1"
        color="secondary"
        style={{ lineHeight: 1, textAlign: "right" }}
      >
        {content.title}
      </Typography>
      <Typography
        variant="h5"
        style={{
          lineHeight: 1,
          letterSpacing: "-0.035rem",
          textAlign: "right",
        }}
      >
        {content.text}
      </Typography>
    </Column>
  );
};
