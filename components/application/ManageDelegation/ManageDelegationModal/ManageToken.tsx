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
import LoaderAnimation from "../../Loader";

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
    <Column gap="lg">
      <Column gap="md">
        <Typography variant="h5">{name}</Typography>
        <Row gap="lg">
          <Typography variant="h5">
            Receive delegation:{" "}
            <Typography inline color="secondary">
              {value === DelegateOption.Receive ? "enabled" : "disabled"}
            </Typography>
          </Typography>
          {loading ? (
            <LoaderAnimation />
          ) : (
            <ToggleSlider
              barStylesActive={{ backgroundColor: "#47b699" }}
              active={value === DelegateOption.Receive}
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
