import React from "react";
import { Column, Row, Typography } from "@ecoinc/ecomponents";
import {
  DelegableToken,
  DelegateValidation,
  useDelegationState,
} from "./provider/ManageDelegationProvider";
import { useManageDelegation } from "./hooks/useManageDelegation";
import ConfirmDialogue from "./ConfirmDialogue";
import { ToggleSlider } from "react-toggle-slider";
import LoaderAnimation from "../../../Loader";

export enum DelegateOption {
  Receive,
  Delegate,
}

interface ManageTokenProps {
  token: DelegableToken;
  loading: boolean;
}

export const ManageToken: React.FC<ManageTokenProps> = ({
  token: tokenId,
  loading,
}) => {
  const { state } = useDelegationState();
  const { manageOneToken } = useManageDelegation();
  const name = tokenId === "eco" ? "ECO" : "ECOx";
  const token = state[tokenId];

  const value = token.enabled
    ? DelegateOption.Receive
    : DelegateOption.Delegate;

  return (
    <Column gap="md">
      <Column gap="xs">
        <Typography variant="h5" style={{ lineHeight: 1 }}>
          <b>{name}</b>
        </Typography>
        <Row gap="md" items="center">
          <Typography variant="h5">
            Receive delegation:{" "}
            <Typography color="secondary">
              <b>{value === DelegateOption.Receive ? "enabled" : "disabled"}</b>
            </Typography>
          </Typography>
          {loading ? (
            <LoaderAnimation />
          ) : (
            <ToggleSlider
              handleSize={20}
              barBackgroundColor="#0000000C"
              barBackgroundColorActive="#47b699"
              active={value === DelegateOption.Receive}
              handleStyles={{ boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.25)" }}
              onToggle={() => {
                manageOneToken(tokenId, value === DelegateOption.Delegate);
              }}
            />
          )}
        </Row>
        <Typography variant="body2" color="secondary">
          Enable so others can delegate voting power to you. Note: if enabled,
          you won&apos;t be able to delegate your voting power to others.
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
