import { Column, Row, Typography } from "@ecoinc/ecomponents";
import React from "react";
import Image from "next/image";
import GearIcon from "../../../../public/images/gear-icon.svg";
import { DelegateOption, DelegateRadioOption } from "./DelegateRadioOption";
import ConfirmDialogue from "./ConfirmDialogue";
import {
  DelegateValidation,
  useDelegationState,
} from "./provider/ManageDelegationProvider";
import { useManageDelegation } from "./hooks/useManageDelegation";

interface EnableDelegationBoxProps {
  onOpen(): void;
}

const EnableDelegationBox: React.FC<EnableDelegationBoxProps> = ({
  onOpen,
}) => {
  const { state } = useDelegationState();
  const { manageBothTokens } = useManageDelegation();

  const loading = state.eco.loading || state.secox.loading;
  const enabled = state.eco.enabled && state.eco.enabled;

  return (
    <Column gap="md">
      <Column gap="md">
        <Row justify="space-between" gap="md">
          <Row items="center" gap="lg">
            <Typography variant="body1">Voting power settings: </Typography>
            <DelegateRadioOption
              loading={loading}
              value={enabled ? DelegateOption.Receive : DelegateOption.Delegate}
              onChange={(value) =>
                manageBothTokens(value === DelegateOption.Receive)
              }
            />
          </Row>
          {loading ? null : (
            <Image
              src={GearIcon}
              alt="gear icon"
              onClick={onOpen}
              style={{ cursor: "pointer" }}
            />
          )}
        </Row>
        <Typography variant="body2" color="secondary">
          Enable so others can delegate voting power to you. Note: if enabled,
          you won&apos;t be able to delegate your voting power to others.
        </Typography>
      </Column>

      {state.eco.validate === DelegateValidation.Blocked ||
      state.secox.validate === DelegateValidation.Blocked ? (
        <ConfirmDialogue enable={false} />
      ) : state.eco.validate === DelegateValidation.Confirm ? (
        <ConfirmDialogue
          enable
          delegate={state.eco.delegate}
          handleConfirm={() => manageBothTokens(true, false)}
        />
      ) : state.secox.validate === DelegateValidation.Confirm ? (
        <ConfirmDialogue
          enable
          delegate={state.secox.delegate}
          handleConfirm={() => manageBothTokens(true, false)}
        />
      ) : null}
    </Column>
  );
};

export default EnableDelegationBox;
