import { Button, Column, Row, styled, Typography } from "@ecoinc/ecomponents";
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
import { GasFee } from "../../commons/GasFee";
import LoaderAnimation from "../../Loader";
import ChevronLeft from "../../../../public/images/chevron-left.svg";

interface EnableDelegationBoxProps {
  back(): void;
}

const Note = styled(Column)(({ active }) => ({
  height: !active && 0,
  opacity: active ? 0.5 : 0,
  marginTop: active ? 4 : 0,
  transitionDuration: "0.2s",
  transitionProperty: "marginTop,height opacity",
  border: "solid 1px #6f8eff",
  background: "rgba(111, 142, 255, 0.05)",
  borderRadius: "6px",
  padding: 16,
}));

const EnableDelegationBox: React.FC<EnableDelegationBoxProps> = ({ back }) => {
  const { state } = useDelegationState();
  const { manageBothTokens } = useManageDelegation();

  const loading = state.eco.loading || state.secox.loading;
  //const enabled = state.eco.enabled && state.eco.enabled;
  const alreadyDelegating = state.eco.delegate || state.secox.delegate;
  const enabled = true;
  // const alreadyDelegating = true;

  return (
    <Column gap="md">
      <Row>
        <Image
          src={ChevronLeft}
          alt=""
          onClick={back}
          css={{ cursor: "pointer" }}
        />
        <Typography variant="h2">
          Are you sure you want to become a delegate?
        </Typography>
      </Row>
      <Typography variant="body1" color="primary">
        Being a voting delegate can be a big responsibility, as others are
        trusting you with their voting power! Many delegates compete to vote
        responsibly and on an informed basis, to earn the voting trust of other
        holders. Remember, you cannot both be a delegate and also delegate
        voting power to others.
      </Typography>
      <Column gap="md" style={{ backgroundColor: "#f6f9fb", padding: 24 }}>
        <Typography variant="body2" color="secondary">
          THINGS TO CONSIDER
        </Typography>
        <ul style={{ listStyleType: "disc", marginLeft: 24 }}>
          <li>
            <Typography variant="body1">
              Making a post to the Community in the Forum (optional)
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Mint an identity token to your wallet with your Discord or Twitter
              so people can find you more easily.
            </Typography>
          </li>
        </ul>
        {alreadyDelegating && (
          <Note gap="sm" active={true}>
            <Typography variant="body2" color="primary">
              Note: because you are currently delegating your votes to{" "}
              {state.eco.delegate}, you must first undelegate your votes from
              this address to become a delegate.
            </Typography>
          </Note>
        )}
        <Row gap="lg">
          <Button disabled>Go back</Button>
          <Button color="success" onClick={() => manageBothTokens(true, false)}>
            {loading ? (
              <LoaderAnimation />
            ) : !alreadyDelegating ? (
              "Become a delegate"
            ) : (
              "Undelegate"
            )}
          </Button>
        </Row>
        <GasFee gasLimit={500_000} />
        {/* <Row justify="space-between" gap="md">
          <Row items="center" gap="lg">
            <Typography variant="body1">Voting power settings: </Typography>
            <DelegateRadioOption
              loading={loading}
              value={enabled ? DelegateOption.Receive : DelegateOption.Delegate}
              onChange={(value) =>
                manageBothTokens(value === DelegateOption.Receive)
              }
            />
          </Row> */}
        {/* {loading ? null : (
            <Image
              src={GearIcon}
              alt="gear icon"
              onClick={onOpen}
              style={{ cursor: "pointer" }}
            />
          )} */}
        {/* </Row> */}
        {/* <Typography variant="body2" color="secondary">
          Enable so others can delegate voting power to you. Note: if enabled,
          you won&apos;t be able to delegate your voting power to others.
        </Typography> */}
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
