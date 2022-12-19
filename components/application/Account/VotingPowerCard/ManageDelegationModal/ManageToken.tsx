import React from "react";
import { Column, Row, Typography } from "@ecoinc/ecomponents";
import {
  DelegableToken,
  DelegateValidation,
  useDelegationState,
} from "./provider/ManageDelegationProvider";
import { useManageDelegation } from "./hooks/useManageDelegation";
import { DelegateOption, DelegateRadioOption } from "./DelegateRadioOption";
import ConfirmDialogue from "./ConfirmDialogue";

interface ManageTokenProps {
  token: DelegableToken;
}

export const ManageToken: React.FC<ManageTokenProps> = ({ token: tokenId }) => {
  const { state } = useDelegationState();
  const { manageOneToken } = useManageDelegation();
  const name = tokenId === "eco" ? "ECO" : "ECOx";
  const token = state[tokenId];

  const value = token.enabled
    ? DelegateOption.Receive
    : DelegateOption.Delegate;

  return (
    <Column gap="lg">
      <Column gap="md">
        <Row gap="xl">
          <Typography variant="h5">{name} Voting Power</Typography>
          <DelegateRadioOption
            value={value}
            loading={token.loading}
            disable={state.eco.loading || state.secox.loading}
            onChange={(value) =>
              manageOneToken(tokenId, value === DelegateOption.Receive)
            }
          />
        </Row>
        <Typography variant="body2" color="secondary">
          Choose whether you want to be able to delegate the voting power from
          your {name}, or if you’d like to receive delegated votes.
        </Typography>
      </Column>
      {token.validate === DelegateValidation.Blocked ? (
        <ConfirmDialogue enable={false} />
      ) : token.validate === DelegateValidation.Confirm ? (
        <ConfirmDialogue
          enable
          delegate={token.delegate}
          handleConfirm={() => manageOneToken(tokenId, true, false)}
        />
      ) : null}
    </Column>
  );
};
